import {cart} from '../data/cart.js';
import {products} from "../data/products.js";

let productsHTML = '';
products.forEach((product) => {
    productsHTML += ` <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${(product.priceCents / 100).toFixed()}
          </div>

          <div class="product-quantity-container js-product-quality-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
                Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>`
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;

let cartQuantity = 0;
const addedMessageTimeouts = {};

function addToCart(button) {
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
}

function updateCartQuantity(productId) {
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

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
        addToCart(button);
    });
});
