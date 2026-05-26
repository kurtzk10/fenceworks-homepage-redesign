import Cart from"cart-store";class CartLink extends HTMLElement{constructor(){super(),this.itemsCount=this.querySelector("items-count")}connectedCallback(){this.unsubscribe=Cart.subscribe((t=>{this.itemsCount.innerHTML=t.cart.item_count.toString()}))}disconnectedCallback(){this.unsubscribe()}}customElements.define("cart-link",CartLink);
//# sourceMappingURL=cart-link.js.map
