import {cartQuantity,cart} from "../../data/cart.js";
import {products} from "../../data/products.js";
import {deliveryOptions} from "../../data/deliveryOptions.js";


function calculateProductPrice(productId)
{
    let price=null;
    products.forEach(product=>{
        if(product.id===productId)
            price=product.priceCents;
    })
    return price;
}

function calculatePriceSum(){
    let sum=0;
    cart.forEach(cartItem=>{
        sum+=calculateProductPrice(cartItem.productId)*cartItem.quantity;
    })
    return sum;
}
function calculateDeliverySum(){
    let sum=0;
    cart.forEach(cartItem=>{
        deliveryOptions.forEach(option=>{
            if(cartItem.deliveryOption===option.id)
                sum+=option.priceInCents;
        })
    })
    return sum;
}


export function renderPaymentSummary(){
    let productSum=calculatePriceSum()/100;
    let productDelivery=calculateDeliverySum()/100;
    let beforeTax=productSum+productDelivery;
    let tax=beforeTax/10;
    let finalPrice=beforeTax+tax;
    let html=`<div class="payment-summary-title">
                Order Summary
            </div>

            <div class="payment-summary-row">
                <div>Items (${cartQuantity}):</div>    
                <div class="payment-summary-money">$${productSum.toFixed(2)}</div>
            </div>

            <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money">$${productDelivery.toFixed(2)}</div>
            </div>

            <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">$${beforeTax.toFixed(2)}</div>
            </div>

            <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">$${tax.toFixed(2)}</div>
            </div>

            <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money">$${finalPrice.toFixed(2)}</div>
            </div>

            <button class="place-order-button button-primary">
                Place your order
            </button>`;
    document.querySelector('.js-payment-summary').innerHTML=`${html}`;
}