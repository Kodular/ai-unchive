import React, {useMemo, useState} from "react";
import {Flex, ScrollArea, Switch, Text} from "@mantine/core";
import BlocklyComponent from "./BlocklyComponent";

export function BlocksPanel({blocksXml}: { blocksXml: string }) {
    const blocks = useMemo(() => {
        const blocksDom = new DOMParser().parseFromString(blocksXml, 'text/xml')
        return Array.from(blocksDom.getElementsByTagName('xml')[0].children)
            .filter(b => b.tagName === 'block')
    }, [blocksXml])

    const [renderBlocks, setRenderBlocks] = useState(false)

    return (
        <>
            <Flex justify="space-between" py={4}>
                <Text>
                    Top blocks = {blocks.length} / Total blocks = {blocksXml.match(/<\/block>/g)?.length ?? 'failed'}
                </Text>
                <Switch
                    label="Render blocks"
                    checked={renderBlocks}
                    onChange={(event) => setRenderBlocks(event.currentTarget.checked)}
                />
            </Flex>
            <ScrollArea h="calc(100vh - 140px)">
                {renderBlocks ? (
                    blocks.map((block, i) => (
                        <BlocklyComponent key={i} blocksDom={block}/>
                    ))
                ) : (
                    <pre>
                        {blocksXml}
                    </pre>
                )}
                {/*<BlocklyComponent blocksDom={Blockly.Xml.textToDom(blocksXml)}/>*/}
            </ScrollArea>
        </>
    )
}
