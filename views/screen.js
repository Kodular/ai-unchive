import { View } from './view.js'
import { Image, Label, Button } from './widgets.js'

import { Node } from './nodes/node.js'
import { NodeList } from './nodes/node_list.js'

import { AIAReader } from '../unchive/aia_reader.js'

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

    this.secondaryNodeList = new NodeList();
    this.secondaryNodeList.addStyleName('node-list--secondary');
    this.nodeListContainer.addView(this.secondaryNodeList);

    this.tertiaryNodeList = new NodeList();
    this.tertiaryNodeList.addStyleName('node-list--tertiary');
    this.nodeListContainer.addView(this.tertiaryNodeList);

    this.primaryNodeList.addView(new Node());

    this.handleURLData();
  }

  async handleURLData() {
    function getReqParams() {
          var paramString = window.location.search.substr(1);
          return paramString != null && paramString != "" ? makeArray(paramString) : {};
    }

    function makeArray(paramString) {
        var params = {};
        var paramArray = paramString.split("&");
        for ( var i = 0; i < paramArray.length; i++) {
            var tempArr = paramArray[i].split("=");
            params[tempArr[0]] = tempArr[1];
        }
        return params;
    }

    this.req = getReqParams();

    if(this.req.url != undefined) {
      var screens = AIAReader.read(this.req.url);
      console.log(JSON.stringify(screens));
    }

    if(this.req.embedded == 'true') {
      this.titleBar.setVisible(false);
    }
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

    this.uploadButton = new Button('unarchive', true);
    this.uploadButton.addStyleName('title-bar__upload-button');

    this.addView(this.logo);
    this.addView(this.title);
    this.addView(this.uploadButton);
  }
}
