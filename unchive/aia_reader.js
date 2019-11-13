import { AIProject, AIScreen, Extension } from './ai_project.js'

export class AIAReader {
  static async read(content) {
    AIProject.descriptorJSON = await DescriptorGenerator.generate();
    var project = new AIProject();
    var readerObj = content instanceof Blob ? new zip.BlobReader(content) : new zip.HttpReader(content);
    zip.createReader(readerObj, (reader) => {
      reader.getEntries((entries) => {
        if (entries.length) {
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
            ));
        }
      });
    }, function(error) {
      // onerror callback
    });
    return project;
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
    var buildInfos = [];
    var descriptors = [];
    var extensions = [];

    for(let file of files) {
      var content = await this.getFileContent(file);
      if(this.getFileName(file) == 'component_build_infos') {
        buildInfos.push({
          'name' : file.filename.split('/')[2],
          'info' : JSON.parse(content)
        });
      } else if(this.getFileName(file) == 'components') {
        descriptors.push({
          'name' : file.filename.split('/')[2],
          'descriptor' : JSON.parse(content)
        });
      }
    }

    for(let buildInfo of buildInfos) {
      for(let ext of buildInfo.info) {
        extensions.push(new Extension(
          ext.type,
          descriptors.find(x => x.name == buildInfo.name).descriptor[buildInfo.info.indexOf(ext)]
        ));
      }
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
