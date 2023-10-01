import {AIComponent} from "aia-kit/dist/ai_component";
import {Badge, Checkbox, ColorInput, Divider, Group, NumberInput, ScrollArea, Stack, TextInput} from "@mantine/core";
import React from "react";
import {parseAiBoolean, parseAiColor,} from "aia-kit/dist/utils/utils";
import {ComponentPropertyEditor} from "aia-kit/dist/types";

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
        return <Checkbox label={property.name} checked={parseAiBoolean(property.value)} readOnly size='xs'/>
    }
    if (property.editorType === 'float') {
        return <NumberInput label={property.name} value={parseFloat(property.value)} readOnly size='xs'/>
    }
    if (property.editorType === 'color' || property.value.startsWith('&H')) {
        return <ColorInput label={property.name} value={parseAiColor(property.value)} readOnly size='xs'/>
    }
    return <TextInput label={property.name} value={property.value} readOnly size='xs'/>
}
