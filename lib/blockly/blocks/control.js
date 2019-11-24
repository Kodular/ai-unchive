// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @fileoverview Control blocks for Blockly, modified for App Inventor
 * @author fraser@google.com (Neil Fraser)
 * @author andrew.f.mckinney@gmail.com (Andrew F. McKinney)
 * Due to the frequency of long strings, the 80-column wrap rule need not apply
 * to language files.
 */

'use strict';

goog.provide('Blockly.Blocks.control');

goog.require('Blockly.Blocks.Utilities');

Blockly.Blocks['controls_if'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.appendValueInput('IF0')
        .appendField(Messages.if_);
    this.appendStatementInput('DO0')
        .appendField(Messages.then_);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['controls_if_elseif',
      'controls_if_else']));
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
  },
  domToMutation: function (xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0
    this.elseCount_ = window.parseInt(xmlElement.getAttribute('else'), 10) || 0;
    this.updateShape_();
  },
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('ELSE')) {
      this.removeInput('ELSE');
    }
    var i = 1;
    while (this.getInput('IF' + i)) {
      this.removeInput('IF' + i);
      this.removeInput('DO' + i);
      i++;
    }
    for (var i = 1; i <= this.elseifCount_; i++) {
      this.appendValueInput('IF' + i)
        .appendField(Messages.elseIf_);
      this.appendStatementInput('DO' + i)
        .appendField(Messages.then_);
    }
    if (this.elseCount_) {
      this.appendStatementInput('ELSE')
        .appendField(Messages.else_);
    }
  }
};

Blockly.Blocks['controls_forRange'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.appendValueInput('START')
        .appendField(Messages.forEach_)
        .appendField(new Blockly.FieldParameterName('number'))
        .appendField(Messages.from_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('END')
        .appendField(Messages.to__)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('STEP')
        .appendField(Messages.by_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('DO')
        .appendField(Messages.do_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['controls_forEach'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.appendValueInput('LIST')
        .appendField(Messages.forEach_)
        .appendField(new Blockly.FieldParameterName('item'))
        .appendField(Messages.inList_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('DO').appendField(Messages.do_);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['controls_while'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.appendValueInput('TEST')
        .appendField(Messages.while_)
        .appendField(Messages.test_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('DO')
        .appendField(Messages.do_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
};

Blockly.Blocks['controls_choose'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.setOutput(true, null);
    this.appendValueInput('TEST')
        .appendField(Messages.if__)
        .appendField('')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('THENRETURN')
        .appendField(Messages.then_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('ELSERETURN')
        .appendField(Messages.else_)
        .setAlign(Blockly.ALIGN_RIGHT);
  }
};

Blockly.Blocks['controls_do_then_return'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.appendStatementInput('STM')
        .appendField(Messages.do_);
    this.appendValueInput('VALUE')
        .appendField(Messages.result_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setOutput(true);
  }
};

Blockly.Blocks['controls_eval_but_ignore'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.appendValueInput('VALUE')
        .appendField(Messages.evaluateButIgnore_);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['controls_openAnotherScreen'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.appendValueInput('SCREEN')
        .appendField(Messages.openAnotherScreen_)
        .appendField(Messages.screenName_)
        .setAlign(Blockly.ALIGN_RIGHT)
    this.setPreviousStatement(true);
  }
};

Blockly.Blocks['controls_openAnotherScreenWithStartValue'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.appendValueInput('SCREENNAME')
        .appendField(Messages.oASWStartVal_)
        .appendField(Messages.screenName_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('STARTVALUE')
        .appendField(Messages.startValue_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
  }
};

Blockly.Blocks['controls_getStartValue'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.setOutput(true, null);
    this.appendDummyInput()
        .appendField(Messages.getSV_);
  }
};

Blockly.Blocks['controls_closeScreen'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.appendDummyInput()
        .appendField(Messages.closeScreen_);
    this.setPreviousStatement(true);
  }
};

Blockly.Blocks['controls_closeScreenWithValue'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.appendValueInput('SCREEN')
        .appendField(Messages.cSWValue_)
        .appendField(Messages.result_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
  }
};

Blockly.Blocks['controls_closeApplication'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.appendDummyInput().appendField(Messages.closeApp_);
    this.setPreviousStatement(true);
  }
};

Blockly.Blocks['controls_getPlainStartText'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.setOutput(true);
    this.appendDummyInput()
        .appendField(Messages.getPlainST_);
  }
};

Blockly.Blocks['controls_closeScreenWithPlainText'] = {
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.appendValueInput('TEXT')
        .appendField(Messages.cSWPText_)
        .appendField(Messages.text_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
  }
};

Blockly.Blocks['controls_break'] = {
  category: 'Control',
  init: function () {
    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.appendDummyInput()
        .appendField(Messages.break_);
    this.setPreviousStatement(true);
  }
};
