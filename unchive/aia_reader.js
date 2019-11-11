import { Screen } from './screen.js'

export class AIAReader {
  read(content) {
    this.screens = [];
    var readerObj = content instanceof Blob ? new zip.BlobReader(content) : new zip.HttpReader(content);
    zip.createReader(readerObj, (reader) => {
      reader.getEntries((entries) => {
        if (entries.length) {
          this.splitEntries(entries);
          this.fetchBlockData(this.screens);

          console.log(JSON.stringify(this.screens));
        }
      });
    }, function(error) {
      // onerror callback
    });

    return this.screens;
  }

  splitEntries(entries) {
    this.schemes = entries.filter((entry) => {
      return entry.filename.split('.')[1] == 'scm';
    });

    this.blocks = entries.filter((entry) => {
      return entry.filename.split('.')[1] == 'blk';
    });
  }

  fetchBlockData(screens) {
    for(let blk of this.blocks) {
      blk.getData(new zip.TextWriter(), function(text) {
        screens.push({
          'name' : blk.split('/').pop().split('.')[0],
          'screen' : new Screen('', text)
        })
      });
    }
    this.fetchSchemeData(screens);
  }

  fetchSchemeData(screens) {
    for(let scm of this.schemes) {
      scm.getData(new zip.TextWriter(), function(text) {
        screens.find((x) => {
          x.name == scm.filename.split('/').pop().split('.')[0];
        }).screen.setScheme(text);
      });
    }
  }
}
