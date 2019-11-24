import { SummaryNode, AssetNode, HeaderNode, ScreenNode, ChainedNode } from '../views/nodes/node.js'
import { View } from '../views/view.js'
import { Label, Dialog, AssetFormatter, Downloader } from '../views/widgets.js'

export class SummaryWriter {
  static async generateSummmaryNodesForProject(project, summaryNodeList) {
    this.header = new HeaderNode('Download summary', 'save_alt');
		this.header.addStyleName('unchive-summary-node__header');
		summaryNodeList.addNode(this.header);

    this.header.addClickListener(e => {
			SummaryHTMLWriter.writeProjectSummary(project);
		});

    summaryNodeList.addNodeAsync(SummaryNode.promiseNode('Stats', this.generateStats(project)));
    summaryNodeList.addNodeAsync(SummaryNode.promiseNode('Most used components', this.generateMostUsed(project)));
    summaryNodeList.addNodeAsync(SummaryNode.promiseNode('% of blocks by screen', this.generateCodeShare(project).getHTML()));
    summaryNodeList.addNodeAsync(SummaryNode.promiseNode('Assets by type', this.generateAssetTypeShare(project).getHTML()));
    summaryNodeList.addNodeAsync(SummaryNode.promiseNode('% of built-in components', this.generateNativeShare(project).getHTML()));
    summaryNodeList.addNodeAsync(SummaryNode.promiseNode('Block usage by type', this.getBlockTypeShare(project).getHTML()));
  }

  static generateStats(project) {
    let html = new View('DIV');
    html.addView(new SummaryItem('Number of screens', project.screens.length));
    html.addView(new SummaryItem('Number of extensions', project.extensions.length));

    let assetSize = 0;
    for(var asset of project.assets) {
      assetSize += asset.size;
    }
    html.addView(new SummaryItem('Number of assets', project.assets.length));
    html.addView(new SummaryItem('Total size of assets', AssetFormatter.formatSize(assetSize)));


    return html.domElement.innerHTML;
  }

  static generateMostUsed(project) {
    let html = new View('DIV');
    let componentUsageIndex = [];
    function addComponentToIndex(component) {
      var type = componentUsageIndex.find(x => x[0] == component.type);
      if(type)
        type[1]++;
      else
        componentUsageIndex.push([component.type, 1]);
      for(let child of component.children)
        addComponentToIndex(child);
    }

    for(let screen of project.screens)
      addComponentToIndex(screen.form);

    componentUsageIndex = componentUsageIndex.sort((a, b) => b[1] - a[1]);
    for(var i = 0; i < 8; i++) {
      html.addView(new SummaryItem(
        Messages[
          componentUsageIndex[i][0][0].toLowerCase() + componentUsageIndex[i][0].slice(1) +
          'ComponentPallette'] || componentUsageIndex[i][0],
        componentUsageIndex[i][1]));
    }
    return html.domElement.innerHTML;
  }

  static generateCodeShare(project) {
    let codeshare = [['Screen', 'Percentage']];
    for(let screen of project.screens) {
      codeshare.push([screen.name, Array.from(new DOMParser().parseFromString(screen.blocks, 'text/xml').getElementsByTagName('block')).length]);
    }
    return new SummaryChart(codeshare);
  }

  static generateAssetTypeShare(project) {
    let typeShare = [['Asset type', 'Percentage']];
    for(let asset of project.assets) {
      var type = typeShare.find(x => x[0] == asset.type.toLowerCase());
      if(type)
        type[1]++;
      else
        typeShare.push([asset.type.toLowerCase(), 1]);
    }

    return new SummaryChart(typeShare);
  }

  static generateNativeShare(project) {
    let header = ['Type', 'Percentage'];
    let native = ['Built-in', 0];
    let extension = ['Extensions', 0];

    function getComponentType(component, extension, native) {
      if(component.origin == 'EXTENSION')
        extension[1]++;
      else
        native[1]++;
      for(var child of component.children)
        getComponentType(child, extension, native);
    }

    for(let screen of project.screens)
      getComponentType(screen.form, extension, native);

    return new SummaryChart([header, native, extension]);
  }

  static getBlockTypeShare(project) {
    let events = 0, methods = 0, properties = 0, procedures = 0, variables = 0;
    for(let screen of project.screens) {
      var screenBlocks = new DOMParser().parseFromString(screen.blocks, 'text/xml');
      events += Array.from(screenBlocks.querySelectorAll('block[type="component_event"]')).length;
      methods += Array.from(screenBlocks.querySelectorAll('block[type="component_method"]')).length;
      properties += Array.from(screenBlocks.querySelectorAll('block[type="component_set_get"]')).length;
      procedures += Array.from(screenBlocks.querySelectorAll('block[type="procedures_defnoreturn"], block[type="procedures_defreturn"]')).length;
      variables += Array.from(screenBlocks.querySelectorAll('block[type="global_declaration"]')).length;
    }
    return new SummaryChart([
      ['Type', 'Percentage'],
      ['Events', events],
      ['Methods', methods],
      ['Properties', properties],
      ['Variables', variables],
      ['Procedures', procedures]],
      [Blockly.COLOUR_EVENT, Blockly.COLOUR_METHOD, Blockly.COLOUR_SET, 'rgb(244, 81, 30)', '#AAA']);
  }
}

class SummaryItem extends Label {
  constructor(title, value) {
    super(`${title} <span>${value}</span>`, true);
    this.addStyleName('summary-item');
  }
}

class SummaryChart extends View {
  constructor(data, colours) {
    super('DIV');
    data = google.visualization.arrayToDataTable(data);

    this.options = {
      legend: {position: 'right', textStyle: {color: 'black'}},
      pieSliceTextStyle: {color: '#000', background: '#FFF'},
      pieHole: 0.5,
      width: 260,
      chartArea:{left:0,top:20,width:"100%",height:"100%"},
      enableInteractivity: false
    };

    if(colours)
      this.options.colors = colours;

    this.chart = new google.visualization.PieChart(this.domElement);
    this.chart.draw(data, this.options);
    //console.log(this.chart.getImageURI());
  }

  getHTML() {
    return this.domElement.outerHTML;
  }
}

class SummaryHTMLWriter {
  static writeProjectSummary(project) {
    var dialog = new Dialog('Generating summary...', 'This may take a while');
    setTimeout(() => {dialog.open()}, 1);
    setTimeout(() => {
      var html = [];
      html.push('<html>');
      html.push(`<head><title>Project Summary for ${project.name}</title></head>`);
      html.push('<body>');
      html.push(`<div style="text-align:center;width:100%;">` +
      `<h1 style="margin-bottom:0">${project.name} - Project Summary</h1>`);
      html.push(`<h5 style="margin-top:0">Summary generated on ${this.getDateTime()}</h5></div>`);

      this.writeTOContents(html, project);
      this.writeStats(html, project);
      this.writeInsights(html, project);
      this.writeScreens(html, project);
      this.writeExtensions(html, project);
      this.writeStyles(html);

      html.push('</body></html>');

      Downloader.downloadText(html.join(''), `${project.name}.html`);
      dialog.close();
    }, 20);
  }

  static getDateTime() {
    var currentdate = new Date();
    return currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes();
  }

  static writeTOContents(html, project) {
    html.push('<h3>Table of Contents</h3>');
    html.push('<ol>');
    html.push('<li><a href="#stats">Project stats</a></li>');
    html.push('<li><a href="#insights">Insights</a></li>');
    html.push('<li>Screens</li><ol>');
    for(let screen of project.screens) {
      html.push(`<li><a href="#screen-${screen.name}">${screen.name}</a></li>`);
    }
    html.push('</ol>');
    html.push('<li><a href="#exts">Extensions summary</a></li>');
    html.push('</ol>');
  }

  static writeStats(html, project) {
    html.push('<a name="stats"></a>');
    html.push('<h3>Project stats</h3>');

    html.push(SummaryWriter.generateStats(project).replace(/<p/g, '<li').replace(/\/p>/g, '/li>'));

    html.push('<h4>Most used components</h4>');
    html.push(SummaryWriter.generateMostUsed(project).replace(/<p/g, '<li').replace(/\/p>/g, '/li>'));
  }

  static writeInsights(html, project) {
    html.push('<a name="insights"></a>');
    html.push('<h3>Insights</h3>');

    html.push('<div style="display:inline-block">');
    html.push(`<div class="chart">${SummaryWriter.generateCodeShare(project).getHTML()}`);
    html.push('<p>Percentage of blocks by screen</p></div>');

    html.push(`<div class="chart">${SummaryWriter.generateAssetTypeShare(project).getHTML()}`);
    html.push('<p>Types of assets by frequency</p></div>');
    html.push('</div>');

    html.push('<div style="display:inline-block">');
    html.push(`<div class="chart">${SummaryWriter.generateNativeShare(project).getHTML()}`);
    html.push('<p>Percentage of built-in components vs extensions used</p></div>');

    html.push(`<div class="chart">${SummaryWriter.getBlockTypeShare(project).getHTML()}`);
    html.push('<p>Percentage of blocks by type</p></div>');
    html.push('</div>');
  }

  static writeScreens(html, project) {
    for(let node of RootPanel.primaryNodeList.nodes) {
      if(node instanceof ScreenNode) {
        html.push(`<a name="screen-${node.caption}"></a>`);
        html.push(`<h3>${node.caption}</h3>`);
        html.push(`<h4>Components</h4>`);

        html.push('<ul>');
        this.writeComponent(html, project.screens.find(x => x.name == node.caption).form);
        html.push('</ul><br>');
        html.push(`<h4>Blocks</h4>`);
        node.open();
        node.chainNodeList.nodes[1].open();
        for(let blockNode of node.chainNodeList.nodes[1].chainNodeList.nodes) {
          blockNode.initializeWorkspace();
          html.push(blockNode.domElement.children[1].children[0].innerHTML);
          html.push(`<p class="blk-cap"></p>`);
        }
      }
    }
    RootPanel.primaryNodeList.nodes.slice(-1)[0].open();
  }

  static writeComponent(html, component) {
    html.push(`<li>${component.name} <small>(${component.type})</small></li>`);
    for(let child of component.children) {
      html.push('<ul>');
      this.writeComponent(html, child);
      html.push('</ul>');
    }
  }

  static writeExtensions(html, project) {
    html.push('<a name="exts"></a>');
    html.push('<h3>Extensions summary</h3>');

    for(let ext of project.extensions) {
      html.push(`<li>${ext.name}<ul><li>${ext.descriptorJSON.helpString}</li></ul></li>`);
    }
  }

  static writeStyles(html) {
    html.push(`<style>${document.head.children[0].innerHTML}</style>`);
    html.push('<style>body{max-width:1000px;margin:0 auto;border:1px solid #DDD;padding:20px;font-family: sans-serif}' +
    '.blocklyMainBackground{stroke-width:0}' +
    '.blocklySvg{position:relative;padding:20px 0}' +
    'span::before{content:": "}' +
    '.chart{display:block;margin:0 40px;}' +
    '.blk-cap:empty::after{content:"[Caption]"; font-style:italic}' +
    '@media print{.blk-cap:empty{display:none}}' +
    '@page{margin-bottom:0}</style>');
    html.push('<script>document.designMode = "on"</script>');
  }
}
