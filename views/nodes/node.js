import { View } from '../view.js'
import { Label, Downloader, AssetFormatter } from '../widgets.js'

import { NodeList } from './node_list.js'

import { BlocklyWorkspace } from '../../unchive/ai_project.js'

export class Node extends View {

	static async promiseNode(caption, subText) {
		return new Node(caption, subText);
	}

	constructor(caption, subText) {
    super('DIV');
    this.captionView = new Label();
    this.addView(this.captionView);
    this.addStyleName('unchive-node');
    this.subText = subText || '';
    this.setCaption(caption);
  }

  setCaption(caption) {
    this.caption = caption;
    this.captionView.setHTML(caption + '<br><small>' + this.subText + '</small>');
  }

  setSubText(text) {
    this.subText = text;
    this.captionView.setHTML(this.caption + '<br><small>' + text + '</small>');
  }

  setNodeList(nodeList) {
    this.containerNodeList = nodeList;
  }
}

export class HeaderNode extends Node {

	static async promiseNode(caption, icon) {
		return new HeaderNode(caption, icon);
	}

	constructor(caption, icon) {
		super(caption);
		this.iconView = new Label('<i class="material-icons">' + icon + '</i>', true);
		this.insertView(this.iconView, 1);
	}

	addClickListener(callback) {
		this.domElement.addEventListener('click', (event) => {
			callback(event);
		});
	}
}

class PropertyNode extends Node {

	static async promiseNode(propertyName, propertyValue) {
		return new PropertyNode(propertyName, propertyValue);
	}

	constructor(propertyName, propertyValue) {
		super(Messages[propertyName + 'Properties'] || propertyName);
		this.captionView.addStyleName('unchive-property-node__property-name');
		this.valueView = new Label(propertyValue);
		this.valueView.addStyleName('unchive-property-node__property-value');
		this.addView(this.valueView);
		this.addStyleName('unchive-property-node');
	}
}

export class ChainedNode extends Node {

	static async promiseNode(caption, subText, data) {
		return new ChainedNode(caption, subText, data);
	}

	constructor(caption, subText, data) {
    super(caption, subText);
    this.addStyleName('unchive-node--chained');
    this.arrowLabel = new Label('<i class="material-icons">keyboard_arrow_right</i>', true);
    this.arrowLabel.addStyleName('unchive-node__icon--right');
    this.addView(this.arrowLabel);
    this.domElement.addEventListener('click', (event) => {
      this.open();
    });
    this.initializeChain(data);
  }

  open() {
    if(this.chainNodeList.visible)
      return;
    this.setChainVisible(true);
    if(this.containerNodeList.activeNode)
      if(this.containerNodeList.activeNode instanceof ChainedNode)
        this.containerNodeList.activeNode.setChainVisible(false);
    this.containerNodeList.setActiveNode(this);
  }

  setChainVisible(visible) {
    this.chainNodeList.setVisible(visible);
    if(visible) {
      RootPanel.nodeListContainer.addView(this.chainNodeList);
    } else if(RootPanel.nodeListContainer.hasView(this.chainNodeList)) {
      RootPanel.nodeListContainer.removeView(this.chainNodeList);
      if(this.chainNodeList.activeNode instanceof ChainedNode)
        this.chainNodeList.activeNode.setChainVisible(false);
				this.chainNodeList.setActiveNode(undefined);
    }
  }

  async initializeChain(data) {
    this.chainNodeList = new NodeList();
    this.generateChain(data);
    this.setChainVisible(false);
  }

  async generateChain(data) {;}
}

class ComponentNode extends ChainedNode {

	static async promiseNode(caption, type, data) {
		return new ComponentNode(caption, type, data);
	}

  constructor(caption, type, componentData) {
		super(
      caption,
      Messages[type.charAt(0).toLowerCase() + type.slice(1) + 'ComponentPallette'] || type,
      componentData);
		if(componentData.faulty) {
				this.arrowLabel.setHTML('<i class="material-icons">error</i>');
				this.addStyleName('unchive-node--faulty');
			}
	}

	async generateChain(data) {
		this.generatePropertyNodes(data.properties);
  }

	async generatePropertyNodes(properties) {
		try {
			for(let item of properties) {
				let propertyNodePromise = PropertyNode.promiseNode(item.name, item.editorType == 'color' ? item.value.replace('&H', '#') : item.value);
				this.chainNodeList.addNodeAsync(propertyNodePromise);
				if(properties.indexOf(item) == 0)
					propertyNodePromise.then(node => {
						this.firstPropertyNode = node.domElement;
						node.addStyleName('unchive-node--first-of-type');
					});
			}
		}catch(error) {
			console.log('Error in ' + this.caption + ', message: ' + error.message);
		}
	}
}

class ContainerNode extends ComponentNode {

	static async promiseNode(caption, subText, data) {
		return new ContainerNode(caption, subText, data);
	}

	async generateChain(data) {
		this.createHeader();
		this.generateChildNodes(data.children);
		this.generatePropertyNodes(data.properties);

		this.header.addClickListener(e => {
			this.firstPropertyNode.scrollIntoView({ block: 'start',  behavior: 'smooth' });
		});
  }

	async createHeader() {
		this.header = new HeaderNode('Jump to properties', 'double_arrow');
		this.header.addStyleName('unchive-node--component-container--header');
		this.chainNodeList.addNode(this.header);
	}

	async generateChildNodes(children) {
		for(let item of children) {
			if(item.children[0] != undefined)
				this.chainNodeList.addNodeAsync(ContainerNode.promiseNode(item.name, item.type, item));
			else
				this.chainNodeList.addNodeAsync(ComponentNode.promiseNode(item.name, item.type, item));
		}
	}
}

export class ScreenNode extends ContainerNode {

	static async promiseNode(screen) {
		return new ScreenNode(screen);
	}

  constructor(screen) {
    if(screen.name != 'Screen1')
      screen.form.properties = screen.form.properties.filter(x =>
        x.name != 'AccentColor' &&
        x.name != 'AppId' &&
        x.name != 'Icon' &&
        x.name != 'MinSdk' &&
        x.name != 'PackageName' &&
        x.name != 'PrimaryColor' &&
        x.name != 'PrimaryColorDark' &&
        x.name != 'ReceiveSharedText' &&
        x.name != 'ShowListsAsJson' &&
        x.name != 'Sizing' &&
        x.name != 'SplashEnabled' &&
        x.name != 'SplashIcon' &&
        x.name != 'Theme' &&
        x.name != 'TutorialURL' &&
        x.name != 'VersionCode' &&
        x.name != 'VersionName')
    super(screen.name, 'Screen', screen);
  }

	async generateChain(data) {
		this.createHeader();
		this.chainNodeList.addNode(new WorkspaceNode(data.blocks));
		this.generateChildNodes(data.form.children);
		this.generatePropertyNodes(data.form.properties);

		this.header.addClickListener(e => {
			this.firstPropertyNode.scrollIntoView({ block: 'start',  behavior: 'smooth' });
		});
  }
}

class WorkspaceNode extends ChainedNode {

	static async promiseNode(blockData) {
		return new WorkspaceNode(blockData);
	}

	constructor(blockData) {
		super('Blocks', '', new DOMParser().parseFromString(blockData, 'text/xml'));
		this.chainNodeList.addStyleName('node-list--full-width');
	}

	async generateChain(data) {
		this.blockNodes = [];
		for(let block of data.getElementsByTagName('xml')[0].children) {
			if(block.tagName == 'block') {
				let blockNode = BlockNode.promiseNode(block);
				this.blockNodes.push(blockNode);
				this.chainNodeList.addNodeAsync(blockNode);
			}
		}
	}

	setChainVisible(visible) {
		super.setChainVisible(visible);
		if(visible)
		for(let blockNode of this.blockNodes) {
			blockNode.then((node) => {
				node.initializeWorkspace();
			});
		}
	}
}

class BlockNode extends Node {

	static async promiseNode(blocks) {
		return new BlockNode(blocks);
	}

	constructor(blocks) {
		super();
		this.addStyleName('unchive-block-node');
		this.workspace = new BlocklyWorkspace(blocks);
		this.addView(this.workspace.getWorkspaceView());
	}

	initializeWorkspace() {
    this.workspace.initializeWorkspace();
    if(this.workspace.faulty)
      this.addStyleName('unchive-block-node--faulty');
	}
}

export class AdditionalListNode extends ChainedNode {
	static async promiseNode(caption, data, generator, onOpen) {
		return new AdditionalListNode(caption, data, generator, onOpen);
	}

	constructor(caption, data, generator, onOpen) {
		super(caption, '', [data, generator]);
    this.onOpen = onOpen;
	}

	async generateChain(data) {
    if( data[0] && data[1])
		  data[1].call(this, data[0]);
	}

  setChainVisible(visible) {
		super.setChainVisible(visible);
		if(visible && this.onOpen)
		  this.onOpen();
	}
}

export class ExtensionNode extends Node {
	constructor(extensionName, packageName, description) {
		super(extensionName, packageName);
		this.addStyleName('unchive-extension-node');
		this.descriptionView = new Label(description);
		this.addView(this.descriptionView);
	}
}

export class AssetNode extends Node {
	constructor(assetName, assetType, assetSize, assetURL) {
		AssetNode.initConstants();
		super(assetName + '.' + assetType, '');
		this.assetName = assetName + '.' + assetType;
		this.assetSize = assetSize;
		this.generatePreview(assetURL, assetType);
		this.addStyleName('unchive-asset-node');
	}

	generatePreview(url, type) {
		var preview;
		if(AssetNode.supportedImageTypes.indexOf(type) != -1)
			preview = new View('IMG');
		else if(AssetNode.supportedVideoTypes.indexOf(type) != -1)
			preview = new View('VIDEO');
		else if(AssetNode.supportedAudioTypes.indexOf(type) != -1)
			preview = new View('AUDIO');
		else
			preview = new Label('Asset cannot be previewed. Click to download');

		preview.setAttribute('src', url);
		preview.addStyleName('asset-preview');
		preview.domElement.addEventListener('click', (e) => {
			Downloader.downloadURL(url, this.assetName);
		});

		this.addView(preview);

		if(this.assetSize > 15000000) {
			this.addStyleName('unchive-asset--large-node');
			this.setSubText('<i class="material-icons">warning</i>' + AssetNode.formatAssetSize(this.assetSize));
		} else {
			this.setSubText(AssetFormatter.formatSize(this.assetSize));
		}
	}

	static initConstants() {
		this.supportedImageTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp'];
		this.supportedVideoTypes = ['mp4', 'avi', '3gp', 'flv', 'wmv'];
		this.supportedAudioTypes = ['mp3', 'ogg', 'wav', 'wma'];
	}
}

export class SummaryNode extends Node {

  static async promiseNode(title, customHTML) {
		return new SummaryNode(title, customHTML);
	}

  constructor(title, customHTML) {
    super(title, '');
    this.addStyleName('unchive-summary-node');
    this.contentWrapper = new View('DIV');
    this.addView(this.contentWrapper);
    this.contentWrapper.domElement.innerHTML = customHTML;
  }

}
