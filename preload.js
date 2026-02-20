const { contextBridge, ipcRenderer } = require('electron');

// CAMBIO: Exponer API segura al contexto de la aplicación
contextBridge.exposeInMainWorld('electronAPI', {
    // CAMBIO: Cargar productos del archivo JSON
    loadProducts: () => ipcRenderer.invoke('load-products'),
    
    // CAMBIO: Guardar productos al archivo JSON
    saveProducts: (products) => ipcRenderer.invoke('save-products', products),
    
    // CAMBIO: Obtener ruta del archivo de datos
    getDataPath: () => ipcRenderer.invoke('get-data-path'),
    
    // CAMBIO: Mostrar diálogos nativos en lugar de alert/confirm
    showAlert: (title, message) => ipcRenderer.invoke('show-alert', { title, message }),
    showConfirm: (title, message) => ipcRenderer.invoke('show-confirm', { title, message })
});
