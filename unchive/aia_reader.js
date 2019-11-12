import { AIProject, AIScreen } from './ai_project.js'

export class AIAReader {
  read(content) {
    var readerObj = content instanceof Blob ? new zip.BlobReader(content) : new zip.HttpReader(content);
    zip.createReader(readerObj, (reader) => {
      reader.getEntries((entries) => {
        if (entries.length) {
          var screens = this.generateScreens(
            entries.filter(x => this.getFileType(x) == 'scm' || this.getFileType(x) == 'bky')
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
        } else if(this.getFileType(file) == 'bky') {
          blocks.push({
            'name' : this.getFileName(file),
            'bky' : content
          });
        }
      });
    }

    console.log(await schemes);

    for(let scheme of schemes) {
      screens.push(new AIScreen(
        scheme.scm,
        blocks.find(x => x.name == scheme.name).bky,
        scheme.name));
    }
    console.log('Done');
    return screens;
  }

  getFileType(file) {
    return file.filename.split('.')[1];
  }

  getFileName(file) {
    return file.filename.split('/').pop().split('.')[0];
  }
}
