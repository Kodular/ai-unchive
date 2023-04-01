import {Cell, LabelList, Legend, Pie, PieChart, ResponsiveContainer} from "recharts";
import React from "react";
import {AIProject} from "../unchive/ai_project";
import {Avatar, Divider, Grid, Group, ScrollArea, Stack, TextInput} from "@mantine/core";

const COLORS = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#5e35b1'];

function RenderPieChart({data}: { data: { name: string, value: number }[] }) {
    const sortedData = data.sort((a, b) => b.value - a.value)
    return (
        <ResponsiveContainer height={300} width="100%">
            <PieChart>
                <Pie data={sortedData} dataKey="value" cx="50%" cy="50%" outerRadius={100} innerRadius={50}>
                    {sortedData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                    <LabelList dataKey="value" position="inside" formatter={(f: number) => (f * 100).toFixed(1) + '%'}/>
                </Pie>
                <Legend layout="vertical" align="right" verticalAlign="top" iconType="circle"/>
            </PieChart>
        </ResponsiveContainer>
    );
}

function ProjectPropertiesPanel({properties}: { properties: { name: string, value: string }[] }) {
    return (
        <div>
            <Group position="apart" style={{padding: '8px 4px'}}>
                <div>Project Properties</div>
            </Group>
            <Divider/>
            <ScrollArea offsetScrollbars style={{height: "calc(100vh - 150px)"}}>
                <Stack>
                    {
                        properties.map((property, i) => (
                            <TextInput key={i} label={property.name} value={property.value} readOnly/>
                        ))
                    }
                </Stack>
            </ScrollArea>
        </div>
    );
}

export function OverviewTab({project}: { project: AIProject }) {
    const totalBlocks = project.screens.reduce((a, s) => a + (s.blocks?.match(/<block/g) || []).length, 0)
    const blocksPerScreen = project.screens.map(s => ({
        name: s.name,
        value: (s.blocks?.match(/<block/g) || []).length / totalBlocks
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
            </Grid.Col>
            <Grid.Col span={3}>
                <ProjectPropertiesPanel properties={project.properties}/>
            </Grid.Col>
            <Grid.Col span={6}>
                <ScrollArea offsetScrollbars style={{height: "calc(100vh - 120px)"}}>
                    <RenderPieChart data={blocksPerScreen}/>
                    <RenderPieChart data={assetsPerType}/>
                </ScrollArea>
            </Grid.Col>
        </Grid>
    )
}
