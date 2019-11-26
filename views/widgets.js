/**
 * Defines several basic interface widgets used in several UI interactions.
 *
 *
 * @file   This file defines the AIAReader class.
 * @author vishwas@kodular.io (Vishwas Adiga)
 * @since  1.0.0
 * @license
 */

import { View } from './view.js'

/**
 * Class that represents an image.
 *
 * @since  1.0.0
 * @access public
 */
export class Image extends View {

  /**
   * Creates a new Image object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments View
   *
   * @param {String} source The src attribute of the image.
   *
   * @return {Image} New Image object.
   */
  constructor(source) {
    super('IMG');
    if(source != null) {
      this.setSource(source);
    }
  }

  /**
   * Sets the source of the image.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} source The src attribute of the image.
   */
  setSource(source) {
    this.setAttribute('src', source);
    this.source = source;
  }
}

/**
 * Class that represents a label.
 *
 * @since  1.0.0
 * @access public
 */
export class Label extends View {

  /**
   * Creates a new Label object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments View
   *
   * @param {String}  text   The content of the label.
   * @param {Boolean} isHTML true if the text has HTML formatting, false otherwise.
   *
   * @return {Label} New Label object.
   */
  constructor(text, isHTML) {
    super('P');
    this.addStyleName('unchive-label');
    if(text != null) {
      isHTML ? this.setHTML(text) : this.setText(text);
    }
  }

  /**
   * Sets the text of this label.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} text The text of this label.
   */
  setText(text) {
    this.domElement.innerText = text;
    this.text = text;
  }

  /**
   * Sets the HTML of this label.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} html The HTML of this label.
   */
  setHTML(html) {
    this.domElement.innerHTML = html;
    this.text = html;
  }
}

/**
 * Class that represents a button.
 *
 * @since  1.0.0
 * @access public
 */
export class Button extends View {

  /**
   * Creates a new Button object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments View
   *
   * @param {String}  text         The content of the button.
   * @param {Boolean} isIconButton true if the button is an icon button.
   *
   * @return {Button} New Button object.
   */
  constructor(text, isIconButton) {
      super('BUTTON');
      this.addStyleName('unchive-button');
      if(isIconButton) this.addStyleName('unchive-button--icon');
      this.isIconButton = isIconButton;
      if(text != null) {
        this.setHTML(text);
      }
  }

  /**
   * Sets the text of this button.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} text The text of this button.
   */
  setHTML(text) {
      this.domElement.innerHTML = this.isIconButton ? '<i class="material-icons">' + text + '</>' : text;
      this.text = text;
  }

  /**
   * Adds a click listener to this button.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {Function} listener The callback invoked when the button is clicked.
   */
	addClickListener(listener) {
		this.domElement.addEventListener('click', listener);
	}
}

/**
 * Class that represents a drop-down.
 *
 * @since  1.0.0
 * @access public
 */
export class Dropdown extends View {

  /**
   * Creates a new Dropdown object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments View
   *
   * @param {String}  value           The initial value of the drop-down.
   * @param {Function} changeListener Callback invoked when the value is changed.
   *
   * @return {Dropdown} New Dropdown object.
   */
  constructor(value, changeListener) {
    super('SELECT');
    this.domElement.value = value;
    this.addStyleName('unchive-dropdown');
    this.domElement.addEventListener('change', changeListener);
  }

  /**
   * Adds a drop-down item to this drop-down.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {DropdownItem} item  The drop-down item to be added.
   */
  addDropdownItem(item) {
    this.addView(item);
  }

  /**
   * Returns the value of this drop-down.
   *
   * @since 1.0.0
   * @access public
   *
   * @return {String} The value of this drop-down.
   */
  getValue() {
    return this.domElement.value;
  }

  /**
   * Sets the value of this drop-down.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} value The value to be set.
   */
  setValue(value) {
    this.domElement.value = value;
  }
}

/**
 * Class that represents a drop-down item.
 *
 * @since  1.0.0
 * @access public
 */
export class DropdownItem extends View {

  /**
   * Creates a new Button object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments View
   *
   * @param {String}  text         The content of the button.
   * @param {Boolean} isIconButton true if the button is an icon button.
   *
   * @return {Button} New Button object.
   */
  constructor(caption) {
    super('OPTION');
    this.domElement.innerHTML = caption;
    this.addStyleName('unchive-dropdown-item');
  }
}

/**
 * Class that represents a downloader utility.
 *
 * @since  1.0.0
 * @access public
 */
export class Downloader {

  /**
   * Downloads a file referenced by its URL.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} url  The URL of the file to be downloaded.
   * @param {String} fileName  The name of the file to be downloaded.
   */
	static downloadURL(url, fileName) {
		var anchor = new View('A');
		anchor.domElement.href = url;
		anchor.domElement.target = '_blank';
		anchor.domElement.download = fileName;
		anchor.domElement.click();
	}

  /**
   * Downloads a Blob with a file name.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {Blob} blob  The blob representing the file to be downloaded.
   * @param {String} fileName  The name of the file to be downloaded.
   */
  static downloadBlob(blob, fileName) {
    var url = URL.createObjectURL(blob);
    this.downloadURL(url, fileName);
    URL.revokeObjectURL(url);
  }

  /**
   * Downloads some text as a file.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} text  The text to be downloaded.
   * @param {String} fileName  The name of the file to be downloaded.
   */
  static downloadText(text, fileName) {
    this.downloadBlob(new Blob([text], {type : 'text/html'}), fileName);
  }
}

/**
 * Utility class that handles URL GET parameters.
 *
 * @since  1.0.0
 * @access public
 */
export class URLHandler {

  /**
   * Gets the request parameters
   *
   * @since 1.0.0
   * @access public
   *
   * @return {Array} Array of name-value pairs of request parameters.
   */
	static getReqParams() {
		var paramString = window.location.search.substr(1);
		return paramString != null && paramString != "" ? this.makeArray(paramString) : {};
	}

  /**
   * Makes an array of string of parameters.
   *
   * @since 1.0.0
   * @access private
   *
   * @return {String} String of request parameters.
   */
	static makeArray(paramString) {
		var params = {};
		var paramArray = paramString.split("&");
		for ( var i = 0; i < paramArray.length; i++) {
				var tempArr = paramArray[i].split("=");
				params[tempArr[0]] = tempArr[1];
		}
		return params;
	}
}

/**
 * Utility class that loads JavaScript files dynamically.
 *
 * @since  1.0.0
 * @access public
 */
export class ScriptLoader {
  /**
   * Loads a script from its URL.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} url URL that points to the script.
   * @param {Function} onLoad Callback that is invoked when the script has loaded.
   */
  static loadScript(url, onLoad) {
    let s = document.createElement('SCRIPT');
    s.src = url;
    document.head.appendChild(s);
		s.onload = () => {
      if(onLoad)
        onLoad();
    }
  }
}

/**
 * Utility class that formats asset sizes.
 *
 * @since  1.0.0
 * @access public
 */
export class AssetFormatter {
  /**
   * Formats an asset size to its nearest unit (B, kB, mB, etc.)
   *
   * @since 1.0.0
   * @access public
   *
   * @param {Integer} size The size of the asset in bytes.
   */
  static formatSize(size) {
    var unitCount = 0
		while(size > 1000) {
			size /= 1000;
			unitCount++;
		}
		return parseInt(size) + ['B', 'kB', 'mB', 'gB', 'tB', 'pB'][unitCount];
  }
}

/**
 * Class that represents a modal/dialog.
 *
 * @since  1.0.0
 * @access public
 */
export class Dialog extends View {

  /**
   * Creates a new Dialog object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments View
   *
   * @param {String} title   The title of the dialog.
   * @param {String} content The text of the dialog.
   *
   * @return {Dialog} New Dialog object.
   */
  constructor(title, content) {
    super('DIV');
    this.addStyleName('unchive-dialog');
    this.titleView = new Label(title, true);
    this.titleView.addStyleName('unchive-dialog__title');
    this.contentView = new Label(content, true);
    this.contentView.addStyleName('unchive-dialog__content');

    this.addView(this.titleView);
    this.addView(this.contentView);

    this.glass = new View('DIV');
    this.glass.addStyleName('unchive-dialog__glass');
  }

  /**
   * Opens this dialog.
   *
   * @since 1.0.0
   * @access public
   */
  open() {
    RootPanel.addView(this);
    RootPanel.addView(this.glass);
  }

  /**
   * Closes this dialog.
   *
   * @since 1.0.0
   * @access public
   */
  close() {
    RootPanel.removeView(this);
    RootPanel.removeView(this.glass);
  }
}
