
export class View {
  constructor(domElementName) {
      this.domElement = document.createElement(domElementName);
  }

  setStyleName(styleName) {
      this.domElement.classList.add(styleName);
  }

  removeStyleName(styleName) {
      this.domElement.classList.remove(styleName);
  }
}
