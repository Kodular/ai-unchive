import {
  Anchor,
  Avatar,
  Badge,
  Center,
  ColorInput,
  Divider,
  Grid,
  Group,
  Indicator,
  List,
  Loader,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  TextInput
} from '@mantine/core';
import React, {useEffect, useRef, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {AIAReader} from "./unchive/aia_reader.js";
import prettyBytes from "pretty-bytes";
import {IconDeviceMobile, IconIcons, IconPuzzle} from "@tabler/icons";
import {convertAiColor} from "./utils.js";
import BlocklyComponent from "./components/Blockly/index.js";
import {Cell, LabelList, Legend, Pie, PieChart, ResponsiveContainer} from "recharts";

const COLORS = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#5e35b1'];

function Explorer({file}) {

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
    <Tabs defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview"><b>{project.name}</b></Tabs.Tab>
        <Indicator label={project.assets.length} dot={false} overflowCount={999} inline size={22}>
          <Tabs.Tab value="assets" icon={<IconIcons/>}>Assets</Tabs.Tab>
        </Indicator>
        <Indicator label={project.extensions.length} dot={false} overflowCount={999} inline size={22}>
          <Tabs.Tab value="extensions" icon={<IconPuzzle/>}>Extensions</Tabs.Tab>
        </Indicator>
        {
          project.screens.map((screen) => (
            <Tabs.Tab key={screen.name} value={screen.name} icon={<IconDeviceMobile/>}>{screen.name}</Tabs.Tab>
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

function RenderPieChart({data}) {
  const sortedData = data.sort((a, b) => b.value - a.value)
  return (
    <ResponsiveContainer height={300} width="100%">
      <PieChart>
        <Pie data={sortedData} dataKey="value" cx="50%" cy="50%" outerRadius={100} innerRadius={50}>
          {sortedData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
          ))}
          <LabelList dataKey="value" position="inside" formatter={f => (f * 100).toFixed(1) + '%'}/>
        </Pie>
        <Legend layout="vertical" align="right" verticalAlign="top" iconType="circle"/>
      </PieChart>
    </ResponsiveContainer>
  );
}

function Overview({project}) {
  const totalBlocks = project.screens.reduce((a, s) => a + (s.blocks?.match(/<block/g) || []).length, 0)
  const blocksPerScreen = project.screens.map(s => ({
    name: s.name,
    value: (s.blocks?.match(/<block/g) || []).length / totalBlocks
  }))

  const totalAssets = project.assets.length
  const assetsPerType = Object.entries(project.assets.reduce((a, s) => {
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
        <ScrollArea offsetScrollbars style={{height: "calc(100vh - 100px)"}}>
          {
            project.properties.map((property, i) => (
              <TextInput key={i} label={property.name} value={property.value} disabled/>
            ))
          }
        </ScrollArea>
      </Grid.Col>
      <Grid.Col span={6}>
        <ScrollArea offsetScrollbars style={{height: "calc(100vh - 100px)"}}>
          <RenderPieChart data={blocksPerScreen}/>
          <RenderPieChart data={assetsPerType}/>
        </ScrollArea>
      </Grid.Col>
    </Grid>
  )
}

function Assets({assets}) {
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
    <ScrollArea offsetScrollbars style={{height: "calc(100vh - 100px)"}}>
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

function Extensions({exts}) {
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
    <ScrollArea offsetScrollbars style={{height: "calc(100vh - 95px)"}}>
      <Table highlightOnHover horizontalSpacing="xl">
        <thead>{ths}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  )
}

function Screen({screen}) {
  const [selected, setSelected] = useState(screen.form)
  return (
    <Grid>
      <Grid.Col span={3}><LayoutPanel form={screen.form} selected={selected} setSelected={setSelected}/></Grid.Col>
      <Grid.Col span={3}><PropertiesPanel component={selected}/></Grid.Col>
      <Grid.Col span={6}><BlocksPanel blocks={screen.blocks}/></Grid.Col>
    </Grid>
  )
}

function LayoutPanel({form, selected, setSelected}) {
  return (
    <div>
      <Group position="apart" style={{padding: '6px 4px'}}>
        <div>Layout</div>
        <Select
          size="xs"
          placeholder="Component Type"
          defaultValue="all"
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
          <TreeNode component={form} selected={selected} setSelected={setSelected}/>
        </List>
      </ScrollArea>
    </div>
  )
}

function TreeNode({component, selected, setSelected}) {

  function onSelect(e) {
    e.stopPropagation()
    setSelected(component)
  }

  return (
    <List.Item onClick={onSelect}>
      <Stack spacing={0} style={{backgroundColor: component === selected && "#4dabf733"}}>
        {component.name}
      </Stack>
      <List listStyleType="none" withPadding style={{borderLeft: "1px solid #ddd8"}}>
        {
          component.children?.map((child, i) => (
            <TreeNode component={child} key={i} selected={selected} setSelected={setSelected}/>
          ))
        }
      </List>
    </List.Item>
  )
}

function PropertiesPanel({component}) {
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
              property.editorType ?
                property.editorType === 'color' ?
                  <ColorInput key={i} label={property.name} value={convertAiColor(property.value)} disabled/>
                  : <TextInput key={i} label={property.name} value={property.value} disabled/>
                : <TextInput key={i} label={property.name} value={property.value} disabled/>
            ))
          }
        </Stack>
      </ScrollArea>
    </div>
  )
}

function BlocksPanel({blocks}) {
  return (
    <div>hello</div>
    // <BlocklyComponent
    //   initialXml={blocks}
    //   readOnly={true}
    //   trashcan={false}
    //   toolbox={false}
    //   scrollbars={false}
    // />
  )
}

export {Explorer}
