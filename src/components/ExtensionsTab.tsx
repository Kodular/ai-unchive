import {AIExtension} from "../unchive/ai_project";
import {ScrollArea, Table} from "@mantine/core";
import React from "react";

export function ExtensionsTab({exts}: { exts: AIExtension[] }) {
    const ths = (
        <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Version</th>
            <th>Description</th>
            <th>Icon</th>
        </tr>
    );

    const rows = exts.map((ext) => (
        <tr key={ext.name}>
            <td>{ext.name}</td>
            <td>{ext.descriptorJSON.name}</td>
            <td>{ext.descriptorJSON.version}</td>
            <td>{ext.descriptorJSON.helpString}</td>
            <td>{ext.descriptorJSON.iconName}</td>
        </tr>
    ));

    return (
        <ScrollArea offsetScrollbars style={{height: "calc(100vh - 100px)"}}>
            <Table highlightOnHover horizontalSpacing="xl">
                <thead>{ths}</thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    )
}
