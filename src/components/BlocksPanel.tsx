import React, {useState} from "react";
import {Group, ScrollArea, Switch, Text} from "@mantine/core";
import BlocklyComponent from "./BlocklyComponent";

export function BlocksPanel({blocksXml}: { blocksXml: string }) {
  const [renderBlocks, setRenderBlocks] = useState(false)

  return (
    <>
      <Group justify="space-between" align='center' px={4} py={2}>
        <Text>
          Total blocks = {blocksXml.match(/<\/block>/g)?.length ?? 'failed'}
        </Text>
        <Switch
          label="Render blocks"
          size='xs'
          checked={renderBlocks}
          onChange={(event) => setRenderBlocks(event.currentTarget.checked)}
        />
      </Group>
      <ScrollArea offsetScrollbars scrollbarSize={6} scrollHideDelay={300}
                  styles={{viewport: {height: "calc(100dvh - var(--app-shell-header-height) - 70px)"}}}>
        {renderBlocks ? (
          <BlocklyComponent blocksXml={blocksXml}/>
        ) : (
          <pre>
            {blocksXml}
          </pre>
        )}
      </ScrollArea>
    </>
  )
}
