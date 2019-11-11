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

  setVisible(visible) {
    if(visible)
      this.domElement.style.display = (this.cacheDisplayStyle == 'none') ? 'none' : this.cacheDisplayStyle;
    else
      this.cacheDisplayStyle = this.domElement.style.display;
      this.domElement.style.display = 'none';
  }
}
