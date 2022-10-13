<template>
  <div class="">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="350"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          bordered
          bottom
          :icon="playerBadgeIcon"
          :color="playerBadgeColor"
          :content="playerBadgeContent"
          offset-x="15"
          offset-y="13"
        >
          <v-btn icon v-bind="attrs" v-on="on">
            <v-avatar :color="avatarColor" size="40">
              {{ player.slice(0, 1) }}
            </v-avatar>
          </v-btn>
        </v-badge>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar :color="avatarColor" size="40">
                {{ player.slice(0, 1).toUpperCase() }}
              </v-avatar>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ player }}</v-list-item-title>
              <!-- <v-list-item-subtitle>Founder of Vuetify</v-list-item-subtitle> -->
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                icon
                :href="'https://www.twitch.tv/' + player"
                target="_blank"
              >
                <v-icon>mdi-twitch</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-btn text color="primary"> Friend Request </v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="red"> kick </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
  <!-- <div class="">
    
      <v-btn icon class="my-3" @click="ReadyOther()">
        <v-avatar :color="avatarColor" size="40">
          {{ player.slice(0, 1) }}
        </v-avatar>
      </v-btn>
    
  </div> -->
</template>

<script>
// import { GameModel } from '~/machine/GameMachine'

export default {
  name: "Player",
  props: {
    player: String,
    gameStarted: String,
    isReady: Boolean,
  },
  data: () => ({
    menu: false,
  }),
  computed: {
    userpoints() {
      return this.$store.getters.getContext.userpoints;
    },
    user() {
      return this.$store.getters.getUser;
    },
    playerBadgeIcon() {
      if (this.gameStarted != null) return "";
      if (this.isReady) return "mdi-check";
      if (!this.isReady) return "mdi-close";
    },
    playerBadgeColor() {
      if (this.gameStarted != null) return "primary";
      if (this.isReady) return "success";
      if (!this.isReady) return "red";
    },
    playerBadgeContent() {
      if (this.gameStarted != null)
        return this.userpoints ? this.userpoints : "0";
      else return "";
    },
    avatarColor() {
      if (this.user != null) {
        if (this.player == this.user.username) {
          return "pink";
        }
        if (this.user.friends.filter((f) => f.name == this.player)) {
          return "indigo ";
        }
      }
      return "primary";
    },
  },
  methods: {
    // TEST /////////
    ReadyOther() {
      // this.$machine.send(GameModel.events.ready(this.player.id))
    },
    ///////////////////
    Leave() {
      let result;
      this.$socket.unsubscribe(this.Context.roomCode);
      this.$socket
        .invoke("leave", {
          roomCode: this.Context.roomCode,
        })
        .then((res) => {
          this.$store.commit("setContext", res);
          this.$router.push("/lobby");
        });
      console.log(result);
    },
  },
};
</script>
