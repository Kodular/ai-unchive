import React, {useCallback, useEffect, useRef} from 'react';
import {getDescriptor} from "../utils";

declare global {
    const Blockly: any
    const BlocklyWorkspace: any
}

function BlocklyComponent({blocksDom}: { blocksDom: Element }) {
    const wsRef = useRef<typeof BlocklyWorkspace | null>(null);

    const blocklyDivRef = useCallback((blocklyDiv: HTMLDivElement) => {
        if (blocklyDiv) {
            if (!wsRef.current) {
                const ws = Blockly.inject(blocklyDiv, {
                    readOnly: true,
                    trashcan: false,
                    toolbox: false,
                    scrollbars: false,
                    // grid: {
                    //     spacing: 20,
                    //     length: 3,
                    //     colour: '#ccc',
                    //     snap: true,
                    // },
                    // zoom: {
                    //     controls: true,
                    //     // wheel: true,
                    //     startScale: 1.0,
                    //     maxScale: 3,
                    //     minScale: 0.3,
                    //     scaleSpeed: 1.2,
                    //     pinch: true,
                    // },
                });
                ws.translate(0, 0);
                ws.setScale(1);
                ws.scrollCenter();
                ws.getDescriptor = getDescriptor
                const block = Blockly.Xml.domToWorkspace(blocksDom, ws)

                // cleanUp the blockly workspace
                // ws.scrollCenter()

                wsRef.current = ws;

                console.log('created new workspace...');
            }

            if (wsRef.current) {
                console.log('resizing workspace...');

                let metrics = wsRef.current.getMetrics();
                // divRef.current.setAttribute(
                //     'style',
                //     `height: ${metrics.contentHeight}px; width: ${metrics.contentWidth}px;`
                // );

                wsRef.current.resizeContents();

                Blockly.svgResize(wsRef.current);
            }
        }

        // return () => {
        //     wsRef.current?.dispose();
        // }
    }, [wsRef, blocksDom]);

    return (
        <div ref={blocklyDivRef} className="blocklyDiv"/>
    );
}

export default BlocklyComponent;
