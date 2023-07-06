import React, {useMemo} from "react";
import {ScrollArea} from "@mantine/core";
import BlocklyComponent from "./BlocklyComponent";

export function BlocksPanel({blocksXml}: { blocksXml: string }) {
    const blocks = useMemo(() => {
        const blocksDom = new DOMParser().parseFromString(blocksXml, 'text/xml')
        return Array.from(blocksDom.getElementsByTagName('xml')[0].children)
            .filter(b => b.tagName === 'block')
    }, [blocksXml])

    return (
        <ScrollArea h="calc(100vh - 110px)">
            {
                blocks.map((block, i) => (
                    <BlocklyComponent key={i} blocksDom={block}/>
                ))
            }
        </ScrollArea>
    )
}
