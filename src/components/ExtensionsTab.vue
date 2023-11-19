<script setup lang="ts">
import { AIExtension } from "aia-kit/ai_extension.js";

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

let props = defineProps<{ exts: AIExtension[] }>();

const exts = props.exts;

</script>

<template>
  <DataTable :value="exts" scrollable scrollHeight="flex" tableStyle="min-width: 50rem">
    <Column field="name" header="Type"></Column>
    <Column field="descriptorJSON.name" header="Name"></Column>
    <Column field="descriptorJSON.version" header="Version"></Column>
    <Column field="descriptorJSON.helpString" header="Description"></Column>
    <Column field="descriptorJSON.iconName" header="Icon"></Column>
  </DataTable>
</template>
