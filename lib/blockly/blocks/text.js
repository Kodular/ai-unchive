// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2017 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Text blocks for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */

'use strict';

goog.provide('Blockly.Blocks.text');
goog.require('Blockly.Blocks.Utilities');

Blockly.Blocks['text'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.appendDummyInput().appendField(Messages.lQuote_)
    .appendField(new Blockly.FieldTextBlockInput(''), 'TEXT')
    .appendField(Messages.rQuote_);
    this.setOutput(true);
  }
};

Blockly.Blocks['text_join'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.setOutput(true);
    this.setMutator(new Blockly.Mutator(['text_join_item']));
    this.repeatingInputName = 'ADD';
  },
  domToMutation: function(xmlElement) {
    for(var i = 0; i < xmlElement.getAttribute('items'); i++) {
      var input = this.addInput(i);
    }
  },
  addInput: function (inputNum) {
    var input = this.appendValueInput(this.repeatingInputName + inputNum).setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("text", Blockly.Blocks.Utilities.INPUT));
    if (inputNum === 0) {
      input.appendField(Messages.join_);
    }
    return input;
  },
};

Blockly.Blocks['text_length'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('VALUE')
        .appendField(Messages.length_);
  }
};

Blockly.Blocks['text_isEmpty'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('VALUE')
        .appendField(Messages.isEmpty_);
  }
};

Blockly.Blocks['text_is_string'] = {
  init: function() {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.appendValueInput('ITEM')
      .appendField(Messages.LANG_TEXT_TEXT_IS_STRING_TITLE);
    this.setOutput(true);
  }
};

Blockly.Blocks['text_compare'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('TEXT1')
        .appendField(Messages.compareTxts_);
    this.appendValueInput('TEXT2')
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
    this.setInputsInline(true);
  }
};

Blockly.Blocks.text_compare.OPERATORS = function () {
  return [
    [Messages.lt__, 'LT'], [Messages.eq__, 'EQUAL'], [Messages.neq_, 'NEQ'], [Messages.gt__, 'GT']
  ]
};

Blockly.Blocks['text_trim'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('TEXT')
        .appendField(Messages.trim_);
  }
};

Blockly.Blocks['text_changeCase'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('TEXT')
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
  }
};

Blockly.Blocks.text_changeCase.OPERATORS = function () {
  return [
    [Messages.upcase_, 'UPCASE'], [Messages.downcase_, 'DOWNCASE']
  ]
};

Blockly.Blocks['text_starts_at'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.setOutput(true);

    this.appendDummyInput()
      .appendField('starts at');
    this.appendValueInput('TEXT')
      .appendField('text')
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('PIECE')
      .appendField('piece')
      .setAlign(Blockly.ALIGN_RIGHT);

    this.setInputsInline(false);
  }
};

Blockly.Blocks['text_contains'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.setOutput(true);
    this.appendDummyInput()
      .appendField('contains');
    this.appendValueInput('TEXT')
      .appendField('text')
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('PIECE')
      .appendField('piece')
      .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['text_split'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('TEXT')
        .appendField(new Blockly.FieldDropdown(this.OPERATORS, Blockly.Blocks.text_split.dropdown_onchange), 'OP')
        .appendField(Messages.text_);
    this.appendValueInput('AT')
        .appendField(Messages.at_, 'ARG2_NAME')
        .setAlign(Blockly.ALIGN_RIGHT);
  },
  domToMutation: function (xmlElement) {
    var mode = xmlElement.getAttribute('mode');
    Blockly.Blocks.text_split.adjustToMode(mode, this);
  }
};

Blockly.Blocks.text_split.adjustToMode = function (mode, block) {
  if (mode == 'SPLITATFIRST' || mode == 'SPLIT') {
    block.getInput("AT");
    block.setFieldValue(Messages.at_, 'ARG2_NAME');
  } else if (mode == 'SPLITATFIRSTOFANY' || mode == 'SPLITATANY') {
    block.getInput("AT");
    block.setFieldValue(Messages.atList_, 'ARG2_NAME');
  }
};

Blockly.Blocks.text_split.OPERATORS = function () {
  return [
    [Messages.sp_, 'SPLIT'],
    [Messages.spAtFirst_, 'SPLITATFIRST'],
    [Messages.spAtAny_, 'SPLITATANY'],
    [Messages.spAtFoAny_, 'SPLITATFIRSTOFANY']
  ]
};

Blockly.Blocks['text_split_at_spaces'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('TEXT')
        .appendField(Messages.spAtSpc_);
  }
};

Blockly.Blocks['text_segment'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.setOutput(true);

    this.appendDummyInput()
      .appendField('segment');
    this.appendValueInput('TEXT')
      .appendField('text')
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('START')
      .appendField('start')
      .setAlign(Blockly.ALIGN_RIGHT);
      this.appendValueInput('LENGTH')
        .appendField('length')
        .setAlign(Blockly.ALIGN_RIGHT);

    this.setInputsInline(false);
  }
};

Blockly.Blocks['text_replace_all'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.setOutput(true);

    this.appendDummyInput()
      .appendField('replace all');
    this.appendValueInput('TEXT')
      .appendField('text')
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('SEGMENT')
      .appendField('segment')
      .setAlign(Blockly.ALIGN_RIGHT);
      this.appendValueInput('REPLACEMENT')
        .appendField('replacement')
        .setAlign(Blockly.ALIGN_RIGHT);

    this.setInputsInline(false);
  }
};

Blockly.Blocks['obfuscated_text'] = {
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.appendDummyInput()
      .appendField(Messages.obfsText_ + " " + Messages.lQuote_)
      .appendField(new Blockly.FieldTextBlockInput(''), 'TEXT')
      .appendField(Messages.rQuote_);
    this.setOutput(true);
    this.confounder = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
  },
  domToMutation: function(xmlElement) {
    var confounder = xmlElement.getAttribute('confounder');
    this.confounder = confounder;
  }
};
