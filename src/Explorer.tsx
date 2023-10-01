import {Center, Loader, Tabs} from '@mantine/core';
import React from "react";
import {useQuery} from "@tanstack/react-query";
import {AIAReader} from "aia-kit";
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
        return <Center h="calc(100dvh - var(--app-shell-header-height))"><Loader/></Center>
    }

    return (
        <Tabs defaultValue="overview" keepMounted>
            <Tabs.List>
                <Tabs.Tab value="overview"><b>{project.name}</b></Tabs.Tab>
                <Tabs.Tab value="assets"
                          leftSection={<IconIcons size='1.2rem' stroke={1.5}/>}>
                  Assets
                </Tabs.Tab>
                <Tabs.Tab value="extensions"
                          leftSection={<IconPuzzle size='1.2rem' stroke={1.5}/>}>
                  Extensions
                </Tabs.Tab>
                {
                    project.screens.map((screen) => (
                        <Tabs.Tab key={screen.name} value={screen.name}
                                  leftSection={<IconDeviceMobile size='1.2rem' stroke={1.5}/>}>
                          {screen.name}
                        </Tabs.Tab>
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
