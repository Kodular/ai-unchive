// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Drop-down chooser of variables in the current lexical scope for App Inventor
 * @author vishwas@kodular.io (Vishwas Adiga)
 */

'use strict';

goog.provide('Blockly.FieldParameterName')
goog.require('Blockly.FieldTextInput');

// Get all global names

/**
 * Class for a variable's name field.
 * @param {!string} varname The default name for the variable.
 * @extends Blockly.FieldTextInput
 * @constructor
 */
Blockly.FieldParameterName = function(name) {
 // Call parent's constructor.
  Blockly.FieldParameterName.superClass_.constructor.call(this, name);
};

// FieldParameterName is a subclass of FieldTextInput.
goog.inherits(Blockly.FieldParameterName, Blockly.FieldTextInput);

Blockly.FieldParameterName.prototype.init = function(block) {
  Blockly.FieldParameterName.superClass_.init.call(this, block);

  Blockly.utils.removeClass(/** @type {!Element} */ (this.fieldGroup_),
      'blocklyEditableText');
  Blockly.utils.removeClass(/** @type {!Element} */ (this.fieldGroup_),
      'blocklyNoNEditableText');
  // ... and add new one, so that look and feel of flyout fields can be customized
  Blockly.utils.addClass(/** @type {!Element} */ (this.fieldGroup_),
      "blocklyFieldParameterName");
}
