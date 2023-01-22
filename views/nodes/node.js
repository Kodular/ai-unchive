/**
 * Defines classes that represent Nodes based on their use-case.
 *
 *
 * @file   This file defines the Node and its descendant classes.
 * @author vishwas@kodular.io (Vishwas Adiga)
 * @since  1.0.0
 * @license
 */

import { View } from '../view.js'
import { Label, Downloader, AssetFormatter } from '../widgets.js'

import { NodeList } from './node_list.js'

import { BlocklyWorkspace } from '../../src/unchive/ai_project.js'

/**
 * Class that represents a basic node.
 *
 * A node is a UI element that, at its least, contains a title and a subtitle.
 *
 * @since  1.0.0
 * @access public
 */
export class Node extends View {

  /**
   * Creates a new Node object asynchronously.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments View
   *
   * @param {String} caption The title of this node.
   * @param {String} subText The subtitle of this node.
   *
   * @return {Node} New Node object.
   */
	static async promiseNode(caption, subText) {
		return new Node(caption, subText);
	}

  /**
   * Creates a new Node object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments View
   *
   * @param {String} caption The title of this node.
   * @param {String} subText The subtitle of this node.
   *
   * @return {Node} New Node object.
   */
	constructor(caption, subText) {
    super('DIV');
    this.captionView = new Label();
    this.addView(this.captionView);
    this.addStyleName('unchive-node');
    this.subText = subText || '';
    this.setCaption(caption);
  }

  /**
   * Sets the caption of this node.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} caption The title of this node.
   */
  setCaption(caption) {
    this.caption = caption;
    this.captionView.setHTML(caption + '<br><small>' + this.subText + '</small>');
  }

  /**
   * Sets the subtitle of this node.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} text The subtitle of this node.
   */
  setSubText(text) {
    this.subText = text;
    this.captionView.setHTML(this.caption + '<br><small>' + text + '</small>');
  }

  /**
   * Sets the NodeList this node belongs to.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {NodeList} nodeList The container NodeList of this node.
   */
  setNodeList(nodeList) {
    this.containerNodeList = nodeList;
  }
}

/**
 * Class that represents a node displayed in the header of a NodeList.
 *
 * @since  1.0.0
 * @access public
 */
export class HeaderNode extends Node {

  /**
   * Creates a new HeaderNode object asynchronously.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments Node
   *
   * @param {String} caption The title of this node.
   * @param {String} icon    An optional icon to be displayed alongside the title.
   *
   * @return {HeaderNode} New HeaderNode object.
   */
	static async promiseNode(caption, icon) {
		return new HeaderNode(caption, icon);
	}

  /**
   * Creates a new HeaderNode object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments Node
   *
   * @param {String} caption The title of this node.
   * @param {String} icon    An optional icon to be displayed alongside the title.
   *
   * @return {HeaderNode} New HeaderNode object.
   */
	constructor(caption, icon) {
		super(caption);
		this.iconView = new Label('<i class="material-icons">' + icon + '</i>', true);
		this.insertView(this.iconView, 1);
	}

  /**
   * Adds a click listener to this node.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {Function} callback The callback to be invoked when the node is clicked.
   */
	addClickListener(callback) {
		this.domElement.addEventListener('click', (event) => {
			callback(event);
		});
	}
}

/**
 * Class that is used to display properties of a component.
 *
 * @since  1.0.0
 * @access public
 */
class PropertyNode extends Node {

  /**
   * Creates a new PropertyNode object asynchronously.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments Node
   *
   * @param {String} propertyName  The translated name of the property.
   * @param {String} propertyValue The translated value of the property.
   *
   * @return {PropertyNode} New PropertyNode object.
   */
	static async promiseNode(propertyName, propertyValue) {
		return new PropertyNode(propertyName, propertyValue);
	}

  /**
   * Creates a new PropertyNode object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments Node
   *
   * @param {String} propertyName  The translated name of the property.
   * @param {String} propertyValue The translated value of the property.
   *
   * @return {PropertyNode} New PropertyNode object.
   */
	constructor(propertyName, propertyValue) {
		super(Messages[propertyName + 'Properties'] || propertyName);
		this.captionView.addStyleName('unchive-property-node__property-name');
		this.valueView = new Label(propertyValue);
		this.valueView.addStyleName('unchive-property-node__property-value');
		this.addView(this.valueView);
		this.addStyleName('unchive-property-node');
	}
}

/**
 * Class that defines a node that can be clicked to display more nodes.
 *
 * @since  1.0.0
 * @access public
 */
export class ChainedNode extends Node {

  /**
   * Creates a new ChainedNode object asynchronously.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments Node
   *
   * @param {String} caption The title of the node.
   * @param {String} subText The subtitle of the node.
   * @param {String} data    The data to be used in generating the chained nodes.
   *
   * @return {ChainedNode} New ChainedNode object.
   */
	static async promiseNode(caption, subText, data) {
		return new ChainedNode(caption, subText, data);
	}

  /**
   * Creates a new ChainedNode object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments Node
   *
   * @param {String} caption The title of the node.
   * @param {String} subText The subtitle of the node.
   * @param {Object} data    The data to be used in generating the chained nodes.
   *
   * @return {ChainedNode} New ChainedNode object.
   */
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

  /**
   * Opens the NodeList chained to this node.
   *
   * @since 1.0.0
   * @access public
   */
  open() {
    if(this.chainNodeList.visible)
      return;
    this.setChainVisible(true);
    if(this.containerNodeList.activeNode)
      if(this.containerNodeList.activeNode instanceof ChainedNode)
        this.containerNodeList.activeNode.setChainVisible(false);
    this.containerNodeList.setActiveNode(this);
  }

  /**
   * Sets the visibility of the node. If visibility is set to false, all open
   * nodes chained to this node get closed too.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {Boolean} visible Visibility of the node and its chained nodes.
   */
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

  /**
   * Asynchronously initialises all the nodes chained to this node using the data
   * provided in the constructor.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {Object} data The data to be used in generating the chained nodes.
   */
  async initializeChain(data) {
    this.chainNodeList = new NodeList();
    this.generateChain(data);
    this.setChainVisible(false);
  }

  /**
   * Generates chained nodes using this custom generator. To be overridden by
   * descendants.
   *
   * @since 1.0.0
   * @access protected
   *
   * @param {Object} data The data to be used in generating the chained nodes.
   */
  async generateChain(data) {;}
}

/**
 * Class that represents a component.
 *
 * @since  1.0.0
 * @access public
 */
class ComponentNode extends ChainedNode {

  /**
   * Creates a new ComponentNode object asynchronously.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments ChainedNode
   *
   * @param {String} caption       The name of the component.
   * @param {String} type          The type of the component.
   * @param {Object} componentData The properties and children of this component.
   *
   * @return {ComponentNode} New ComponentNode object.
   */
	static async promiseNode(caption, type, data) {
		return new ComponentNode(caption, type, data);
	}

  /**
   * Creates a new ComponentNode object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments ChainedNode
   *
   * @param {String} caption       The name of the component.
   * @param {String} type          The type of the component.
   * @param {Object} componentData The properties of this component.
   *
   * @return {ComponentNode} New ComponentNode object.
   */
  constructor(caption, type, componentData) {
		super(
      caption,
      Messages[type.charAt(0).toLowerCase() + type.slice(1) + 'ComponentPallette'] || type,
      componentData);
    // If there was a problem parsing the component, we show it as such with a
    // "!" icon.
		if(componentData.faulty) {
				this.arrowLabel.setHTML('<i class="material-icons">error</i>');
				this.addStyleName('unchive-node--faulty');
			}
	}

	async generateChain(data) {
		this.generatePropertyNodes(data.properties);
  }

  /**
   * Asynchronously generates property nodes for all properties of this component.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {Array} properties An array of properties of this component.
   */
	async generatePropertyNodes(properties) {
		try {
			for(let item of properties) {
				let propertyNodePromise = PropertyNode.promiseNode(
          // We replace &H with # in all colour properties.
          item.name, item.editorType == 'color' ?
          item.value.replace('&H', '#') :
          item.value);
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

/**
 * Class that represents a ComponentContainer.
 *
 * @since  1.0.0
 * @access public
 */
class ContainerNode extends ComponentNode {

  /**
   * Creates a new ContainerNode object asynchronously.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments ComponentNode
   *
   * @param {String} caption The name of the component.
   * @param {String} type    The type of the component.
   * @param {Object} data    The properties and children of this container.
   *
   * @return {ContainerNode} New ContainerNode object.
   */
  static async promiseNode(caption, subText, data) {
		return new ContainerNode(caption, subText, data);
	}

  /**
   * Generates chained nodes for the container's properties, children, and an
   * ease-of-access header.
   *
   * @since 1.0.0
   * @access protected
   *
   * @param {Object} data The data to be used in generating the chained nodes.
   */
	async generateChain(data) {
		this.createHeader();
		this.generateChildNodes(data.children);
		this.generatePropertyNodes(data.properties);

		this.header.addClickListener(e => {
			this.firstPropertyNode.scrollIntoView({ block: 'start',  behavior: 'smooth' });
		});
  }

  /**
   * Creates a header node that lets the user jump directly to the list of properties.
   *
   * @since 1.0.0
   * @access private
   */
	async createHeader() {
		this.header = new HeaderNode('Jump to properties', 'double_arrow');
		this.header.addStyleName('unchive-node--component-container--header');
		this.chainNodeList.addNode(this.header);
	}

  /**
   * Generates nodes for all children of this container.
   *
   * @since 1.0.0
   * @access protected
   *
   * @param {Object} data The data to be used in generating the chained nodes.
   */
	async generateChildNodes(children) {
		for(let item of children) {
			if(item.children[0] != undefined)
				this.chainNodeList.addNodeAsync(ContainerNode.promiseNode(
          item.name,
          item.type,
          item));
			else
				this.chainNodeList.addNodeAsync(ComponentNode.promiseNode(
          item.name,
          item.type,
          item));
		}
	}
}

/**
 * Class that represents a Screen.
 *
 * @since  1.0.0
 * @access public
 */
export class ScreenNode extends ContainerNode {

  /**
   * Creates a new ScreenNode object asynchronously.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments ContainerNode
   *
   * @param {AIScreen} screen The screen this node represents.
   *
   * @return {ScreenNode} New ScreenNode object.
   */
	static async promiseNode(screen) {
		return new ScreenNode(screen);
	}

  /**
   * Creates a new ScreenNode object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments ContainerNode
   *
   * @param {AIScreen} screen The screen this node represents.
   *
   * @return {ScreenNode} New ScreenNode object.
   */
  constructor(screen) {
    // Filter out Screen1 only properties
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
    super(screen.name, Messages.screenComponentPallette, screen);
  }

  /**
   * Generates chained nodes for the screen's properties, children, and its
   * blocks.
   * @since 1.0.0
   * @access protected
   *
   * @param {Object} data The data to be used in generating the chained nodes.
   */
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

/**
 * Class that represents a Blockly workspace.
 *
 * @since  1.0.0
 * @access public
 */
class WorkspaceNode extends ChainedNode {

  /**
   * Creates a new WorkspaceNode object asynchronously.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments ChainedNode
   *
   * @param {String} blockData Stringified Blockly XML content.
   *
   * @return {WorkspaceNode} New WorkspaceNode object.
   */
	static async promiseNode(blockData) {
		return new WorkspaceNode(blockData);
	}

  /**
   * Creates a new WorkspaceNode object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments ChainedNode
   *
   * @param {String} blockData Stringified Blockly XML content.
   *
   * @return {WorkspaceNode} New WorkspaceNode object.
   */
	constructor(blockData) {
		super('Blocks', '', new DOMParser().parseFromString(blockData, 'text/xml'));
		this.chainNodeList.addStyleName('node-list--blocks-list');
	}

  /**
   * Generates BlockNodes for every block in the XML DOM.
   * @since 1.0.0
   * @access protected
   *
   * @param {Object} data The blocks XML DOM.
   */
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

  /**
   * Sets the visibility of the nodes chained to this node.
   * @since 1.0.0
   * @access public
   *
   * @param {Boolean} visible Visibility of the chained nodes.
   */
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

/**
 * Class that represents a top-level block.
 *
 * @since  1.0.0
 * @access public
 */
class BlockNode extends Node {

  /**
   * Creates a new BlockNode object asynchronously.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments Node
   *
   * @param {DOM} blocks XML DOM describing the top-level block and its children.
   *
   * @return {BlockNode} New BlockNode object.
   */
	static async promiseNode(blocks) {
		return new BlockNode(blocks);
	}

  /**
   * Creates a new BlockNode object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments Node
   *
   * @param {DOM} blocks XML DOM describing the top-level block and its children.
   *
   * @return {BlockNode} New BlockNode object.
   */
	constructor(blocks) {
		super();
		this.addStyleName('unchive-block-node');
		this.workspace = new BlocklyWorkspace(blocks);
		this.addView(this.workspace.getWorkspaceView());
	}

  /**
   * Initialises the Blockly workspace.
   * @since 1.0.0
   * @access public
   */
	initializeWorkspace() {
    this.workspace.initializeWorkspace();
    // If the block parse was faulty or if the top-level block is invalid,
    // we mark the block as such with a yellow background.
    if(this.workspace.faulty)
      this.addStyleName('unchive-block-node--faulty');
	}
}

/**
 * Class that represents a node used to display additional information.
 *
 * @since  1.0.0
 * @access public
 */
export class AdditionalListNode extends ChainedNode {

  /**
   * Creates a new AdditionalListNode object asynchronously.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments ChainedNode
   *
   * @param {String}   caption   Title of this node.
   * @param {Object}   data      Data used to generate the chained nodes.
   * @param {Function} generator Function used to generate the chained nodes.
   * @param {Function} onOpen    Function called when the node was clicked on.
   *
   * @return {AdditionalListNode} New AdditionalListNode object.
   */
	static async promiseNode(caption, data, generator, onOpen) {
		return new AdditionalListNode(caption, data, generator, onOpen);
	}

  /**
   * Creates a new AdditionalListNode object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments ChainedNode
   *
   * @param {String}   caption   Title of this node.
   * @param {Object}   data      Data used to generate the chained nodes.
   * @param {Function} generator Function used to generate the chained nodes.
   * @param {Function} onOpen    Function called when the node was clicked on.
   *
   * @return {AdditionalListNode} New AdditionalListNode object.
   */
	constructor(caption, data, generator, onOpen) {
		super(caption, '', [data, generator]);
    this.onOpen = onOpen;
	}

  /**
   * Generates nodes using the generator function and the data.
   * @since 1.0.0
   * @access protected
   *
   * @param {Object} data The data used to generate the chained nodes.
   */
	async generateChain(data) {
    if( data[0] && data[1])
		  data[1].call(this, data[0]);
	}

  /**
   * Sets the visibility of the nodes chained to this node.
   * @since 1.0.0
   * @access public
   *
   * @param {Boolean} visible Visibility of the chained nodes.
   */
  setChainVisible(visible) {
		super.setChainVisible(visible);
		if(visible && this.onOpen)
		  this.onOpen();
	}
}

/**
 * Class that represents an extension.
 *
 * @since  1.0.0
 * @access public
 */
export class ExtensionNode extends Node {

  /**
   * Creates a new ExtensionNode object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments Node
   *
   * @param {String} extensionName Name of the extension.
   * @param {String} packageName   Package name of the extension.
   * @param {String} description   Developer-defined description of the extension.
   *
   * @return {ExtensionNode} New ExtensionNode object.
   */
	constructor(extensionName, packageName, description) {
		super(extensionName, packageName);
		this.addStyleName('unchive-extension-node');
		this.descriptionView = new Label(description);
		this.addView(this.descriptionView);
	}
}

/**
 * Class that represents an asset.
 *
 * @since  1.0.0
 * @access public
 */
export class AssetNode extends Node {

  /**
   * Creates a new AssetNode object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments Node
   *
   * @param {String} assetName Name of the asset.
   * @param {String} assetType File type of the asset.
   * @param {String} assetSize Size of the asset in bytes.
   * @param {String} assetURL  Temporary URL assigned to the asset blob.
   *
   * @return {AssetNode} New AssetNode object.
   */
	constructor(assetName, assetType, assetSize, assetURL) {
		AssetNode.initConstants();
		super(assetName + '.' + assetType, '');
		this.assetName = assetName + '.' + assetType;
		this.assetSize = assetSize;
		this.generatePreview(assetURL, assetType);
		this.addStyleName('unchive-asset-node');
	}

  /**
   * Generates a preview for the asset if it can be previewed.
   * @since 1.0.0
   * @access private
   *
   * @param {String} url  Temporary URL assigned to the asset blob.
   * @param {String} type File type of the asset.
   */
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
			this.setSubText(
        '<i class="material-icons">warning</i>' +
        AssetNode.formatAssetSize(this.assetSize));
		} else {
			this.setSubText(AssetFormatter.formatSize(this.assetSize));
		}
	}

  /**
   * Utility function to initialise necessary enums.
   * @since 1.0.0
   * @access private
   */
	static initConstants() {
		this.supportedImageTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp'];
		this.supportedVideoTypes = ['mp4', 'avi', '3gp', 'flv', 'wmv'];
		this.supportedAudioTypes = ['mp3', 'ogg', 'wav', 'wma'];
	}
}

/**
 * Class that represents a summary item.
 *
 * @since  1.0.0
 * @access public
 */
export class SummaryNode extends Node {

  /**
   * Creates a new SummaryNode object asynchronously.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments Node
   *
   * @param {String} title Title of the summary item.
   * @param {String} customHTML HTML describing the rows of the summary items.
   *
   * @return {SummaryNode} New SummaryNode object.
   */
  static async promiseNode(title, customHTML) {
		return new SummaryNode(title, customHTML);
	}

  /**
   * Creates a new SummaryNode object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments Node
   *
   * @param {String} title Title of the summary item.
   * @param {String} customHTML HTML describing the rows of the summary items.
   *
   * @return {SummaryNode} New SummaryNode object.
   */
  constructor(title, customHTML) {
    super(title, '');
    this.addStyleName('unchive-summary-node');
    this.contentWrapper = new View('DIV');
    this.addView(this.contentWrapper);
    this.contentWrapper.domElement.innerHTML = customHTML;
  }
}
