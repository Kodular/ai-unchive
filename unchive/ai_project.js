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

  generateSchemeData(scmJson) {
    this.components = JSON.parse(scmJson.substring(9, scmJson.length - 9));
  }

  generateBlocks(blkXml) {
    // TODO: convert xml to json, and then to block objects
    var blockJson = xmlToJson.parse(this.blocks);
    this.blocks = blockJson;
  }
}
