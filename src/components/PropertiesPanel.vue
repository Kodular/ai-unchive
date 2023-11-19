<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import { AIComponent } from "aia-kit/ai_component.js";
import { ComponentPropertyEditor } from "aia-kit/types.js";
import { parseAiBoolean, parseAiColor } from "aia-kit/utils/utils.js";

let props = defineProps<{ component: AIComponent }>();

const component = props.component;

function parseProperty(property: ComponentPropertyEditor): { type: 'text' | 'color' | 'number' | 'boolean', value: string | number | boolean, name: string } {
  if (['boolean', 'visibility'].includes(property.editorType!)) {
    return { type: 'boolean', value: parseAiBoolean(property.value), name: property.name }
  }
  if (property.editorType === 'float') {
    return { type: 'number', value: parseFloat(property.value), name: property.name }
  }
  if (property.editorType === 'color' || property.value.startsWith('&H')) {
    return { type: 'color', value: parseAiColor(property.value), name: property.name }
  }
  return { type: 'text', value: property.value, name: property.name }
}

let componentProperties = component.properties.map(parseProperty)

</script>

<template>
  <div class="flex col gap-2 p-4">
    <div v-for="property in componentProperties">
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
</template>
