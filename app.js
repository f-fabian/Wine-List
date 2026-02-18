const products = [
    { name: "Vino Tinto", price: 15.99, glassPrice: 5.00},
    { name: "Vino Blanco", price: 12.50, glassPrice: 4.00 },
    { name: "Vino Rosado", price: 14.75, glassPrice: 4.50 },
    { name: "Vino Espumoso", price: 18.00, glassPrice: 6.00 },
    { name: "Vino Dulce", price: 16.50, glassPrice: 5.50},
    { name: "Vino Fortificado", price: 20.00, glassPrice: 7.00 }
]

const listContent = document.getElementById("listContent");
const input = document.getElementById("searchInput");

function renderProducts(productsToRender) {

    listContent.innerHTML = "";
    
    productsToRender.forEach(product => {
        const name = document.createElement("div");
        const price = document.createElement("div");
        const glassPrice = document.createElement("div");
        const editButton = document.createElement("button");

        const buttonCell = document.createElement("div");
        
        name.className = "product-item";
        name.textContent = product.name;
        
        price.className = "product-item";
        price.textContent = `$${product.price.toFixed(2)}`;
        
        glassPrice.className = "product-item";
        glassPrice.textContent = `$${product.glassPrice.toFixed(2)}`;

        editButton.className = "edit-button";
        editButton.textContent = "Editar";

        buttonCell.className = "product-item button-cell";
        buttonCell.appendChild(editButton);
        
        listContent.appendChild(name);
        listContent.appendChild(price);
        listContent.appendChild(glassPrice);
        listContent.appendChild(buttonCell);
    });
}

renderProducts(products);


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