// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Logic blocks for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */

'use strict';

goog.provide('Blockly.Blocks.logic');

goog.require('Blockly.Blocks.Utilities');

Blockly.Blocks['logic_boolean'] = {
  init: function () {
    this.setColour(Blockly.LOGIC_CATEGORY_HUE);
    this.setOutput(true);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'BOOL');
  }
};

Blockly.Blocks.logic_boolean.OPERATORS = function () {
  return [
    [Messages.true_, 'TRUE'],
    [Messages.false_, 'FALSE']
  ];
};

Blockly.Blocks['logic_false'] = {
  init: function () {
    this.setColour(Blockly.LOGIC_CATEGORY_HUE);
    this.setOutput(true);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.logic_boolean.OPERATORS), 'BOOL');
    this.setFieldValue('FALSE', 'BOOL');
  }
};

Blockly.Blocks['logic_negate'] = {
  init: function () {
    this.setColour(Blockly.LOGIC_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('BOOL')
        .appendField(Messages.not_);
  }
};

Blockly.Blocks['logic_compare'] = {
  init: function () {
    this.setColour(Blockly.LOGIC_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
    this.setInputsInline(true);
  }
};

Blockly.Blocks.logic_compare.OPERATORS = function () {
  return [
    [Messages.eq_, 'EQ'],
    [Messages.neq_, 'NEQ']
  ];
};

Blockly.Blocks['logic_operation'] = {
  init: function () {
    this.setColour(Blockly.LOGIC_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
    this.setInputsInline(true);
  }
};

Blockly.Blocks.logic_operation.OPERATORS = function () {
  return [
    [Messages.and_, 'AND'],
    [Messages.or_, 'OR']
  ]
};

Blockly.Blocks['logic_or'] = {
  init: function () {
    this.setColour(Blockly.LOGIC_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.logic_operation.OPERATORS), 'OP');
    this.setFieldValue('OR', 'OP');
    this.setInputsInline(true);
  }
};
