<template>
  <v-row>
    <v-col class="text-center" cols="8" offset="2">
      <v-card class="ma-2">
        <v-card-title>
          Liste des parties
          <v-icon class="mx-2" @click="getList">mdi-refresh</v-icon>
          <v-spacer></v-spacer>
          <v-btn nuxt to="/" text> Retour </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-iterator
            :items.sync="items"
            :items-per-page="itemsPerPage"
            :page.sync="page"
            hide-default-footer
            no-data-text="aucune partie ouverte"
          >
            <template v-slot:default="props">
              <v-row>
                <v-col
                  v-for="item in props.items"
                  :key="item.host"
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12"
                >
                  <v-card>
                    <v-card-title class="subheading font-weight-bold">
                      Salon de {{ item.host }}
                      <v-spacer></v-spacer>
                      {{ item.playercount }}/4

                      <v-btn
                        class="ml-4"
                        icon
                        @click="joinLobby(item.code)"
                        :disabled="item.playercount > 3"
                      >
                        <v-icon>mdi-login-variant</v-icon>
                      </v-btn>
                    </v-card-title>
                  </v-card>
                </v-col>
              </v-row>
            </template>
            <template v-slot:footer>
              <v-row class="mt-2" align="center" justify="center">
                <v-pagination
                  v-model="page"
                  :length="numberOfPages"
                  :total-visible="7"
                ></v-pagination>
                <v-spacer></v-spacer>
                <span class="mr-2">Rejoindre avec un code:</span>
                <span class="mr-3" style="max-width: 200px">
                  <v-otp-input v-model="otp" :length="5" plain @finish="joinLobby"> </v-otp-input>
                </span>
              </v-row>
            </template>
          </v-data-iterator>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "InspirePage",
  data: () => ({
    otp: null,
    page: 1,
    itemsPerPage: 6,
    items: [],
  }),
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
  },
  methods: {
    async getList() {
      let result;
      try {
        result = await this.$socket.invoke("search");
        this.items = result;
      } catch (error) {
        console.log(error.name);
      }
    },
    joinLobby(code) {
      this.$socket.invoke("join", { code: code.toUpperCase() }).then((res) => {
        this.$store.commit("setContext", res);
        this.$router.push('/lobby')
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>