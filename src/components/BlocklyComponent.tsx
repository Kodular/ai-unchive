import React, {useEffect, useRef} from 'react';
import {getDescriptor} from "../utils";

declare global {
    const Blockly: any
    const BlocklyWorkspace: any
}

function BlocklyComponent({blocksDom}: { blocksDom: Element }) {
    const divRef = useRef<HTMLDivElement | null>(null);
    const wsRef = useRef<typeof BlocklyWorkspace | null>(null);

    useEffect(() => {
        if (divRef.current) {
            if (!wsRef.current) {
                const newWs = Blockly.inject(divRef.current, {
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
                newWs.setScale(1)
                newWs.getDescriptor = getDescriptor
                Blockly.Xml.domToBlock(blocksDom, newWs).setCollapsed(false)

                wsRef.current = newWs;

                console.log('created new workspace...');
            }

            if (wsRef.current) {
                console.log('resizing workspace...');

                let metrics = wsRef.current.getMetrics();
                divRef.current.setAttribute(
                    'style',
                    `height: ${metrics.contentHeight}px; width: ${metrics.contentWidth}px;`
                );

                Blockly.svgResize(wsRef.current);
            }
        }

        // return () => {
        //     wsRef.current?.dispose();
        // }
    }, [divRef, wsRef, blocksDom]);

    return (
        <div ref={divRef}/>
    );
}

export default BlocklyComponent;
