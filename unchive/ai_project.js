export class AIProject {
  constructor() {
    this.screens = [];
    this.extensions = [];
    this.assets = [];
  }

  addScreen(screen) {
    if(screen instanceof AIScreen)
      this.screens.push(screen);
    else
      throw new Exception('Attempt to add non-screen object to AIProject');
  }

  addScreens(screens) {
    for (let screen of screens)
      this.addScreen(screen);
  }

  removeScreen(screen) {
    if(screen instanceof AIScreen)
      ;// TODO: Add splice code
    else
      throw new Exception('Attempt to remove non-screen object from AIProject');
  }

  addAsset(asset) {
    if(screen instanceof AIAsset)
      this.assets.push(asset);
    else
      throw new Exception('Attempt to add non-asset object to AIProject');
  }

  addExtension(extension) {
    if(extension instanceof AIExtension)
      this.extensions.push(extension);
    else
      throw new Exception('Attempt to add non-extension object to AIProject');
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
      throw new Exception('Screen name cannot be null!');
  }

  generateSchemeData(scmJSON) {
    var componentsJSON = JSON.parse(scmJSON.substring(9, scmJSON.length - 3));
    this.components = this.generateComponent(componentsJSON.Properties);
  }

  generateComponent(componentJSON) {
    var components = [];
    var component = new Component(
      componentJSON.$Name,
      componentJSON.$Type,
      componentJSON.Uuid || 0, //Screens do not have a Uuid property.
      componentJSON);
    components.push(component);
    for(let childComponent of componentJSON.$Components || []) {
      component.addChild(this.generateComponent(childComponent));
    }
    return components;
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

    loadProperties(propertiesJSON);

    this.package = 'com.google.appinventor.components.runtime';
    this.customDescriptorJSON = null;
  }

  loadProperties(properties) {
    var propertyLoader = Worker('property_processor.js');
    propertyLoader.postMessage({
      'type' : this.package + '.' + this.type,
      'propertyJSON' : properties,
      'customJSON' : this.customDescriptorJSON
    });
    propertyLoader.addEventListener('message' (event) => {
      this.properties = event.data.properties;
      propertyLoader.terminate();
    })
  }

  addChild(component) {
    if(component instanceof Component)
      this.children.push(component);
    else
      throw new Exception('Attempt to add non-component to component.');
  }
}
