import { View } from '../view.js'
import { Label } from '../widgets.js'
import { Node } from './node.js'

export class NodeList extends View {
  constructor() {
    super('DIV');
    this.addStyleName('node-list');

		this.helpText = new Label('Nothing to see here!');
		this.helpText.addStyleName('node-list__help-text');
		this.addView(this.helpText);
  }

  addNodeAsync(promise) {
		promise.then((node) => {
			this.addNode(node);
		});
  }

	addNode(node) {
		this.addView(node);
		node.setNodeList(this);
	}

  setActiveNode(node) {
		if(this.activeNode != undefined)
			this.activeNode.removeStyleName('unchive-node--active');
    this.activeNode = node;
		if(node != undefined)
			node.addStyleName('unchive-node--active');
  }

	setVisible(visible) {
		super.setVisible(visible);
		if(visible)
			setTimeout(()=>{this.domElement.scrollIntoView({ behavior: 'smooth', inline : 'end'})}, 100);
	}
}
