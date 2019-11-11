import { Screen } from './screen.js'

export class AIAReader {
  static read(content) {
    this.screens = [];
    var readerObj = content instanceof Blob ? new zip.BlobReader(content) : new zip.HttpReader(content);
    zip.createReader(readerObj, (reader) => {
      reader.getEntries((entries) => {
        if (entries.length) {
          this.splitEntries(entries);
          this.fetchBlockData();
          this.fetchSchemeData();

          console.log(JSON.stringify(this.screen));
        }
      });
    }, function(error) {
      // onerror callback
    });
  }

  static splitEntries(entries) {
    this.schemes = entries.filter((entry) => {
      return entry.filename.split('.')[1] == 'scm';
    });

    this.blocks = entries.filter((entry) => {
      return entry.filename.split('.')[1] == 'blk';
    });
  }

  static fetchBlockData() {
    for(let blk of this.blocks) {
      blk.getData(new zip.TextWriter(), function(text) {
        this.screens.push({
          'name' : blk.split('/').pop().split('.')[0],
          'screen' : new Screen('', text)
        })
      });
    }
  }

  static fetchSchemeData() {
    for(let scm of this.schemes) {
      scm.getData(new zip.TextWriter(), function(text) {
        this.screens.find(x => x.name == scm.filename.split('/').pop().split('.')[0]).screen.setScheme(text);
      });
    }
  }
}
