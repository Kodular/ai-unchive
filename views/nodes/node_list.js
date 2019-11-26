/**
 * Defines a NodeList class which holds Nodes.
 *
 *
 * @file   This file defines the NodeList class.
 * @author vishwas@kodular.io (Vishwas Adiga)
 * @since  1.0.0
 * @license
 */

import { View } from '../view.js'
import { Label } from '../widgets.js'
import { Node } from './node.js'

/**
 * Class that contains Node objects.
 *
 * @since  1.0.0
 * @access public
 */
export class NodeList extends View {

  /**
   * Creates a new NodeList object.
   *
   * @since 1.0.0
   * @access public
   *
   * @class
   * @augments View
   *
   * @return {NodeList} A new NodeList object.
   */
  constructor() {
    super('DIV');
    /**
     * Array of all nodes in this NodeList.
     * @since  1.0.0
     * @type   {Array}
     */
    this.nodes = [];

    /**
     * Helper text shown when the NodeList is empty.
     * @since  1.0.0
     * @type   {Label}
     */
		this.helpText = new Label('Nothing to see here!');
		this.helpText.addStyleName('node-list__help-text');
		this.addView(this.helpText);
    this.addStyleName('node-list');
  }

  /**
   * Adds an asynchronously generated Node to this NodeList.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {Promise} promise A promise, when resolved, should yield a Node object.
   */
  addNodeAsync(promise) {
		promise.then((node) => {
			this.addNode(node);
		});
  }

  /**
   * Adds a Node to this NodeList.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {Node} node The Node object to be added to this list.
   */
	addNode(node) {
		this.addView(node);
		node.setNodeList(this);
    this.nodes.push(node);
	}

  /**
   * Sets the active node of a NodeList. The active node has a user-visible
   * highlight.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {Node} node The Node object to be made active. The node must be in
   *                    this NodeList.
   */
  setActiveNode(node) {
		if(this.activeNode != undefined)
			this.activeNode.removeStyleName('unchive-node--active');
    this.activeNode = node;
		if(node != undefined)
			node.addStyleName('unchive-node--active');
  }

  /**
   * Sets the visibility of this NodeList.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {Boolean} visible true if visible, false otherwise.
   */
	setVisible(visible) {
		super.setVisible(visible);
		if(visible)
			setTimeout(()=>{this.domElement.scrollIntoView({ behavior: 'smooth', inline : 'end'})}, 100);
	}
}
