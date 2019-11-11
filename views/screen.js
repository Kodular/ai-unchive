import { View } from './view.js'

class Screen extends View {
  constructor(name) {
    this.name = name;
    alert(this.name);
  }
}

let s = new Screen('aa');
