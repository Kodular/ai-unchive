/**
 * Defines classes used to generate a summary for the current AIProject.
 *
 * This summary includes statistics about the project like number of screens and
 * most used components, and also makes charts that show distributions of blocks
 * and other project data.
 * The SummaryHTMLWriter allows the user to then download this generated summary
 * as a zip file.
 * (Charts are generated using Google's Charts API).
 *
 * @file   This file defines the SummaryWriter and SummaryHTMLWriter classes.
 * @author vishwas@kodular.io (Vishwas Adiga)
 * @since  1.0.0
 * @license
 */
import {
  SummaryNode, AssetNode, HeaderNode, ScreenNode, ChainedNode
} from '../../views/nodes/node.js'
import {View} from '../../views/view.js'
import {Label, Dialog, AssetFormatter, Downloader} from '../../views/widgets.js'

/**
 * Class that generates a summary for an AIProject object.
 *
 * @since  1.0.0
 * @access public
 */
export class SummaryWriter {

  /**
   * Generates nodes that are to be displayed in the Summary tab of the page.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {AIProject} project         The project for which the summary is to
   *                                    be generated.
   * @param {NodeList}  summaryNodeList The NodeList to which the generated nodes
   *                                    are to be added.
   */
  static async generateSummmaryNodesForProject(project, summaryNodeList) {

    // A header node is added that lets the user download this generated summary.
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


  /**
   * Generates a table containing general stats about the project.
   *
   * These stats include the total size of assets andnumber of screens,
   * extensions, and assets.
   *
   * @since 1.0.0
   * @access protected
   *
   * @param {AIProject} project The project for which the stats are to be generated.
   * @return {String} An HTML string representing the table of data generated.
   */
  static generateStats(project) {
    let html = new View('DIV');
    html.addView(new SummaryItem('Number of screens', project.screens.length));
    html.addView(new SummaryItem('Number of extensions', project.extensions.length));

    let totalBlockCount = 0;
    for (let screen of project.screens) {
      totalBlockCount += Array.from(new DOMParser()
        .parseFromString(screen.blocks, 'text/xml')
        .getElementsByTagName('block')).length;
    }
    html.addView(new SummaryItem('Total number of blocks', totalBlockCount));

    let assetSize = 0;
    for (let asset of project.assets) {
      assetSize += asset.size;
    }
    html.addView(new SummaryItem('Number of assets', project.assets.length));
    html.addView(new SummaryItem('Total size of assets', AssetFormatter.formatSize(assetSize)));


    return html.domElement.innerHTML;
  }

  /**
   * Generates a table containing the most used components in a project.
   *
   * @since 1.0.0
   * @access protected
   *
   * @param {AIProject} project The project for which the stats are to be generated.
   * @return {String} An HTML string representing the table of data generated.
   */
  static generateMostUsed(project) {
    let html = new View('DIV');
    let componentUsageIndex = [];

    /**
     * Closure method which is called recursively and generates an array of
     * component types with their usage frequency.
     *
     * @since 1.0.0
     * @access private
     *
     * @param {AIProject} component The component that is to be analysed.
     */
    function addComponentToIndex(component) {
      const type = componentUsageIndex.find(x => x[0] === component.type);
      if (type) type[1]++; else componentUsageIndex.push([component.type, 1]);
      for (let child of component.children) addComponentToIndex(child);
    }

    // We index the component type of all components
    // in every screen of the project.
    for (let screen of project.screens) addComponentToIndex(screen.form);

    componentUsageIndex = componentUsageIndex.sort((a, b) => b[1] - a[1]);
    for (let i = 0; i < 8; i++) {
      html.addView(new SummaryItem(Messages[componentUsageIndex[i][0][0].toLowerCase() + componentUsageIndex[i][0].slice(1) + 'ComponentPallette'] || componentUsageIndex[i][0], componentUsageIndex[i][1]));
    }
    return html.domElement.innerHTML;
  }


  /**
   * Generates a chart that maps the percentage of blocks by screen.
   *
   * @since 1.0.0
   * @access protected
   *
   * @param {AIProject} project The project for which the stats are to be generated.
   * @return {SummaryChart} A chart object that is to be shown to the user.
   */
  static generateCodeShare(project) {
    let codeshare = [['Screen', 'Percentage']];
    for (let screen of project.screens) {
      codeshare.push([screen.name, Array.from(new DOMParser()
        .parseFromString(screen.blocks, 'text/xml')
        .getElementsByTagName('block')).length]);
    }
    return new SummaryChart(codeshare);
  }

  /**
   * Generates a chart that maps the percentage of assets by file type.
   *
   * @since 1.0.0
   * @access protected
   *
   * @param {AIProject} project The project for which the stats are to be generated.
   * @return {SummaryChart} A chart object that is to be shown to the user.
   */
  static generateAssetTypeShare(project) {
    let typeShare = [['Asset type', 'Percentage']];
    for (let asset of project.assets) {
      const type = typeShare.find(x => x[0] === asset.type.toLowerCase());
      if (type) type[1]++; else typeShare.push([asset.type.toLowerCase(), 1]);
    }

    return new SummaryChart(typeShare);
  }

  /**
   * Generates a chart that maps the percentage of components by origin.
   *
   * @since 1.0.0
   * @access protected
   *
   * @param {AIProject} project The project for which the stats are to be generated.
   * @return {SummaryChart} A chart object that is to be shown to the user.
   */
  static generateNativeShare(project) {
    let header = ['Type', 'Percentage'];
    let native = ['Built-in', 0];
    let extension = ['Extensions', 0];

    function getComponentType(component, extension, native) {
      if (component.origin === 'EXTENSION') extension[1]++; else native[1]++;
      for (let child of component.children) getComponentType(child, extension, native);
    }

    for (let screen of project.screens) getComponentType(screen.form, extension, native);

    return new SummaryChart([header, native, extension]);
  }

  /**
   * Generates a chart that maps the percentage of blocks by their type.
   *
   * @since 1.0.0
   * @access protected
   *
   * @param {AIProject} project The project for which the stats are to be generated.
   * @return {SummaryChart} A chart object that is to be shown to the user.
   */
  static getBlockTypeShare(project) {
    let events = 0, methods = 0, properties = 0, procedures = 0, variables = 0;
    for (let screen of project.screens) {
      // Pick all blocks with matching types in every screen.
      const screenBlocks = new DOMParser().parseFromString(screen.blocks, 'text/xml');
      events += Array.from(screenBlocks.querySelectorAll('block[type="component_event"]')).length;
      methods += Array.from(screenBlocks.querySelectorAll('block[type="component_method"]')).length;
      properties += Array.from(screenBlocks.querySelectorAll('block[type="component_set_get"]')).length;
      procedures += Array.from(screenBlocks.querySelectorAll('block[type="procedures_defnoreturn"],' + ' block[type="procedures_defreturn"]')).length;
      variables += Array.from(screenBlocks.querySelectorAll('block[type="global_declaration"]')).length;
    }
    return new SummaryChart([['Type', 'Percentage'], ['Events', events], ['Methods', methods], ['Properties', properties], ['Variables', variables], ['Procedures', procedures]], [Blockly.COLOUR_EVENT, Blockly.COLOUR_METHOD, Blockly.COLOUR_SET, 'rgb(244, 81, 30)', '#AAA']);
  }
}

/**
 * Class that represents a row of summary data.
 *
 * @since  1.0.0
 * @access public
 */
class SummaryItem extends Label {

  /**
   * Creates a new SummaryItem object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments Label
   * @param {String} title The title/caption of the row of data.
   * @param {String} value The value of the row of data.
   *
   * @return {SummaryItem} A new SummaryItem object.
   */
  constructor(title, value) {
    super(`${title} <span>${value}</span>`, true);
    this.addStyleName('summary-item');
  }
}

/**
 * Class that represents a chart made with Google's Charts API.
 *
 * @since  1.0.0
 * @access public
 */
class SummaryChart extends View {

  /**
   * Creates a new SummaryChart object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments View
   * @param {Array} data    Array of array of items representing data to be
   *                        visualised. Each item is a segment/value paired array.
   * @param {Array} colours Array of custom colours to label the data. Default
   *                        colours will be used if no array is passed.
   *
   * @return {SummaryChart} A new SummaryChart object.
   */
  constructor(data, colours) {
    super('DIV');
    data = google.visualization.arrayToDataTable(data);

    this.options = {
      legend: {position: 'right', textStyle: {color: 'black'}},
      pieSliceTextStyle: {color: '#000', background: '#FFF'},
      pieHole: 0.5,
      width: 260,
      chartArea: {left: 0, top: 20, width: "100%", height: "100%"},
      enableInteractivity: false
    };

    if (colours) this.options.colors = colours;

    this.chart = new google.visualization.PieChart(this.domElement);
    this.chart.draw(data, this.options);
  }

  /**
   * Returns the HTML representation of this chart.
   *
   * @since 1.0.0
   * @access public
   *
   * @return {String} HTML string.
   */
  getHTML() {
    return this.domElement.outerHTML;
  }

  /**
   * Returns the SVG content of this chart.
   *
   * @since 1.0.0
   * @access public
   *
   * @return {String} SVG string.
   */
  getChartHTML() {
    const html = this.domElement.getElementsByTagName('svg')[0];
    html.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    return html.outerHTML;
  }
}

/**
 * Class that writes the generated summary to a zip file.
 *
 * @since  1.0.0
 * @access public
 */
class SummaryHTMLWriter {

  /**
   * Writes a zip file for a given project
   *
   * @since 1.0.0
   * @access public
   *
   * @param {AIProject} project The project for which the summary is to be downloaded.
   */
  static writeProjectSummary(project) {

    // A dialog is shown while the user waits.
    const dialog = new Dialog('Generating summary...', 'This may take a while');
    // The dialog has to be opened outside the event loop so that it doesn't wait
    // till everything is done before being opened.
    setTimeout(() => {
      dialog.open()
    }, 1);

    // The writing is done outside the event loop as well.
    setTimeout(() => {
      const html = [];
      const blobs = [];
      html.push('<html>');
      html.push(`<head><title>Project Summary for ${project.name}</title></head>`);
      html.push('<body>');
      html.push('<div style="text-align:center;width:100%;">');
      html.push(`<h1 style="margin-bottom:0">${project.name} - Project Summary</h1>`);
      html.push('<h5 style="margin-top:0">');
      html.push(`Summary generated on ${this.getDateTime()}`);
      html.push('</h5></div>');

      this.writeTOContents(html, project);
      this.writeStats(html, project);
      this.writeInsights(html, blobs, project);
      // Writing screens is done asynchronously, so we wait till that's done
      // before moving on to writing extensions.
      this.writeScreens(html, blobs, project).then(() => {
        if (project.extensions.length) this.writeExtensions(html, project);
        this.writeStyles(html, blobs);

        html.push('</body></html>');

        blobs.push([new Blob([html.join('')], {type: 'image/svg+xml'}), `${project.name}.html`]);

        this.zipAllBlobs(blobs);
        dialog.close();
      });
    }, 20);
  }

  /**
   * Utility function that formats the current time in DD/MM/YYYY @ HH:MM
   *
   * @since 1.0.0
   * @access private
   */
  static getDateTime() {
    const currentdate = new Date();
    return currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes();
  }

  /**
   * Writes the table of contents for the summary.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {Array} html The writer object used to make the summary.
   * @param {AIProject} project The project for which the summary is to be downloaded.
   */
  static writeTOContents(html, project) {
    html.push('<h3>Table of Contents</h3>');
    html.push('<ol>');
    html.push('<li><a href="#stats">Project stats</a></li>');
    html.push('<li><a href="#insights">Insights</a></li>');
    html.push('<li>Screens</li><ol>');
    for (let screen of project.screens) {
      html.push(`<li><a href="#screen-${screen.name}">${screen.name}</a></li>`);
    }
    html.push('</ol>');
    if (project.extensions.length) html.push('<li><a href="#exts">Extensions summary</a></li>');
    html.push('</ol>');
  }

  /**
   * Writes the general statistics of the project.
   * @see SummaryWriter::generateStats
   *
   * @since 1.0.0
   * @access private
   *
   * @param {Array} html The writer object used to make the summary.
   * @param {AIProject} project The project for which the summary is to be downloaded.
   */
  static writeStats(html, project) {
    html.push('<a name="stats"></a>');
    html.push('<h3>Project stats</h3>');

    html.push(SummaryWriter.generateStats(project).replace(/<p/g, '<li').replace(/\/p>/g, '/li>'));

    html.push('<h4>Most used components</h4>');
    html.push(SummaryWriter.generateMostUsed(project).replace(/<p/g, '<li').replace(/\/p>/g, '/li>'));
  }

  /**
   * Writes the charts for the project.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {Array} html The writer object used to make the summary.
   * @param {AIProject} project The project for which the summary is to be downloaded.
   */
  static writeInsights(html, blobs, project) {
    html.push('<a name="insights"></a>');
    html.push('<h3>Insights</h3>');

    blobs.push([new Blob([SummaryWriter.generateCodeShare(project).getChartHTML()], {type: 'image/svg+xml'}), 'code_share.svg']);
    blobs.push([new Blob([SummaryWriter.generateAssetTypeShare(project).getChartHTML()], {type: 'image/svg+xml'}), 'asset_type_share.svg']);
    blobs.push([new Blob([SummaryWriter.generateNativeShare(project).getChartHTML()], {type: 'image/svg+xml'}), 'native_share.svg']);
    blobs.push([new Blob([SummaryWriter.getBlockTypeShare(project).getChartHTML()], {type: 'image/svg+xml'}), 'block_type_share.svg']);

    html.push('<div style="display:inline-block">');
    html.push('<div class="chart"><img src="code_share.svg"></img>');
    html.push('<p>Percentage of blocks by screen</p></div>');

    html.push('<div class="chart"><img src="asset_type_share.svg"></img>');
    html.push('<p>Types of assets by frequency</p></div>');
    html.push('</div>');

    html.push('<div style="display:inline-block">');
    html.push('<div class="chart"><img src="native_share.svg"></img>');
    html.push('<p>Percentage of built-in components vs extensions used</p></div>');

    html.push('<div class="chart"><img src="block_type_share.svg"></img>');
    html.push('<p>Percentage of blocks by type</p></div>');
    html.push('</div>');
  }

  /**
   * Writes the screens and their blocks.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {Array} html The writer object used to make the summary.
   * @param {AIProject} project The project for which the summary is to be downloaded.
   */
  static async writeScreens(html, blobs, project) {
    let i = 0;
    for (let node of RootPanel.primaryNodeList.nodes) {
      if (node instanceof ScreenNode) {
        // Heading for the screen is written.
        html.push(`<a name="screen-${node.caption}"></a>`);
        html.push(`<h3>${node.caption}</h3>`);

        // All the components are listed.
        html.push(`<h4>Components</h4>`);

        html.push('<ul>');
        this.writeComponent(html, project.screens.find(x => x.name === node.caption).form);
        html.push('</ul><br>');
        html.push(`<h4>Blocks</h4>`);
        node.open();
        node.chainNodeList.nodes[1].open();
        let j = 0;

        // We cycle through all the screen nodes in the primary node list,
        // open them one by one, and open their blocks nodes.
        // This initializes the workspaces of all the blocks in the project,
        // if they haven't been done so already.
        // Next, we capture the SVG content of the blocks and append styles to
        // them. We finally convert them to blobs and then to PNG blobs.
        for (let blockNode of node.chainNodeList.nodes[1].chainNodeList.nodes) {
          blockNode.initializeWorkspace();
          html.push(`<img src="block_${i}_${j}.png">`);
          let blockXML = blockNode.domElement.children[1].children[0].innerHTML.replace(/&nbsp;/g, ' ');
          const styles = [];
          styles.push(`<style>${document.head.children[0].innerHTML}</style>`);
          styles.push('<style>.blocklyMainBackground{stroke-width:0}' + '.blocklySvg{position:relative;width:100%}</style>');
          blockXML = blockXML.substring(0, blockXML.indexOf('</svg>')) + styles.join('') + '</svg>';
          const svgBlob = new Blob([blockXML], {type: 'image/svg+xml'});
          blobs.push([await this.svgToPngBlob(svgBlob), `block_${i}_${j}.png`]);
          html.push(`<p class="blk-cap"></p>`);
          j++;
        }
        i++;
      }
    }
    // Once all screens have been opened and their blocks screenshotted, we
    // reopen the summary node list.
    RootPanel.primaryNodeList.nodes.slice(-1)[0].open();
  }

  /**
   * Converts an SVG blob to a PNG blob.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {Blob} svgBlob The writer object used to make the summary.
   *
   * @return {Promise} A Promise object, when resolved, yields the PNG blob.
   */
  static svgToPngBlob(svgBlob) {
    return new Promise((resolve, reject) => {
      // We first generate a URL pointing to the SVG blob.
      const url = URL.createObjectURL(svgBlob);

      // Then, we create an image element and set its source to the generated url.
      // We make sure to place the image far out of render distance so that it's
      // hidden from the user.
      const svgImage = document.createElement('img');
      svgImage.style.position = 'absolute';
      svgImage.style.top = '-9999px';
      document.body.appendChild(svgImage);

      svgImage.onload = function () {
        // When the image loads, we create a canvas element and draw the image's
        // content onto it.
        // Then we convert the canvas to a blob and resolve the promise.
        // Finally, we remove the image element from the DOM.
        const canvas = document.createElement('canvas');
        canvas.width = svgImage.clientWidth;
        canvas.height = svgImage.clientHeight;
        const canvasCtx = canvas.getContext('2d');
        canvasCtx.drawImage(svgImage, 0, 0);
        canvas.toBlob(function (pngBlob) {
          resolve(pngBlob);
          document.body.removeChild(svgImage);
        }, 'image/png');
      };
      svgImage.src = url;
    });
  }

  /**
   * Recursively lists a component and all its children.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {Array} html The writer object used to make the summary.
   * @param {AIProject} project The project for which the summary is to be downloaded.
   */
  static writeComponent(html, component) {
    html.push(`<li>${component.name} <small>(${component.type})</small></li>`);
    for (let child of component.children) {
      html.push('<ul>');
      this.writeComponent(html, child);
      html.push('</ul>');
    }
  }

  /**
   * Lists all extensions used in a project.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {Array} html The writer object used to make the summary.
   * @param {AIProject} project The project for which the summary is to be downloaded.
   */
  static writeExtensions(html, project) {
    html.push('<a name="exts"></a>');
    html.push('<h3>Extensions summary</h3>');

    for (let ext of project.extensions) {
      html.push(`<li>${ext.name}<ul><li>${ext.descriptorJSON.helpString}</li></ul></li>`);
    }
  }

  /**
   * Writes styles used to display the summary correctly.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {Array} html The writer object used to make the summary.
   * @param {AIProject} project The project for which the summary is to be downloaded.
   */
  static writeStyles(html, blobs) {
    html.push('<style>body{max-width:1000px;margin:0 auto;border:1px solid #DDD;' + 'padding:20px;font-family: sans-serif}' + 'span::before{content:": "}' + '.chart{display:block;margin:0 40px;}' + '.blk-cap:empty::after{content:"[Caption]"; font-style:italic;color:#888}' + '@media print{.blk-cap:empty{display:none}}' + '@page{margin-bottom:0}</style>');
    html.push('<script>document.designMode = "on"</script>');
  }

  /**
   * Utility function that zips all blobs in an array.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {Array} blobs An array of array of blobs. Each blob is a name-blob pair.
   *
   * @return {Blob} The zipped blob.
   */
  static zipAllBlobs(blobs) {
    zip.createWriter(new zip.BlobWriter("application/zip"), (zipWriter) => {
      this.zipBlob(zipWriter, blobs);
    });
  }

  /**
   * Utility function that recursively zips all blobs in an array.
   *
   * @since 1.0.0
   * @access private
   *
   * @param {Object} writer The zipWriter object.
   * @param {Array} blobs An array of array of blobs. Each blob is a name-blob pair.
   *
   * @return {Blob} The zipped blob.
   */
  static zipBlob(writer, blobs) {
    // We cannot asynchronously call this function for all blobs and then do
    // Promise.all() because the zipWriter can write only one file at a time.
    // So we write a blob, pop it from the array, write the next blob, pop it,
    // and so on till the array is empty.
    // Once all blobs have been zipped, we download the zipped file.
    if (blobs.length > 0) {
      let blob = blobs.pop();
      writer.add(blob[1], new zip.BlobReader(blob[0]), () => {
        this.zipBlob(writer, blobs);
      });
    } else {
      writer.close((zippedFile) => {
        Downloader.downloadBlob(zippedFile, 'project.zip');
      });
    }
  }
}
