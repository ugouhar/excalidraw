const template = document.createElement("template");
template.innerHTML = `
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    />
   <link rel="stylesheet" href="./components/toolbar.css" />
    <div id="toolbar">
        <i class="fa-solid fa-arrow-pointer" id="select-tool"></i>
        <i class="fa-regular fa-square" id="rectangle-tool"></i>
        <i class="fa-regular fa-circle" id="circle-tool"></i>
        <i class="fa-solid fa-arrow-right" id="arrow-tool"></i>
        <i class="fa-solid fa-minus" id="line-tool"></i>
        <i class="fa-solid fa-pencil" id="pencil-tool"></i>
        <i class="fa-solid fa-font" id="text-tool"></i>
        <i class="fa-solid fa-rotate-left" id="undo-tool"></i>
        <i class="fa-solid fa-rotate-right" id="redo-tool"></i>
    </div>
`;

class Toolbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define("app-toolbar", Toolbar);
