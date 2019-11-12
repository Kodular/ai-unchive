import { AIProject, AIScreen } from './ai_project.js'

export class AIAReader {
  read(content) {
    var readerObj = content instanceof Blob ? new zip.BlobReader(content) : new zip.HttpReader(content);
    zip.createReader(readerObj, (reader) => {
      reader.getEntries((entries) => {
        if (entries.length) {
          var screens = this.generateScreens(
            entries.filter(x => this.getFileType(x) == 'scm' || this.getFileType(x) == 'blk')
          );

          console.log(screens);
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
      file.getData(new zip.TextWriter(), (content) => {
        if(this.getFileType(file) == 'scm') {
          schemes.push({
            'name' : this.getFileName(file),
            'scm' : content
          });
          console.log(this.getFileType(file) + JSON.stringify(schemes));
        } else if(this.getFileType(file) == 'blk') {
          blocks.push({
            'name' : this.getFileName(file),
            'blk' : content
          });
          console.log('bbb<br>' + JSON.stringify(blocks));
        }
      });
    }

    for(let scheme of schemes) {
      screens.push(new AIScreen(
        scheme.scm,
        blocks.find(x => x.name == scheme.name).blk,
        scheme.name));
    }


    for(let s of schemes) {
      console.log('aa' + s.scm);
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
