<template>
    <v-container class="fill-height">
      <v-responsive
        class="align-centerfill-height mx-auto"
        max-width="900"
      >
        <div class="text-center">
          <h1 class="text-h2 font-weight-bold px-4 py-4">Spotify Playlist- {{ playlist.name }}</h1>
        </div>

        <div class="py-4" />

        <v-card
            class="mx-auto"
            max-width="900"
            height="800"
            >
            <v-card-item class="bg-green-darken-4">

            <v-card-title class="font-weight-bold">
                {{ playlist.name  }}
            </v-card-title>

            <v-card-sub-title class="font-weight-light text-h8" >
             {{ playlist.tracks?.total }} Songs
            </v-card-sub-title>

            <template v-slot:append>
                <v-icon size="xxx-large">mdi-spotify</v-icon>
            </template>
            </v-card-item>

            <v-card-text v-if="playlist?.description" class="pt-4">{{ playlist.description }}</v-card-text>
            <v-card-text v-else class="pt-4">No Description Available</v-card-text>

            <v-divider></v-divider>

            <v-virtual-scroll
                :items="playlist.tracks.items"
                height="940"
                item-height="50"
            >
            <template v-slot:default="{ item }">
                <v-list-item class="py-2">
                <template v-slot:prepend>
                    <v-avatar
                        size="50"
                         rounded="0"
                        >
                        <v-img
                            alt="Album Image"
                            :src="trackImage(item.track?.album?.images)"
                        ></v-img>
                    </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">{{ item.track?.name }}</v-list-item-title>
                <v-list-item-sub-title class="font-weight-light">{{ item.track.album?.name }}</v-list-item-sub-title>

                <template v-slot:append>
                    <v-btn
                    size="small"
                    variant="tonal"
                    >
                    View User

                    <v-icon
                        color="orange-darken-4"
                        end
                    >
                        mdi-open-in-new
                    </v-icon>
                    </v-btn>
                </template>
                </v-list-item>
            </template>
            </v-virtual-scroll>
        </v-card>

        <div class="text-center py-5">
          <v-btn @click="onClick" size="large" color="primary" rounded>Select Destination Music App</v-btn>
        </div>

      </v-responsive>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router"

import useUserStore from "@/stores/userStore"

const router = useRouter()
const userStore = useUserStore()

const playlist = computed(() => userStore.getTracks)

const trackImage= (images)=>{
    if(images[0]){
        return images[0]?.url 
    }
    else{
        return 'https://img.icons8.com/?size=100&id=cyBLpim2K7Ja&format=png&color=000000'
    }
}

const onClick = () => {
  router.push({ path: "/playlistdest" })
}

</script>
