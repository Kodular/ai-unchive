import { View } from './view.js'
import { Image, Label, Button } from './widgets.js'

import { Node } from './nodes/node.js'
import { NodeList } from './nodes/node_list.js'

export class Screen extends View {
  constructor() {
    super('DIV');

    this.titleBar = new TitleBar();
    this.addView(this.titleBar);

    this.nodeListContainer = new View('DIV');
    this.nodeListContainer.addStyleName('node-list-container');

    this.addView(this.nodeListContainer);

    this.primaryNodeList = new NodeList();
    this.primaryNodeList.addStyleName('node-list--primary');
    this.nodeListContainer.addView(this.primaryNodeList);

    this.primaryNodeList.addView(new Node());
  }
}

class TitleBar extends View {
  constructor() {
    super('DIV');

    this.setStyleName('title-bar');

    this.logo = new Image('logo.png');
    this.logo.addStyleName('title-bar__logo');

    this.title = new Label('Unchive');
    this.title.addStyleName('title-bar__title');

    this.uploadButton = new Button('cloud_upload', true);
    this.uploadButton.addStyleName('title-bar__upload-button');

    this.addView(this.logo);
    this.addView(this.title);
    this.addView(this.uploadButton);
  }
}
