// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Drop-down chooser of variables in the current lexical scope for App Inventor
 * @author vishwas@kodular.io (Vishwas Adiga)
 */

import * as Blockly from "blockly";

/**
 * Class for a variable's name field.
 * @param {!string} varname The default name for the variable.
 * @extends Blockly.FieldTextInput
 * @constructor
 */
export class FieldParameterName extends Blockly.FieldTextInput {

  constructor(value, validator, config) {
    super(value, validator, config);

    // Blockly.utils.removeClass(/** @type {!Element} */ (this.fieldGroup_),
    //   'blocklyEditableText');
    // Blockly.utils.removeClass(/** @type {!Element} */ (this.fieldGroup_),
    //   'blocklyNoNEditableText');
    // // ... and add new one, so that look and feel of flyout fields can be customized
    // Blockly.utils.addClass(/** @type {!Element} */ (this.fieldGroup_),
    //   "blocklyFieldParameterName");
  }

  doClassValidation_(opt_newValue) {
    // this.menuGenerator_.push([opt_newValue, opt_newValue]);
    return super.doClassValidation_(opt_newValue);
  }
}

Blockly.fieldRegistry.register('field_param_name', FieldParameterName);
