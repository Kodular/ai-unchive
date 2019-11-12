import { AIProject, AIScreen } from './ai_project.js'

export class AIAReader {
  read(content) {
    var readerObj = content instanceof Blob ? new zip.BlobReader(content) : new zip.HttpReader(content);
    zip.createReader(readerObj, (reader) => {
      reader.getEntries((entries) => {
        if (entries.length) {
          var screens = this.generateScreens(entries.filter((x) => {
            return this.getFileType(file) == 'scm' || this.getFileType(file) == 'blk';
          }));

          console.log(JSON.stringify(screens));
        }
      });
    }, function(error) {
      // onerror callback
    });
  }

  generateScreens(files) {
    var schemes = [];
    var blocks = [];

    var screens = [];

    for(let file of files) {
      file.getData(new zip.TextWriter(), function(content) {
        if(this.getFileType(file) == 'scm') {
          schemes.push({
            'name' : this.getFileName(file),
            'scm' : text
          });
        } else if(this.getFileType(file) == 'blk') {
          blocks.push({
            'name' : this.getFileName(file),
            'blk' : text
          });
        }
      });
    }

    for(let scheme of schemes) {
      screens.push(new AIScreen(scheme.scm, blocks.find((x) => {
        return x.name == scheme.name;
      }).blk));
    }

    return screens;
  }

  getFileType(file) {
    return file.filename.split('.')[1];
  }

  getFileName(file) {
    return file.filename.split('/').pop().split('.')[0];
  }
}
