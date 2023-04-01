// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Drop-down chooser of variables in the current lexical scope for App Inventor
 * @author fturbak@wellesley.com (Lyn Turbak)
 */

import * as Blockly from 'blockly';

/**
 * Class for a variable's dropdown field.
 * @param {!string} varname The default name for the variable.  If null,
 *     a unique variable name will be generated.
 * @extends Blockly.FieldDropdown
 * @constructor
 */
export class FieldParameterDropdown extends Blockly.FieldDropdown {

  constructor(value, validator, config) {
    super([[value, value]], validator, config);

    // Blockly.utils.removeClass(/** @type {!Element} */ (this.fieldGroup_),
    //   'blocklyEditableText');
    // Blockly.utils.removeClass(/** @type {!Element} */ (this.fieldGroup_),
    //   'blocklyNoNEditableText');
    // // ... and add new one, so that look and feel of flyout fields can be customized
    // Blockly.utils.addClass(/** @type {!Element} */ (this.fieldGroup_),
    //   "blocklyFieldParameterDropdown");
  }

  doClassValidation_(opt_newValue) {
    // this.menuGenerator_.push([opt_newValue, opt_newValue]);
    return super.doClassValidation_(opt_newValue);
  }
}

Blockly.fieldRegistry.register('field_param_dropdown', FieldParameterDropdown);

