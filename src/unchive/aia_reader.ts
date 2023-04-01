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

import {AIAsset, AIExtension, AIProject, AIScreen} from './ai_project'
import {BlobReader, Entry, HttpReader, ZipReader} from "@zip.js/zip.js";
import {getBlobFileContent, getFileInfo, getTextFileContent, readProjectProperties} from "../utils";

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
    static async read(content: Blob | string) {
        const readerObj = content instanceof Blob ? new BlobReader(content) : new HttpReader(content);
        const zr = new ZipReader(readerObj)
        const entries = await zr.getEntries()

        let projectPropertiesFile = entries.find(x => x.filename === 'youngandroidproject/project.properties');
        if (!projectPropertiesFile) {
            throw new Error('Invalid AIA file: project.properties not found');
        }

        const projectProperties = await readProjectProperties(projectPropertiesFile)

        const project = new AIProject(projectProperties.find(x => x.name === 'name')?.value ?? 'Unnamed Project');
        project.properties = projectProperties;

        // Extensions are loaded first so that instances of extensions can
        // later fetch the correct descriptor JSON files.
        for (let extension of await this.generateExtensions(entries.filter(x => getFileInfo(x)[1] === 'json'))) {
            project.addExtension(extension);
        }

        // Screens are loaded asynchronously.
        for (let screen of await this.generateScreens(entries.filter(x => getFileInfo(x)[1] === 'scm' || getFileInfo(x)[1] === 'bky'))) {
            project.addScreen(screen);
        }

        // Finally, all the assets are loaded.
        for (let asset of await this.generateAssets(entries.filter(x => x.filename.split('/')[0] === 'assets' && x.filename.split('/')[2] === undefined))) {
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
    static async generateScreens(files: Entry[]) {
        const schemes: { name: string, scm: string }[] = [];
        const blocks: { name: string, bky: string }[] = [];

        // First, we load all the scheme files into the schemes array and the Blockly
        // files into the blocks array.
        for (let file of files) {
            const content = await getTextFileContent(file);
            let [fileName, fileType] = getFileInfo(file);
            if (fileType === 'scm') {
                schemes.push({
                    name: fileName,
                    scm: content
                });
            } else if (fileType === 'bky') {
                blocks.push({
                    name: fileName,
                    bky: content
                });
            }
        }

        const screens: Promise<AIScreen>[] = [];

        // Then, for each scheme file, we create a new AIScreen and initialise it with
        // the corresponding Blockly file.
        for (let scheme of schemes) {
            let block = blocks.find(x => x.name === scheme.name);
            if (!block) continue
            screens.push(AIScreen.init(scheme.name, scheme.scm, block.bky));
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
    static async generateExtensions(files: Entry[]) {
        const buildInfos: { name: string, info: ExtensionBuildInfoJson[] }[] = [];
        const descriptors: { name: string, descriptor: ExtensionDescriptorJson[] }[] = [];

        // The component_build_info and component descriptor files are being read.
        // Some extensions describe the component as a JSON array, while some as a
        // JSON object. We collect both files at the same time and handle them
        // separately later.
        for (let file of files) {
            const content = await getTextFileContent(file);
            let fileName = getFileInfo(file)[0];
            let extName = file.filename.split('/')[2];
            if (fileName === 'component_build_infos') {
                buildInfos.push({
                    name: extName,
                    info: JSON.parse(content) as ExtensionBuildInfoJson[]
                });
            } else if (fileName === 'component_build_info') {
                buildInfos.push({
                    name: extName,
                    info: [JSON.parse(content)] as ExtensionBuildInfoJson[]
                });
            } else if (fileName === 'components') {
                descriptors.push({
                    name: extName,
                    descriptor: JSON.parse(content) as ExtensionDescriptorJson[]
                });
            } else if (fileName === 'component') {
                descriptors.push({
                    name: extName,
                    descriptor: [JSON.parse(content)] as ExtensionDescriptorJson[]
                });
            }
        }

        const extensions: AIExtension[] = [];

        // If the build info is an array, then the extension is a pack
        // (a collection of extensions bundled into one file). In such a case, we
        // iterate through each element in the array and create a new AIExtension for
        // every extension defined in the pack.
        // If the build info is a JSON object, then the extension is standalone, and
        // we handle it as such.
        for (let buildInfo of buildInfos) {
            for (let [i, ext] of buildInfo.info.entries()) {
                const desc = descriptors.find(x => x.name === buildInfo.name);
                if (!desc) continue
                extensions.push(new AIExtension(ext.type, desc.descriptor[i]));
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
    static async generateAssets(files: Entry[]) {
        const assets: AIAsset[] = [];
        for (let file of files) {
            // TODO: Lazily read the file content.
            const content = await getBlobFileContent(file);
            const [fileName, fileType] = getFileInfo(file);
            assets.push(new AIAsset(fileName, fileType, content));
        }
        return assets;
    }
}
