import {AIComponent} from "../unchive/ai_project";
import React, {useState} from "react";
import {Box, Divider, Flex, Group, List, ScrollArea, Select, Stack, ThemeIcon} from "@mantine/core";
import {IconBox, IconComponents} from '@tabler/icons-react';

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
                <List listStyleType="none" w="100%" pl="1rem">
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
        <List.Item onClick={onSelect} w="100%">
            <div style={{
                display: 'flex',
                backgroundColor: component === selected ? "#60a5fa33" : undefined,
                marginLeft: '-100%',
                marginRight: '100%',
                paddingLeft: '100%',
                paddingRight: '100%'
            }}>
                <span style={{marginLeft: '-0.5rem', marginRight: '0.5rem'}}>
                    {component.children.length ? <IconBox size="1rem"/> : <IconComponents size="1rem"/>}
                </span>
                {component.name}
            </div>
            <List listStyleType="none" withPadding style={{borderLeft: "2px solid #8888", width: '100%'}}>
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
