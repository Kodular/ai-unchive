import {Grid, List, Loader, ScrollArea, Stack, Tabs, TextInput, Anchor, Table, Center, Indicator} from '@mantine/core';
import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {AIAReader} from "../unchive/aia_reader.js";
import prettyBytes from "pretty-bytes";

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
        <Tabs.Tab value="overview">Project Overview - {project.name}</Tabs.Tab>
        <Indicator label={project.assets.length} dot={false} overflowCount={999} inline size={22}>
          <Tabs.Tab value="assets">Assets</Tabs.Tab>
        </Indicator>
        <Indicator label={project.extensions.length} dot={false} overflowCount={999} inline size={22}>
          <Tabs.Tab value="extensions">Extensions</Tabs.Tab>
        </Indicator>
        {
          project.screens.map((screen) => (
            <Tabs.Tab key={screen.name} value={screen.name}>{screen.name}</Tabs.Tab>
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
        <Extensions assets={project.extensions}/>
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

function Overview({project}) {
  return (
    <Stack>
      <p>Project Name: {project.name}</p>
      <p>Number of screens: {project.screens.length}</p>
      <p>Number of extensions: {project.extensions.length}</p>
      <p>Number of assets: {project.assets.length}</p>
      <p>Total size of assets: {prettyBytes(project.assets.reduce((s, a)=>s+a.size,0))}</p>
    </Stack>
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
      <td>{prettyBytes(asset.size)}</td>
      <td><Anchor href={asset.getURL()} target="_blank">Download</Anchor></td>
    </tr>
  ));

  return (
    <ScrollArea offsetScrollbars style={{height: "calc(100vh - 85px)"}}>
      <Table highlightOnHover>
        <thead>{ths}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  )
}

function Extensions({assets: exts}) {
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
      <Table highlightOnHover>
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
      {/*<Grid.Col span={6}><BlocksPanel/></Grid.Col>*/}
    </Grid>
  )
}

function LayoutPanel({form, selected, setSelected}) {
  return (
    <div>
      <div>Layout</div>
      <ScrollArea offsetScrollbars style={{height: "calc(100vh - 120px)"}}>
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
        <small>{component.type}</small>
      </Stack>
      <List listStyleType="none" withPadding style={{borderLeft: "2px solid #ddd9"}}>
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
      <div>{component.name} ({component.type}) Properties</div>
      <ScrollArea offsetScrollbars style={{height: "calc(100vh - 120px)"}}>
        <Stack>
          {
            component.properties.map((property, i) => (
              <TextInput key={i} label={property.name} value={property.value} disabled/>
            ))
          }
        </Stack>
      </ScrollArea>
    </div>
  )
}

export {Explorer}
