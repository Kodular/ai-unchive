import { View } from './view.js'
import { Image, Label, Button } from './widgets.js'

import { ScreenNode, AdditionalListNode, ExtensionNode, AssetNode } from './nodes/node.js'
import { NodeList } from './nodes/node_list.js'

import { AIAReader } from '../unchive/aia_reader.js'

export class Screen extends View {
  constructor() {
    super('DIV');

		this.helpText = new Label('Upload a project using the button in the top-right');

    this.titleBar = new TitleBar();
    this.addView(this.titleBar);

    this.nodeListContainer = new View('DIV');
    this.nodeListContainer.addStyleName('node-list-container');

    this.addView(this.nodeListContainer);
    this.initializeNodeLists();
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
			this.helpText.setText('Loading project...');
      this.openProject(await AIAReader.read(this.req.url));
    }

    if(this.req.embedded == 'true') {
      this.titleBar.setVisible(false);
    }
  }

  async openProject(project) {
		console.log(project);
    this.initializeNodeLists();
    for(let screen of project.screens) {
      this.primaryNodeList.addNodeAsync(ScreenNode.promiseNode(screen));
    }

    this.primaryNodeList.addNodeAsync(AdditionalListNode.promiseNode(
			'Extensions',
			project.extensions,
			function(extensions) {
				for(let extension of extensions) {
					this.chainNodeList.addNode(new ExtensionNode(
						extension.descriptorJSON.name,
						extension.name,
						extension.descriptorJSON.helpString));
				}
			}));
    this.primaryNodeList.addNodeAsync(AdditionalListNode.promiseNode(
			'Assets',
			project.assets,
			function(assets) {
				for(let asset of assets) {
					this.chainNodeList.addNode(new AssetNode(
						asset.name,
						asset.type,
						asset.blob.size,
						asset.getURL()
					));
				}
			}
		));
    //this.primaryNodeList.addNodeAsync(AdditionalListNode.promiseNode('Summary'));
		this.helpText.setText('Click on a Screen to view its details');
  }

  initializeNodeLists() {
    this.primaryNodeList = new NodeList();
    this.primaryNodeList.addStyleName('node-list--primary');

    this.nodeLists = [this.primaryNodeList];
    this.nodeListContainer.clear();
    this.nodeListContainer.addView(this.primaryNodeList);

		this.helpPanel = new View('DIV');
		this.helpPanel.addView(this.helpText);
		this.helpPanel.addStyleName('help-panel');
		this.nodeListContainer.addView(this.helpPanel);
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

		var uploadInput = new View('INPUT');
		uploadInput.domElement.type = 'file';

		uploadInput.domElement.addEventListener('change', async (event) => {
			RootPanel.openProject(await AIAReader.read(event.target.files[0]));
		});

		this.uploadButton.addClickListener((event) => {
			uploadInput.domElement.click();
		});

    this.addView(this.logo);
    this.addView(this.title);
    this.addView(this.uploadButton);
  }
}
