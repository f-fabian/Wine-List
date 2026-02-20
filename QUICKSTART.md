# 🚀 PASOS RÁPIDOS PARA COMPILAR EL EJECUTABLE

## En 3 pasos sencillos:

### 1️⃣ Abrir PowerShell aquí
Haz clic derecho en la carpeta del proyecto y selecciona "Abrir PowerShell aquí"

### 2️⃣ Instalar dependencias (solo la primera vez)
```powershell
npm install
```
Espera a que termine (toma 2-3 minutos)

### 3️⃣ Compilar el ejecutable
```powershell
npm run build:win
```
Espera a que termine. Verás un archivo `.exe` en la carpeta `dist/`

---

## 📦 Resultado

En la carpeta `dist/` encontrarás:
- **Setup instalador** - Para entregar a otros usuarios
- **Portable .exe** - Para usar sin instalación

---

## 🔄 Para probar antes de compilar

```powershell
npm start
```

La aplicación se abrirá con toda la funcionalidad normal de Electron.

---

## ⚠️ Importante

En el PRIMER inicio, la aplicación te pedirá que selecciones dónde guardar los datos.
Selecciona una carpeta (puede ser Mis Documentos o Desktop).

---

¿Necesitas ayuda? Ver `README.md` para instrucciones detalladas.
