// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Dictionaries blocks for Blockly, modified for MIT App Inventor.
 * @author data1013@mit.edu (Danny Tang)
 */

import Blockly from 'blockly/core';
import {Messages} from "../../../../i18n/js/en.js";
import {DICTIONARY_CATEGORY_HUE} from "./utilities.ts";

Blockly.Blocks['dictionaries_create_with'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.setOutput(true);
    this.setMutator(new Blockly.Mutator(['dictionaries_mutator_pair']));
    this.emptyInputName = 'EMPTY';
    this.repeatingInputName = 'ADD';
  },
  mutationToDom: Blockly.mutationToDom,
  domToMutation: function (xmlElement) {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    const inputCount = xmlElement.getAttribute('items');
    if (inputCount === 0) {
      this.addEmptyInput();
    } else {
      for (let i = 0; i < inputCount; i++) {
        this.addInput(i);
      }
    }
  },

  addEmptyInput: function () {
    this.appendDummyInput(this.emptyInputName)
      .appendField(Messages.crEmptyDct_);
  },
  addInput: function (inputNum) {
    const input = this.appendValueInput(this.repeatingInputName + inputNum);
    if (inputNum === 0) {
      input.appendField(Messages.mkADct_);
    }
    return input;
  }
};

Blockly.Blocks['pair'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('KEY')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.key_);
    this.appendValueInput('VALUE')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.value_);
    this.setInputsInline(true);
  }
};

Blockly.Blocks['dictionaries_lookup'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('KEY')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.getVFor_)
      .appendField(Messages.key_);
    this.appendValueInput('DICT')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.inDct_);
    this.appendValueInput('NOTFOUND')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.orIfNFnd_);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['dictionaries_set_pair'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.appendValueInput('KEY')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.setVFor_)
      .appendField(Messages.key_);
    this.appendValueInput('DICT')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.inDct_);
    this.appendValueInput('VALUE')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.to__);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['dictionaries_delete_pair'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.appendValueInput('KEY')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.remEntFor_)
      .appendField(Messages.key_);
    this.appendValueInput('DICT')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.frmDct_);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['dictionaries_recursive_lookup'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('KEYS')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.getVlAtKPth_);
    this.appendValueInput('DICT')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.inDct_);
    this.appendValueInput('NOTFOUND')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.orIfNFnd_);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['dictionaries_recursive_set'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput('KEYS')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.setVlFrKPth_);
    this.appendValueInput('DICT')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.inDct_);
    this.appendValueInput('VALUE')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.to__);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['dictionaries_getters'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('DICT')
      .appendField(Messages.get_)
      .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'OP');
  }
};

Blockly.Blocks['dictionaries_getters'].OPERATORS = function () {
  return [[Messages.keys_, 'KEYS'],
    [Messages.values_, 'VALUES']];
};

Blockly.Blocks['dictionaries_get_values'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('DICT')
      .appendField(Messages.get_)
      .appendField(new Blockly.FieldDropdown(Blockly.Blocks.dictionaries_getters.OPERATORS), 'OP');
    this.setFieldValue('VALUES', "OP");
  }
};

Blockly.Blocks['dictionaries_is_key_in'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.appendValueInput('KEY')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.isKInDct_)
      .appendField(Messages.key_);
    this.appendValueInput('DICT')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.dict_);
    this.setOutput(true);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['dictionaries_length'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('DICT')
      .appendField(Messages.szOfDct_)
      .appendField(Messages.dict_);
  }
};

Blockly.Blocks['dictionaries_alist_to_dict'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('PAIRS')
      .appendField(Messages.lstOPrsTDct_)
      .appendField(Messages.pairs_);
  }
};

Blockly.Blocks['dictionaries_dict_to_alist'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('DICT')
      .appendField(Messages.dctTLstOPrs_)
      .appendField(Messages.dict_);
  }
};

Blockly.Blocks['dictionaries_copy'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('DICT')
      .appendField(Messages.copyDct_)
      .appendField(Messages.dict_);
  }
};

Blockly.Blocks['dictionaries_combine_dicts'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.appendValueInput('DICT1')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.mergeInto_)
      .appendField(Messages.dict_);
    this.appendValueInput('DICT2')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.from_)
      .appendField(Messages.dict_);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['dictionaries_walk_tree'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.appendValueInput('PATH')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.lstByWkngKPth_);
    this.appendValueInput('DICT')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.inDctOLst_);
    this.setOutput(true);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['dictionaries_walk_all'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.appendDummyInput('WALK')
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Messages.wlkAtAllLvl_);
    this.setOutput(true);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['dictionaries_is_dict'] = {
  category: 'Dictionaries',
  init: function () {
    this.setColour(DICTIONARY_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('THING')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.isADct_);
  }
};
