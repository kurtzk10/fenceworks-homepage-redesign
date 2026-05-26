import{animate,inView}from"motion";class AnimatedContainer extends HTMLElement{#n;connectedCallback(){this.#n=inView(this,(({target:n})=>{animate(n,{opacity:1,transform:"none"},{delay:.2,duration:.5,easing:[.17,.55,.55,1]})}))}disconnectedCallback(){this.#n()}}customElements.define("animated-container",AnimatedContainer);
//# sourceMappingURL=animated-container.js.map
