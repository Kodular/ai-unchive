import {AIAsset} from "../unchive/ai_project";
import prettyBytes from "pretty-bytes";
import {Anchor, Center, Divider, ScrollArea, Table} from "@mantine/core";
import React from "react";

export function AssetsTab({assets}: { assets: AIAsset[] }) {
  if (assets.length === 0) {
    return <Center h='calc(100dvh - var(--app-shell-header-height) - 41px)'>nothing in here...</Center>
  }

  const ths = (
    <Table.Tr>
      <Table.Th>Name</Table.Th>
      <Table.Th>Type</Table.Th>
      <Table.Th align="right">Size</Table.Th>
      <Table.Th>Download</Table.Th>
    </Table.Tr>
  );

  const rows = assets.map((asset) => (
    <Table.Tr key={asset.name}>
      <Table.Td>{asset.name}</Table.Td>
      <Table.Td>{asset.type}</Table.Td>
      <Table.Td align="right">{prettyBytes(asset.size)}</Table.Td>
      <Table.Td><Anchor href={asset.getURL()} target="_blank">Download</Anchor></Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea offsetScrollbars scrollbarSize={6} scrollHideDelay={300}
                styles={{viewport: {height: "calc(100dvh - var(--app-shell-header-height) - 41px)"}}}>
      <Table highlightOnHover horizontalSpacing="xl">
        <Table.Thead>{ths}</Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
        <Table.Tfoot>
          <Table.Tr>
            <Table.Td></Table.Td>
            <Table.Td></Table.Td>
            <Table.Td align="right">
              <Divider/>
              <p>
                &sum; = {prettyBytes(assets.map(it => it.size).reduce((a, v) => a + v, 0))}
              </p>
            </Table.Td>
            <Table.Td></Table.Td>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
    </ScrollArea>
  )
}
