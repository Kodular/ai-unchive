
export class View {
  constructor(domElementName) {
      this.domElement = document.createElement(domElementName);
  }

  setStyleName(styleName) {
      domElement.classList.add(styleName);
  }

  removeStyleName(styleName) {
      domElement.classList.remove(styleName);
  }
}
