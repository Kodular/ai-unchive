// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Lists blocks for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */

'use strict';

goog.provide('Blockly.Blocks.lists');

goog.require('Blockly.Blocks.Utilities');

Blockly.Blocks['lists_create_with'] = {
  init: function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
    this.emptyInputName = 'EMPTY';
    this.repeatingInputName = 'ADD';
  },
  domToMutation: function(xmlElement) {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    var inputCount = xmlElement.getAttribute('items');
    if(inputCount == 0) {
      this.addEmptyInput();
    } else {
      for(var i = 0; i < inputCount; i++) {
        this.addInput(i);
      }
    }
  },
  addEmptyInput: function() {
    this.appendDummyInput(this.emptyInputName)
      .appendField(Messages.crEmptyList_);
  },
  addInput: function(inputNum) {
    var input = this.appendValueInput("LIST_ITEM" + inputNum);
    if(inputNum === 0){
      input.appendField(Messages.mkAList_);
    }
    return input;
  }
};

Blockly.Blocks['lists_add_items'] = {
  init: function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.appendValueInput('LIST')
      .appendField(Messages.adItsTList_)
      .appendField(Messages.list_);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['lists_add_items_item']));
    this.emptyInputName = null;
    this.repeatingInputName = 'ITEM';
  },
  domToMutation: function(xmlElement) {
    for(var i = 0; i < xmlElement.getAttribute('items'); i++) {
      this.addInput(i);
    }
  },
  addInput: function(inputNum){
    var input = this.appendValueInput(this.repeatingInputName + inputNum);
    input.appendField(Messages.item_).setAlign(Blockly.ALIGN_RIGHT);
    return input;
  }
};

Blockly.Blocks['lists_is_in'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.appendValueInput('ITEM')
      .appendField(Messages.iInList_)
      .appendField(Messages.thing_);
    this.appendValueInput('LIST')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.list_);
    this.setOutput(true);
    this.setInputsInline(false);
  }
};


Blockly.Blocks['lists_length'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('LIST')
      .appendField(Messages.lenOList_)
      .appendField(Messages.list_);
  }
};

Blockly.Blocks['lists_is_empty'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('LIST')
      .appendField(Messages.isLEmpty_)
      .appendField(Messages.list_);
  }
};

Blockly.Blocks['lists_pick_random_item'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('LIST')
      .appendField(Messages.pARanItem_)
      .appendField(Messages.list_);
  }
};

Blockly.Blocks['lists_position_in'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('ITEM')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.idxInList_)
      .appendField(Messages.thing_);
    this.appendValueInput('LIST')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.list_);
    this.setInputsInline(false);
  }
};


Blockly.Blocks['lists_select_item'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('LIST')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.selLiItem_)
      .appendField(Messages.list_);
    this.appendValueInput('NUM')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.index_);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['lists_insert_item'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.appendValueInput('LIST')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.insLiItem_)
      .appendField(Messages.list_);
    this.appendValueInput('INDEX')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.index_);
    this.appendValueInput('ITEM')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.item_);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['lists_replace_item'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.appendValueInput('LIST')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.repLiItem_)
      .appendField(Messages.list_);
    this.appendValueInput('NUM')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.index_);
    this.appendValueInput('ITEM')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.repl_);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['lists_remove_item'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.appendValueInput('LIST')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.remLiItem_)
      .appendField(Messages._list_);
    this.appendValueInput('INDEX')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.index_);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(false);
  }
};

Blockly.Blocks['lists_append_list'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.appendValueInput('LIST0')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.appToList_)
      .appendField(Messages.l1_);
    this.appendValueInput('LIST1')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.l2_);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(false);
  }
};


Blockly.Blocks['lists_copy'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('LIST')
      .appendField(Messages.cpyList_)
      .appendField(Messages.list_);
  }
};

Blockly.Blocks['lists_is_list'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('ITEM')
      .appendField(Messages.iAList_)
      .appendField(Messages.thing_);
  }
};

Blockly.Blocks['lists_reverse'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('LIST')
      .appendField(Messages.revList_)
      .appendField(Messages.list_);
  }
}

Blockly.Blocks['lists_to_csv_row'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('LIST')
      .appendField(Messages.lTCRow_)
      .appendField(Messages.list_);
  }
};

Blockly.Blocks['lists_to_csv_table'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('LIST')
      .appendField(Messages.lTCTab_)
      .appendField(Messages.list_);
  }
};

Blockly.Blocks['lists_from_csv_row'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('TEXT')
      .appendField(Messages.lFCRow_)
      .appendField(Messages.list_);
  }
};

Blockly.Blocks['lists_from_csv_table'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('TEXT')
      .appendField(Messages.lFCTab_)
      .appendField(Messages.list_);
  }
};

Blockly.Blocks['lists_lookup_in_pairs'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.setOutput(true);
    this.appendValueInput('KEY')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.lkIPrs_)
      .appendField(Messages.key_);
    this.appendValueInput('LIST')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.pairs_);
    this.appendValueInput('NOTFOUND')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.ntFnd_);
    this.setInputsInline(false);
  }
};


Blockly.Blocks['lists_join_with_separator'] = {
  init : function() {
    this.setColour(Blockly.LIST_CATEGORY_HUE);
    this.appendValueInput('SEPARATOR')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.joiIts_)
    this.appendValueInput('LIST')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Messages.list_);
    this.setInputsInline(false);
  }
};
