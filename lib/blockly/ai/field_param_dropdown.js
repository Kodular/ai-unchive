// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Drop-down chooser of variables in the current lexical scope for App Inventor
 * @author fturbak@wellesley.com (Lyn Turbak)
 */

'use strict';

goog.provide('Blockly.FieldParameterDropdown')
goog.require('Blockly.FieldDropdown');

// Get all global names

/**
 * Class for a variable's dropdown field.
 * @param {!string} varname The default name for the variable.  If null,
 *     a unique variable name will be generated.
 * @extends Blockly.FieldDropdown
 * @constructor
 */
Blockly.FieldParameterDropdown = function(varname) {
 // Call parent's constructor.
  Blockly.FieldParameterDropdown.superClass_.constructor.call(this, [[varname, ""]]);
};

// FieldParameterDropdown is a subclass of FieldDropdown.
goog.inherits(Blockly.FieldParameterDropdown, Blockly.FieldDropdown);

Blockly.FieldParameterDropdown.prototype.init = function(block) {
  Blockly.FieldParameterDropdown.superClass_.init.call(this, block);

  Blockly.utils.removeClass(/** @type {!Element} */ (this.fieldGroup_),
      'blocklyEditableText');
  Blockly.utils.removeClass(/** @type {!Element} */ (this.fieldGroup_),
      'blocklyNoNEditableText');
  // ... and add new one, so that look and feel of flyout fields can be customized
  Blockly.utils.addClass(/** @type {!Element} */ (this.fieldGroup_),
      "blocklyFieldParameterDropdown");
}

Blockly.FieldParameterDropdown.prototype.doClassValidation_ = function(opt_newValue) {
  this.menuGenerator_.push([opt_newValue, opt_newValue]);
  Blockly.FieldParameterDropdown.superClass_.doClassValidation_.call(this, opt_newValue);
}
