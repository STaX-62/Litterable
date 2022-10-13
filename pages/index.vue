<template>
  <v-row justify="center" align="center">
    <v-col cols="4" sm="4" md="4">
      <v-card>
        <v-card-title class="headline justify-center">
          Modes de jeu
        </v-card-title>
        <v-card-text class="d-flex flex-column justify-center">
          <v-btn
            color="primary"
            nuxt
            @click="hostLobby"
            class="mx-auto my-3"
            x-large
            :disabled="IsInRoom != null || !user"
          >
            Héberger
          </v-btn>
          <v-btn
            color="primary"
            nuxt
            to="/searchlobby"
            class="mx-auto my-3"
            x-large
            :disabled="true"
          >
            Matchmaking
          </v-btn>
          <v-btn
            color="primary"
            nuxt
            to="/searchlobby"
            class="mx-auto my-3"
            x-large
            :disabled="IsInRoom != null"
          >
            Liste des Parties
          </v-btn>

          <v-row class="pa-3 my-3" v-if="IsInRoom">
            <v-btn color="primary" nuxt to="/lobby" class="mx-auto" x-large>
              Reprendre
              <v-chip class="ml-2" small label>{{ IsInRoom }}</v-chip>
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
      return this.$store.getters.getContext.roomCode;
    },
    user() {
      console.log(this.$store.getters.getUser);
      return this.$store.getters.getUser;
    },
  },
  methods: {
    hostLobby() {
      this.$socket.invoke("host").then((res) => {
        this.$store.commit("setContext", res);
        this.$router.push("/lobby");
      });
    },
  },
};
</script>
