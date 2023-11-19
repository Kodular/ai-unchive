<script setup lang="ts">
import { AIAsset } from "aia-kit/ai_asset.js";
import prettyBytes from "pretty-bytes";

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

let props = defineProps<{ assets: AIAsset[] }>();

const assets = props.assets;

</script>

<template>
  <DataTable :value="assets" scrollable scrollHeight="flex" tableStyle="min-width: 50rem">
    <Column field="name" header="Name"></Column>
    <Column field="type" header="Type"></Column>
    <Column header="Size">
      <template #body="slotProps">
        {{ prettyBytes(slotProps.data.size) }}
      </template>
      <template #footer>
        &sum; = {{ prettyBytes(assets.map(it => it.size).reduce((a, v) => a + v, 0)) }}
      </template>
    </Column>
    <Column header="Download">
      <template #body="slotProps">
        <a :href="slotProps.data.getURL()" target="_blank">Download</a>
      </template>
    </Column>
  </DataTable>
</template>