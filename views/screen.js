import { View } from './view.js'
import { Image, Label, Button } from './widgets.js'

import { Node } from './nodes/node.js'
import { NodeList } from './nodes/node_list.js'

export class Screen extends View {
  constructor() {
    super('DIV');

    this.titleBar = new View('DIV');
    this.titleBar.setStyleName('title-bar');

    this.logo = new Image('logo.png');
    this.logo.addStyleName('title-bar__logo');

    this.title = new Label('Unchive');
    this.title.addStyleName('title-bar__title');

    this.uploadButton = new Button('cloud_upload', true);
    this.uploadButton.addStyleName('title-bar__upload-button');

    this.titleBar.addView(this.logo);
    this.titleBar.addView(this.title);
    this.titleBar.addView(this.uploadButton);

    this.addView(this.titleBar);

    this.primaryNodeList = new NodeList();
    this.primaryNodeList.addStyleName('node-list--primary');
    this.addView(this.primaryNodeList);

    this.primaryNodeList.addView(new Node());
  }
}
