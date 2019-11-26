/**
 * Defines a basic View class that describes an interface element.
 *
 *
 * @file   This file defines the AIAReader class.
 * @author vishwas@kodular.io (Vishwas Adiga)
 * @since  1.0.0
 * @license
 */

 /**
  * Class that represents a root interface element.
  *
  * @since  1.0.0
  * @access public
  */
export class View {

  /**
   * Creates a new View object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   *
   * @param {String} domElementName The name of the DOM element this view holds.
   *
   * @return {View} New View object.
   */
  constructor(domElementName) {
    this.domElement = document.createElement(domElementName);
    this.visible = true;
    this.cacheDisplayStyle = this.domElement.style.display;
  }

  /**
   * Adds a new style name alongside existing styles.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} styleName The new style name.
   */
  addStyleName(styleName) {
    this.domElement.classList.add(styleName);
  }

  /**
   * Removes all existing stylenames from the view and sets this as the new style.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} styleName The new style name.
   */
  setStyleName(styleName) {
    this.domElement.classList = styleName;
  }

  /**
   * Removes a style name from the element's list of styles.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} styleName The style to be removed.
   */
  removeStyleName(styleName) {
    this.domElement.classList.remove(styleName);
  }

  /**
   * Adds a child view to this view.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {View} view The view to be added.
   */
  async addView(view) {
    this.domElement.appendChild(view.domElement);
  }

  /**
   * Removes a child from this view.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {View} view The view to be removed.
   */
  async removeView(view) {
    this.domElement.removeChild(view.domElement);
  }

  /**
   * Returns whether a view is a child of this view.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {View} view The view to be analysed.
   *
   * @return {Boolean} true if the view exists in this view, false otherwise.
   */
  hasView(view) {
    return this.domElement.contains(view.domElement);
  }

  /**
   * Inserts a view to this view at a specific position
   *
   * @since 1.0.0
   * @access public
   *
   * @param {View} view The view to be added.
   * @param {Integer} position the position of the new view.
   */
	async insertView(view, position) {
		this.domElement.insertBefore(view.domElement, this.domElement.childNodes[position - 1]);
	}

  /**
   * Sets the value of an attribute of this view.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} attributeName The name of the attribute.
   * @param {String} attributeValue The value of the attribute.
   */
  setAttribute(attributeName, attributeValue) {
    this.domElement.setAttribute(attributeName, attributeValue);
  }

  /**
   * Returns the value of a specific attribute.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} attributeName The name of the attribute.
   *
   * @return {String} The value of the attribute.
   */
  getAttribute(attributeName) {
    this.domElement.getAttribute(attributeName);
  }

  /**
   * Sets the id of this view.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} id The id of the view.
   */
	setId(id) {
		this.setAttribute('id', id);
	}

  /**
   * Returns the id of this view.
   *
   * @since 1.0.0
   * @access public
   *
   * @return {String} The id of this view.
   */
	getId() {
		return this.getAttribute('id');
	}

  /**
   * Sets the visibility of this view.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} visibile The visibility of the view.
   */
  setVisible(visible) {
    if(visible) {
      this.domElement.style.display = this.cacheDisplayStyle;
    } else {
      this.cacheDisplayStyle = this.domElement.style.display;
      this.domElement.style.display = 'none';
    }
    this.visible = visible;
  }

  /**
   * Clears the contents of this view.
   *
   * @since 1.0.0
   * @access public
   */
  clear() {
    this.domElement.innerHTML = '';
  }
}
