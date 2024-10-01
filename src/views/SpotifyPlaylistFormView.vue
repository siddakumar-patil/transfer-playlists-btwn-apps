<template>
    <PlayListForm />
  </template>
<script setup>
import { defineAsyncComponent, onMounted } from "vue"

import useUserStore from "@/stores/userStore"

const PlayListForm = defineAsyncComponent(() => import("@/components/PlayListForm.vue"))

onMounted(async () => {
  await useUserStore().generateAccessToken()
})
</script>
