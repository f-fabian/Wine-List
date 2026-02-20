# Lista de Preços - Guía de Instalación y Compilación

Aplicación de escritorio para gestionar precios - Hotel Açores de Lisboa

## Requisitos Previos

- **Node.js** (versión 14 o superior) - Descargar desde: https://nodejs.org/
- **npm** (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

## Instalación Inicial

### 1. Abrir PowerShell en la carpeta del proyecto

```powershell
cd "c:\ruta\del\proyecto"
```

### 2. Instalar dependencias

```powershell
npm install
```

Esto instalará Electron y electron-builder.

## Ejecución en Modo Desarrollo

```powershell
npm start
```

La aplicación se abrirá como una ventana flotante normal. En el primer inicio, deberás seleccionar dónde guardar el archivo `precios.json`.

## Compilar Instalador Ejecutable (.exe)

### 1. Construir la aplicación

```powershell
npm run build:win
```

Este comando creará:
- **Instalador NSIS** (`Lista de Preços Setup 1.0.0.exe`) - Instalador completo
- **Ejecutable portable** (`Lista de Preços 1.0.0.exe`) - Ejecutable sin instalación

### 2. Ubicación de los archivos compilados

Los `.exe` se guardarán en:
```
dist/
├── Lista de Preços Setup 1.0.0.exe  (Instalador)
└── Lista de Preços 1.0.0.exe        (Portable)
```

## Uso del Instalador

1. **Ejecutar el instalador** (`Lista de Preços Setup 1.0.0.exe`)
2. **Seleccionar ubicación de instalación** (por defecto: `Program Files`)
3. **En primer inicio**, la app pedirá que selecciones dónde guardar los datos (`precios.json`)
4. **Selecciona una carpeta** (recomendado: `C:\Users\{usuario}\AppData\Local\` o `Mis Documentos`)
5. ¡Listo! La aplicación está lista para usar

## Características

✅ Aplicación de escritorio flotante (sin navegador visible)
✅ Visualización y búsqueda de productos
✅ Agregar, editar y eliminar productos
✅ Los datos se guardan automáticamente en archivo JSON local
✅ Funciona 100% offline (sin internet)
✅ Interfaz elegante y profesional
✅ Opción de minimizar y cerrar normal

## Estructura del Proyecto

```
proyecto/
├── main.js              (Proceso principal de Electron)
├── preload.js           (Script de seguridad)
├── app.js               (Lógica de la aplicación)
├── index.html           (Interfaz)
├── styles.css           (Estilos)
├── package.json         (Configuración)
├── README.md            (Este archivo)
└── assets/
    └── logo.png         (Logo de la empresa)
```

## Troubleshooting

### Error: "npm is not recognized"
- Reinicia PowerShell después de instalar Node.js
- O abre una nueva ventana de PowerShell

### Error: "Electron not found"
```powershell
npm install
```

### La aplicación no guarda datos
- Asegúrate de haber seleccionado una carpeta válida en el primer inicio
- Verifica que la carpeta tenga permisos de escritura
- El archivo `precios.json` debe existir en la carpeta seleccionada

## Distribución

Para entregar a usuarios:

1. **Opción 1: Instalador** 
   - Entregar `Lista de Preços Setup 1.0.0.exe`
   - El usuario lo instala como cualquier programa de Windows

2. **Opción 2: Portable**
   - Entregar `Lista de Preços 1.0.0.exe` 
   - Se ejecuta sin instalación, desde cualquier carpeta/USB

## Actualizaciones Futuras

Para modificar la aplicación:

1. Edita los archivos (`.js`, `.css`, `.html`)
2. Prueba con `npm start`
3. Cuando esté listo, compila nuevamente con `npm run build:win`
4. Distribuye el nuevo `.exe`

## Notas Importantes

- La carpeta donde se guardan los datos es elegida por el usuario en primer inicio
- El archivo `precios.json` contiene toda la información de productos
- Es recomendable hacer backups periódicos del archivo `precios.json`
- La aplicación requiere Windows 7 o superior

## Soporte

Para problemas o dudas, consulta la documentación de Electron:
https://www.electronjs.org/docs
