export class View {
  constructor(domElementName) {
    this.domElement = document.createElement(domElementName);
  }

  addStyleName(styleName) {
    this.domElement.classList.add(styleName);
  }

  setStyleName(styleName) {
    this.domElement.classList = styleName;
  }

  removeStyleName(styleName) {
    this.domElement.classList.remove(styleName);
  }

  addView(view) {
    this.domElement.appendChild(view.domElement);
  }

  removeView(view) {
    this.domElement.removeChild(view.domElement);
  }

  setAttribute(attributeName, attributeValue) {
    this.domElement.setAttribute(attributeName, attributeValue);
  }

  getAttribute(attributeName) {
    this.domElement.getAttribute(attributeName);
  }
}
