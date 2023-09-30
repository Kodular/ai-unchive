import {AIComponent} from "../unchive/ai_project";
import React, {useState} from "react";
import {Divider, Flex, Group, List, ScrollArea, Select, Text} from "@mantine/core";
import {
  IconBox,
  IconChevronDown,
  IconChevronRight,
  IconComponents
} from '@tabler/icons-react';
import {useToggle} from "@mantine/hooks";

export function LayoutPanel({form, selected, setSelected}: {
  form: AIComponent,
  selected: AIComponent,
  setSelected: (component: AIComponent) => void
}) {
  const [visibility, setVisibility] = useState<string | null>('all')
  return (
    <div>
      <Group justify='space-between' style={{padding: '6px 4px'}}>
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
      <ScrollArea offsetScrollbars scrollbarSize={6} scrollHideDelay={300}
                  styles={{viewport: {height: "calc(100dvh - var(--app-shell-header-height) - 85px)"}}}>
        <List listStyleType="none" w="100%" withPadding>
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
  const [collapsed, toggleCollapsed] = useToggle()

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
                backgroundColor: component.name === selected.name ? '#7048e888' : undefined,
                marginLeft: '-100%',
                // marginRight: '100%',
                paddingLeft: '100%',
                // paddingRight: '100%',
                borderRadius: '4px',
            }}>
              <Flex gap='0.5rem' w='100%' ml='-0.5rem'>
                { component.children.length ? (
                  <span onClick={() => toggleCollapsed()}>
                    {collapsed ? <IconChevronRight size="1rem"/> : <IconChevronDown size="1rem"/>}
                  </span>
                ) : null}
                <div>
                  {component.children.length ? <IconBox size="1rem"/> : <IconComponents size="1rem"/>}
                </div>
                <Text>
                  {component.name}
                </Text>
              </Flex>
            </div>
            <List listStyleType="none" w='100%' withPadding pl='1.5rem' style={{borderLeft: "2px solid #8888"}}>
                {
                    !collapsed && component.children?.map((child, i) => (
                        <TreeNode component={child} key={i} selected={selected} setSelected={setSelected}
                                  visibility={visibility}/>
                    ))
                }
            </List>
        </List.Item>
    )
}
