/**
 * Defines classes that represent the top-layer interface of the page.
 *
 * @file   This file defines the Screen and Title classes.
 * @author vishwas@kodular.io (Vishwas Adiga)
 * @since  1.0.0
 * @license
 */

import {View} from './view.js'
import {Button, Dialog, Downloader, Dropdown, DropdownItem, Image, Label, URLHandler} from './widgets.js'

import {AdditionalListNode, AssetNode, ExtensionNode, ScreenNode} from './nodes/node.js'
import {NodeList} from './nodes/node_list.js'

import {AIAReader} from '../src/unchive/aia_reader.js'
import {AIProject} from '../src/unchive/ai_project.js'
import {SummaryWriter} from '../src/unchive/summary_writer.js'
import simpleComponentsJson from "../src/unchive/simple_components.json";

/**
 * Class that represents the root panel of the page.
 *
 * @since  1.0.0
 * @access public
 */
export class Screen extends View {

  /**
   * Creates a new Screen object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments View
   *
   * @return {Screen} New Screen object.
   */
  constructor() {
    super('DIV');

		this.helpText = new Label('Upload a project using the button in the top-right');

    this.titleBar = new TitleBar();
    this.addView(this.titleBar);

    this.nodeListContainer = new View('DIV');
    this.nodeListContainer.addStyleName('node-list-container');

    this.addView(this.nodeListContainer);
    this.initializeNodeLists();
  }

  /**
   * Handles GET parameters passed in the URL of the page.
   *
   * @since 1.0.0
   * @access private
   */
  async handleURLData() {
    this.req = URLHandler.getReqParams();

    if(this.req.url) {
			this.helpText.setText('Loading project...');
			Opener.openURL(this.req.url);
    }

    if(this.req.embed == 'true') {
      this.titleBar.setVisible(false);
			this.addStyleName('embed');
    }
  }

  /**
   * Opens a new App Inventor project.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {AIProject} project The project that is to be opened.
   */
  async openProject(project) {
    if(AIProject.descriptorJSON == undefined) {
      AIProject.descriptorJSON = simpleComponentsJson;
    }
		console.log(project);
		this.project = project;
		this.titleBar.exportButton.setVisible(true);
    this.titleBar.title.setText(
      `${Messages.pageTitle} - ${project.name}.${this.aiv ? 'aiv' : 'aia'}`);

    this.initializeNodeLists();
    for(let screen of project.screens) {
      // Add all screens asynchronously.
      this.primaryNodeList.addNodeAsync(ScreenNode.promiseNode(screen));
    }

    // Add all extensions asynchronously.
    this.primaryNodeList.addNodeAsync(AdditionalListNode.promiseNode(
			'Extensions',
			project.extensions,
			function(extensions) {
				for(let extension of extensions) {
					this.chainNodeList.addNode(new ExtensionNode(
						extension.descriptorJSON.name,
						extension.name,
						extension.descriptorJSON.helpString));
				}
		}));

    // Add all assets asynchronously.
    this.primaryNodeList.addNodeAsync(AdditionalListNode.promiseNode(
			'Assets',
			project.assets,
			function(assets) {
				for(let asset of assets) {
					this.chainNodeList.addNode(new AssetNode(
						asset.name,
						asset.type,
						asset.size,
						RootPanel.aiv ? 'unknown.unknown' : asset.getURL()
					));
				}
			}
		));

    // Generate the summary asynchronously.
    this.primaryNodeList.addNodeAsync(AdditionalListNode.promiseNode(
			'Summary',
			null,
			null,
      function() {
        if(this.loaded) return;
        this.loaded = true;
        SummaryWriter.generateSummmaryNodesForProject(
          project,
          this.chainNodeList);
      }
		));
		this.helpText.setText('Click on a Screen to view its details');
  }

  /**
   * Initialises the primary and secondary node lists of the screen.
   *
   * @since 1.0.0
   * @access public
   */
  initializeNodeLists() {
    this.primaryNodeList = new NodeList();
    this.primaryNodeList.addStyleName('node-list--primary');

    this.nodeLists = [this.primaryNodeList];
    this.nodeListContainer.clear();
    this.nodeListContainer.addView(this.primaryNodeList);

		this.helpPanel = new View('DIV');
		this.helpPanel.addView(this.helpText);
		this.helpPanel.addStyleName('help-panel');
		this.nodeListContainer.addView(this.helpPanel);
  }
}

/**
 * Class that represents the Screen's title bar.
 *
 * @since  1.0.0
 * @access public
 */
class TitleBar extends View {

  /**
   * Creates a new TitleBar object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments View
   *
   * @return {TitleBar} New TitleBar object.
   */
  constructor() {
    super('DIV');

    this.setStyleName('title-bar');

    this.logo = new Image('logo.png');
    this.logo.addStyleName('title-bar__logo');
    this.logo.setSource(fetchDir('logo.png'));

    this.title = new Label(Messages.pageTitle);
    this.title.addStyleName('title-bar__title');

    this.uploadButton = new Button('unarchive', true);
    this.uploadButton.addStyleName('title-bar__upload-button');

		var uploadInput = new View('INPUT');
		uploadInput.domElement.type = 'file';
		uploadInput.domElement.accept = '.aia,.aiv'

		uploadInput.domElement.addEventListener('change', async (event) => {
			await Opener.openFile(uploadInput.domElement.value, event.target.files[0]);
		});

		this.uploadButton.addClickListener((event) => {
			uploadInput.domElement.click();
		});

    this.addView(this.logo);
    this.addView(this.title);
    this.addView(this.uploadButton);

		this.exportButton = new Button('cloud_download', true);
		this.exportButton.addStyleName('title-bar__export-button');

		this.exportButton.addClickListener((event) => {
			console.log(Flatted.stringify(RootPanel.project));
			Downloader.downloadURL(
				'data:application/json;charset=utf-8,'+
        encodeURIComponent(Flatted.stringify(RootPanel.project)),
				`${RootPanel.project.name}.aiv`
			)
		});
		this.exportButton.setVisible(false);
		this.addView(this.exportButton);

    this.localeDropdown = new Dropdown('', (e) => {
      window.location = '?locale=' + window.locales.find(x =>
        x[0] == this.localeDropdown.getValue())[1];
    });

    for(let locale of window.locales) {
      this.localeDropdown.addDropdownItem(new DropdownItem(locale[0]));
    }
    this.localeDropdown.setValue(window.locale[0]);
		this.localeDropdown.addStyleName('title-bar__locale-dropdown');
    this.addView(this.localeDropdown);
  }
}

/**
 * Class that opens an AIProject from a URL or a blob.
 *
 * @since  1.0.0
 * @access public
 */
class Opener {
  /**
   * Opens an AIProject from a file.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} fileDir The directory of the file.
   * @param {Blob} file The file that is to be opened.
   */
  static async openFile(fileDir, file) {
    fileDir = fileDir.split('.');
    let fileType = fileDir.pop();
    let fileName = fileDir.pop().split('\\').pop();
    let project;
    if(fileType == 'aiv') {
      project = await this.openAiv(URL.createObjectURL(file));
    } else if(fileType == 'aia') {
      project = await AIAReader.read(file);
    } else {
      new Dialog(
        `Unknown project type .${fileType}`,
        'Project files should end with .aia or .aiv').open();
      return;
    }
    project.name = fileName;
    RootPanel.openProject(project);
  }

  /**
   * Opens an AIProject from a url.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} url The URL that points to the file.
   */
  static async openURL(url) {
    let fileType = url.split('.').pop();
    let fileName = url.split('.')[0].split('\\').pop();
    console.log(url);
    let project;
    if(fileType == 'aia') {
      project = await AIAReader.read(url);
    } else if(fileType == 'aiv') {
      project = await this.openAiv(url);
    } else {
      new Dialog(
        `Unknown project type .${fileType}`,
        'Project files should end with .aia or .aiv').open();
      return;
    }

    project.name = fileName;
    RootPanel.openProject(project);
  }

  static async openAiv(url) {
    RootPanel.aiv = true;
    let response = await fetch(url);
    return Flatted.parse(JSON.stringify(await response.json()));
  }
}
