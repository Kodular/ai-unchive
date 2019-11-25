// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Math blocks for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */

'use strict';

goog.provide('Blockly.Blocks.math');

goog.require('Blockly.Blocks.Utilities');

Blockly.Blocks['math_number'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.appendDummyInput().appendField(
        new Blockly.FieldTextInput('0'), 'NUM');
    this.setOutput(true);
  }
};

Blockly.Blocks['math_compare'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
    this.setInputsInline(true);
  }
};

Blockly.Blocks.math_compare.OPERATORS = function () {
  return [[Messages.eq_, 'EQ'],
    [Messages.neq_, 'NEQ'],
    [Messages.lt_, 'LT'],
    [Messages.lte_, 'LTE'],
    [Messages.gt_, 'GT'],
    [Messages.gte_, 'GTE']];
};

Blockly.Blocks['math_add'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.setInputsInline(true);

    this.setMutator(new Blockly.Mutator(['math_mutator_item']));
    this.emptyInputName = 'EMPTY';
    this.repeatingInputName = 'NUM';
  },
  domToMutation: function(xmlElement) {
    for(var i = 0; i < xmlElement.getAttribute('items'); i++) {
      this.addInput(i);
    }
  },
  addInput: function (inputNum) {
    var input = this.appendValueInput(this.repeatingInputName + inputNum);
    if (inputNum !== 0) {
      input.appendField(Messages.add_);
    }
    return input;
  }
};

Blockly.Blocks['math_subtract'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(Messages.sub_);
    this.setInputsInline(true);
  }
};

Blockly.Blocks['math_multiply'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.setInputsInline(true);


    this.setMutator(new Blockly.Mutator(['math_mutator_item']));
    this.emptyInputName = 'EMPTY';
    this.repeatingInputName = 'NUM';
  },
  domToMutation: function(xmlElement) {
    for(var i = 0; i < xmlElement.getAttribute('items'); i++) {
      this.addInput(i);
    }
  },
  addInput: function (inputNum) {
    var input = this.appendValueInput(this.repeatingInputName + inputNum)
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT));
    if (inputNum !== 0) {
      input.appendField(Blockly.Blocks.Utilities.times_symbol);
    }
    return input;
  }
};

Blockly.Blocks['math_division'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(Messages.div_);
    this.setInputsInline(true);
  }
};

Blockly.Blocks['math_power'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(Messages.pow_);
    this.setInputsInline(true);
  }
};


Blockly.Blocks['math_bitwise'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.setInputsInline(false);

    this.setMutator(new Blockly.Mutator(['math_mutator_item']));
    this.repeatingInputName = 'NUM';
  },
  domToMutation: function(xmlElement) {
    for(var i = 0; i < xmlElement.getAttribute('items'); i++) {
      var input = this.addInput(i);

    }
  },
  addInput: function (inputNum) {
    var input = this.appendValueInput(this.repeatingInputName + inputNum)
        .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("number", Blockly.Blocks.Utilities.INPUT));
    if (inputNum == 0) {
      input.appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
      this.setFieldValue(this.valuesToSave['OP'], 'OP');
    }
    return input;
  }
};

Blockly.Blocks.math_bitwise.OPERATORS = function () {
  return [[Messages.bAnd_, 'BITAND'],
    [Messages.bOr_, 'BITIOR'],
    [Messages.bXor_, 'BITXOR']]
};

Blockly.Blocks['math_random_int'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('FROM')
     .appendField(Messages.randomInt_)
     .appendField(Messages.from_);
     this.appendValueInput('TO')
     .appendField(Messages.to__);
    this.setInputsInline(true);
  }
};

Blockly.Blocks['math_random_float'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendDummyInput()
        .appendField(Messages.randomFrac_);
  }
};

Blockly.Blocks['math_random_set_seed'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(false);
    this.appendValueInput('NUM')
        .appendField(Messages.randomSetSeed_)
        .appendField(Messages.to__);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['math_on_list'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.setInputsInline(false);
    this.setMutator(new Blockly.Mutator(['math_mutator_item']));
    this.repeatingInputName = 'NUM';
  },
  domToMutation: function(xmlElement) {
    for(var i = 0; i < xmlElement.getAttribute('items'); i++) {
      var input = this.addInput(i);
    }
  },
  addInput: function (inputNum) {
    var input = this.appendValueInput(this.repeatingInputName + inputNum);
    if (inputNum == 0) {
      input.appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
      this.setFieldValue(this.valuesToSave['OP'], 'OP');
    }
    return input;
  }
};

Blockly.Blocks.math_on_list.OPERATORS = function () {
  return [[Messages.min_, 'MIN'],
    [Messages.max_, 'MAX']]
};

Blockly.Blocks['math_single'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('NUM')
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
  }
};

Blockly.Blocks.math_single.OPERATORS = function () {
  return [[Messages.sqRoot_, 'ROOT'],
    [Messages.abs_, 'ABS'],
    [Messages.neg_, 'NEG'],
    [Messages.log_, 'LN'],
    [Messages.exp_, 'EXP'],
    [Messages.round_, 'ROUND'],
    [Messages.ceil_, 'CEILING'],
    [Messages.floor_, 'FLOOR']];
};

Blockly.Blocks['math_abs'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('NUM')
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_single.OPERATORS), 'OP');
    this.setFieldValue('ABS', "OP");
  }
};

Blockly.Blocks['math_neg'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('NUM')
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_single.OPERATORS), 'OP');
    this.setFieldValue('NEG', "OP");
  }
};

Blockly.Blocks['math_round'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('NUM')
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_single.OPERATORS), 'OP');
    this.setFieldValue('ROUND', "OP");
  }
};

Blockly.Blocks['math_ceiling'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('NUM')
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_single.OPERATORS), 'OP');
    this.setFieldValue('CEILING', "OP");
  }
};

Blockly.Blocks['math_floor'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('NUM')
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_single.OPERATORS), 'OP');
    this.setFieldValue('FLOOR', "OP");
  }
};

Blockly.Blocks['math_divide'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('DIVIDEND')
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
    this.appendValueInput('DIVISOR')
        .appendField(Messages.div_);
    this.setInputsInline(true);
  }
};

Blockly.Blocks.math_divide.OPERATORS = function () {
  return [[Messages.moduloOf_, 'MODULO'],
    [Messages.remainderOf_, 'REMAINDER'],
    [Messages.quotientOf_, 'QUOTIENT']];
};

Blockly.Blocks['math_trig'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('NUM')
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
  }
};

Blockly.Blocks.math_trig.OPERATORS = function () {
  return [[Messages.sin_, 'SIN'],
    [Messages.cos_, 'COS'],
    [Messages.tan_, 'TAN'],
    [Messages.asin_, 'ASIN'],
    [Messages.acos_, 'ACOS'],
    [Messages.atan_, 'ATAN']];
}

Blockly.Blocks['math_cos'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('NUM')
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_trig.OPERATORS), 'OP');
    this.setFieldValue('COS', "OP");
  }
};

Blockly.Blocks['math_tan'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('NUM')
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.math_trig.OPERATORS), 'OP');
    this.setFieldValue('TAN', "OP");
  }
};

Blockly.Blocks['math_atan2'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendDummyInput().appendField(Messages.atan2_);
    this.appendValueInput('Y')
        .appendField(Messages.y_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('X')
        .appendField(Messages.x_)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['math_convert_angles'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('NUM')
        .appendField(Messages.convert_)
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
  }
};

Blockly.Blocks.math_convert_angles.OPERATORS = function () {
  return [[Messages.radToDeg_, 'RADIANS_TO_DEGREES'],
    [Messages.degToRad_, 'DEGREES_TO_RADIANS']]
};

Blockly.Blocks['math_format_as_decimal'] = {
  init: function () {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);

    this.appendDummyInput()
      .appendField(Messages.formatAsDec_);
    this.appendValueInput('NUM')
      .appendField(Messages.number_)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('PLACES')
      .appendField(Messages.places_)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['math_is_a_number'] = {
  init : function() {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('NUM')
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
  }
};

Blockly.Blocks.math_is_a_number.OPERATORS =
  [[ Messages.isNum_, 'NUMBER' ],
   [ Messages.isBs10_, 'BASE10' ],
   [ Messages.isHex_, 'HEXADECIMAL' ],
   [ Messages.isBin_, 'BINARY' ]];


Blockly.Blocks['math_convert_number'] = {
  init : function() {
    this.setColour(Blockly.MATH_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('NUM')
        .appendField(Messages.convertNum_)
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
  }
};

Blockly.Blocks.math_convert_number.OPERATORS =
  [[ Messages.b10THex_, 'DEC_TO_HEX' ],
   [ Messages.hexTB10_, 'HEX_TO_DEC' ],
   [ Messages.b10TBin_, 'DEC_TO_BIN' ],
   [ Messages.binTB10_, 'BIN_TO_DEC' ]];
