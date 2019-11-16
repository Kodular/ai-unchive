import { AIProject, AIScreen, AIExtension, AIAsset } from './ai_project.js'

export class AIAReader {
  static async read(content) {
    return new Promise(async (resolve, reject) => {
      AIProject.descriptorJSON = await DescriptorGenerator.generate();
      var project = new AIProject();
      var readerObj = content instanceof Blob ? new zip.BlobReader(content) : new zip.HttpReader(content);
      zip.createReader(readerObj, (reader) => {
        reader.getEntries(async (entries) => {
          if (entries.length) {
            project.addExtensions(
              await this.generateExtensions(
                entries.filter(x => this.getFileType(x) == 'json')
              )
            );

            project.addScreens(
              await this.generateScreens(
                entries.filter(x =>
                  this.getFileType(x) == 'scm' ||
                  this.getFileType(x) == 'bky'),
                project
              )
            );

            project.addAssets(
              await this.generateAssets(
                entries.filter(x =>
                  x.filename.split('/')[0] == 'assets' &&
                  x.filename.split('/')[2] == undefined)
              )
            );
						project.generateSummary();
            resolve(project);
          }
        });
      });
    })
  }

  static async generateScreens(files, project) {
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
			let aiScreen = new AIScreen();
      screens.push(aiScreen.init(
        scheme.scm,
        blocks.find(x => x.name == scheme.name).bky,
        scheme.name,
        project
      ));
    }
    return Promise.all(screens);
  }

  static async generateExtensions(files) {
    var buildInfos = [];
    var descriptors = [];
    var extensions = [];

    for(let file of files) {
      var content = await this.getFileContent(file);
      if(this.getFileName(file) == 'component_build_infos' || this.getFileName(file) == 'component_build_info') {
        buildInfos.push({
          'name' : file.filename.split('/')[2],
          'info' : JSON.parse(content)
        });
      } else if(this.getFileName(file) == 'components' || this.getFileName(file) == 'component') {
        descriptors.push({
          'name' : file.filename.split('/')[2],
          'descriptor' : JSON.parse(content)
        });
      }
    }

    for(let buildInfo of buildInfos) {
      if(Array.isArray(buildInfo.info)) {
        for(let ext of buildInfo.info) {
          extensions.push(new AIExtension(
            ext.type,
            descriptors.find(x => x.name == buildInfo.name).descriptor[buildInfo.info.indexOf(ext)]
          ));
        }
      } else {
        extensions.push(new AIExtension(
          buildInfo.info.type,
          descriptors.find(x => x.name == buildInfo.name).descriptor
        ));
      }
    }

    return extensions;
  }

  static async generateAssets(files) {
    var assets = [];
    for(let file of files) {
      var content = await this.getFileContent(file, new zip.BlobWriter());
      assets.push(new AIAsset(
        this.getFileName(file),
        this.getFileType(file),
        content
      ));
    }
    return assets;
  }

  static getFileContent(file, writer = new zip.TextWriter()) {
    return new Promise((resolve, reject) => {
      file.getData(writer, (content) => {
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
