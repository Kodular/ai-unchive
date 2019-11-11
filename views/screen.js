import { View } from './view.js'
import { Image, Label } from './widgets.js'

import { Node } from './nodes/node.js'
import { NodeList } from './nodes/node_list.js'

export class Screen extends View {
  constructor() {
    super('DIV');

    this.titleBar = new View('DIV');
    this.titleBar.setStyleName('title-bar');

    this.logo = new Image('logo.png');
    this.logo.setStyleName('title-bar__logo');

    this.title = new Label('Unchive');
    this.title.setStyleName('title-bar__title');

    this.titleBar.addView(this.logo);
    this.titleBar.addView(this.title);

    this.addView(this.titleBar);

    this.primaryNodeList = new NodeList();
    this.primaryNodeList.addStyleName('node-list--primary');
    this.addView(this.primaryNodeList);

    this.primaryNodeList.addView(new Node());
  }
}
