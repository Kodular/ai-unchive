<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { IconDeviceMobile, IconIcons, IconPuzzle } from "@tabler/icons-react";
import ScreenTab from "./components/ScreenTab.vue";
import ExtensionsTab from "./components/ExtensionsTab.vue";
import AssetsTab from "./components/AssetsTab.vue";
import OverviewTab from "./components/OverviewTab.vue";

import { computed, ref } from 'vue';
import { AIProject } from "aia-kit/ai_project.js";

let props = defineProps<{ project: AIProject }>();

const project = props.project;

let activeTab = ref('overview');
let selectedScreen = ref(null);

const items = computed(() => [
    {
        label: 'Project',
        command: () => {
            activeTab.value = 'overview';
        },
    },
    {
        label: 'Assets',
        command: () => {
            activeTab.value = 'assets';
        },
    },
    {
        label: 'Extensions',
        command: () => {
            activeTab.value = 'extensions';
        },
    },
    {
        label: 'Screens',
        items: project.screens.map((screen) => ({
            label: screen.name,
            command: () => {
                selectedScreen.value = screen;
                activeTab.value = 'screen';
            },
        })),
    }
]);

</script>

<template>
    <Splitter>
        <SplitterPanel :size="15" :minSize="15">
            <PanelMenu :model="items" />
        </SplitterPanel>
        <SplitterPanel :size="85">
            <div v-if="activeTab === 'overview'">
                <OverviewTab :project="project" />
            </div>
            <div v-else-if="activeTab === 'assets'">
                <AssetsTab :assets="project.assets" />
            </div>
            <div v-else-if="activeTab === 'extensions'">
                <ExtensionsTab :exts="project.extensions" />
            </div>
            <div v-else-if="activeTab === 'screen'">
                <ScreenTab :screen="selectedScreen" />
            </div>
        </SplitterPanel>
    </Splitter>
</template>
