import { View } from './view.js'

export class Image extends View {
  constructor(source) {
    super('IMG');
    this.source = undefined;
    if(source != null) {
      setSource(source);
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
    this.text = undefined;
    if(text != null) {
      if(isHTML) {
        setHTML(text);
      } else {
        setText(text);
      }
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
