/**
 * Defines classes used to manage App Inventor project data.
 *
 * Contains several classes that together represent an AI project. Each AI
 * project consists of screens, extensions, and assets. Each Screen in a project
 * is represented by its Form, child components, and blocks. Extensions are
 * simple objects containing their names and descriptions.
 * Together, these classes fully describe the content of an AIA file.
 *
 * @file   This file defines the AIProject, AIScreen, Component, AIExtension,
 *         AIAsset, and BlocklyWorkspace classes.
 * @author vishwas@kodular.io (Vishwas Adiga)
 * @since  1.0.0
 * @license
 */

import {View} from '../views/view.js'
import simpleComponentsJson from "./simple_components.json";

/**
 * Class that describes an App Inventor project.
 *
 * @since  1.0.0
 * @access public
 */
export class AIProject {

/**
 * Creates a new AIProject object with the given name.
 *
 * @since 1.0.0
 * @access public
 *
 * @class
 * @param {String} name Name of the project.
 *
 * @return {AIProject} New AIProject object.
 */
  constructor(name) {
    /**
     * Name of the project this class represents.
     * @since  1.0.0
     * @type   {String}
     */
    this.name = name;

    /**
     * Array of Screen objects this project contains.
     * @since  1.0.0
     * @type   {Array<AIScreen>}
     */
    this.screens = [];

    /**
     * Array of extensions used by this project.
     * @since  1.0.0
     * @type   {Array}
     */
    this.extensions = [];

    /**
     * Array of AIAsset objects this project contains.
     * @since  1.0.0
     * @type   {Array}
     */
    this.assets = [];
}
  /**
   * Adds a single asset to this project's array of assets.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {AIAsset} asset Asset object.
   */
  addAsset(asset) {
    if(asset instanceof AIAsset)
      this.assets.push(asset);
    else
      throw new TypeError('Attempt to add ' + typeof asset + ' to AIProject');
  }

  /**
   * Adds a single screen to this project's array of screens.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {AIScreen} screen Screen object.
   */
  addScreen(screen) {
    if(screen instanceof AIScreen)
        this.screens.push(screen);
    else
        throw new TypeError('Attempt to add ' + typeof screen + ' to AIProject');
  }

  /**
   * Adds a single extension to this project's array of extensions.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {AIExtension} extension Extension object.
   */
  addExtension(extension) {
    if(extension instanceof AIExtension)
      this.extensions.push(extension);
    else
      throw new TypeError('Attempt to add ' + typeof extension + ' to AIProject');
  }
}

/**
 * Class that describes a screen in an App Inventor project.
 *
 * @since  1.0.0
 * @access public
 */
export class AIScreen {

  /**
   * Creates a new AIScreen object asynchronously.
   *
   * Asynchronously creating this object, as opposed to using a constructor, lets
   * us generate all screens in a project simultaneously. This greatly reduces
   * the overall load time of the page, especially in case of large AIAs, as the
   * @see AIAReader::read function will not have to wait for the components of
   * this screen to load before starting with the next.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @param {String}    scm     The scheme data for this screen as fetched from
   *                            the AIA.
   * @param {String}    blk     The stringified Blockly XML for this screen as
   *                            fetched from the AIA.
   * @param {String}    name    The name of this screen.
   * @param {AIProject} project The project this screen belongs to.
   *
   * @return {AIScreen} New AIScreen object.
   */
  async init(scm, blk, name) {
    this.form = await this.generateSchemeData(scm);
    this.generateBlocks(blk);
    this.name = name;
    if(name == null)
      throw new TypeError('Screen name cannot be null!');
		return this;
  }
  /**
   * Takes the raw scheme input from the AIA, parses it as a JSON array, and then
   * generates all the component and property objects for this screen.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {String} scmJSON The raw scheme text fetched from the .scm file of
   *                         the AIA.
   *
   * @return {Component} The Form component of this screen.
   */
  async generateSchemeData(scmJSON) {
    var componentsJSON = JSON.parse(scmJSON.substring(9, scmJSON.length - 3));
     return this.generateComponent(componentsJSON.Properties);
  }

  /**
   * Takes the JSON description of a component and asynchronously
   * creates a new @see Component class representing it. Also recursively calls
   * itself for every child of this component.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {String} componentJSON The JSON object describing this component.
   *
   * @return {Component} An object representing this component's properties and
   *                     children.
   */
  async generateComponent(componentJSON) {
    // Check if the component is an instance of an extension.
    var extType = undefined //this.project.extensions.find(x => x.name.split('.').pop() === componentJSON.$Type);
    var origin;

    // If it is an extension, give it a custom descriptor JSON object that will
    // be used to generate its properties.
    // If it's not an extension, no JSON will be provided and the service's
    // simple_components.json file will be used instead.
    if(extType !== undefined) {
      var customDescriptorJSON = extType.descriptorJSON;
      origin = 'EXTENSION';
    } else {
      origin = 'BUILT-IN';
    }

    var component = new Component(
      componentJSON.$Name,
      componentJSON.$Type,
      componentJSON.Uuid || 0, //Screens do not have a Uuid property.
      origin
    );

		component.properties = await component.loadProperties(
      componentJSON,
      customDescriptorJSON || null);

    for(let childComponent of componentJSON.$Components || []) {
      component.addChild(await this.generateComponent(childComponent));
    }
    return component;
  }

  /**
   * Assigns the stringified Blockly XML of this screen to a class variable.
   *
   * We do not parse the text as XML right away as .aiv files cannot hold JSONP.
   * This XML is instead parsed right before being displayed in BlockNodes.
   * @see node.js::WorkspaceNode
   * @since 1.0.0
   * @access private
   *
   * @param {String} blkXml The string representing this screen's blocks.
   */
  generateBlocks(blkXml) {
    this.blocks = blkXml;
  }
}

/**
 * Class that describes a component with its properties and children.
 *
 * @since  1.0.0
 * @access public
 */
class Component {

  /**
   * Creates a new Component object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @param {String} name    The user-facing name of this component.
   * @param {String} type    The internal class name of this component.
   * @param {String} uid     The unique ID attached to this component.
   * @param {String} origin 'EXTENSION' if this component is the instance of an
   *                         extension, 'BUILT-IN' otherwise.
   *
   * @return {Component} New Component object.
   */
  constructor(name, type, uid, origin) {

    /**
     * Name of this component. It is unique and set by the user.
     * @since  1.0.0
     * @type   {String}
     */
    this.name = name;

    /**
     * Internal class name of this component, as defined by the name of the Java
     * file it is declared in.
     * @since  1.0.0
     * @type   {String}
     */
    this.type = type;

    /**
     * Unique identifier for this component. Is internal and hidden from the user.
     * Form components have a UID of 0.
     * @since  1.0.0
     * @type   {String}
     */
    this.uid = uid;

    /**
     * Array of Component objects that represents the children of this component.
     * @since  1.0.0
     * @type   {Array}
     */
    this.children = [];

    /**
     * Origin of this component. Used in @see SummaryWriter::generateNativeShare
     * to make summary charts of component usage.
     * @since  1.0.0
     * @type   {String}
     */
    this.origin = origin;

    /**
     * Array of property name-value pairs of this component. Properties are loaded
     * asynchronously in AIScreen::generateComponent.
     * @since  1.0.0
     * @type   {Array}
     */
    this.properties = [];

    /**
     * Flag which indicates whether there was a problem parsing this component's
     * properties. @see Component::loadProperties
     * @since  1.0.0
     * @type   {Boolean}
     */
    this.faulty = false;
  }

  /**
   * Generates an array of name-value pair objects describing this compoent's
   * properties.
   *
   * AIA files only store properties of a component that are not the default
   * value. Therefore, we have to map the properties defined for this component
   * type in the simple_components.json file (or custom descriptor JSON for
   * extensions) to the properties saved in the AIA. This lets us generate the
   * full list of properties for this component.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {Array} properties           JSON array describing the properties of this
   *                                     component that have a non-default value.
   * @param {Array} customDescriptorJSON The full list of properties and their
   *                                     default values for this component.
   *
   * @return {Promise} A Promise object, that when resolved, yields the complete
   *                   array of properties of this component.
   */
  loadProperties(properties, customDescriptorJSON) {
		return new Promise(async (resolve, reject) => {

      // We need to load the simple_components.json file first.
			if(AIProject.descriptorJSON === undefined) {
	      AIProject.descriptorJSON = await simpleComponentsJson;
	    }

      // It is not ideal to load the properties of all components in the UI thread
      // of the page, as it may cause users to see the kill page dialog when
      // loading large projects.
      // Instead, we use several web workers to do the job simultaneously in
      // separate threads and then return the complete array of properties.
      var propertyLoader = new Worker('unchive/property_processor.js');
	    try {
	      propertyLoader.postMessage({
	        'type' : this.name,
	        'propertyJSON' : properties,
	        'descriptorJSON' : (
            customDescriptorJSON ||
            AIProject.descriptorJSON.find(x =>
              x.type === 'com.google.appinventor.components.runtime.' + this.type)
            ).properties || []
	      });
	    } catch(error) {
        // If the descriptor JSON object for this component does not exist in
        // AIProject.descriptorJSON, it means either the component has been
        // removed from the service, or that the user is trying to load an AIA
        // that was developed using a different service.
        // In either case, we continue to parse the rest of the components that
        // can be parsed, and add a "faulty" flag to the component.
        // This flag will later be used in @see node.js::ComponentNode to show the
        // user a visual indicator stating there was an error parsing the component.
	      console.log(
          'Error in ' +
          this.name +
          '(' + this.uid + ' / ' + this.type + '), message: ' +
          error.message);
				this.faulty = true;
				resolve([]);
	      propertyLoader.terminate();
	    }

	    propertyLoader.addEventListener('message', (event) => {
	      resolve(event.data.properties);
	      propertyLoader.terminate();
	    });
		});

  }

  /**
   * Adds a child component to this component.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {Component} component The child component to be added.
   */
  addChild(component) {
    if(component instanceof Component)
      this.children.push(component);
    else
      throw new TypeError(
        'Attempt to add ' +
        typeof component +
        ' to Component.');
  }
}

/**
 * Class that describes an extension.
 *
 * @since  1.0.0
 * @access public
 */
export class AIExtension {

  /**
   * Creates a new AIExtension object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @param {String} name              The full package name of this extension.
   * @param {String} descriptorJSON    The custom JSON used to load the properties
   *                                   of any instances of this extension.
   *
   * @return {AIExtension} New AIExtension object.
   */
  constructor(name, descriptorJSON) {

    /**
     * Package name of this extension (eg: com.google.SearchBoxExtension).
     * @since  1.0.0
     * @type   {String}
     */
    this.name = name;

    /**
     * Custom descriptor JSON used by components to populate their list of
     * properties
     * @since  1.0.0
     * @type   {Object}
     */
    this.descriptorJSON = descriptorJSON;
  }
}

/**
 * Class that describes an asset file.
 *
 * @since  1.0.0
 * @access public
 */
export class AIAsset {

  /**
   * Creates a new AIAsset object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @param {String} name The name of this asset file.
   * @param {String} type The asset's file type (png, jpg, etc.)
   * @param {Blob} blob   The blob representing this asset's contents.
   *
   * @return {AIAsset} New AIAsset object.
   */
  constructor(name, type, blob) {

    /**
     * Name of this asset, as defined by the user in their project.
     * @since  1.0.0
     * @type   {String}
     */
    this.name = name;

    /**
     * File type of this asset.
     * @since  1.0.0
     * @type   {String}
     */
    this.type = type;

    /**
     * Blob representing this project. This is undefined in .aiv files as Blob
     * functions are not stringified into JSON.
     * @since  1.0.0
     * @type   {Blob}
     */
    this.blob = blob;

    /**
     * Size of this asset in bytes.
     * @since  1.0.0
     * @type   {Integer}
     */
		this.size = blob.size;

    /**
     * Temporary URL representing this blob
     * @since  1.0.0
     * @type   {String}
     */
		this.url = '';
  }

  /**
   * Returns a unique URL that can be used to display this asset to the user.
   *
   * @since 1.0.0
   * @access public
   *
   * @return {String} Temporary URL pointing to this asset's blob.
   */
  getURL() {
    if(this.url === '')
      this.url = URL.createObjectURL(this.blob)
    return this.url;
  }

  /**
   * Revokes any URL set to point to this asset's blob.
   *
   * @since 1.0.0
   * @access public
   */
  revokeURL() {
    URL.revokeObjectURL(this.url);
  }
}

/**
 * Class that describes a Blockly Workspace used to display blocks.
 *
 * @since  1.0.0
 * @access public
 */
export class BlocklyWorkspace {

  /**
   * Creates a new BlocklyWorkspace object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @param {DOM} blocks The blocks DOM that this workspace will show.
   *
   * @return {BlocklyWorkspace} New BlocklyWorkspace object.
   */
	constructor(blocks) {

    /**
     * View inside which the Blockly workspace will be injected.
     * @since  1.0.0
     * @type   {View}
     */
	  this.workspaceView = new View('DIV');

    /**
     * Flag indicating if the blocks have been loaded already.
     * @since  1.0.0
     * @type   {Boolean}
     */
		this.loaded = false;

    /**
     * DOM containing the blocks this workspace will show.
     * @since  1.0.0
     * @type   {DOM}
     */
    this.blocks = blocks;

    /**
     * Flag indicating if the workspace contains faulty blocks.
     * @since  1.0.0
     * @type   {Boolean}
     */
    this.faulty = false;

    /**
     * Array of valid top-level blocks this workspace can contain.
     * @since  1.0.0
     * @type   {Array}
     */
    this.validTypes = [
      'global_declaration',
      'component_event',
      'procedures_defnoreturn',
      'procedures_defreturn'];
	}

  /**
   * Injects a Blockly workspace to the user interface and loads blocks in it.
   *
   * @since 1.0.0
   * @access public
   */
	initializeWorkspace() {

    // If the blocks are already loaded, we simply resize the workspace based on
    // the size of the blocks. Resizing every time is necessary to avoid a no-show
    // when the user first downloads the project summary and then goes to view
    // each screen's blocks.
		if(this.loaded) {
      this.resizeWorkspace();
      return;
    }
		this.loaded = true;
		this.workspace = Blockly.inject(this.workspaceView.domElement, {
      toolbox: false,
      trashcan: false,
      readOnly: true,
      scrollbars: false
    });

    this.workspace.setScale(1);

    /**
     * Returns the descriptor JSON object containing all the events, methods, and
     * properties of the component passed as parameter.
     *
     * @since 1.0.0
     * @access private
     *
     * @param {String} componentType The internal class name of the component.
     *
     * @return {Object} The JSON object describing the component.
     */
		this.workspace.getDescriptor = function(componentType) {
			let descriptor =  AIProject.descriptorJSON.find(x =>
        x.type === 'com.google.appinventor.components.runtime.' + componentType);
			if(descriptor === undefined)
				for(let extension of RootPanel.project.extensions)
					if(extension.name.split('.').pop() === componentType)
						return extension.descriptorJSON;
			return descriptor;
		}
    this.addBlocksToWorkspace();
    this.resizeWorkspace();
	}

  /**
   * Populates the workspace with blocks.
   *
   * @since 1.0.0
   * @access private
   */
	addBlocksToWorkspace() {
    try {
      Blockly.Xml.domToBlock(this.blocks, this.workspace).setCollapsed(false);
    } catch(error) {
      // If there was an error parsing the blocks, we set the faulty flag to true.
      this.faulty = true;
    } finally {
      // If the top-level block is not an event, procedure def, or global declaration,
      // we flag it as faulty to show the user a visual indicator in the UI.
      if(this.validTypes.indexOf(this.blocks.getAttribute('type')) === -1)
        this.faulty = true;
    }
	}

  /**
   * Resizes the Blockly workspace based on the size of its blocks.
   *
   * @since 1.0.0
   * @access private
   */
  resizeWorkspace() {
    let metrics = this.workspace.getMetrics();
		this.workspaceView.setAttribute(
			'style',
			'height: ' + metrics.contentHeight + 'px;' +
			'width: ' + metrics.contentWidth + 'px;'
		);

		Blockly.svgResize(this.workspace);
  }

	getWorkspaceView() {
		return this.workspaceView;
	}
}
