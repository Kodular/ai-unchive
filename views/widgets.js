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
