// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Procedure blocks for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */


'use strict';

goog.provide('Blockly.Blocks.procedures');

goog.require('Blockly.Blocks.Utilities');
goog.require('Blockly.FieldTextInput');

Blockly.Blocks['procedures_defnoreturn'] = {
  init: function() {
    this.setColour(Blockly.PROCEDURE_CATEGORY_HUE);
    this.headerInput =
      this.appendDummyInput('HEADER')
        .appendField(Messages.to__)
        .appendField(new Blockly.FieldTextInput(''), 'NAME');
    this.appendEnd();
    this.setMutator(new Blockly.Mutator(['math_mutator_item']));
  },
  domToMutation: function(xmlElement) {
    var params = [];
    var children = xmlElement.children;
    for (var x = 0, childNode; childNode = children[x]; x++) {
      if (childNode.nodeName.toLowerCase() == 'arg') {
        params.push(childNode.getAttribute('name'));
      }
    }
    this.horizontalParameters = xmlElement.getAttribute('vertical_parameters') !== "true";

    if (this.horizontalParameters) { // horizontal case
      for (var i = 0; i < children.length; i++) {
        this.headerInput.appendField(' ')
                   .appendField(new Blockly.FieldParameterName(''),
                                'VAR' + i);
      }
    } else { // vertical case
      for (var i = 0; i < children.length; i++) {
        this.removeInput('STACK', true);
        this.removeInput('RETURN', true);

        this.appendDummyInput('VAR' + i)
          .appendField(new Blockly.FieldParameterName(''), 'VAR' + i)
          .setAlign(Blockly.ALIGN_RIGHT);

        this.appendEnd();
      }
    }
  },
  appendEnd: function() {
    this.appendStatementInput('STACK')
        .appendField(Messages.do_);
  }
};

Blockly.Blocks['procedures_defreturn'] = {
  init: Blockly.Blocks.procedures_defnoreturn.init,
  domToMutation: Blockly.Blocks.procedures_defnoreturn.domToMutation,
  appendEnd: function() {
    this.appendValueInput('RETURN')
        .appendField(Messages.result_)
        .setAlign(Blockly.ALIGN_RIGHT);
  }
};

Blockly.Blocks['procedures_callnoreturn'] = {
  init: function() {
    this.setColour(Blockly.PROCEDURE_CATEGORY_HUE);

    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
  domToMutation: function(xmlElement) {
    var name = xmlElement.getAttribute('name');
    this.appendDummyInput()
        .appendField(Messages.call_)
        .appendField(new Blockly.FieldParameterDropdown(name),"PROCNAME");
    var children = xmlElement.children;
    for (var x = 0, childNode; childNode = children[x]; x++) {
      if (childNode.nodeName.toLowerCase() == 'arg') {
        this.appendValueInput('ARG' + x)
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(childNode.getAttribute('name'))
      }
    }
  }
};


Blockly.Blocks['procedures_callreturn'] = {
  init: function() {
    this.setColour(Blockly.PROCEDURE_CATEGORY_HUE);
    this.setOutput(true, null);
  },
  domToMutation: Blockly.Blocks.procedures_callnoreturn.domToMutation
};
