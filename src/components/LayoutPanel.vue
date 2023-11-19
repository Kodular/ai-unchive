<script setup lang="ts">
import { AIComponent } from "aia-kit/ai_component.js";
import SelectButton from "primevue/selectbutton";
import Tree, { TreeNode } from "primevue/tree";
import { computed, ref } from "vue";

let props = defineProps<{ form: AIComponent }>();

const form = props.form;

let emit = defineEmits<{
  (e: 'componentSelected', component: AIComponent): void
}>()

let visibility = ref("All");

function componentToTreeNode(component: AIComponent): any {
  if (component.type !== 'Form') {
    if (visibility.value === 'Visible' && !component.visible) {
      return null
    }

    if (visibility.value === 'Non-Visible' && component.visible) {
      return null
    }
  }
  return {
    key: component.name,
    label: component.name,
    children: component.children.map(componentToTreeNode).filter(Boolean),
    componentRef: component,
  };
}

let nodes = computed(() => {
  return [
    componentToTreeNode(form),
  ];
});

let topLevelComponents = computed(() => {
  let m = new Map<string, boolean>();
  for (let component of form.children) {
    m.set(component.name, true);
  }
  return m;
});


function onNodeSelect(node: TreeNode) {
  emit('componentSelected', node.componentRef);
}

</script>

<template>
  <SelectButton v-model="visibility" :options="['All', 'Visible', 'Non-Visible']" />
  <Tree :value="nodes" :expandedKeys="topLevelComponents" selectionMode="single" @nodeSelect="onNodeSelect" />
  <pre>{{ topLevelComponents }}</pre>
</template>
