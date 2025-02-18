import { cart, removeFromCart, editCart, updateDeliveryOption,cartQuantity as quantity } from '../../data/cart.js';
import { products } from "../../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import {renderPaymentSummary} from "./paymentSummary.js";

let cartQuantity=quantity;

export function renderOrderSummary(){


    let checkoutHTML = '';
    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        const matchingProduct = products.find(product => product.id === productId);
        let selectedOption;
        let deliveryDay;
        deliveryOptions.forEach(option => {
            if (cartItem.deliveryOption === option.id) {
                selectedOption = option;
                deliveryDay = option.delivery_time;
            }
        });

        if (matchingProduct) {
            const today = dayjs();
            const deliveryDate = today.add(deliveryDay, 'days');
            const formatedDateHeader = deliveryDate.format('dddd, MMMM D');

            checkoutHTML += `
                <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                    <div class="delivery-date">
                      Delivery date: ${formatedDateHeader}
                    </div>
                    <div class="cart-item-details-grid">
                      <img class="product-image" src="${matchingProduct.image}">
                      <div class="cart-item-details">
                        <div class="product-name">
                          ${matchingProduct.name}
                        </div>
                        <div class="product-price">
                          $${(matchingProduct.priceCents / 100).toFixed(2)}
                        </div>
                        <div class="product-quantity">
                          <span>
                            Quantity: <span class="quantity-label-${productId}">${cartItem.quantity}</span>
                          </span>
                          
                          <span class="update-quantity-link link-primary js-update-link"
                          data-product-id="${matchingProduct.id}">
                            Update
                          </span>
                          <input class="quantity-input-${productId} quantity-input" type="number" value="${cartItem.quantity}" data-product-id="${matchingProduct.id}">
                          <span class="save-quantity-link link-primary js-save-link"
                          data-product-id="${matchingProduct.id}">Save</span>
                          
                          <span class="delete-quantity-link link-primary js-delete-link"
                          data-product-id="${matchingProduct.id}">
                            Delete
                          </span>
                        </div>
                      </div>
                      <div class="delivery-options">
                        <div class="delivery-options-title">
                          Choose a delivery option:
                        </div>
                        ${generateCartHTML(matchingProduct, cartItem)}
                       </div>
                    </div>
                </div>`;
        }
    });

    function generateCartHTML(matchingProduct, cartItem) {
        let html = ``;
        const date = dayjs();
        deliveryOptions.forEach((delivery) => {
            const deliveryDate = date.add(delivery.delivery_time, 'days');
            const formatedDate = deliveryDate.format('dddd, MMMM D');
            const isChecked = cartItem.deliveryOption === delivery.id;
            const priceString = (delivery.priceInCents === 0 ? 'FREE' : `$${(delivery.priceInCents / 100).toFixed(2)}`);
            html += `<div class="delivery-option js-delivery-option" 
                    data-product-id="${matchingProduct.id}"
                    data-delivery-option-id="${delivery.id}">
                      <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
                      <div>
                        <div class="delivery-option-date">
                          ${formatedDate}
                        </div>
                        <div class="delivery-option-price">
                          ${priceString} - Shipping
                        </div>
                      </div>
                    </div>`;
        });
        return html;
    }

    cartQuantity = calculateQuantity();
    updateCartQuantityDisplay(cartQuantity);
    document.querySelector('.js-order-summary').innerHTML = checkoutHTML;

    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            cartQuantity = calculateQuantity();
            updateCartQuantityDisplay(cartQuantity);
            document.querySelector(`.js-cart-item-container-${productId}`).remove();
            renderOrderSummary();
            renderPaymentSummary();
        });
    });

    document.querySelectorAll('.js-update-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            document.querySelector(`.quantity-input-${productId}`).classList.add('quantity-input-visible');
            document.querySelector(`.js-save-link[data-product-id="${productId}"]`).classList.add('save-quantity-link-visible');
        });
    });

    document.querySelectorAll('.js-save-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            const quantityInput = document.querySelector(`.quantity-input-${productId}`);
            const newQuantity = Number(quantityInput.value);

            editCart(productId, newQuantity);
            document.querySelector(`.quantity-label-${productId}`).innerText = String(newQuantity);
            cartQuantity = calculateQuantity();
            updateCartQuantityDisplay(cartQuantity);
            renderOrderSummary();
            renderPaymentSummary();
            quantityInput.classList.remove('quantity-input-visible');
            link.classList.remove('save-quantity-link-visible');

        });
    });

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const { productId, deliveryOptionId } = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });

}

export function calculateQuantity() {
    let totalQuantity = 0;
    cart.forEach((cartItem) => {
        totalQuantity += cartItem.quantity;
    });
    return totalQuantity;
}

function updateCartQuantityDisplay(quantity) {
    const noItemsElement = document.querySelector('.js-NO-items');
    if (noItemsElement) {
        noItemsElement.innerHTML = `${quantity} items`;
    } else {
        console.error('Element with class .js-NO-items not found.');
    }
}

