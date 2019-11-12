import { AIProject, AIScreen } from './ai_project.js'

export class AIAReader {
  static read(content) {
    var readerObj = content instanceof Blob ? new zip.BlobReader(content) : new zip.HttpReader(content);
    zip.createReader(readerObj, (reader) => {
      reader.getEntries((entries) => {
        if (entries.length) {
          var screens = this.generateScreens(
            entries.filter(x => this.getFileType(x) == 'scm' || this.getFileType(x) == 'bky')
          );

          console.log(screens);
          return new AIProject().addScreens(screens);
        }
      });
    }, function(error) {
      // onerror callback
    });
  }

  static async generateScreens(files) {
    var schemes = [];
    var blocks = [];

    var screens = [];

    for(let file of files) {
      var content = await this.getFileContent(file);
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
    }

    for(let scheme of schemes) {
      screens.push(new AIScreen(
        scheme.scm,
        blocks.find(x => x.name == scheme.name).bky,
        scheme.name));
    }
    return screens;
  }

  static getFileContent(file) {
    return new Promise((resolve, reject) => {
      file.getData(new zip.TextWriter(), (content) => {
        resolve(content);
      });
    });
  }

  static getFileType(file) {
    return file.filename.split('.')[1];
  }

  static getFileName(file) {
    return file.filename.split('/').pop().split('.')[0];
  }
}
