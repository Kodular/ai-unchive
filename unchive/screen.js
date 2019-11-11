export class Screen {
  constructor(scheme, blocks) {
    this.scheme = scheme;
    this.blocks = blocks;
  }

  setBlocks(blocks) {
    this.blocks = blocks;
  }

  setScheme(scheme) {
    this.scheme = scheme;
  }
}
