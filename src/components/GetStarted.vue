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
        <h1 class="text-h2 font-weight-bold px-4 py-4">Now, <br>Transfer your playlist from One Music App to Other</h1>
        <v-btn color="primary" variant="outlined" block  @click="onClick" >Try it out!</v-btn>
      </div>

      <div class="py-4" />

    </v-responsive>
  </v-container>
</template>
<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const onClick = () => {
  router.push({ path: "/playlistsrc" })
}

</script>