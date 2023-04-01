import {AIComponent} from "../unchive/ai_project";
import React, {useState} from "react";
import {Divider, Group, List, ScrollArea, Select, Stack} from "@mantine/core";

export function LayoutPanel({form, selected, setSelected}: {
    form: AIComponent,
    selected: AIComponent,
    setSelected: (component: AIComponent) => void
}) {
    const [visibility, setVisibility] = useState<string | null>('all')
    return (
        <div>
            <Group position="apart" style={{padding: '6px 4px'}}>
                <div>Layout</div>
                <Select
                    size="xs"
                    placeholder="Component Type"
                    onChange={setVisibility}
                    value={visibility}
                    data={[
                        {value: 'all', label: 'All'},
                        {value: 'visible', label: 'Visible'},
                        {value: 'non_visible', label: 'Non-Visible'},
                    ]}
                />
            </Group>
            <Divider/>
            <ScrollArea offsetScrollbars style={{height: "calc(100vh - 150px)"}}>
                <List listStyleType="none" withPadding>
                    <TreeNode component={form} selected={selected} setSelected={setSelected}
                              visibility={visibility}
                    />
                </List>
            </ScrollArea>
        </div>
    )
}

function TreeNode({component, selected, setSelected, visibility}
                      : {
                      component: AIComponent,
                      selected: AIComponent,
                      setSelected: (component: AIComponent) => void,
                      visibility: string | null
                  }
) {
    if (component.type !== 'Form') {
        if (visibility === 'visible' && !component.visible) {
            return null
        }

        if (visibility === 'non_visible' && component.visible) {
            return null
        }
    }

    function onSelect(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        e.stopPropagation()
        setSelected(component)
    }

    return (
        <List.Item onClick={onSelect}>
            <Stack spacing={0} style={{backgroundColor: component === selected ? "#4dabf733" : undefined}}>
                {component.name}
            </Stack>
            <List listStyleType="none" withPadding style={{borderLeft: "1px solid #ddd8"}}>
                {
                    component.children?.map((child, i) => (
                        <TreeNode component={child} key={i} selected={selected} setSelected={setSelected}
                                  visibility={visibility}/>
                    ))
                }
            </List>
        </List.Item>
    )
}
