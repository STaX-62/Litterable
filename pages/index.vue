<template>
  <v-row justify="center" align="center">
    <v-col cols="4" sm="4" md="4">
      <v-card>
        <v-card-title class="headline justify-center">
          Modes de jeu
        </v-card-title>
        <v-card-text>
          <v-row class="pa-3 my-3">
            <v-btn color="primary" nuxt to="/inspire" class="mx-auto" x-large>
              Rejoindre
            </v-btn>
          </v-row>
          <v-row class="pa-3 my-3">
            <v-btn color="primary" nuxt to="/lobby" class="mx-auto" x-large>
              Héberger
            </v-btn>
          </v-row>
          <v-row class="pa-3 my-3">
            <v-btn color="primary" nuxt to="/inspire" class="mx-auto" x-large>
              Equipes
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="4" sm="4" md="4">
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
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage'
}
</script>
