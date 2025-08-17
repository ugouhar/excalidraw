const template = document.createElement("template");
template.innerHTML = `
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    />
    <style>
        #toolbar{
            background-color: white;
            width: max-content;
            position: fixed;
            left: 30vw;
            top: 15px;
            display: flex;
            z-index: 1;
            gap: 10px;
            padding: 4px;
            border-radius: 0.5rem;
            box-shadow: 0px 0px 0.9px 0px rgba(0, 0, 0, .17), 0px 0px 3px 0px rgba(0, 0, 0, .08), 0px 7px 14px 0px rgba(0, 0, 0, .05);
            color: rgb(27, 27, 31);
        }
        #toolbar i{
            cursor: pointer;
            padding: 10px;
            border: 1px solid transparent;
            border-radius: 0.5rem;
        }

        #toolbar i:hover{
            background-color: #f1f0ff;
        }

        #toolbar i:active{
            border: 1px solid #4440bf;
        }

        #toolbar .active-tool:hover{
            background-color: #e0dfff;
        }

        #toolbar .active-tool{
            background-color: #e0dfff;
        }
    </style>

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
