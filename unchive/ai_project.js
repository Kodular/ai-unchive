import { DescriptorGenerator } from '../unchive/aia_reader.js'

export class AIProject {
  constructor() {
    this.screens = [];
    this.extensions = [];
    this.assets = [];
  }

  addScreen(screen) {
    if(screen instanceof AIScreen) {
        this.screens.push(screen);
        screen.addToProject(this);
    } else {
        throw new TypeError('Attempt to add ' + typeof screen + ' to AIProject');
    }
  }

  async addScreens(screensArray) {
    for(let screen of await screensArray)
      this.addScreen(screen);
  }

  addExtensions(extensions) {
    this.extensions = extensions;
  }

  removeScreen(screen) {
    if(screen instanceof AIScreen)
      ;// TODO: Add splice code
    else
      throw new TypeError('Attempt to remove ' + typeof screen + ' from AIProject');
  }

  addAsset(asset) {
    if(screen instanceof AIAsset)
      this.assets.push(asset);
    else
      throw new TypeError('Attempt to add ' + typeof asset + ' to AIProject');
  }

  addExtension(extension) {
    if(extension instanceof AIExtension)
      this.extensions.push(extension);
    else
      throw new TypeError('Attempt to add ' + typeof extension + ' to AIProject');
  }

  generateSummary() {

  }
}

export class AIScreen {
  constructor(scm, blk, name) {
    this.generateSchemeData(scm);
    this.generateBlocks(blk);
    this.name = name;
    if(name == null)
      throw new TypeError('Screen name cannot be null!');
  }

  addToProject(project) {
    if(project instanceof AIProject)
      this.project = project;
    else
      throw new TypeError('Attempt to set ' + typeof project + ' as project of AIScreen');
  }

  generateSchemeData(scmJSON) {
    var componentsJSON = JSON.parse(scmJSON.substring(9, scmJSON.length - 3));
    this.form = this.generateComponent(componentsJSON.Properties);
  }

  generateComponent(componentJSON) {
    var component = new Component(
      componentJSON.$Name,
      componentJSON.$Type,
      componentJSON.Uuid || 0, //Screens do not have a Uuid property.
      componentJSON);
    for(let childComponent of componentJSON.$Components || []) {
      component.addChild(this.generateComponent(childComponent));
    }
    return component;
  }

  generateBlocks(blkXml) {
    // TODO: convert xml to json, and then to block objects
    this.blocks = new DOMParser().parseFromString(blkXml, 'text/xml');
  }
}

class Component {
  constructor(name, type, uid, propertiesJSON) {
    this.name = name;
    this.type = type;
    this.uid = uid;
    this.children = [];
    this.package = 'com.google.appinventor.components.runtime';
    this.customDescriptorJSON = null;

    this.loadProperties(propertiesJSON);
  }

  async loadProperties(properties) {
    if(AIProject.descriptorJSON == undefined) {
      AIProject.descriptorJSON = await DescriptorGenerator.generate();
    }

    console.log('Loading properties of ' + this.name);
    var propertyLoader = new Worker('unchive/property_processor.js');
    try {
    propertyLoader.postMessage({
      'propertyJSON' : properties,
      'descriptorJSON' : (this.customDescriptorJSON || AIProject.descriptorJSON).find(x => x.type == this.package + '.' + this.type).properties || []
    });
    }catch(e){;}
    propertyLoader.addEventListener('message', (event) => {
      this.properties = event.data.properties;
      propertyLoader.terminate();
    })
  }

  addChild(component) {
    if(component instanceof Component)
      this.children.push(component);
    else
      throw new TypeError('Attempt to add ' + typeof component + ' to Component.');
  }
}

export class Extension {
  constructor(name, descriptorJSON, packageName) {
    this.name = name;
    this.descriptorJSON = descriptorJSON;
    this.packageName = packageName;
  }

  getFullPackageName() {
    return this.packageName + '.' + this.name;
  }
}
