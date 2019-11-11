import { View } from '../view.js'
import { Node } from './node.js'

export class NodeList extends View {
  constructor() {
    super('DIV');
    this.setStyleName('node-list');
  }

  addNode(node) {
    if(node instanceof Node)
      this.domElement.appendChild(node);
    else
      throw new Exception('Attempt to add non-node view to a node list.');
  }
}
