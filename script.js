let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

cartIcon.onclick = () => {
    cart.classList.toggle("active");
};

closeCart.onclick = () => {
    cart.classList.remove("active");
};

if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}
function ready() {
    clearCart();

    let removeCartButtons = document.getElementsByClassName("cart-remove");
    for (let button of removeCartButtons) {
        button.addEventListener("click", removeCartItem);
    }

    let quantityInputs = document.getElementsByClassName("cart-quantity");
    for (let input of quantityInputs) {
        input.addEventListener("change", quantityChanged);
    }

    let addCartButtons = document.getElementsByClassName("add-cart");
    for (let button of addCartButtons) {
        button.addEventListener("click", addToCartClicked);
    }
}
function clearCart() {
    let cartContent = document.getElementsByClassName("cart-content")[0];
    cartContent.innerHTML = '';
    document.getElementsByClassName("total-price")[0].innerText = "Total Items: 0";
    cartIcon.setAttribute('data-quantity', '0');
}
function addToCartClicked(event) {
    let button = event.target;
    let productBox = button.closest(".product-box");
    let title = productBox.getElementsByClassName("product-title")[0].innerText;
    let productImg = productBox.getElementsByClassName("product-img")[0].src;

    addProductToCart(title, productImg);
    updatetotal();
}
function addProductToCart(title, productImg) {
    let cartContent = document.getElementsByClassName("cart-content")[0];
    let cartItems = cartContent.getElementsByClassName("cart-box");
    for (let cartItem of cartItems) {
        let cartItemTitle = cartItem.getElementsByClassName("cart-product-title")[0].innerText;
        if (cartItemTitle.trim().toLowerCase() === title.trim().toLowerCase()) {
            let quantityElement = cartItem.getElementsByClassName("cart-quantity")[0];
            quantityElement.value = parseInt(quantityElement.value) + 1;
            updatetotal();
            return;
        }
    }

    let cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");

    cartBox.innerHTML = `
        <img src="${productImg}" class="cart-image">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class="bx bxs-trash cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);

    cartBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem);
    cartBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanged);
}
// Usunięcie przedmiotu z koszyka
function removeCartItem(event) {
    event.target.parentElement.remove();
    updatetotal();
}
function quantityChanged(event) {
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();
}
function updatetotal() {
    let cartContent = document.getElementsByClassName("cart-content")[0];
    let cartBoxes = cartContent.getElementsByClassName("cart-box");
    let totalItems = 0;

    for (let cartBox of cartBoxes) {
        let quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        totalItems += parseInt(quantityElement.value);
    }

    document.getElementsByClassName("total-price")[0].innerText = `Total Items: ${totalItems}`;
    cartIcon.setAttribute('data-quantity', totalItems);
}

(function() {
    emailjs.init("IIDSJsi83TuCv7hc1"); 
})();

document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    emailjs.send("service_ot4m48r", "template_rsuun3c", {
        from_name: document.getElementById("name").value,
        from_email: document.getElementById("email").value,
        message: document.getElementById("message").value
    }).then(function(response) {
        alert("Wiadomość wysłana!");
    }, function(error) {
        alert("Błąd: " + JSON.stringify(error));
    });
});

// dal tel zmiana obraza
document.addEventListener("DOMContentLoaded", function () {
    const imageContainers = document.querySelectorAll(".image-container");

    imageContainers.forEach(container => {
        container.addEventListener("click", function () {
            const defaultImage = container.querySelector(".default");
            const hoverImage = container.querySelector(".hover");

            if (defaultImage.style.opacity === "0") {
                defaultImage.style.opacity = "1";
                hoverImage.style.opacity = "0";
            } else {
                defaultImage.style.opacity = "0";
                hoverImage.style.opacity = "1";
            }
        });
    });
});

// dla tel
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
});
 //wysylanie zamowienia
document.getElementById("send-query-btn").addEventListener("click", function() {
    let totalItems = parseInt(cartIcon.getAttribute('data-quantity'));
    if (totalItems < 1) {
        alert("Musisz dodać przynajmniej 1 produkt do koszyka, aby złożyć zamówienie");
        return;
    }
    let cartBoxes = document.querySelectorAll('.cart-box');
    let orderDetails = "";
    
    cartBoxes.forEach(box => {
        let productTitle = box.querySelector('.cart-product-title').innerText;
        let quantity = box.querySelector('.cart-quantity').value;
        orderDetails += `Produkt: ${productTitle}, Ilość: ${quantity}\n`;
    });
    
    emailjs.send("service_ot4m48r", "template_rsuun3c", {
        order_details: orderDetails
    }).then(function(response) {
        alert("Zamówienie zostało wysłane!");
        clearCart();
    }, function(error) {
        alert("Błąd podczas wysyłania zamówienia: " + JSON.stringify(error));
    });
});


function saveCartToLocalStorage() {
    let cartContent = document.getElementsByClassName("cart-content")[0];
    let cartBoxes = cartContent.getElementsByClassName("cart-box");
    let cartItems = [];

    for (let cartBox of cartBoxes) {
        let title = cartBox.getElementsByClassName("cart-product-title")[0].innerText;
        let productImg = cartBox.getElementsByClassName("cart-image")[0].src;
        let quantity = cartBox.getElementsByClassName("cart-quantity")[0].value;
        cartItems.push({ title, productImg, quantity });
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}
function loadCartFromLocalStorage() {
    let savedCart = localStorage.getItem("cartItems");
    if (!savedCart) return;
    let cartItems = JSON.parse(savedCart);
    let cartContent = document.getElementsByClassName("cart-content")[0];
    cartContent.innerHTML = '';

    cartItems.forEach(item => {
        let cartBox = document.createElement("div");
        cartBox.classList.add("cart-box");

        cartBox.innerHTML = `
            <img src="${item.productImg}" class="cart-image">
            <div class="detail-box">
                <div class="cart-product-title">${item.title}</div>
                <input type="number" value="${item.quantity}" class="cart-quantity">
            </div>
            <i class="bx bxs-trash cart-remove"></i>
        `;

        cartContent.appendChild(cartBox);

  
        cartBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem);
        cartBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanged);
    });
    
    
    updatetotal();
}
function addToCartClicked(event) {
    let button = event.target;
    let productBox = button.closest(".product-box");
    let title = productBox.getElementsByClassName("product-title")[0].innerText;
    let productImg = productBox.getElementsByClassName("product-img")[0].src;

    addProductToCart(title, productImg);
    updatetotal();
    saveCartToLocalStorage();
}

function removeCartItem(event) {
    event.target.parentElement.remove();
    updatetotal();
    saveCartToLocalStorage();
}

function quantityChanged(event) {
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();
    saveCartToLocalStorage();
}
function ready() {
    clearCart(); 
    loadCartFromLocalStorage();

    let removeCartButtons = document.getElementsByClassName("cart-remove");
    for (let button of removeCartButtons) {
        button.addEventListener("click", removeCartItem);
    }

    let quantityInputs = document.getElementsByClassName("cart-quantity");
    for (let input of quantityInputs) {
        input.addEventListener("change", quantityChanged);
    }

    let addCartButtons = document.getElementsByClassName("add-cart");
    for (let button of addCartButtons) {
        button.addEventListener("click", addToCartClicked);
    }
}
