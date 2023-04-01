/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Blockly React Component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import React, {useEffect, useRef} from 'react';

import Blockly, {BlocklyOptions, WorkspaceSvg} from 'blockly/core';
import locale from 'blockly/msg/en';
import 'blockly/blocks.js';
import './blocks/colors.js';
import './blocks/components.js';
import './blocks/control.js';
import './blocks/dictionaries.js';
import './blocks/helpers.js'
import './blocks/lexical-variables.js'
import './blocks/lists.js'
import './blocks/logic.js'
import './blocks/math.js'
import './blocks/procedures.js'
import './blocks/text.js'

Blockly.setLocale(locale);

function BlocklyComponent(props: React.PropsWithChildren<{ initialXml: string } & BlocklyOptions>) {
    const ws = useRef<WorkspaceSvg | null>(null);

    useEffect(() => {
        const {initialXml, children, ...blocklyOptions} = props;

        if (!ws.current) {
            console.log('creating new workspace...');
            const newWs = Blockly.inject(
                "blocklyDiv",
                blocklyOptions,
            );
            Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(initialXml), newWs);
            ws.current = newWs;
        }

        // return () => {
        //     ws.current?.dispose();
        // }
    }, [ws, props]);

    return (
        <div id="blocklyDiv"/>
    );
}

export default BlocklyComponent;
