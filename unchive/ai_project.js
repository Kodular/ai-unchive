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
  constructor(scheme, blocks) {
    this.scheme = scheme;
    this.blocks = blocks;
  }

  setBlk(blocks) {
    this.blocks = blocks;
    this.generateBlockData();
  }

  setScm(scheme) {
    this.scheme = scheme;
  }

  generateBlockData() {
    // TODO: convert xml to json, and then to block objects
  }
}
