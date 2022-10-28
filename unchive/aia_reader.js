/**
 * Defines functions used to extract components, extensions, and assets from
 * an AIA file.
 *
 *
 * @file   This file defines the AIAReader class.
 * @author vishwas@kodular.io (Vishwas Adiga)
 * @since  1.0.0
 * @license
 */

import {AIAsset, AIExtension, AIProject, AIScreen} from './ai_project.js'
import simpleComponentsJson from './simple_components.json'
import {BlobReader, BlobWriter, HttpReader, TextWriter, ZipReader} from "@zip.js/zip.js";

/**
 * Class that reads/parses an AIA file.
 *
 * @since  1.0.0
 * @access public
 */
export class AIAReader {

  /**
   * Unzips and reads every file in an AIA and then parses it.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {Blob | String} content The AIA file, or a URL pointing to it.
   *
   * @return {Promise} A Promise object, when resolved, yields the parsed
   *                   AIProject object.
   */
  static async read(content) {

    // The simple_components.json file is fetched before anything is read.
    AIProject.descriptorJSON = simpleComponentsJson;
    var project = new AIProject("somename");
    var readerObj = content instanceof Blob ?
      new BlobReader(content) :
      new HttpReader(content);

    const zr = new ZipReader(readerObj)
    const entries = await zr.getEntries()

    // Extensions are loaded first so that instances of extensions can
    // later fetch the correct descriptor JSON files.
    for (let extension of await this.generateExtensions(
      entries.filter(x => this.getFileType(x) === 'json')
    )) {
      project.addExtension(extension);
    }

    // Screens are loaded asynchronously.
    for (let screen of await this.generateScreens(
      entries.filter(x =>
        this.getFileType(x) === 'scm' ||
        this.getFileType(x) === 'bky'))) {
      project.addScreen(screen);
    }

    // Finally, all the assets are loaded.
    for (let asset of await this.generateAssets(
      entries.filter(x =>
        x.filename.split('/')[0] === 'assets' &&
        x.filename.split('/')[2] === undefined)
    )) {
      project.addAsset(asset);
    }

    return project
  }

  /**
   * Asynchronously reads every screen in the project.
   *
   * @since 1.0.0
   * @access private
   *
   * @class
   * @param {Array}     files   An array of files that have a filetype .scm or .bky.
   * @return {Promise<AIScreen>} A Promise object, when resolved, yields the parsed
   *
   */
  static async generateScreens(files) {
    var schemes = [];
    var blocks = [];

    var screens = [];

    // First, we load all the scheme files into the schemes array and the Blockly
    // files into the blocks array.
    for (let file of files) {
      var content = await this.getFileContent(file);
      if (this.getFileType(file) === 'scm') {
        schemes.push({
          'name': this.getFileName(file),
          'scm': content
        });
      } else if (this.getFileType(file) === 'bky') {
        blocks.push({
          'name': this.getFileName(file),
          'bky': content
        });
      }
    }

    // Then, for each scheme file, we create a new AIScreen and initialise it with
    // the corresponding Blockly file.
    for (let scheme of schemes) {
      let aiScreen = new AIScreen();
      screens.push(aiScreen.init(
        scheme.scm,
        blocks.find(x => x.name === scheme.name).bky,
        scheme.name
      ));
    }

    return Promise.all(screens)
  }

  /**
   * Asynchronously reads every extension used in the project.
   *
   * @since 1.0.0
   * @access private
   *
   * @class
   * @param {Array} files An array of files that have a filetype .json.
   *
   * @return {Promise<Array>} An array of AIExtension objects for the project being read.
   */
  static async generateExtensions(files) {
    var buildInfos = [];
    var descriptors = [];
    var extensions = [];

    // The component_build_info and component descriptor files are being read.
    // Some extensions describe the component as a JSON array, while some as a
    // JSON object. We collect both files at the same time and handle them
    // separately later.
    for (let file of files) {
      var content = await this.getFileContent(file);
      if (this.getFileName(file) ===
        'component_build_infos' ||
        this.getFileName(file) === 'component_build_info') {
        buildInfos.push({
          'name': file.filename.split('/')[2],
          'info': JSON.parse(content)
        });
      } else if (this.getFileName(file) ===
        'components' ||
        this.getFileName(file) === 'component') {
        descriptors.push({
          'name': file.filename.split('/')[2],
          'descriptor': JSON.parse(content)
        });
      }
    }

    // If the build info is an array, then the extension is a pack
    // (a collection of extensions bundled into one file). In such a case, we
    // iterate through each element in the array and create a new AIExtension for
    // every extension defined in the pack.
    // If the build info is a JSON object, then the extension is standalone, and
    // we handle it as such.
    for (let buildInfo of buildInfos) {
      if (Array.isArray(buildInfo.info)) {
        for (let ext of buildInfo.info) {
          extensions.push(new AIExtension(
            ext.type,
            descriptors.find(x => x.name === buildInfo.name)
              .descriptor[buildInfo.info.indexOf(ext)]
          ));
        }
      } else {
        extensions.push(new AIExtension(
          buildInfo.info.type,
          descriptors.find(x => x.name === buildInfo.name).descriptor
        ));
      }
    }

    return extensions;
  }

  /**
   * Asynchronously reads every asset uploaded to the project.
   *
   * @since 1.0.0
   * @access private
   *
   * @class
   * @param {Array} files An array of files present in the assets folderr of the AIA.
   *
   * @return {Promise<Array>} An array of AIAsset objects for the project being read.
   */
  static async generateAssets(files) {
    var assets = [];
    for (let file of files) {
      var content = await this.getFileContent(file, new BlobWriter());
      assets.push(new AIAsset(
        this.getFileName(file),
        this.getFileType(file),
        content
      ));
    }
    return assets;
  }

  /**
   * Asynchronously reads the content of a file.
   *
   * @since 1.0.0
   * @access private
   *
   * @class
   * @param {unknown} file   The name of the file to be read.
   * @param {Object} writer The zip writer object to be used to read the file.
   *
   * @return {Promise} A Promise object, when resolved, yields the file's content.
   */
  static async getFileContent(file, writer = new TextWriter()) {
    return await file.getData(writer)
  }

  /**
   * Returns the extension of the file (scm, bky, etc.)
   *
   * @since 1.0.0
   * @access private
   *
   * @class
   * @param {Entry} file The name of the file whose extension is to be returned.
   *
   * @return {String} The file's extension.
   */
  static getFileType(file) {
    return file.filename.split('.').pop();
  }

  /**
   * Returns the name of the file passed.
   *
   * @since 1.0.0
   * @access private
   *
   * @class
   * @param {Entry} file The full name of the file whose name is to be returned.
   *
   * @return {String} The file's name.
   */
  static getFileName(file) {
    return file.filename.split('/').pop().split('.')[0];
  }
}
