import { View } from './view.js'
import { Image, Label, Button, Dialog, Downloader, URLHandler } from './widgets.js'

import { ScreenNode, AdditionalListNode, ExtensionNode, AssetNode } from './nodes/node.js'
import { NodeList } from './nodes/node_list.js'

import { AIAReader, DescriptorGenerator } from '../unchive/aia_reader.js'
import { AIProject } from '../unchive/ai_project.js'
import { SummaryWriter } from '../unchive/summary_writer.js'

export class Screen extends View {
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

  async openProject(project) {
    if(AIProject.descriptorJSON == undefined) {
      AIProject.descriptorJSON = await DescriptorGenerator.generate();
    }
		console.log(project);
		this.project = project;
		this.titleBar.exportButton.setVisible(true);
    this.titleBar.title.setText(`${Messages.pageTitle} - ${project.name}.${this.aiv ? 'aiv' : 'aia'}`);

    this.initializeNodeLists();
    for(let screen of project.screens) {
      this.primaryNodeList.addNodeAsync(ScreenNode.promiseNode(screen));
    }

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
    this.primaryNodeList.addNodeAsync(AdditionalListNode.promiseNode(
			'Summary',
			null,
			null,
      function() {
        if(this.loaded) return;
        this.loaded = true;
        SummaryWriter.generateSummmaryNodesForProject(project, this.chainNodeList);
      }
		));
		this.helpText.setText('Click on a Screen to view its details');
  }

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

class TitleBar extends View {
  constructor() {
    super('DIV');

    this.setStyleName('title-bar');

    this.logo = new Image('logo.png');
    this.logo.addStyleName('title-bar__logo');

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
				'data:application/json;charset=utf-8,'+ encodeURIComponent(Flatted.stringify(RootPanel.project)),
				`${RootPanel.project.name}.aiv`
			)
		});
		this.exportButton.setVisible(false);
		this.addView(this.exportButton);
  }
}

class Opener {
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
      new Dialog(`Unknown project type .${fileType}`, 'Project files should end with .aia or .aiv').open();
      return;
    }
    project.name = fileName;
    RootPanel.openProject(project);
  }

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
      new Dialog(`Unknown project type .${fileType}`, 'Project files should end with .aia or .aiv').open();
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
