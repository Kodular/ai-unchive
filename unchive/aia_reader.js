import { AIProject, AIScreen, Extension } from './ai_project.js'

export class AIAReader {
  static async read(content) {
    AIProject.descriptorJSON = await DescriptorGenerator.generate();
    var readerObj = content instanceof Blob ? new zip.BlobReader(content) : new zip.HttpReader(content);
    zip.createReader(readerObj, (reader) => {
      reader.getEntries((entries) => {
        if (entries.length) {
          var project = new AIProject();
          project.addScreens(
            this.generateScreens(
              entries.filter(x =>
                this.getFileType(x) == 'scm' ||
                this.getFileType(x) == 'bky')
            )
          );

          project.addExtensions(
            this.generateExtensions(
              entries.filter(x => this.getFileType(x) == 'json')
            )
          );

          console.log('prj' + JSON.stringify(project));
          //return new AIProject().addScreens(screens); // TODO:
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

  static async generateExtensions(files) {
    var extensions = [];

    for(let file of files) {
      var content = await this.getFileContent(file);
      extensions.push(new Extension(
        file.filename.split('/')[2].split('.').pop(),
        content,
        ''
      ));
    }

    return extensions;
  }

  static getFileContent(file) {
    return new Promise((resolve, reject) => {
      file.getData(new zip.TextWriter(), (content) => {
        resolve(content);
      });
    });
  }

  static getFileType(file) {
    return file.filename.split('.').pop();
  }

  static getFileName(file) {
    return file.filename.split('/').pop().split('.')[0];
  }
}

export class DescriptorGenerator {
  static generate() {
    return new Promise((resolve, reject) => {
      this.fetchJSON((res) => {
        resolve(JSON.parse(res));
      })
    })
  }

  static fetchJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'unchive/simple_components.json', true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }
}
