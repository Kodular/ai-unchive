import BlocklyComponent from "./Blockly";
import React from "react";

export function BlocksPanel({blocks}: { blocks: string }) {
    return (
        <BlocklyComponent
            initialXml={blocks}
            readOnly={true}
            trashcan={false}
            toolbox={undefined}
            scrollbars={true}
            grid={{
                spacing: 20,
                length: 3,
                colour: '#ccc',
                snap: true
            }}
            zoom={{
                controls: true,
                // wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
                pinch: true
            }}
        />
    )
}
