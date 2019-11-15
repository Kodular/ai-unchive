import { View } from '../view.js'
import { Label } from '../widgets.js'

import { NodeList } from './node_list.js'

import { BlockWriter } from '../../unchive/block_writer.js'

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
    this.captionView.setHTML(caption + '<br><small>' + this.subText + '</small>');
  }

  setNodeList(nodeList) {
    this.containerNodeList = nodeList;
  }
}

class HeaderNode extends Node {

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
		super(PropertyNode.addSpacesToName(propertyName));
		this.captionView.addStyleName('unchive-property-node__property-name');
		this.valueView = new Label(propertyValue);
		this.valueView.addStyleName('unchive-property-node__property-value');
		this.addView(this.valueView);
		this.addStyleName('unchive-property-node');
	}

	static addSpacesToName(name) {
		return name.trim().split(/(?=[A-Z])/).join(' ');
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
      if(this.chainNodeList.visible)
        return;
      this.setChainVisible(true);
      if(this.containerNodeList.activeNode != undefined)
        if(this.containerNodeList.activeNode instanceof ChainedNode)
          this.containerNodeList.activeNode.setChainVisible(false);
      this.containerNodeList.setActiveNode(this);
    });
    this.initializeChain(data);
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

	static async promiseNode(caption, subText, data) {
		return new ComponentNode(caption, subText, data);
	}

  constructor(caption, subText, componentData) {
		super(caption, subText, componentData);
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
		super('Blocks', '', blockData);
		this.chainNodeList.addStyleName('node-list--full-width');
	}

	async generateChain(data) {
		/*for(let block of data.getElementsByTagName('xml')[0].children) {
			this.chainNodeList.addNodeAsync(BlockNode.promiseNode(
				BlockWriter.writeBlock(block),
				!BlockWriter.validGlobalBlock(block)
			));
		}*/
	}
}

class BlockNode extends Node {

	static async promiseNode(blockContents, faulty) {
		return new BlockNode(blockContents, faulty);
	}

	constructor(blockContents, faulty) {
		super(blockContents);
		this.addStyleName('unchive-block-node');
		if(faulty)
			this.addStyleName('unchive-node--faulty');
	}
}

export class AdditionalListNode extends ChainedNode {
	static async promiseNode(caption, data, generator) {
		return new AdditionalListNode(caption, data, generator);
	}

	constructor(caption, data, generator) {
		super(caption, '', [data, generator]);
	}

	async generateChain(data) {
		data[1].call(this, data[0]);
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
		super(assetName + '.' + assetType, AssetNode.formatAssetSize(assetSize));
		this.assetName = assetName + '.' + assetType;
		this.generatePreview(assetURL, assetType);
		this.addStyleName('unchive-extension-node');
	}

	generatePreview(url, type) {
		var preview;
		if(['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp'].indexOf(type) != -1)
			preview = new View('IMG');
		else if(['mp4', 'avi', '3gp', 'flv', 'wmv'].indexOf(type) != -1)
			preview = new View('VIDEO');
		else if(['mp3', 'ogg', 'wav', 'wma'].indexOf(type) != -1)
			preview = new View('AUDIO');
		else
			preview = new Label('Asset cannot be previewed. Click to download');

		preview.setAttribute('src', url);
		preview.addStyleName('asset-preview');
		preview.domElement.addEventListener('click', (e) => {
			var anchor = new View('A');
			anchor.domElement.href = url;
			anchor.domElement.target = '_blank';
			anchor.domElement.download = this.assetName;

			anchor.domElement.click();
		});

		this.addView(preview);
	}

	//static supportedImageTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp'];
	//static supportedVideoTypes = ['mp4', 'avi', '3gp', 'flv', 'wmv'];
	//static supportedAudioTypes = ['mp3', 'ogg', 'wav', 'wma'];
	//static units = ['B', 'kB', 'mB', 'gB', 'tB', 'pB'];

	static formatAssetSize(size) {
		var unitCount = 0
		while(size > 1000) {
			size /= 1000;
			unitCount++;
		}
		return parseInt(size) + ['B', 'kB', 'mB', 'gB', 'tB', 'pB'][unitCount];
	}
}
