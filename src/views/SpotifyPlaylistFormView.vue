<template>
  <PlayListForm  
    :serviceProviderName="getSrc" 
  />
</template>

<script setup>
import { computed, defineAsyncComponent } from "vue"
import useAppStore from "@/stores/appStore";

const PlayListForm = defineAsyncComponent(() => import("@/components/PlayListForm.vue"))

const getSrc = computed(()=>useAppStore().getSrc)
</script>
