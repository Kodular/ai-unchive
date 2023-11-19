<script setup lang="ts">
import LayoutPanel from "./LayoutPanel.vue";
import PropertiesPanel from "./PropertiesPanel.vue";
import BlocksPanel from "./BlocksPanel.vue";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import { ref } from "vue";
import { AIScreen } from "aia-kit/ai_screen.js";
import { AIComponent } from "aia-kit/ai_component.js";

let props = defineProps<{ screen: AIScreen }>();

const screen = props.screen;

let selectedComponent = ref(screen.form);

function onComponentSelected(component: AIComponent) {
    selectedComponent.value = component;
}

</script>

<template>
    <Splitter>
        <SplitterPanel :minSize="20">
            <LayoutPanel :form="screen.form" @componentSelected="onComponentSelected" />
        </SplitterPanel>
        <SplitterPanel :minSize="20">
            <PropertiesPanel :component="selectedComponent" />
        </SplitterPanel>
        <SplitterPanel :minSize="30">
            <BlocksPanel :blocksXml="screen.blocks" />
        </SplitterPanel>
    </Splitter>
</template>