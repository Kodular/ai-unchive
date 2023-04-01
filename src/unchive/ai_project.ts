/**
 * Defines classes used to manage App Inventor project data.
 *
 * Contains several classes that together represent an AI project. Each AI
 * project consists of screens, extensions, and assets. Each Screen in a project
 * is represented by its Form, child components, and blocks. Extensions are
 * simple objects containing their names and descriptions.
 * Together, these classes fully describe the content of an AIA file.
 *
 * @file   This file defines the AIProject, AIScreen, Component, AIExtension,
 *         AIAsset, and BlocklyWorkspace classes.
 * @author vishwas@kodular.io (Vishwas Adiga)
 * @since  1.0.0
 * @license
 */

import simpleComponentsJson from "./simple_components.json";
import {process_properties} from "./property_processor";

/**
 * Class that describes an App Inventor project.
 *
 * @since  1.0.0
 * @access public
 */
export class AIProject {
    name: string;
    properties: { name: string, value: string }[]
    screens: AIScreen[];
    extensions: AIExtension[];
    assets: AIAsset[];

    /**
     * Creates a new AIProject object with the given name.
     *
     * @since 1.0.0
     * @access public
     *
     * @class
     * @param {String} name Name of the project.
     *
     * @return {AIProject} New AIProject object.
     */
    constructor(name: string) {
        /**
         * Name of the project this class represents.
         * @since  1.0.0
         * @type   {String}
         */
        this.name = name;

        this.properties = []

        /**
         * Array of Screen objects this project contains.
         * @since  1.0.0
         * @type   {Array<AIScreen>}
         */
        this.screens = [];

        /**
         * Array of extensions used by this project.
         * @since  1.0.0
         * @type   {Array}
         */
        this.extensions = [];

        /**
         * Array of AIAsset objects this project contains.
         * @since  1.0.0
         * @type   {Array}
         */
        this.assets = [];
    }

    /**
     * Adds a single asset to this project's array of assets.
     *
     * @since 1.0.0
     * @access public
     *
     * @param {AIAsset} asset Asset object.
     */
    addAsset(asset: AIAsset) {
        this.assets.push(asset);
    }

    /**
     * Adds a single screen to this project's array of screens.
     *
     * @since 1.0.0
     * @access public
     *
     * @param {AIScreen} screen Screen object.
     */
    addScreen(screen: AIScreen) {
        if (screen.name === 'Screen1') {
            this.screens.unshift(screen);
        } else {
            this.screens.push(screen);
        }
    }

    /**
     * Adds a single extension to this project's array of extensions.
     *
     * @since 1.0.0
     * @access public
     *
     * @param {AIExtension} extension Extension object.
     */
    addExtension(extension: AIExtension) {
        this.extensions.push(extension);
    }
}

/**
 * Class that describes a screen in an App Inventor project.
 *
 * @since  1.0.0
 * @access public
 */
export class AIScreen {
    name: string;
    form: AIComponent;
    blocks: string;

    constructor(name: string, form: AIComponent, blocks: string) {
        this.name = name;
        this.form = form;
        this.blocks = blocks;
    }

    /**
     * Creates a new AIScreen object asynchronously.
     *
     * Asynchronously creating this object, as opposed to using a constructor, lets
     * us generate all screens in a project simultaneously. This greatly reduces
     * the overall load time of the page, especially in case of large AIAs, as the
     * @see AIAReader::read function will not have to wait for the components of
     * this screen to load before starting with the next.
     *
     * @since 1.0.0
     * @access public
     *
     * @class
     * @param {String}    scm     The scheme data for this screen as fetched from
     *                            the AIA.
     * @param {String}    blk     The stringified Blockly XML for this screen as
     *                            fetched from the AIA.
     * @param {String}    name    The name of this screen.
     *
     * @return {AIScreen} New AIScreen object.
     */
    static async init(name: string, scm: string, blk: string) {
        const form = await this.generateSchemeData(scm);

        return new AIScreen(name, form, blk);
    }

    /**
     * Takes the raw scheme input from the AIA, parses it as a JSON array, and then
     * generates all the component and property objects for this screen.
     *
     * @since 1.0.0
     * @access private
     *
     * @param {String} scmJSON The raw scheme text fetched from the .scm file of
     *                         the AIA.
     *
     * @return {AIComponent} The Form component of this screen.
     */
    static async generateSchemeData(scmJSON: string) {
        const componentsJSON = JSON.parse(scmJSON.slice(9, -3)) as ScmJson;
        return this.generateComponent(componentsJSON.Properties);
    }

    /**
     * Takes the JSON description of a component and asynchronously
     * creates a new @see Component class representing it. Also recursively calls
     * itself for every child of this component.
     *
     * @since 1.0.0
     * @access private
     *
     * @param {String} componentJSON The JSON object describing this component.
     *
     * @return {AIComponent} An object representing this component's properties and
     *                     children.
     */
    static async generateComponent(componentJSON: ComponentJson) {
        // Check if the component is an instance of an extension.
        const extType = simpleComponentsJson.find(x => x.name.split('.').pop() === componentJSON.$Type);

        // If it is an extension, give it a custom descriptor JSON object that will
        // be used to generate its properties.
        // If it's not an extension, no JSON will be provided and the service's
        // simple_components.json file will be used instead.
        let origin = extType === undefined ? 'EXTENSION' : 'BUILT-IN';

        const component = new AIComponent(
            componentJSON.$Name,
            componentJSON.$Type,
            componentJSON.Uuid, //Screens do not have a Uuid property.
            origin
        );

        component.properties = await component.loadProperties(
            componentJSON,
            extType as any);

        for (let childComponent of componentJSON.$Components || []) {
            component.addChild(await this.generateComponent(childComponent));
        }
        return component;
    }
}

/**
 * Class that describes a component with its properties and children.
 *
 * @since  1.0.0
 * @access public
 */
export class AIComponent {
    name: string;
    type: string;
    uid: string;
    children: AIComponent[];
    private origin: string;
    visible: boolean;
    properties: { name: string, value: string, editorType?: string }[];
    private faulty: boolean;

    /**
     * Creates a new Component object.
     *
     * @since 1.0.0
     * @access public
     *
     * @class
     * @param {String} name    The user-facing name of this component.
     * @param {String} type    The internal class name of this component.
     * @param {String} uid     The unique ID attached to this component.
     * @param {String} origin 'EXTENSION' if this component is the instance of an
     *                         extension, 'BUILT-IN' otherwise.
     *
     * @return {AIComponent} New Component object.
     */
    constructor(name: string, type: string, uid: string, origin: string) {

        /**
         * Name of this component. It is unique and set by the user.
         * @since  1.0.0
         * @type   {String}
         */
        this.name = name;

        /**
         * Internal class name of this component, as defined by the name of the Java
         * file it is declared in.
         * @since  1.0.0
         * @type   {String}
         */
        this.type = type;

        /**
         * Unique identifier for this component. Is internal and hidden from the user.
         * Form components have a UID of 0.
         * @since  1.0.0
         * @type   {String}
         */
        this.uid = uid;

        /**
         * Array of Component objects that represents the children of this component.
         * @since  1.0.0
         * @type   {Array}
         */
        this.children = [];

        /**
         * Origin of this component. Used in @see SummaryWriter::generateNativeShare
         * to make summary charts of component usage.
         * @since  1.0.0
         * @type   {String}
         */
        this.origin = origin;

        this.visible = true;

        /**
         * Array of property name-value pairs of this component. Properties are loaded
         * asynchronously in AIScreen::generateComponent.
         * @since  1.0.0
         * @type   {Array}
         */
        this.properties = []

        /**
         * Flag which indicates whether there was a problem parsing this component's
         * properties. @see Component::loadProperties
         * @since  1.0.0
         * @type   {Boolean}
         */
        this.faulty = false;
    }

    /**
     * Generates an array of name-value pair objects describing this compoent's
     * properties.
     *
     * AIA files only store properties of a component that are not the default
     * value. Therefore, we have to map the properties defined for this component
     * type in the simple_components.json file (or custom descriptor JSON for
     * extensions) to the properties saved in the AIA. This lets us generate the
     * full list of properties for this component.
     *
     * @since 1.0.0
     * @access private
     *
     * @param {Array} properties           JSON array describing the properties of this
     *                                     component that have a non-default value.
     * @param {Array} customDescriptorJSON The full list of properties and their
     *                                     default values for this component.
     *
     * @return {Promise} A Promise object, that when resolved, yields the complete
     *                   array of properties of this component.
     */
    async loadProperties(properties: ComponentJson, customDescriptorJSON: ExtensionDescriptorJson) {
        // It is not ideal to load the properties of all components in the UI thread
        // of the page, as it may cause users to see the kill page dialog when
        // loading large projects.
        // Instead, we use several web workers to do the job simultaneously in
        // separate threads and then return the complete array of properties.
        try {
            const descriptor = customDescriptorJSON ||
                simpleComponentsJson.find(x =>
                    x.type === 'com.google.appinventor.components.runtime.' + this.type);

            this.visible = descriptor.nonVisible === "false";

            return process_properties(
                properties,
                descriptor.properties
            )
        } catch (error: any) {
            // If the descriptor JSON object for this component does not exist in
            // AIProject.descriptorJSON, it means either the component has been
            // removed from the service, or that the user is trying to load an AIA
            // that was developed using a different service.
            // In either case, we continue to parse the rest of the components that
            // can be parsed, and add a "faulty" flag to the component.
            // This flag will later be used in @see node.js::ComponentNode to show the
            // user a visual indicator stating there was an error parsing the component.
            console.log(`Error in ${this.name}(${this.uid} / ${this.type}), message: ${error.message}`, customDescriptorJSON);
            this.faulty = true;
            return [];
        }

    }

    /**
     * Adds a child component to this component.
     *
     * @since 1.0.0
     * @access private
     *
     * @param {AIComponent} component The child component to be added.
     */
    addChild(component: AIComponent) {
        this.children.push(component);
    }
}

/**
 * Class that describes an extension.
 *
 * @since  1.0.0
 * @access public
 */
export class AIExtension {
    name: string;
    descriptorJSON: Record<string, any>;

    /**
     * Creates a new AIExtension object.
     *
     * @since 1.0.0
     * @access public
     *
     * @class
     * @param {String} name              The full package name of this extension.
     * @param {String} descriptorJSON    The custom JSON used to load the properties
     *                                   of any instances of this extension.
     *
     * @return {AIExtension} New AIExtension object.
     */
    constructor(name: string, descriptorJSON: ExtensionDescriptorJson) {

        /**
         * Package name of this extension (eg: com.google.SearchBoxExtension).
         * @since  1.0.0
         * @type   {String}
         */
        this.name = name;

        /**
         * Custom descriptor JSON used by components to populate their list of
         * properties
         * @since  1.0.0
         * @type   {Object}
         */
        this.descriptorJSON = descriptorJSON;
    }
}

/**
 * Class that describes an asset file.
 *
 * @since  1.0.0
 * @access public
 */
export class AIAsset {
    name: string;
    type: string;
    private readonly blob: Blob;
    size: number;
    private url: string;

    /**
     * Creates a new AIAsset object.
     *
     * @since 1.0.0
     * @access public
     *
     * @class
     * @param {String} name The name of this asset file.
     * @param {String} type The asset's file type (png, jpg, etc.)
     * @param {Blob} blob   The blob representing this asset's contents.
     *
     * @return {AIAsset} New AIAsset object.
     */
    constructor(name: string, type: string, blob: Blob) {

        /**
         * Name of this asset, as defined by the user in their project.
         * @since  1.0.0
         */
        this.name = name;

        /**
         * File type of this asset.
         * @since  1.0.0
         */
        this.type = type;

        /**
         * Blob representing this project. This is undefined in .aiv files as Blob
         * functions are not stringified into JSON.
         * @since  1.0.0
         */
        this.blob = blob;

        /**
         * Size of this asset in bytes.
         * @since  1.0.0
         */
        this.size = blob.size;

        /**
         * Temporary URL representing this blob
         * @since  1.0.0
         * @type   {String}
         */
        this.url = '';
    }

    /**
     * Returns a unique URL that can be used to display this asset to the user.
     *
     * @since 1.0.0
     * @access public
     *
     * @return {String} Temporary URL pointing to this asset's blob.
     */
    getURL() {
        if (this.url === '')
            this.url = URL.createObjectURL(this.blob)
        return this.url;
    }

    /**
     * Revokes any URL set to point to this asset's blob.
     *
     * @since 1.0.0
     * @access public
     */
    revokeURL() {
        URL.revokeObjectURL(this.url);
    }
}
