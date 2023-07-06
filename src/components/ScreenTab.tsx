import {AIScreen} from "../unchive/ai_project";
import React, {useState} from "react";
import {Container, Grid} from "@mantine/core";
import {LayoutPanel} from "./LayoutPanel";
import {PropertiesPanel} from "./PropertiesPanel";
import {BlocksPanel} from "./BlocksPanel";

export function ScreenTab({screen}: { screen: AIScreen }) {
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
                    <BlocksPanel blocksXml={screen.blocks}/>
                </Grid.Col>
            </Grid>
        </Container>
    )
}
