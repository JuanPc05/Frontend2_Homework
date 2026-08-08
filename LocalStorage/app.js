let proName = document.getElementById("nameProduct");
let proPrice = document.getElementById("priceProduct");
let proAmount = document.getElementById("amountProduct");
let proImage = document.getElementById("imageProduct"); 
let btnSave = document.getElementById("btnSave");



proImage.addEventListener("input", function() {
    if (imagePreview) {
        imagePreview.src = proImage.value;
    }
});

btnSave.addEventListener("click", function() {
    let pro = validForm();
    
   
    if (pro) {
        saveProduct(pro);
    }
});

function validForm() {

    if (proName.value && proPrice.value && proAmount.value && proImage.value) {
        
        
        const product = {
            "nombre": proName.value,
            "precio": proPrice.value,
            "cantidad": proAmount.value,
            "imagen": proImage.value
        };

        // Limpiar el formulario
        proName.value = "";
        proPrice.value = "";
        proAmount.value = "";
        proImage.value = "";
        

        if (imagePreview) {
            imagePreview.src = "";
        }

        return product; 
        
    } else {
        alert("Faltan campos por diligenciar ❌");
        return null; 
    }
}

function saveProduct(product) {
    let productsPrevious = JSON.parse(localStorage.getItem("proList")) || [];

    productsPrevious.push(product);

    localStorage.setItem("proList", JSON.stringify(productsPrevious));
    alert("Producto guardado con exito 🫡");
}