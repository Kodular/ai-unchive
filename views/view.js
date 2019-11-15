export class View {
  constructor(domElementName) {
    this.domElement = document.createElement(domElementName);
    this.visible = true;
    this.cacheDisplayStyle = this.domElement.style.display;
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

  async addView(view) {
    this.domElement.appendChild(view.domElement);
  }

  async removeView(view) {
    this.domElement.removeChild(view.domElement);
  }

  hasView(view) {
    return this.domElement.contains(view.domElement);
  }

	async insertView(view, position) {
		this.domElement.insertBefore(view.domElement, this.domElement.childNodes[position - 1]);
	}

  setAttribute(attributeName, attributeValue) {
    this.domElement.setAttribute(attributeName, attributeValue);
  }

  getAttribute(attributeName) {
    this.domElement.getAttribute(attributeName);
  }

  setVisible(visible) {
    if(visible) {
      this.domElement.style.display = this.cacheDisplayStyle;
    } else {
      this.cacheDisplayStyle = this.domElement.style.display;
      this.domElement.style.display = 'none';
    }
    this.visible = visible;
  }

  clear() {
    this.domElement.innerHTML = '';
  }
}
