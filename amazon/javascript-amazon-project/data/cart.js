export let cart =JSON.parse(localStorage.getItem('cart')) || [
    { productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2 },
    { productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 1 }
];

function  saveToStorage(){
    localStorage.setItem('cart',JSON.stringify(cart));
}
export let cartQuantity = 0;
export const addedMessageTimeouts = {};

export function addToCart(button) {
    const productId = button.dataset.productId;
    const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
    const selectedValue = Number(quantitySelector.value);

    let matchingItem = cart.find(item => item.productId === productId);

    if (!matchingItem) {
        cart.push({
            productId,
            quantity: selectedValue
        });
    } else {
        matchingItem.quantity += selectedValue;
    }

    cartQuantity += selectedValue;
    document.querySelector('.js-cart-quantity').textContent = cartQuantity;

    updateCartQuantity(productId);
    saveToStorage();
}

export function updateCartQuantity(productId) {
    const addedButton = document.querySelector(`.js-added-to-cart-${productId}`);
    addedButton.classList.add('added-to-cart-visible');

    const prevId = addedMessageTimeouts[productId];

    if (prevId) {
        clearTimeout(prevId);
    }

    const timeout = setTimeout(() => {
        addedButton.classList.remove('added-to-cart-visible');
    }, 2000);
    addedMessageTimeouts[productId] = timeout;

    console.log(cart);
}
export function removeFromCart(productId){
    const newCart=[];
    cart.forEach((cartItem)=>{
        if(cartItem.productId!==productId)
        {
            newCart.push(cartItem);
        }
    });
    cart=newCart;
    saveToStorage();
}
