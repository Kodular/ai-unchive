<script setup lang="ts">
import { ref } from 'vue';

import Toolbar from 'primevue/toolbar';
import FileUpload, { FileUploadUploadEvent } from 'primevue/fileupload';


import { IconBrandGithub } from "@tabler/icons-vue";

import Explorer from './Explorer.vue';
import { AIAReader } from 'aia-kit'
import { AIProject } from 'aia-kit/ai_project.js';

const project = ref<AIProject | null>(null);

async function onUpload(ev: FileUploadUploadEvent) {
  const file = (ev.files as File[])[0];

  project.value = await AIAReader.read(file);
}
</script>

<template>
  <Toolbar>
    <template #start>
      <a href="/" style="text-decoration: none;">
        <span class="gradient-text">
          Unchive
        </span>
      </a>
    </template>

    <template #end>
      <a href="https://github.com/Kodular/ai-unchive" target="_blank">
        <IconBrandGithub></IconBrandGithub>
      </a>
    </template>
  </Toolbar>
  <div v-if="!!project">
    <!-- <Suspense> -->
    <Explorer :project="project" />

    <!-- <template #fallback>
            Loading...
          </template>
        </Suspense> -->
  </div>
  <div v-else>
    <p>Select aia file</p>
    <FileUpload mode="basic" accept=".aia" @select="onUpload" />
  </div>
</template>

<style>
body {
  max-height: 100dvh;
}

.gradient-text {
  background: linear-gradient(90deg, #f71dc1 0%, #fda000 100%);
  background-clip: text;
  color: transparent;

  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 2px;
}
</style>