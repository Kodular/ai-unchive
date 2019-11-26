import { DescriptorGenerator } from './aia_reader.js'
import { View } from '../views/view.js'

export class AIProject {
  constructor(name) {
    this.name = name;
    this.screens = [];
    this.extensions = [];
    this.assets = [];
  }

  addAssets(assets) {
    for(let asset of assets)
      this.addAsset(asset);
  }

  addScreens(screens) {
    for(let screen of screens)
      this.addScreen(screen);
  }

  addExtensions(extensions) {
    for(let extension of extensions)
      this.addExtension(extension);
  }

  addAsset(asset) {
    if(asset instanceof AIAsset)
      this.assets.push(asset);
    else
      throw new TypeError('Attempt to add ' + typeof asset + ' to AIProject');
  }

  addScreen(screen) {
    if(screen instanceof AIScreen)
        this.screens.push(screen);
    else
        throw new TypeError('Attempt to add ' + typeof screen + ' to AIProject');
  }

  addExtension(extension) {
    if(extension instanceof AIExtension)
      this.extensions.push(extension);
    else
      throw new TypeError('Attempt to add ' + typeof extension + ' to AIProject');
  }

  generateSummary() {
		this.summary = [];

		this.summary.push({
			'title' : 'Stats',
			'customHTML' : this.screens.length
		});

		var totalBlocks = 0;
		for(let screen of this.screens) {
			//totalBlocks += screen.blocks.getElementsByTagName('block').length;
		}
		this.summary.push({
			'title' : 'Number of blocks',
			'customHTML' : totalBlocks
		});

		this.summary.push({
			'title' : 'Number of assets',
			'customHTML' : this.assets.length
		});

		var totalSize = 0;
		for(let asset of this.assets) {
			totalSize += asset.size;
		}
		this.summary.push({
			'title' : 'Size of assets',
			'customHTML' : totalSize + 'B'
		});

		this.summary.push({
			'title' : 'Number of extensions',
			'customHTML' : this.extensions.length
		});
  }
}

export class AIScreen {
  async init(scm, blk, name, project) {
    this.addToProject(project);
    this.form = await this.generateSchemeData(scm);
    this.generateBlocks(blk);
    this.name = name;
    if(name == null)
      throw new TypeError('Screen name cannot be null!');
		return this;
  }

  addToProject(project) {
    if(project instanceof AIProject)
      this.project = project;
    else
      throw new TypeError('Attempt to set ' + typeof project + ' as project of AIScreen');
  }

  async generateSchemeData(scmJSON) {
    var componentsJSON = JSON.parse(scmJSON.substring(9, scmJSON.length - 3));
     return this.generateComponent(componentsJSON.Properties);
  }

  async generateComponent(componentJSON) {
    var extType = this.project.extensions.find(x => x.name.split('.').pop() == componentJSON.$Type);
    var origin;
    if(extType != undefined) {
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

		component.properties = await component.loadProperties(componentJSON, customDescriptorJSON || null);

    for(let childComponent of componentJSON.$Components || []) {
      component.addChild(await this.generateComponent(childComponent));
    }
    return component;
  }

  generateBlocks(blkXml) {
    this.blocks = blkXml;
  }
}

class Component {
  constructor(name, type, uid, origin) {
    this.name = name;
    this.type = type;
    this.uid = uid;
    this.children = [];
    this.origin = origin;
  }

  loadProperties(properties, customDescriptorJSON) {
		return new Promise(async (resolve, reject) => {
			if(AIProject.descriptorJSON == undefined) {
	      AIProject.descriptorJSON = await DescriptorGenerator.generate();
	    }

	    var propertyLoader = new Worker('unchive/property_processor.js');
	    try {
	      propertyLoader.postMessage({
	        'type' : this.name,
	        'propertyJSON' : properties,
	        'descriptorJSON' : (customDescriptorJSON || AIProject.descriptorJSON.find(x => x.type == 'com.google.appinventor.components.runtime.' + this.type)).properties || []
	      });
	    } catch(error) {
	      console.log('Error in ' + this.name + '(' + this.uid + ' / ' + this.type + '), message: ' + error.message);
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

  addChild(component) {
    if(component instanceof Component)
      this.children.push(component);
    else
      throw new TypeError('Attempt to add ' + typeof component + ' to Component.');
  }
}

export class AIExtension {
  constructor(name, descriptorJSON) {
    this.name = name;
    this.descriptorJSON = descriptorJSON;
  }
}

export class AIAsset {
  constructor(name, type, blob) {
    this.name = name;
    this.type = type;
    this.blob = blob;
		this.size = blob.size;
  }

  getURL() {
    if(this.url == undefined)
      this.url = URL.createObjectURL(this.blob)
    return this.url;
  }

  revokeURL() {
    URL.revokeObjectURL(this.url);
  }
}

export class BlocklyWorkspace {
	constructor(blocks) {
	  this.workspaceView = new View('DIV');
		this.loaded = false;
    this.blocks = blocks;
    this.validTypes = ['global_declaration', 'component_event', 'procedures_defnoreturn', 'procedures_defreturn'];
	}

	initializeWorkspace() {
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
		this.workspace.getDescriptor = function(componentType) {
			let descriptor =  AIProject.descriptorJSON.find(x => x.type == 'com.google.appinventor.components.runtime.' + componentType);
			if(descriptor == undefined)
				for(let extension of RootPanel.project.extensions)
					if(extension.name.split('.').pop() == componentType)
						return extension.descriptorJSON;
			return descriptor;
		}
    this.addBlocksToWorkspace();
    this.resizeWorkspace();
	}

	addBlocksToWorkspace() {
    try {
      Blockly.Xml.domToBlock(this.blocks, this.workspace).setCollapsed(false);
    } catch(error) {
      this.faulty = true;
    } finally {
      if(this.validTypes.indexOf(this.blocks.getAttribute('type')) == -1)
        this.faulty = true;
    }
	}

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
