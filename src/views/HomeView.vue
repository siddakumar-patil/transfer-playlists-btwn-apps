<template>
    <GetStarted />
</template>

<script setup>
import { defineAsyncComponent } from "vue"

const GetStarted = defineAsyncComponent(() => import("@/components/GetStarted.vue"))
</script>
