<template>
  <v-row justify="center" align="center">
    <v-col cols="4" sm="4" md="4">
      <v-card>
        <v-card-title class="headline justify-center">
          Modes de jeu
        </v-card-title>
        <v-card-text>
          <v-row class="pa-3 my-3">
            <v-btn
              color="primary"
              nuxt
              to="/searchlobby"
              class="mx-auto"
              x-large
              :disabled="IsInRoom != null"
            >
              Rejoindre
            </v-btn>
          </v-row>
          <v-row class="pa-3 my-3">
            <v-btn
              color="primary"
              nuxt
              to="/lobby"
              class="mx-auto"
              x-large
              :disabled="IsInRoom != null"
            >
              Héberger
            </v-btn>
          </v-row>
          <v-row class="pa-3 my-3" v-if="IsInRoom">
            <v-btn color="primary" nuxt to="/lobby" class="mx-auto" x-large>
              Reprendre
              <v-chip class="ml-2" small label>{{ IsInRoom.roomCode }}</v-chip>
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <!-- <v-col cols="4" sm="4" md="4">
      <v-card>
        <v-card-title class="headline justify-center">
          Tableau des scores
        </v-card-title>
        <v-card-text>
          <v-row class="pa-3 my-3">
            <v-data-iterator />
          </v-row>
        </v-card-text>
      </v-card>
    </v-col> -->
  </v-row>
</template>

<script>
export default {
  name: "IndexPage",
  computed: {
    IsInRoom() {
      if (this.$store.getters.getUser) return this.$store.getters.getUser.room;
      return null;
    },
  },
  created() {
    this.$store.dispatch("getUserData");
  },
};
</script>
