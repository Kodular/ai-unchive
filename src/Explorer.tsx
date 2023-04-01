import {
    Anchor,
    Avatar,
    Badge,
    Center, Checkbox,
    ColorInput, Container,
    Divider,
    Grid,
    Group,
    Indicator,
    List,
    Loader, NumberInput,
    ScrollArea,
    Select,
    Stack,
    Table,
    Tabs,
    TextInput
} from '@mantine/core';
import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {AIAReader} from "./unchive/aia_reader";
import prettyBytes from "pretty-bytes";
import {IconDeviceMobile, IconIcons, IconPuzzle} from "@tabler/icons-react";
import {convertAiColor} from "./utils";
import BlocklyComponent from "./components/Blockly";
import {Cell, LabelList, Legend, Pie, PieChart, ResponsiveContainer} from "recharts";
import {AIAsset, AIComponent, AIExtension, AIProject, AIScreen} from "./unchive/ai_project";

const COLORS = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#5e35b1'];

function Explorer({file}: { file: File }) {

    const {isLoading, isError, data: project} = useQuery(['aia'], () => {
        return AIAReader.read(file)
    })

    if (isError) {
        return <p>error</p>
    }

    if (isLoading) {
        return <Center style={{height: "100%"}}><Loader/></Center>
    }

    return (
        <Tabs defaultValue="overview" keepMounted={false}>
            <Tabs.List>
                <Tabs.Tab value="overview"><b>{project.name}</b></Tabs.Tab>
                <Indicator label={project.assets.length} inline size={16}>
                    <Tabs.Tab value="assets" icon={<IconIcons/>}>Assets</Tabs.Tab>
                </Indicator>
                <Indicator label={project.extensions.length} inline size={16}>
                    <Tabs.Tab value="extensions" icon={<IconPuzzle/>}>Extensions</Tabs.Tab>
                </Indicator>
                {
                    project.screens.map((screen) => (
                        <Tabs.Tab key={screen.name} value={screen.name}
                                  icon={<IconDeviceMobile/>}>{screen.name}</Tabs.Tab>
                    ))
                }
            </Tabs.List>
            <Tabs.Panel value="overview">
                <Overview project={project}/>
            </Tabs.Panel>
            <Tabs.Panel value="assets">
                <Assets assets={project.assets}/>
            </Tabs.Panel>
            <Tabs.Panel value="extensions">
                <Extensions exts={project.extensions}/>
            </Tabs.Panel>
            {
                project.screens.map((screen) => (
                    <Tabs.Panel key={screen.name} value={screen.name}>
                        <Screen screen={screen}/>
                    </Tabs.Panel>
                ))
            }
        </Tabs>
    )
}

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

function Overview({project}: { project: AIProject }) {
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
                <div>
                    <Group position="apart" style={{padding: '8px 4px'}}>
                        <div>Project Properties</div>
                    </Group>
                    <Divider/>
                    <ScrollArea offsetScrollbars style={{height: "calc(100vh - 150px)"}}>
                        <Stack>
                            {
                                project.properties.map((property, i) => (
                                    <TextInput key={i} label={property.name} value={property.value} readOnly/>
                                ))
                            }
                        </Stack>
                    </ScrollArea>
                </div>
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

function Assets({assets}: { assets: AIAsset[] }) {
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

function Extensions({exts}: { exts: AIExtension[] }) {
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

function Screen({screen}: { screen: AIScreen }) {
    const [selected, setSelected] = useState(screen.form)
    return (
        <Container fluid>
            <Grid>
                <Grid.Col span={3}>
                    <LayoutPanel form={screen.form} selected={selected} setSelected={setSelected}/>
                </Grid.Col>
                <Grid.Col span={3}>
                    <PropertiesPanel component={selected}/>
                </Grid.Col>
                <Grid.Col span={6}>
                    <BlocksPanel blocks={screen.blocks}/>
                </Grid.Col>
            </Grid>
        </Container>
    )
}

function LayoutPanel({form, selected, setSelected}: {
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

function PropertiesPanel({component}: { component: AIComponent }) {
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

function BlocksPanel({blocks}: { blocks: string }) {
    return (
        <BlocklyComponent
            initialXml={blocks}
            readOnly={true}
            trashcan={false}
            toolbox={undefined}
            scrollbars={true}
            grid={{
                spacing: 20,
                length: 3,
                colour: '#ccc',
                snap: true
            }}
            zoom={{
                controls: true,
                // wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
                pinch: true
            }}
        />
    )
}

export {Explorer}
