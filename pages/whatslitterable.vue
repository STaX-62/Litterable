<template>
  <div class="text-center">
    <h1>Qu'est-ce que Litterable ?</h1>
    <v-row class="my-6">
      <v-col md="4" sm="12">
        <v-lazy
          :options="{
            threshold: 0.5,
          }"
          min-height="200"
          transition="fade-transition"
        >
          <v-card class="mx-auto" max-width="336">
            <v-card-title>Origines</v-card-title>

            <v-card-text>
              Litterable est un projet personnel réalisé par Clément Mouronval.
              L'objectif de Litterable est de créer une plateforme de jeu
              inspiré du Scrabble® jouable en ligne avec d'autres joueurs. PS:
              aussi pour prouver que je ne suis pas si nul que ça en dev
              contrairement à ce que pensent certaines entreprises après 3min
              d'entretien =)
            </v-card-text>
          </v-card>
        </v-lazy>
      </v-col>
      <v-col md="4" sm="12" cols="12">
        <v-lazy
          :options="{
            threshold: 0.5,
          }"
          min-height="200"
          transition="fade-transition"
        >
          <v-card class="mx-auto" max-width="336">
            <v-card-title>
              <v-icon class="mr-2">mdi-twitch</v-icon>
              Intégration Twitch</v-card-title
            >

            <v-card-text>
              Litterable utilise l'api de Twitch majoritairement pour la
              création et gestion des utilisateurs, mais à l'avenir d'autres
              intégrations sont à prévoir pour améliorer le jeu et proposer de
              nouvelles expériences si le jeu rencontre un quelconque succès (on
              ne sait jamais xD)
            </v-card-text>
          </v-card>
        </v-lazy>
      </v-col>
      <v-col md="4" sm="12">
        <v-lazy
          :options="{
            threshold: 0.5,
          }"
          min-height="200"
          transition="fade-transition"
        >
          <v-card class="mx-auto" max-width="336">
            <v-card-title>
              <v-icon class="mr-2">mdi-twitch</v-icon>
              Stack de Développement
            </v-card-title>

            <v-card-text>
              <v-list class="text-left" dense>
                <v-subheader>Front-end</v-subheader>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-nuxt</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>Nuxt.js</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-vuetify</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>Vuetify</v-list-item-content>
                </v-list-item>
                <v-subheader>Back-end</v-subheader>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-nodejs</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>Node.js</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-img
                      src="/socketcluster.png"
                      height="24"
                      width="24"
                    ></v-img>
                  </v-list-item-icon>
                  <v-list-item-content>SocketCluster</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-img src="/xstate.png" height="24" width="24"></v-img>
                  </v-list-item-icon>
                  <v-list-item-content>Xstate (TS)</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
  </div>
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
};
</script>
  