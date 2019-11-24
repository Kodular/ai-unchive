import { View } from './view.js'

export class Image extends View {
  constructor(source) {
    super('IMG');
    if(source != null) {
      this.setSource(source);
    }
  }
  setSource(source) {
    this.setAttribute('src', source);
    this.source = source;
  }
}

export class Label extends View {
  constructor(text, isHTML) {
    super('P');
    this.addStyleName('unchive-label');
    if(text != null) {
      isHTML ? this.setHTML(text) : this.setText(text);
    }
  }

  setText(text) {
    this.domElement.innerText = text;
    this.text = text;
  }

  setHTML(html) {
    this.domElement.innerHTML = html;
    this.text = html;
  }
}

export class Button extends View {
  constructor(text, isIconButton) {
      super('BUTTON');
      this.addStyleName('unchive-button');
      if(isIconButton) this.addStyleName('unchive-button--icon');
      this.isIconButton = isIconButton;
      if(text != null) {
        this.setHTML(text);
      }
  }

  setHTML(text) {
      this.domElement.innerHTML = this.isIconButton ? '<i class="material-icons">' + text + '</>' : text;
      this.text = text;
  }

	addClickListener(listener) {
		this.domElement.addEventListener('click', listener);
	}
}

export class Downloader {
	static downloadURL(url, fileName) {
		var anchor = new View('A');
		anchor.domElement.href = url;
		anchor.domElement.target = '_blank';
		anchor.domElement.download = fileName;
		anchor.domElement.click();
	}

  static downloadBlob(blob, fileName) {
    var url = URL.createObjectURL(blob);
    this.downloadURL(url, fileName);
    URL.revokeObjectURL(url);
  }

  static downloadText(text, fileName) {
    this.downloadBlob(new Blob([text], {type : 'text/html'}), fileName);
  }
}

export class URLHandler {
	static getReqParams() {
		var paramString = window.location.search.substr(1);
		return paramString != null && paramString != "" ? this.makeArray(paramString) : {};
	}

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

export class ScriptLoader {
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

export class AssetFormatter {
  static formatSize(size) {
    var unitCount = 0
		while(size > 1000) {
			size /= 1000;
			unitCount++;
		}
		return parseInt(size) + ['B', 'kB', 'mB', 'gB', 'tB', 'pB'][unitCount];
  }
}

export class Dialog extends View {
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

  open() {
    RootPanel.addView(this);
    RootPanel.addView(this.glass);
  }

  close() {
    RootPanel.removeView(this);
    RootPanel.removeView(this.glass);
  }
}
