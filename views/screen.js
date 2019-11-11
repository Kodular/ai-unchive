import { View } from './view.js'
import { Node } from './nodes/node.js'
import { NodeList } from './nodes/node_list.js'

export class Screen extends View {
  constructor() {
    super('DIV');

    this.primaryNodeList = new NodeList();
    this.addView(this.primaryNodeList);

    this.primaryNodeList.addView(new Node());

  }
}
