import {AIExtension} from "../unchive/ai_project";
import {Center, ScrollArea, Table} from "@mantine/core";
import React from "react";

export function ExtensionsTab({exts}: { exts: AIExtension[] }) {
  if (exts.length === 0) {
    return <Center h='calc(100dvh - var(--app-shell-header-height) - 41px)'>nothing in here...</Center>
  }

  const ths = (
    <Table.Tr>
      <Table.Th>Type</Table.Th>
      <Table.Th>Name</Table.Th>
      <Table.Th>Version</Table.Th>
      <Table.Th>Description</Table.Th>
      <Table.Th>Icon</Table.Th>
    </Table.Tr>
  );

  const rows = exts.map((ext) => (
    <Table.Tr key={ext.name}>
      <Table.Td>{ext.name}</Table.Td>
      <Table.Td>{ext.descriptorJSON.name}</Table.Td>
      <Table.Td>{ext.descriptorJSON.version}</Table.Td>
      <Table.Td>{ext.descriptorJSON.helpString}</Table.Td>
      <Table.Td>{ext.descriptorJSON.iconName}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea offsetScrollbars scrollbarSize={6} scrollHideDelay={300}
                styles={{viewport: {height: "calc(100dvh - var(--app-shell-header-height) - 41px)"}}}>
      <Table highlightOnHover horizontalSpacing="xl">
        <Table.Thead>{ths}</Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  )
}
