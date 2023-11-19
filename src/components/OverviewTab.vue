<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import { AIProject } from "aia-kit/ai_project.js";
import { parseAiBoolean, parseAiColor } from "aia-kit/utils/utils.js";

import { getPackageName } from "../utils";


let props = defineProps<{ project: AIProject }>();

const project = props.project;

const COLORS = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#5e35b1'];

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

function parseProperty(value: string): { type: 'text' | 'color' | 'number' | 'boolean', value: string | number | boolean } {
  if (['True', 'False'].includes(value)) {
    return { type: 'boolean', value: parseAiBoolean(value) }
  }
  if (!Number.isNaN(Number.parseFloat(value))) {
    return { type: 'number', value: parseFloat(value) }
  }
  if (value.startsWith('&H')) {
    return { type: 'color', value: parseAiColor(value) }
  }
  return { type: 'text', value }
}

let projectProperties = Object.entries(project.properties).map(([k, v]) => ({
  name: k,
  ...parseProperty(v)
}))
</script>

<template>
  <Splitter>
    <SplitterPanel :size="15" :minSize="15">
      <img src="/logo.png" style="height:64px" />
      <p>Package name = {{ getPackageName(project) }}</p>
    </SplitterPanel>
    <SplitterPanel :size="40">
      <div class="flex col gap-2 p-4">
        <div v-for="property in projectProperties">
          <div v-if="property.type === 'boolean'" class="flex row apart align-center">
            <label :for="property.name">{{ property.name }}</label>
            <InputSwitch :inputId="property.name" v-model="property.value" readOnly />
          </div>
          <div v-else-if="property.type === 'number'" class="flex col">
            <label :for="property.name">{{ property.name }}</label>
            <InputNumber :inputId="property.name" v-model="property.value" readOnly />
          </div>
          <div v-else-if="property.type === 'color'" class="flex row apart align-center">
            <label :for="property.name">{{ property.name }}</label>
            <div class="flex row align-center gap-2">
              <div class="colorview" :style="{ backgroundColor: property.value }"></div>
              <span>{{ property.value }}</span>
            </div>
          </div>
          <div v-else-if="property.type === 'text'" class="flex col">
            <label :for="property.name">{{ property.name }}</label>
            <InputText :inputId="property.name" v-model="property.value" readOnly />
          </div>
        </div>
      </div>
    </SplitterPanel>
    <SplitterPanel :size="45">
      some charts here
    </SplitterPanel>
  </Splitter>
</template>

<style>
.flex {
  display: flex;
}

.row {
  flex-direction: row;
}

.col {
  flex-direction: column;
}

.gap-2 {
  gap: 1rem;
}

.apart {
  justify-content: space-between;
}

.align-center {
  align-items: center;
}

.p-4 {
  padding: 1rem;
}

.colorview {
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  outline: 2px solid gray;
}
</style>