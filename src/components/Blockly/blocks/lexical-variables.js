// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Variables blocks for Blockly, modified for MIT App Inventor.
 * @author fturbak@wellesley.edu (Lyn Turbak)
 */

import Blockly from 'blockly/core';
import {Messages} from "../../../../i18n/js/en.js";
import {VARIABLE_CATEGORY_HUE} from "./utilities.ts";
import {FieldParameterName} from "../fields/field_param_name.js";

/**
 * Prototype bindings for a global variable declaration block
 */
Blockly.Blocks['global_declaration'] = {
  // Global var defn
  category: 'Variables',
  init: function () {
    this.setColour(VARIABLE_CATEGORY_HUE);
    this.appendValueInput('VALUE')
      .appendField(Messages.initGbl_)
      .appendField(new Blockly.FieldTextInput(''), "NAME")
      .appendField(Messages.to__);
  }
};

Blockly.Blocks['lexical_variable_get'] = {
  category: 'Variables',
  init: function () {
    this.setColour(VARIABLE_CATEGORY_HUE);
    this.appendDummyInput()
      .appendField(Messages.get_)
      .appendField(new Blockly.FieldTextInput(""), "NAME")
    this.setOutput(true);
  },
  // domToMutation: function (xmlElement) {
  //   this.setFieldValue(Messages[xmlElement.getAttribute('name') + 'Params'] || xmlElement.getAttribute('name'), 'VAR')
  // }
};

Blockly.Blocks['lexical_variable_set'] = {
  category: 'Variables',
  init: function () {
    this.setColour(VARIABLE_CATEGORY_HUE);
    this.appendValueInput('VALUE')
      .appendField(Messages.set_)
      .appendField(new Blockly.FieldTextInput(""), "NAME")
      .appendField(Messages.to__);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['local_declaration_statement'] = {
  init: function () {
    this.setColour(VARIABLE_CATEGORY_HUE);
    this.setMutator(new Blockly.Mutator(['math_mutator_item']));
    this.appendEnd();

  },
  domToMutation: function (xmlElement) {
    const children = xmlElement.children;
    this.horizontalParameters = xmlElement.getAttribute('inline') === "true";
    this.removeInput('STACK', true);
    this.removeInput('RETURN', true);
    for (let i = 0; i < children.length; i++) {
      this.appendValueInput('DECL' + i)
        .appendField(Messages.initLcl_)
        .appendField(new FieldParameterName(''), 'VAR' + i)
        .appendField(Messages.to__)
        .setAlign(Blockly.ALIGN_RIGHT);
    }
    if (this.horizontalParameters) {
      this.appendDummyInput('');
    }

    this.appendEnd();
  },
  appendEnd: function () {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendStatementInput('STACK')
      .appendField(Messages.in_);
  }
};

Blockly.Blocks['local_declaration_expression'] = {
  init: Blockly.Blocks.local_declaration_statement.init,
  domToMutation: Blockly.Blocks.local_declaration_statement.domToMutation,
  appendEnd: function () {
    this.appendValueInput('RETURN')
      .appendField(Messages.in_);
    this.setOutput(true);
  }
};
