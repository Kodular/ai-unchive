// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Visual blocks editor for App Inventor
 * FieldTextBlockInput is a subclass of FieldTextInput
 *
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */


import * as Blockly from "blockly";

export class FieldTextBlockInput extends Blockly.FieldTextInput {

  constructor(value, validator, config) {
    super(value, validator, config);

    // this.changeHandler_ = opt_changeHandler;
  }

  doClassValidation_(opt_newValue) {
    // this.menuGenerator_.push([opt_newValue, opt_newValue]);
    return super.doClassValidation_(opt_newValue);
  }

  getText() {
    return super.getText();
  }
}

Blockly.fieldRegistry.register('field_textblockinput', FieldTextBlockInput);
