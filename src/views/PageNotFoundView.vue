<template>
    <v-container class="fill-height">
      <v-responsive
        class="align-centerfill-height mx-auto"
        max-width="900"
      >
        <!-- <v-img
          class="mb-4"
          height="150"
          src="@/assets/logo.png"
        /> -->
  
        <div class="text-center">
          <h1 class="text-h1 font-weight-bold px-1 py-1">404</h1>
          <h2 class="text-h3 font-weight-bold px-3 py-3">Page Not Found!</h2>
          <v-btn class="px-4 py-4" color="primary"  block  @click="onClick" > Get Back to Home</v-btn>
        </div>
  
        <div class="py-4" />
  
      </v-responsive>
    </v-container>
  </template>
  <script setup>
  import { useRouter } from "vue-router"
  
  
  const onClick = () => {
        console.log("OnCLick! Implementation yet to be done")
  
  const router = useRouter()
        router.push("/")
      }
  
  </script>