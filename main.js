const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let dataFilePath = null;

// CAMBIO: Rutas de configuración
const configDir = path.join(app.getPath('userData'), 'config');
const configFile = path.join(configDir, 'settings.json');

// CAMBIO: Garantizar que el directorio de configuración existe
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
}

// CAMBIO: Cargar configuración guardada
function loadConfig() {
    try {
        if (fs.existsSync(configFile)) {
            const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
            return config;
        }
    } catch (error) {
        console.error('Error cargando configuración:', error);
    }
    return null;
}

// CAMBIO: Guardar configuración
function saveConfig(config) {
    try {
        fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error('Error guardando configuración:', error);
    }
}

// CAMBIO: Función para mostrar diálogo de selección de carpeta
async function selectDataFolder() {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Selecione pasta para salvar dados',
        message: 'Selecione onde salvar o arquivo de dados (preços)'
    });

    if (!result.canceled) {
        const folderPath = result.filePaths[0];
        dataFilePath = path.join(folderPath, 'preços.json');
        
        // CAMBIO: Guardar la ruta en la configuración
        saveConfig({ dataFolder: folderPath });
        
        // Crear archivo si no existe
        if (!fs.existsSync(dataFilePath)) {
            const defaultData = [];
            fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
        }
        return true;
    }
    return false;
}

// CAMBIO: Función para manejar el caso cuando el archivo no existe
async function handleMissingFile(folderPath) {
    const result = await dialog.showMessageBox(mainWindow, {
        type: 'question',
        title: 'Arquivo não encontrado',
        message: `O arquivo preços não foi encontrado em:\n${folderPath}`,
        detail: 'O que deseja fazer?',
        buttons: ['Criar aqui', 'Mudar pasta', 'Sair'],
        defaultId: 0,
        cancelId: 2
    });
    
    // result.response: 0 = Criar, 1 = Mudar, 2 = Sair
    if (result.response === 0) {
        // Criar novo arquivo vazio
        const newFilePath = path.join(folderPath, 'preços.json');
        fs.writeFileSync(newFilePath, JSON.stringify([], null, 2));
        dataFilePath = newFilePath;
        saveConfig({ dataFolder: folderPath });
        return true;
    } else if (result.response === 1) {
        // Abrir seletor de pasta
        const selected = await selectDataFolder();
        return selected;
    } else {
        // Sair
        return false;
    }
}

// CAMBIO: Función para cambiar la carpeta de datos
async function changeDataFolder() {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: 'Selecione nova pasta para salvar dados',
        message: 'Selecione a nova pasta para salvar ou mover o arquivo de dados (preços)'
    });

    if (!result.canceled) {
        const newFolderPath = result.filePaths[0];
        const newDataFilePath = path.join(newFolderPath, 'preços.json');
        const oldDataFilePath = dataFilePath;
        
        try {
            // Si el archivo existe en la carpeta antigua, copiarlo a la nueva
            if (fs.existsSync(oldDataFilePath)) {
                fs.copyFileSync(oldDataFilePath, newDataFilePath);
            } else {
                // Si no existe, crear uno vacío en la nueva carpeta
                fs.writeFileSync(newDataFilePath, JSON.stringify([], null, 2));
            }
            
            // Actualizar la ruta global
            dataFilePath = newDataFilePath;
            
            // Guardar la nueva configuración
            saveConfig({ dataFolder: newFolderPath });
            
            // Mostrar mensaje de éxito
            dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Pasta actualizada',
                message: 'A pasta de dados foi alterada com sucesso.',
                detail: `Nova rota: ${newDataFilePath}`
            });
            
            return true;
        } catch (error) {
            console.error('Erro ao mudar pasta de dados:', error);
            dialog.showMessageBox(mainWindow, {
                type: 'error',
                title: 'Erro',
                message: 'Não foi possível alterar a pasta de dados.',
                detail: error.message
            });
            return false;
        }
    }
    return false;
}
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 750,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            sandbox: true
        },
        icon: path.join(__dirname, 'assets/logo.png')
    });

    mainWindow.loadFile('index.html');

    // Menú de la aplicación
    createMenu();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// CAMBIO: Menú de la aplicación
function createMenu() {
    const template = [
        {
            label: 'Arquivo',
            submenu: [
                {
                    label: 'Mudar pasta de dados',
                    accelerator: 'CmdOrCtrl+Shift+D',
                    click: () => {
                        changeDataFolder();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Sair',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Ajuda',
            submenu: [
                {
                    label: 'Sobre',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Sobre Lista de Preços',
                            message: 'Lista de Preços - Hotel Açores de Lisboa',
                            detail: 'Aplicação para gerir preços - Desenvolvida por Facundo Sansat 2026',
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// CAMBIO: IPC - Cargar productos del archivo JSON
ipcMain.handle('load-products', () => {
    try {
        if (!dataFilePath) return null;
        if (!fs.existsSync(dataFilePath)) return null;
        
        const data = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error cargando productos:', error);
        return null;
    }
});

// CAMBIO: IPC - Guardar productos en archivo JSON
ipcMain.handle('save-products', (event, products) => {
    try {
        if (!dataFilePath) return false;
        fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
        return true;
    } catch (error) {
        console.error('Error guardando productos:', error);
        return false;
    }
});

// CAMBIO: IPC - Obtener ruta del archivo
ipcMain.handle('get-data-path', () => {
    return dataFilePath;
});

// CAMBIO: IPC - Mostrar alerta nativa
ipcMain.handle('show-alert', (event, { title, message }) => {
    return dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: title,
        message: message,
        buttons: ['OK']
    });
});

// CAMBIO: IPC - Mostrar confirmación nativa (retorna índice del botón)
ipcMain.handle('show-confirm', (event, { title, message }) => {
    return dialog.showMessageBox(mainWindow, {
        type: 'question',
        title: title,
        message: message,
        buttons: ['Não', 'Sim'],
        defaultId: 0,
        cancelId: 0
    });
});

// App initialization
app.on('ready', async () => {
    // CAMBIO: Cargar configuración guardada
    const config = loadConfig();
    
    if (config && config.dataFolder) {
        const folderPath = config.dataFolder;
        const fileInFolder = path.join(folderPath, 'preços.json');
        
        if (fs.existsSync(fileInFolder)) {
            // CAMBIO: Archivo existe, usarlo
            dataFilePath = fileInFolder;
        } else if (fs.existsSync(folderPath)) {
            // CAMBIO: Carpeta existe pero archivo no, preguntar qué hacer
            const shouldContinue = await handleMissingFile(folderPath);
            if (!shouldContinue) {
                app.quit();
                return;
            }
        } else {
            // CAMBIO: Ni carpeta ni archivo existen, pedir nueva ubicación
            const selected = await selectDataFolder();
            if (!selected) {
                app.quit();
                return;
            }
        }
    } else {
        // CAMBIO: Primera ejecución, pedir ubicación
        const selected = await selectDataFolder();
        if (!selected) {
            app.quit();
            return;
        }
    }
    
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
