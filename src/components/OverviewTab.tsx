import React from "react";
import {AIProject} from "aia-kit/dist/ai_project";
import {Avatar, Badge, Divider, Grid, Group, RingProgress, ScrollArea, Stack, Text, TextInput} from "@mantine/core";
import {getPackageName} from "../utils";

const COLORS = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#5e35b1'];

function RenderPieChart({data, title}: { data: { name: string, value: number }[], title: string }) {
  const sections = data.map((d, i) => ({
    value: d.value * 100,
    color: COLORS[i % COLORS.length],
    tooltip: `${d.name}: ${(d.value * 100).toFixed(1)}%`,
    children: 123
  }));

  return (
    <Group>
      <RingProgress
        size={300}
        thickness={40}
        label={
          <Text size="xs" ta="center">
            {title}
          </Text>
        }
        sections={sections}
      />
      <Stack>
        {data.map((d, i) => (
          <Group justify="apart" key={i}>
            <Badge variant="dot" color={COLORS[i % COLORS.length]} style={{textTransform: 'none'}}>{d.name}</Badge>
            <Text>{(d.value * 100).toFixed(1)}%</Text>
          </Group>
        ))}
      </Stack>
    </Group>
  )
}

function ProjectPropertiesPanel({properties}: { properties: Record<string, string> }) {
  return (
    <div>
      <Group justify="apart" style={{padding: '8px 4px'}}>
        <div>Project Properties</div>
      </Group>
      <Divider/>
      <ScrollArea offsetScrollbars scrollbarSize={6} scrollHideDelay={300}
                  styles={{viewport: {height: "calc(100dvh - var(--app-shell-header-height) - 82px)"}}}>
        <Stack gap='xs'>
          {
            Object.entries(properties).map(([name, value], i) => (
              <TextInput key={i} label={name} value={value} readOnly/>
            ))
          }
        </Stack>
      </ScrollArea>
    </div>
  );
}

export function OverviewTab({project}: { project: AIProject }) {
  const totalBlocks = project.screens.reduce((a, s) => a + (s.blocks?.match(/<\/block>/g) || []).length, 0)
  const blocksPerScreen = project.screens.map(s => ({
    name: s.name,
    value: (s.blocks?.match(/<\/block>/g) || []).length / totalBlocks
  }))

  const totalAssets = project.assets.length
  const assetsPerType = Object.entries(project.assets.reduce((a: Record<string, number>, s) => {
    if (a[s.type]) {
      a[s.type]++
    } else {
      a[s.type] = 1
    }
    return a
  }, {})).map(([k, v]) => ({
    name: k,
    value: v / totalAssets
  }))

  return (
    <Grid>
      <Grid.Col span={3}>
        <Avatar radius="md" size="xl" color="dark" src="/logo.png"/>
        <Text>Package Name = {getPackageName(project)}</Text>
      </Grid.Col>
      <Grid.Col span={3}>
        <ProjectPropertiesPanel properties={project.properties}/>
      </Grid.Col>
      <Grid.Col span={6}>
        <ScrollArea offsetScrollbars scrollbarSize={6} scrollHideDelay={300}
                    styles={{viewport: {height: "calc(100dvh - var(--app-shell-header-height) - 41px)"}}}>
          <RenderPieChart data={blocksPerScreen} title="Blocks per screen"/>
          <RenderPieChart data={assetsPerType} title="Assets per type"/>
        </ScrollArea>
      </Grid.Col>
    </Grid>
  )
}
