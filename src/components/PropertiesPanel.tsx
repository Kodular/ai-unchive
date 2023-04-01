import {AIComponent} from "../unchive/ai_project";
import {Badge, Checkbox, ColorInput, Divider, Group, NumberInput, ScrollArea, Stack, TextInput} from "@mantine/core";
import React from "react";
import {convertAiColor} from "../utils";

export function PropertiesPanel({component}: { component: AIComponent }) {
    return (
        <div>
            <Group position="apart" style={{padding: '8px 4px'}}>
                <div><b>{component.name}</b> Properties</div>
                <Badge>{component.type}</Badge>
            </Group>
            <Divider/>
            <ScrollArea offsetScrollbars style={{height: "calc(100vh - 150px)"}}>
                <Stack>
                    {
                        component.properties.map((property, i) => (
                            <RenderPropertyEditor property={property} key={i}/>
                        ))
                    }
                </Stack>
            </ScrollArea>
        </div>
    )
}

function RenderPropertyEditor({property}: { property: ComponentPropertyEditor }) {
    if (property.editorType === 'boolean') {
        return <Checkbox label={property.name} checked={property.value === 'True'} readOnly/>
    }
    if (property.editorType === 'float') {
        return <NumberInput label={property.name} value={parseFloat(property.value)} readOnly/>
    }
    if (property.editorType === 'color') {
        return <ColorInput label={property.name} value={convertAiColor(property.value)} readOnly/>
    }
    return <TextInput label={property.name} value={property.value} readOnly/>
}
