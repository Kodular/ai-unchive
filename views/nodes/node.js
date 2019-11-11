import { View } from '../view.js'

export class Node extends View {
  constructor() {
      super('DIV');
      this.title = 'T';
  }

  setTitle(title) {
    this.title = title;
  }
}
