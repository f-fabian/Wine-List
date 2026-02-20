// CAMBIO: Productos por defecto - lista vacía para inicio limpio
const DEFAULT_PRODUCTS = [];

// CAMBIO: Inicializar productos (se cargarán de forma asíncrona)
let products = [];

// CAMBIO: Función para cargar productos de Electron/JSON o localStorage como fallback
async function loadProducts() {
    try {
        // CAMBIO: Si está disponible la API de Electron, usar eso
        if (window.electronAPI) {
            const loaded = await window.electronAPI.loadProducts();
            return loaded && loaded.length > 0 ? loaded : DEFAULT_PRODUCTS;
        } else {
            // CAMBIO: Fallback para desarrollo sin Electron
            const stored = localStorage.getItem("preciarioProducts");
            return stored ? JSON.parse(stored) : DEFAULT_PRODUCTS;
        }
    } catch (error) {
        console.error("Error cargando productos:", error);
        return DEFAULT_PRODUCTS;
    }
}

// CAMBIO: Función para guardar productos en archivo JSON (Electron) o localStorage
async function saveProducts() {
    try {
        if (window.electronAPI) {
            await window.electronAPI.saveProducts(products);
        } else {
            // CAMBIO: Fallback para desarrollo sin Electron
            localStorage.setItem("preciarioProducts", JSON.stringify(products));
        }
    } catch (error) {
        console.error("Error guardando productos:", error);
    }
}

// CAMBIO: Función para mostrar alertas nativas
async function showAlert(title, message) {
    if (window.electronAPI) {
        await window.electronAPI.showAlert(title, message);
    } else {
        alert(message);
    }
}

// CAMBIO: Função para mostrar confirmações nativas (retorna true/false)
async function showConfirm(title, message) {
    if (window.electronAPI) {
        const result = await window.electronAPI.showConfirm(title, message);
        // result.response: 0 = Não, 1 = Sim
        return result.response === 1;
    } else {
        return confirm(message);
    }
}

const listContent = document.getElementById("listContent");
const input = document.getElementById("searchInput");
const modal = document.getElementById("productModal");
const addProductBtn = document.getElementById("addProductBtn");
const cancelBtn = document.getElementById("cancelBtn");
const closeBtn = document.querySelector(".close");
const productForm = document.getElementById("productForm");
const modalTitle = document.getElementById("modalTitle");

let editingIndex = null;

// CAMBIO: Abrir modal para agregar y enfocar el campo de nombre
addProductBtn.addEventListener("click", () => {
    editingIndex = null;
    modalTitle.textContent = "Adicionar produto";
    productForm.reset();
    modal.classList.add("open");
    // CAMBIO: Enfocar automáticamente el campo de nombre
    document.getElementById("productName").focus();
});

// Cerrar modal
cancelBtn.addEventListener("click", closeModal);
closeBtn.addEventListener("click", closeModal);

// CAMBIO: Función para cerrar modal y devolver foco al input de búsqueda
function closeModal() {
    modal.classList.remove("open");
    productForm.reset();
    // CAMBIO: Devolver foco al input de búsqueda después de cerrar
    input.focus();
}

// CAMBIO: Función para capitalizar nombres (primera letra mayúscula el resto minúscula)
function capitalizeName(name) {
    return name.trim().toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// CAMBIO: Función para verificar si un producto ya existe en la lista
function productExists(name, excludeIndex = null) {
    return products.some((product, index) => 
        product.name === name && index !== excludeIndex
    );
}

// CAMBIO: Guardar producto (agregar o editar) con validación de campos
productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const productNameInput = document.getElementById("productName");
    const productPriceInput = document.getElementById("productPrice");
    const productGlassPriceInput = document.getElementById("productGlassPrice");
    
    // CAMBIO: Validar que el nombre no esté vacío
    if (productNameInput.value.trim() === "") {
        await showAlert("⚠️ Validación", "O nome do produto não pode estar vazio.");
        productNameInput.focus();
        return;
    }
    
    // CAMBIO: Validar precio de copo (opcional - puede estar vacío o ser un número válido)
    if (productGlassPriceInput.value !== "" && isNaN(productGlassPriceInput.value)) {
        await showAlert("⚠️ Validación", "O preço do copo deve ser um número válido.");
        productGlassPriceInput.focus();
        return;
    }
    
    // CAMBIO: Validar precio de garrafa (opcional - puede estar vacío o ser un número válido)
    if (productPriceInput.value !== "" && isNaN(productPriceInput.value)) {
        await showAlert("⚠️ Validación", "O preço da garrafa deve ser um número válido.");
        productPriceInput.focus();
        return;
    }
    
    // CAMBIO: Capitalizar el nombre del producto
    let name = capitalizeName(productNameInput.value);
    const price = productPriceInput.value === "" ? null : parseFloat(productPriceInput.value);
    const glassPrice = productGlassPriceInput.value === "" ? null : parseFloat(productGlassPriceInput.value);
    
    if (editingIndex !== null) {
        // CAMBIO: Al editar, verificar duplicados excluyendo el producto actual
        if (productExists(name, editingIndex)) {
            await showAlert("⚠️ Duplicado", `O produto "${name}" já existe na lista.`);
            productNameInput.focus();
            return;
        }
        // Editar producto existente
        products[editingIndex] = { name, price, glassPrice };
    } else {
        // CAMBIO: Al agregar, verificar si el producto ya existe
        if (productExists(name)) {
            await showAlert("⚠️ Duplicado", `O produto "${name}" já existe na lista.`);
            productNameInput.focus();
            return;
        }
        // Agregar nuevo producto
        products.push({ name, price, glassPrice });
    }
    
    // CAMBIO: Guardar productos después de agregar/editar
    await saveProducts();
    
    renderProducts(products);
    input.value = "";
    closeModal();
    input.focus();
});

function renderProducts(productsToRender) {
    listContent.innerHTML = "";
    
    // CAMBIO: Asegurar que el input está accesible después de render
    if (input) {
        input.disabled = false;
        input.style.opacity = "1";
        input.style.pointerEvents = "auto";
    }
    
    if (productsToRender.length === 0) {
        document.getElementById("noResults").style.display = "block";
        return;
    }
    
    document.getElementById("noResults").style.display = "none";
    
    productsToRender.forEach((product, index) => {
        const actualIndex = products.indexOf(product);
        
        const name = document.createElement("div");
        const price = document.createElement("div");
        const glassPrice = document.createElement("div");
        
        name.className = "product-item";
        name.textContent = product.name;
        
        price.className = "product-item";
        price.textContent = product.price === null ? "-" : `$${product.price.toFixed(2)}`;
        
        glassPrice.className = "product-item";
        glassPrice.textContent = product.glassPrice === null ? "-" : `$${product.glassPrice.toFixed(2)}`;

        // Contenedor de botones
        const buttonCell = document.createElement("div");
        buttonCell.className = "product-item button-cell";

        // CAMBIO: Botón editar que abre el modal con los datos del producto
        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.textContent = "Editar";
        editButton.addEventListener("click", () => {
            editingIndex = actualIndex;
            document.getElementById("productName").value = product.name;
            document.getElementById("productPrice").value = product.price;
            document.getElementById("productGlassPrice").value = product.glassPrice;
            modalTitle.textContent = "Editar produto";
            modal.classList.add("open");
            // CAMBIO: Enfocar el campo de nombre cuando se abre para editar
            document.getElementById("productName").focus();
        });

        // CAMBIO: Botón eliminar con diálogo nativo
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "🗑️";
        deleteButton.addEventListener("click", async () => {
            const confirmed = await showConfirm(
                "Eliminar produto",
                `Tem a certeza que deseja eliminar "${product.name}"?`
            );
            
            if (confirmed) {
                products.splice(actualIndex, 1);
                // CAMBIO: Guardar productos después de eliminar
                await saveProducts();
                renderProducts(products);
                input.value = "";
                input.focus();
            }
        });

        buttonCell.appendChild(editButton);
        buttonCell.appendChild(deleteButton);
        
        listContent.appendChild(name);
        listContent.appendChild(glassPrice);
        listContent.appendChild(price);
        listContent.appendChild(buttonCell);
    });
}

// CAMBIO: Event listener directo en el input de búsqueda
input.addEventListener("input", function() {
    const searchTerm = input.value.toLowerCase();
    
    if (searchTerm === "") {
        renderProducts(products);
    } else {
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    }
});

// CAMBIO: Delegación de eventos para búsqueda usando document listener (fallback)
document.addEventListener("input", function(event) {
    if (event.target.id === "searchInput") {
        const searchTerm = event.target.value.toLowerCase();
        
        if (searchTerm === "") {
            renderProducts(products);
        } else {
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);
        }
    }
});

// CAMBIO: Inicializar la aplicación cargando los datos
async function initializeApp() {
    // CAMBIO: Cargar productos del archivo o localStorage
    products = await loadProducts();
    
    // CAMBIO: Renderizar productos iniciales
    renderProducts(products);
    
    // CAMBIO: Enfocar el input de búsqueda
    input.focus();
}

// CAMBIO: Iniciar la aplicación cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});