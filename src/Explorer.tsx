import {Center, Indicator, Loader, Tabs} from '@mantine/core';
import React from "react";
import {useQuery} from "@tanstack/react-query";
import {AIAReader} from "./unchive/aia_reader";
import {IconDeviceMobile, IconIcons, IconPuzzle} from "@tabler/icons-react";
import {ScreenTab} from "./components/ScreenTab";
import {ExtensionsTab} from "./components/ExtensionsTab";
import {AssetsTab} from "./components/AssetsTab";
import {OverviewTab} from "./components/OverviewTab";

export function Explorer({file}: { file: File }) {

    const {isLoading, isError, data: project} = useQuery({
        queryKey: ['aia'],
        queryFn: () => AIAReader.read(file)
    })

    if (isError) {
        return <p>error</p>
    }

    if (isLoading) {
        return <Center style={{height: "100%"}}><Loader/></Center>
    }

    return (
        <Tabs defaultValue="overview" keepMounted>
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
                <OverviewTab project={project}/>
            </Tabs.Panel>
            <Tabs.Panel value="assets">
                <AssetsTab assets={project.assets}/>
            </Tabs.Panel>
            <Tabs.Panel value="extensions">
                <ExtensionsTab exts={project.extensions}/>
            </Tabs.Panel>
            {
                project.screens.map((screen) => (
                    <Tabs.Panel key={screen.name} value={screen.name}>
                        <ScreenTab screen={screen}/>
                    </Tabs.Panel>
                ))
            }
        </Tabs>
    )
}
