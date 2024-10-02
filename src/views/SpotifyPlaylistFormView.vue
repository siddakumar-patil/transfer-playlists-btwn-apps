<template>
  <PlayListForm  
    serviceProviderName="youtube" 
  />
</template>

<script setup>
import { defineAsyncComponent } from "vue"
const PlayListForm = defineAsyncComponent(() => import("@/components/PlayListForm.vue"))
</script>
