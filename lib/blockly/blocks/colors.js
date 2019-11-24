// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Color blocks for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 */

'use strict';

goog.provide('Blockly.Blocks.color');

goog.require('Blockly.Blocks.Utilities');

Blockly.Blocks['color_white'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#ffffff'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_light_gray'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#cccccc'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_gray'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#9E9E9E'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_blue_gray'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#607D8B'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_dark_gray'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#444444'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_black'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#000000'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_red'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#F34336'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_pink'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#E81E63'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_purple'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#9C27B0'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_deep_purple'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#673AB7'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_indigo'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#3F51B5'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_blue'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#2196F2'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_light_blue'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#03A9F3'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_cyan'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#00BCD3'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_teal'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#009688'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_green'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#4CAF50'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_light_green'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#8BC24A'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_lime'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#CCDB39'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_yellow'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#FEEA3B'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_amber'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#FEC007'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_orange'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#FE9800'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_deep_orange'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#FE5722'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_brown'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendDummyInput().appendField(new Blockly.FieldColour('#795548'), 'COLOR');
    this.setOutput(true);
  }
};

Blockly.Blocks['color_make_color'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendValueInput('COLORLIST')
      .appendField(Messages.makeColor_)
    this.setOutput(true);
  }
};

Blockly.Blocks['color_split_color'] = {
  init: function() {
    this.setColour(Blockly.COLOR_CATEGORY_HUE);
    this.appendValueInput('COLOR')
      .appendField(Messages.splitColor_)
    this.setOutput(true);
  }
};
