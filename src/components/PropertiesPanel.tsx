import {AIComponent} from "../unchive/ai_project";
import {Badge, Checkbox, ColorInput, Divider, Group, NumberInput, ScrollArea, Stack, TextInput} from "@mantine/core";
import React from "react";
import {convertAiColor} from "../utils";

export function PropertiesPanel({component}: { component: AIComponent }) {
  return (
    <div>
      <Group justify="apart" gap='xs' style={{padding: '8px 4px'}}>
        <b>{component.name}</b>
        <div>properties</div>
        <Badge>{component.type}</Badge>
      </Group>
      <Divider/>
      <ScrollArea offsetScrollbars scrollbarSize={6} scrollHideDelay={300}
                  styles={{viewport: {height: "calc(100dvh - var(--app-shell-header-height) - 85px)"}}}>
        <Stack gap='xs'>
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
    if (['boolean', 'visibility'].includes(property.editorType!)) {
        return <Checkbox label={property.name} checked={property.value === 'True'} readOnly/>
    }
    if (property.editorType === 'float') {
        return <NumberInput label={property.name} value={parseFloat(property.value)} readOnly/>
    }
    if (property.editorType === 'color' || property.value.startsWith('&H')) {
        return <ColorInput label={property.name} value={convertAiColor(property.value)} readOnly/>
    }
    return <TextInput label={property.name} value={property.value} readOnly/>
}
