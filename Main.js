document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
});

function toggleNav() {
    const navList = document.querySelector('nav ul');
    navList.classList.toggle('show-nav');
}




function smoothScrollTo(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); 
        const target = this.getAttribute('href'); 
        smoothScrollTo(target);
    });
});



const products = [
    {
        id: 1,
        name: '12 ounces',
        price: 25.00,
        image: 'assets/12ounces.png'
    },
    {
        id: 2,
        name: '14 ounces',
        price: 35.00,
        image: 'assets/14ounces.png'
    },
    {
        id: 3,
        name: '16 ounces',
        price: 45.00,
        image: 'assets/16ounces.png'
    },
    {
        id: 4,
        name: '20 ounces',
        price: 55.00,
        image: 'assets/20onuces.png'
    },
    {
        id: 5,
        name: '14 ounces buy one take 1',
        price: 60.00,
        image: 'assets/promo2.png'
    },
    {
        id: 6,
        name: '12 ounces buy 3 for less',
        price: 60.00,
        image: 'assets/promo1.png'
    },
];

const productList = document.getElementById('product-list');
const cart = document.getElementById('cart-items');
let cartItems = [];

function renderProducts() {
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>P${product.price.toFixed(2)}</p>
            <div class="quantity-selector">
                <button onclick="decrementQuantity(${product.id})">-</button>
                <input type="number" id="quantity-${product.id}" value="1" min="1">
                <button onclick="incrementQuantity(${product.id});">+</button>
            </div>
            <button id="showPopupBtn" onclick="addToCart(${product.id}); showPopupMessage();">Add to Cart</button>
        `;

        productList.appendChild(productDiv);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
    cartItems.push({ ...product, quantity });
    renderCart();
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    renderCart();
}

function clearCart() {
    cartItems = [];
    renderCart();
}

function removeSelectedItems() {
    cartItems = cartItems.filter((item, index) => {
        const checkbox = document.getElementById(`item-${index}`);
        return !checkbox.checked;
    });

    renderCart();
}

/* cart sidebar */
function toggleCart() {
    const cart = document.getElementById('cart');
    const header = document.getElementById('cartinside').querySelector('.cartheader');
    const btns = document.getElementById('btns');

    if (cart.classList.contains('active')) {
        cart.classList.remove('active');
        header.style.position = 'fixed';
        btns.style.position = 'relative';
        document.body.style.overflowY = 'auto';
    } else {
        cart.classList.add('active');
        header.style.position = 'fixed';
        btns.style.position = 'relative';
        document.body.style.overflowY = 'hidden';

    }

    
        if (cartItems.length === 0) {
            btns.style.display = 'none';
        }
}



/* scrolling */


/* buy now */
function showPopup() {

    var popup = document.getElementById("popup");
    popup.style.display = "flex"; 
}

function hidePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "none"; 
}

/* buy now end */

function decrementQuantity(productId) {
    const input = document.getElementById(`quantity-${productId}`);
    let value = parseInt(input.value);
    if (value > 1) {
        value--;
        input.value = value;
    }
}

function incrementQuantity(productId) {
    const input = document.getElementById(`quantity-${productId}`);
    let value = parseInt(input.value);
    value++;
    input.value = value;
}

function renderCart() {
    cart.innerHTML = '';
    const btns = document.getElementById('btns');

    if (cartItems.length === 0) {
        cart.innerHTML = '<p>Cart is empty</p>';
        btns.style.display = 'none';
        return;
    }

    const ul = document.createElement('ul');
    ul.classList.add('cart-list');

    let totalPrice = 0;

    cartItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('cart-item');
        const itemPrice = item.price * item.quantity;
        totalPrice += itemPrice;
        li.innerHTML = `
            <div class="cart-item-content">
                <input type="checkbox" id="item-${index}" class="item-checkbox">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name} <span class="cart-item-quantity">(x${item.quantity})</span></p>
                    <p class="cart-item-price">P${itemPrice.toFixed(2)}</p>
                </div>
            </div>
            <button class="delete-btn" onclick="removeFromCart(${index})">x</button>
        `;
        ul.appendChild(li);
        btns.style.display = 'block';
    });

    const totalLi = document.createElement('li');
    totalLi.classList.add('total-price');
    totalLi.textContent = `Total Price: P${totalPrice.toFixed(2)}`;
    ul.appendChild(totalLi);

    cart.appendChild(ul);
}

function renderSelectedItems() {
    const pop = document.querySelector('.display');

    // Clear any existing content
    pop.innerHTML = '';

    if (cartItems.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No items selected';
        pop.appendChild(message);
        return;
    }

    const table = document.createElement('table');
    table.classList.add('selected-items');

    // Create table header
const headerRow = document.createElement('tr');
const headers = ['   ', 'Name', 'Quantity', 'Price'];
headers.forEach(headerText => {
    const headerCell = document.createElement('th');
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
});
table.appendChild(headerRow);

cartItems.forEach((item, index) => {
    const row = document.createElement('tr');

    // Image cell
    const imageCell = document.createElement('td');
    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.name;
    imageCell.appendChild(image);
    row.appendChild(imageCell);

    // Name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = item.name;
    row.appendChild(nameCell);

    // Quantity cell
    const quantityCell = document.createElement('td');
    quantityCell.textContent = item.quantity;
    row.appendChild(quantityCell);

    // Price cell
    const priceCell = document.createElement('td');
    const totalPrice = item.price * item.quantity;
    priceCell.textContent = `P${totalPrice.toFixed(2)}`;
    row.appendChild(priceCell);

    table.appendChild(row);
});


    pop.appendChild(table);

    const totalRow = document.createElement('tr');
    const totalCell = document.createElement('td');
    totalCell.colSpan = 4;
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalCell.textContent = `Total Price: P${totalPrice.toFixed(2)}`;
    totalRow.appendChild(totalCell);
    table.appendChild(totalRow);

    const btnDiv = document.createElement('div');
    btnDiv.classList.add('btn');

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Confirm';
    confirmBtn.id = 'popbtn1';
    confirmBtn.onclick = confirmSelection;

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.id = 'popbtn2';
    cancelBtn.onclick = hidePopup;

    btnDiv.appendChild(confirmBtn);
    btnDiv.appendChild(cancelBtn);

    pop.appendChild(btnDiv);
}



renderProducts();




/* qr generator */
function generateQRCode(size) {
    var qrText = "Sample QR Text"; 
    var qr = qrcode(0, 'M');
    qr.addData(qrText);
    qr.make();
    var qrImgTag = qr.createImgTag(size);
    var qrContainer = document.getElementById("qr-container");
    qrContainer.innerHTML = qrImgTag;
    showPopup();

    document.getElementById('qr-container').style.display = 'block';
    document.getElementById('qrclose').style.display = 'block';
    document.getElementById('popbtn1').style.display = 'none';
    document.getElementById('popbtn2').style.display = 'none';
    document.querySelector('.guidinfo').style.display = 'none';
    document.querySelector('.scanguid').style.display = 'block';
    document.querySelector('.thanks').style.display = 'none';


    const displayDiv = document.getElementById('display');
    displayDiv.innerHTML = ''; 
}

function Closeqr() {
    document.getElementById('qr-container').style.display = 'none';
    document.getElementById('qrclose').style.display = 'none';
    document.getElementById('popbtn1').style.display = 'block';
    document.getElementById('popbtn2').style.display = 'block';
    document.querySelector('.guidinfo').style.display = 'block';
    document.querySelector('.scanguid').style.display = 'none';

}



/* about us text */

const textElement = document.getElementById('changingText');
const textArray = ['CEO', 'CHEF', 'MANAGER', 'PRODUCER', 'DESIGNER', 'FINANCER'];
let currentIndex = 0;

function changeText() {
  textElement.textContent = textArray[currentIndex];
  currentIndex = (currentIndex + 1) % textArray.length;
}

setInterval(changeText, 1500);

/* pop message */
document.getElementById('showPopupBtn').addEventListener('click', function() {
    showPopupMessage();
});

function showPopupMessage() {
    const popup = document.getElementById('popupMessage');
    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000); // Hide the popup after 3 seconds
}


