import {AIAsset} from "../unchive/ai_project";
import prettyBytes from "pretty-bytes";
import {Anchor, Divider, ScrollArea, Table} from "@mantine/core";
import React from "react";

export function AssetsTab({assets}: { assets: AIAsset[] }) {
    const ths = (
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Download</th>
        </tr>
    );

    const rows = assets.map((asset) => (
        <tr key={asset.name}>
            <td>{asset.name}</td>
            <td>{asset.type}</td>
            <td align="right">{prettyBytes(asset.size)}</td>
            <td><Anchor href={asset.getURL()} target="_blank">Download</Anchor></td>
        </tr>
    ));

    return (
        <ScrollArea offsetScrollbars style={{height: "calc(100vh - 150px)"}}>
            <Table highlightOnHover horizontalSpacing="xl">
                <thead>{ths}</thead>
                <tbody>{rows}</tbody>
                <tfoot>
                <tr>
                    <td></td>
                    <td></td>
                    <td align="right">
                        <Divider/>
                        <p>
                            &sum; = {prettyBytes(assets.map(it => it.size).reduce((a, v) => a + v, 0))}
                        </p>
                    </td>
                    <td></td>
                </tr>
                </tfoot>
            </Table>
        </ScrollArea>
    )
}
