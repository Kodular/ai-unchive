// -*- mode: java; c-basic-offset: 2; -*-
// Copyright © 2013-2018 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
/**
 * @license
 * @fileoverview Component blocks for Blockly, modified for MIT App Inventor.
 * @author mckinney@mit.edu (Andrew F. McKinney)
 * @author sharon@google.com (Sharon Perl)
 * @author ewpatton@mit.edu (Evan W. Patton)
 */

import Blockly from 'blockly/core';
import {Messages} from "../../../../i18n/js/en.js";
import {FieldParameterDropdown} from "../fields/field_param_dropdown.js";
import {FieldParameterName} from "../fields/field_param_name.js";
import {getDescriptor} from "../../../utils.ts";
import {INPUT, OUTPUT, YailTypeToBlocklyType} from "./utilities.ts";

Blockly.Blocks.components = {};

export const COLOUR_EVENT = '#ffa726';
export const COLOUR_METHOD = '#5E35B1';
export const COLOUR_GET = '#8bc24a';
export const COLOUR_SET = '#388e3c';
export const COLOUR_COMPONENT = '#8bc24a';

export const COMPONENT_SELECTOR = "COMPONENT_SELECTOR";

/**
 * Create an event block of the given type for a component with the given
 * instance name. eventType is one of the "events" objects in a typeJsonString
 * passed to Blockly.Component.add.
 * @lends {Blockly.BlockSvg}
 * @lends {Blockly.Block}
 */
Blockly.Blocks['component_event'] = {
  category : 'Component',
  blockType : 'event',

  domToMutation : function(xmlElement) {
    const oldRendered = this.rendered;
    this.rendered = false;
    let oldDo = null;
    for (var i = 0, input; input = this.inputList[i]; i++) {
      if (input.connection) {
        if (input.name === 'DO') {
          oldDo = input.connection.targetBlock();
        }
        const block = input.connection.targetBlock();
        if (block) {
          block.unplug();
        }
      }
      input.dispose();
    }
    this.inputList.length = 0;

    this.typeName = xmlElement.getAttribute('component_type');
    this.eventName = xmlElement.getAttribute('event_name');
    this.isGeneric = xmlElement.getAttribute('is_generic') === 'true';
    if (!this.isGeneric) {
      this.instanceName = xmlElement.getAttribute('instance_name');//instance name not needed
    } else {
      delete this.instanceName;
    }

    // Orient parameters horizontally by default
    const horizParams = xmlElement.getAttribute('vertical_parameters') !== "true";

    this.setColour(COLOUR_EVENT);

    if (!this.isGeneric) {
      this.appendDummyInput('WHENTITLE').appendField(Messages.when_)
        .appendField(new FieldParameterDropdown(this.instanceName), COMPONENT_SELECTOR)
        .appendField('.' + (Messages[this.eventName + 'Events'] || this.eventName));
      this.componentDropDown = new FieldParameterDropdown(this.instanceName);
    } else {
      this.appendDummyInput('WHENTITLE').appendField(Messages.whenAny_
        + this.typeName + '.' + (Messages[this.eventName + 'Events'] || this.eventName));
    }
    this.setParameterOrientation(horizParams);

    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);

    if (oldDo) {
      this.getInput('DO').connection.connect(oldDo.previousConnection);
    }

    for (var i = 0, input; input = this.inputList[i]; i++) {
      input.init();
    }

    this.rendered = oldRendered;
  },
  // [lyn, 10/24/13] Allow switching between horizontal and vertical display of arguments
  // Also must create flydown params and DO input if they don't exist.

  // To-DO: consider using top.BlocklyPanel... instead of window.parent.BlocklyPanel

  setParameterOrientation: function(isHorizontal) {
    let params = this.getParameters();
    if (!params)  {
      params = [];
    }
    const oldDoInput = this.getInput("DO");
    if (!oldDoInput || (isHorizontal !== this.horizontalParameters && params.length > 0)) {
      this.horizontalParameters = isHorizontal;

      let bodyConnection = null, i, param, newDoInput;
      if (oldDoInput) {
        bodyConnection = oldDoInput.connection.targetConnection; // Remember any body connection
      }
      if (this.horizontalParameters) { // Replace vertical by horizontal parameters

        if (oldDoInput) {
          // Remove inputs after title ...
          for (i = 0; i < params.length; i++) {
            this.removeInput('VAR' + i); // vertical parameters
          }
          this.removeInput('DO');
        }

        // .. and insert new ones:
        if (params.length > 0) {
          const paramInput = this.appendDummyInput('PARAMETERS')
            .appendField(" ")
            .setAlign(Blockly.ALIGN_LEFT);
          for (i = 0; param = params[i]; i++) {
            paramInput.appendField(new FieldParameterName(Messages[param.name + 'Params']|| param.name), // false means not editable
              'VAR' + i)
              .appendField(" ");
          }
        }

        newDoInput = this.appendStatementInput("DO")
          .appendField(Messages.do_); // Hey, I like your new do!
        if (bodyConnection) {
          newDoInput.connection.connect(bodyConnection);
        }

      } else { // Replace horizontal by vertical parameters

        if (oldDoInput) {
          // Remove inputs after title ...
          this.removeInput('PARAMETERS'); // horizontal parameters
          this.removeInput('DO');
        }

        // .. and insert new ones:

        // Vertically aligned parameters
        for (i = 0; param = params[i]; i++) {
          this.appendDummyInput('VAR' + i)
            .appendField(new FieldParameterName(param.name),
              'VAR' + i)
            .setAlign(Blockly.ALIGN_RIGHT);
        }
        newDoInput = this.appendStatementInput("DO")
          .appendField(Messages.do_);
        if (bodyConnection) {
          newDoInput.connection.connect(bodyConnection);
        }
      }
      if (Blockly.Events.isEnabled()) {
        // Trigger a Blockly UI change event
        Blockly.Events.fire(new Blockly.Events.Ui(this, 'parameter_orientation',
          (!this.horizontalParameters).toString(), this.horizontalParameters.toString()))
      }
    }
  },
  // Return a list of parameter names
  getParameters: function () {
    this.descriptor = this.getDescriptor(this.typeName);
    const params = this.descriptor.events.find(function (x) {
      return x.name === this.eventName
    }.bind(this)).params;
    if (this.isGeneric) {
      return [
        {name:'component', type:'component'},
        {name:'notAlreadyHandled', type: 'boolean'}
      ].concat(params || []);
    }
    return params || [];
  },

  getDescriptor: function(componentType) {
    return getDescriptor(componentType);
  }
};

/**
 * Create a method block of the given type for a component with the given instance name. methodType
 * is one of the "methods" objects in a typeJsonString passed to Blockly.Component.add.
 * @lends {Blockly.BlockSvg}
 * @lends {Blockly.Block}
 */
Blockly.Blocks['component_method'] = {
  category : 'Component',

  domToMutation : function(xmlElement) {
    const oldRendered = this.rendered;
    this.rendered = false;
    const oldInputValues = [];
    for (var i = 0, input; input = this.inputList[i]; i++) {
      if (input.connection) {
        const block = input.connection.targetBlock();
        if (block) {
          block.unplug();
        }
        oldInputValues.push(block);
      } else {
        oldInputValues.push(null);
      }
      input.dispose();
    }
    this.inputList.length = 0;

    this.typeName = xmlElement.getAttribute('component_type');
    this.methodName = xmlElement.getAttribute('method_name');
    const isGenericString = xmlElement.getAttribute('is_generic');
    this.isGeneric = isGenericString === 'true';
    if(!this.isGeneric) {
      this.instanceName = xmlElement.getAttribute('instance_name');//instance name not needed
    } else {
      delete this.instanceName;
    }

    this.setColour(COLOUR_METHOD);

    //for non-generic blocks, set the value of the component drop down
    if(!this.isGeneric) {
      this.componentDropDown = new FieldParameterDropdown(this.instanceName);
    }

    if(!this.isGeneric) {
      if (this.typeName === "Clock" && isClockMethodName(this.methodName)) {
        const timeUnitDropDown = createClockAddDropDown();
        this.appendDummyInput()
          .appendField(Messages.call_)
          .appendField(new FieldParameterDropdown(this.instanceName), COMPONENT_SELECTOR)
          .appendField('.Add')
          .appendField(timeUnitDropDown, "TIME_UNIT");
        switch (this.methodName){
          case "AddYears":
            this.setFieldValue('Years', "TIME_UNIT");
            break;
          case "AddMonths":
            this.setFieldValue('Months', "TIME_UNIT");
            break;
          case "AddWeeks":
            this.setFieldValue('Weeks', "TIME_UNIT");
            break;
          case "AddDays":
            this.setFieldValue('Days', "TIME_UNIT");
            break;
          case "AddHours":
            this.setFieldValue('Hours', "TIME_UNIT");
            break;
          case "AddMinutes":
            this.setFieldValue('Minutes', "TIME_UNIT");
            break;
          case "AddSeconds":
            this.setFieldValue('Seconds', "TIME_UNIT");
            break;
          case "AddDuration":
            this.setFieldValue('Duration', "TIME_UNIT");
            break;
        }
      } else {
        this.appendDummyInput()
          .appendField(Messages.call_)
          .appendField(new FieldParameterDropdown(this.instanceName), COMPONENT_SELECTOR)
          .appendField('.' + (Messages[this.methodName + 'Methods'] || this.methodName));
      }
    } else {
      this.appendDummyInput()
        .appendField(Messages.call_ + this.typeName + '.' + this.methodName);
      this.appendValueInput("COMPONENT")
        .appendField(Messages.forComponent_)
        .setAlign(Blockly.ALIGN_RIGHT);
    }

    let params = [];
    const descriptor = this.getDescriptor(this.typeName);
    if (descriptor) {
      params = descriptor.params;
    }
    oldInputValues.splice(0, oldInputValues.length - params.length);
    for (var i = 0, param; param = params[i]; i++) {
      const newInput = this.appendValueInput("ARG" + i).appendField(Messages[param.name + 'Params'] || param.name);
      newInput.setAlign(Blockly.ALIGN_RIGHT);
      const blockyType = YailTypeToBlocklyType(param.type, INPUT);
      if (oldInputValues[i]) {
        Blockly.Mutator.reconnect(oldInputValues[i].outputConnection, this, 'ARG' + i);
      }
    }

    for (var i = 0, input; input = this.inputList[i]; i++) {
      input.init();
    }

    if (!descriptor) {
      this.setOutput(false);
      this.setPreviousStatement(false);
      this.setNextStatement(false);
    } // methodType.returnType is a Yail type
    else if (descriptor.returnType) {
      this.setOutput(true, YailTypeToBlocklyType(descriptor.returnType,OUTPUT));
    } else {
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }


    this.rendered = oldRendered;
  },

  /**
   * Get a mapping from input names to {@link Blockly.Input}s.
   * @returns {Object.<string, !Blockly.Input>}}
   */
  getArgInputs: function() {
    const argList = {};
    let i = 0, input;
    for (; input = this.getInput('ARG' + i); i++) {
      if (input.fieldRow.length === 1) {  // should only be 0 or 1
        argList[input.fieldRow[0].getValue()] = input;
      }
    }
    return argList;
  },

  /**
   * Get an array of argument names in the block.
   * @returns {Array.<string>}
   */
  getArgs: function() {
    const argList = [];
    let i = 0, input;
    for (; input = this.getInput('ARG' + i); i++) {
      if (input.fieldRow.length === 1) {  // should only be 0 or 1
        argList.push(input.fieldRow[0].getValue());
      }
    }
    return argList;
  },

  getDescriptor: function(componentType) {
    const descriptor = getDescriptor(componentType);
    if(descriptor === undefined)
      throw ReferenceError('No descriptor found for ' + componentType);
    const method = descriptor.methods.find(function (x) {
      return x.name === this.methodName
    }.bind(this));
    if(method === undefined)
      throw ReferenceError(`Attempt to get ${this.methodName} No such method exists`);
    return method;
  }

};


/**
 * Create a property getter or setter block for a component with the given
 * instance name. Blocks can also be generic or not, depending on the
 * values of the attribute in the mutators.
 * @lends {Blockly.BlockSvg}
 * @lends {Blockly.Block}
 */
Blockly.Blocks['component_set_get'] = {
  category : 'Component',

  init: function() {
    ;
  },

  domToMutation : function(xmlElement) {
    const oldRendered = this.rendered;
    this.rendered = false;
    const oldInput = this.setOrGet === "set" && this.getInputTargetBlock('VALUE');
    for (var i = 0, input; input = this.inputList[i]; i++) {
      if (input.connection) {
        const block = input.connection.targetBlock();
        if (block) {
          if (block.isShadow()) {
            block.dispose();
          } else {
            block.unplug();
          }
        }
      }
      input.dispose();
    }
    this.inputList.length = 0;
    this.typeName = xmlElement.getAttribute('component_type');
    this.setOrGet = xmlElement.getAttribute('set_or_get');
    this.propertyName = xmlElement.getAttribute('property_name');
    const isGenericString = xmlElement.getAttribute('is_generic');
    this.isGeneric = isGenericString === "true";
    if(!this.isGeneric) {
      this.instanceName = xmlElement.getAttribute('instance_name');//instance name not needed
    } else {
      delete this.instanceName;
    }
    if(this.setOrGet === "set"){
      this.setColour(COLOUR_SET);
    } else {
      this.setColour(COLOUR_GET);
    }

    const thisBlock = this;
    const dropdown = new Blockly.FieldDropdown(
      function () {
        return [[Messages[this.propertyName + 'Properties'] || this.propertyName, this.propertyName]];
      }.bind(this),
      // change the output type and tooltip to match the new selection
      function (selection) {
        ;
      }
    );

    if(this.setOrGet === "get") {
      //add output plug for get blocks
      this.setOutput(true);

      if(!this.isGeneric) {
        //non-generic get
        this.appendDummyInput()
          .appendField(new FieldParameterDropdown(this.instanceName), COMPONENT_SELECTOR)
          .appendField('.')
          .appendField(dropdown, "PROP");
      } else {
        //generic get
        this.appendDummyInput()
          .appendField(Messages[this.typeName[0].toLowerCase() + this.typeName.slice(1) + 'ComponentPallette'] || this.typeName + '.')
          .appendField(dropdown, "PROP");

        this.appendValueInput("COMPONENT")
          .appendField(Messages.ofComponent_)
          .setAlign(Blockly.ALIGN_RIGHT);
      }
    } else { //this.setOrGet == "set"
      //a notches for set block
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      if(!this.isGeneric) {
        this.appendValueInput("VALUE")
          .appendField(Messages.set_)
          .appendField(new FieldParameterDropdown(this.instanceName), COMPONENT_SELECTOR)
          .appendField('.')
          .appendField(dropdown, "PROP")
          .appendField(Messages.to_);
      } else {
        //generic set
        this.appendDummyInput()
          .appendField(Messages.set_ + ' ' +
            (Messages[this.typeName[0].toLowerCase() + this.typeName.slice(1) + 'ComponentPallette'] || this.typeName) + '.')
          .appendField(dropdown, "PROP");

        this.appendValueInput("COMPONENT")
          .appendField(Messages.ofComponent_)
          .setAlign(Blockly.ALIGN_RIGHT);

        this.appendValueInput("VALUE")
          .appendField(Messages.to_)
          .setAlign(Blockly.ALIGN_RIGHT);
      }
    }

    if (oldInput) {
      this.getInput('VALUE').init();
      Blockly.Mutator.reconnect(oldInput.outputConnection, this, 'VALUE');
    }

    //for non-generic blocks, set the value of the component drop down
    if(!this.isGeneric) {
      this.componentDropDown = new FieldParameterDropdown(this.instanceName);
    }
    //set value of property drop down
    this.setFieldValue(this.propertyName,"PROP");

    for (var i = 0, input; input = this.inputList[i]; i++) {
      input.init();
    }

    this.rendered = oldRendered;
  },

  getPropertyBlocklyType : function(propertyName,inputOrOutput) {
    let yailType = "any"; // necessary for undefined propertyObject
    if (this.getPropertyObject(propertyName)) {
      yailType = this.getPropertyObject(propertyName).type;
    }
    return YailTypeToBlocklyType(yailType,inputOrOutput);
  },

  getDescriptor: function(componentType) {
    return this.workspace.getDescriptor(componentType).methods.find(function() {return x.name === this.propertyName}.bind(this));
  }

};

/**
 * Create a component (object) block for a component with the given
 * instance name.
 * @lends {Blockly.BlockSvg}
 * @lends {Blockly.Block}
 */
Blockly.Blocks['component_component_block'] = {
  category : 'Component',
  domToMutation : function(xmlElement) {

    this.typeName = xmlElement.getAttribute('component_type');
    this.instanceName = xmlElement.getAttribute('instance_name');

    this.setColour(COLOUR_COMPONENT);

    this.appendDummyInput().appendField(new FieldParameterDropdown(this.instanceName), COMPONENT_SELECTOR);
    this.setOutput(true, [this.typeName,"COMPONENT"]);
  }

};

export const timeUnits = ["Years", "Months", "Weeks", "Days", "Hours", "Minutes", "Seconds", "Duration"];
export const timeUnitsMenu =
  [[ Messages.years_, "Years"],
    [ Messages.months_, "Months"],
    [ Messages.weeks_, "Weeks"],
    [ Messages.days_, "Days"],
    [ Messages.hours_, "Hours"],
    [ Messages.minutes_, "Minutes"],
    [ Messages.seconds_, "Seconds"],
    [ Messages.duration_, "Duration"]
  ];

export const clockMethodNames = ["AddYears", "AddMonths","AddWeeks", "AddDays",
  "AddHours", "AddMinutes", "AddSeconds", "AddDuration"];
export const isClockMethodName =  function  (name) {
  return clockMethodNames.indexOf(name) !== -1;
};

export const createClockAddDropDown = function(/*block*/){
  const componentDropDown = new Blockly.FieldDropdown([["", ""]]);
  componentDropDown.menuGenerator_ = function(){ return timeUnitsMenu; };
  return componentDropDown;
};
