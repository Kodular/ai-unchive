// -*- mode: java; c-basic-offset: 2; -*-
// Copyright 2013-2014 MIT, All rights reserved
// Released under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
import {Block, COLLAPSE_CHARS} from "blockly";

/**
 * @fileoverview Block utilities for Blockly, modified for App Inventor
 * @author mckinney@mit.edu (Andrew F. McKinney)
 * @author hal@mit.edu (Hal Abelson)
 * @author fraser@google.com (Neil Fraser)
 * Due to the frequency of long strings, the 80-column wrap rule need not apply
 * to language files.
 */

export const HSV_SATURATION = 0.7;
export const CONTROL_CATEGORY_HUE = "#FFAB00";  // [177, 143, 53]
export const LOGIC_CATEGORY_HUE = "#43A047";  // [119, 171, 65]
export const MATH_CATEGORY_HUE = "#3949AB";  // [63, 113, 181]
export const TEXT_CATEGORY_HUE = "#D81B60";  // [179, 45, 94]
export const LIST_CATEGORY_HUE = "#039BE5";  // [73, 166, 212]
export const COLOR_CATEGORY_HUE = "#757575";  // [125, 125, 125]
export const DICTIONARY_CATEGORY_HUE = "#2D1799"; // [45, 23, 153]
export const VARIABLE_CATEGORY_HUE = "#F4511E";  // [208, 95, 45]
export const PROCEDURE_CATEGORY_HUE = "#5E35B1";  // [124, 83, 133]
export const COLOUR_EVENT = '#ffa726';
export const COLOUR_METHOD = PROCEDURE_CATEGORY_HUE;
export const COLOUR_GET = '#8bc24a';
export const COLOUR_SET = '#388e3c';
export const COLOUR_COMPONENT = '#8bc24a';

// Create a unique object to represent the type InstantInTime,
// used in the Clock component
export const InstantInTime = function () {
    return 'InstantInTime';
};


// Convert Yail types to Blockly types
// Yail types are represented by strings: number, text, list, any, ...
// Blockly types are represented by objects: Number, String, ...
// and by the string "COMPONENT"
// The Yail type 'any' is represented by Javascript null, to match
// Blockly's convention
export const YailTypeToBlocklyTypeMap: Record<string, { input: any, output: any }> = {
    'number': {
        input: "Number", output: ["Number", "String"]
    },
    'text': {
        input: "String", output: ["Number", "String"]
    },
    'boolean': {
        input: "Boolean", output: ["Boolean", "String"]
    },
    'list': {
        input: "Array", output: ["Array", "String"]
    },
    'component': {
        input: "COMPONENT", output: "COMPONENT"
    },
    'InstantInTime': {
        input: InstantInTime, output: InstantInTime
    },
    'any': {
        input: null, output: null
    }
    //add  more types here
};

export const OUTPUT = 1;
export const INPUT = 0;

export const YailTypeToBlocklyType = function (yail: string, inputOrOutput: typeof INPUT | typeof OUTPUT) {

    const inputOrOutputName = (inputOrOutput === OUTPUT ? "output" : "input");
    const bType = YailTypeToBlocklyTypeMap[yail][inputOrOutputName];

    if (bType !== null || yail === 'any') {
        return bType;
    } else {
        throw new Error("Unknown Yail type: " + yail + " -- YailTypeToBlocklyType");
    }
};


// Blockly doesn't wrap tooltips, so these can get too wide.  We'll create our own tooltip setter
// that wraps to length 60.

export const setTooltip = function (block: Block, tooltip: string) {
    block.setTooltip(wrapSentence(tooltip, 60));
};

// Wrap a string by splitting at spaces. Permit long chunks if there
// are no spaces.

export const wrapSentence = function (str: string, len: number): string {
    str = str.trim();
    if (str.length < len) return str;
    const place = (str.lastIndexOf(" ", len));
    if (place === -1) {
        return str.substring(0, len).trim() + wrapSentence(str.substring(len), len);
    } else {
        return str.substring(0, place).trim() + "\n" +
            wrapSentence(str.substring(place), len);
    }
};

// Change the text of collapsed blocks on rename
// Recurse to fix collapsed parents

export const MAX_COLLAPSE: number = 4;

export const renameCollapsed = function (block: Block, n: number) {
    if (n > MAX_COLLAPSE) return;
    if (block.isCollapsed()) {
        const COLLAPSED_INPUT_NAME = '_TEMP_COLLAPSED_INPUT';
        block.removeInput(COLLAPSED_INPUT_NAME);
        block.setCollapsed(false);
        const text = block.toString(COLLAPSE_CHARS);
        block.setCollapsed(true);
        block.appendDummyInput(COLLAPSED_INPUT_NAME).appendField(text);

        if (block.type.indexOf("procedures_call") !== -1) {
            block.moveInputBefore(COLLAPSED_INPUT_NAME, 'ARG0');
        }
    }

    let parentBlock = block.getParent();
    if (parentBlock !== null) {
        renameCollapsed(parentBlock, n + 1);
    }
}

// unicode multiplication symbol
export const times_symbol = '\u00D7';
