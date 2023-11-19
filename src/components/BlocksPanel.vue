<script setup lang="ts">
import { ref, watch } from 'vue';
import { getDescriptor } from "aia-kit/utils/utils.js";
import SelectButton from 'primevue/selectbutton';

let props = defineProps<{ blocksXml: string }>()

const blocksXml = props.blocksXml

let totalBlocks = blocksXml.match(/<\/block>/g)?.length ?? 'failed'

let renderMode = ref('Blocks')
let blocklyDiv = ref<HTMLElement | null>(null)

watch(blocklyDiv, () => {
  if (blocklyDiv.value === null) {
    return
  }

  const ws = Blockly.inject(blocklyDiv.value, {
    readOnly: true,
    trashcan: false,
    toolbox: false,
    scrollbars: true,
    grid: {
      spacing: 20,
      length: 3,
      colour: '#ccc',
      snap: true,
    },
    // zoom: {
    //     controls: true,
    //     // wheel: true,
    //     startScale: 1.0,
    //     maxScale: 3,
    //     minScale: 0.3,
    //     scaleSpeed: 1.2,
    //     pinch: true,
    // },
  });

  ws.getDescriptor = getDescriptor
  Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(blocksXml), ws)
})

</script>

<template>
  <p>Total blocks = {{ totalBlocks }}</p>
  <SelectButton v-model="renderMode" :options="['Blocks', 'Raw']" />
  <div v-if="renderMode === 'Blocks'" ref="blocklyDiv" style="height: 100%"></div>
  <pre v-else>{{ blocksXml }}</pre>
</template>
