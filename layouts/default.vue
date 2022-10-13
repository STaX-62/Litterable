<template>
  <v-app fixed dark>
    <v-app-bar app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn text @click="connectLink" v-if="!user">
        Connect with Twitch
        <v-icon class="ml-2">mdi-twitch</v-icon>
      </v-btn>
      <User v-if="user"></User>
      <v-badge
        v-for="player in Lobby"
        :key="player.id"
        bordered
        bottom
        :content="LVL(player.xp)"
        color="deep-purple accent-4"
        offset-x="25"
        offset-y="15"
      >
        <v-btn icon>
          <v-avatar color="indigo" size="40">
            {{ player.name.slice(0, 1) }}
          </v-avatar>
        </v-btn>
      </v-badge>
      <v-btn
        icon
        class="ml-2"
        @click.stop="rightDrawer = !rightDrawer"
        v-if="user"
      >
        <v-icon>mdi-account-multiple</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-alert class="ma-4" outlined color="orange" type="info">
        Version non définitive (Work-In-Progress)
      </v-alert>
      <Nuxt />
    </v-main>
    <Friends :rightDrawer="rightDrawer" v-if="user"></Friends>
    <v-footer app>
      <span>&copy; Clément Mouronval {{ new Date().getFullYear() }}</span>
      <span class="mx-2">
        <v-icon>mdi-twitch</v-icon>
        <a href="https://twitch.fr/tup_stax">tup_stax</a>
      </span>
      <span class="mx-2">
        <v-icon>mdi-github</v-icon>
        <a href="https://github.com/STaX-62">STaX-62</a>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import User from "~/components/User.vue";
import Friends from "~/components/Friends.vue";
// import { GameModel } from '~/machine/GameMachine'
export default {
  name: "DefaultLayout",
  data() {
    return {
      rightDrawer: false,
      title: "Litterable",
      notifications: 2,
      LobbyUsers: [],
      client_id: "zlahv2pgul6g7bjzhnaf6ngzghv9m9",
      redirecturl: process.env.CLIENT_URL,
      scope: "user:read:email",
      userprofile: false,
      // audio: new Audio('/joinsound.mp3')
    };
  },
  created() {
    this.$store.dispatch("getUserData");
  },
  computed: {
    user() {
      console.log(this.$store.getters.getUser);
      return this.$store.getters.getUser;
    },
    friends() {
      return this.$friends;
    },
    Lobby() {
      return this.LobbyUsers.filter((u) => u.id !== this.$user.id);
    },
  },
  methods: {
    connectLink() {
      var params = new URLSearchParams({
        response_type: "token",
        client_id: this.client_id,
        redirect_uri: this.redirecturl,
        scope: this.scope,
      });
      window.location.replace(
        `https://id.twitch.tv/oauth2/authorize?` + params
      );
    },
    Invite(friend) {
      // this.$machine.send(
      //   GameModel.events.join(
      //     friend.id,
      //     friend.name,
      //     friend.xp,
      //     this.$machine.state.context.Room
      //   )
      // )
    },
    getAvatarColor(friend) {
      let color = "red";
      if (friend.isOnline) {
        color = "primary";
      }
      if (this.Lobby.filter((u) => u.id == friend.id).length > 0) {
        color = "success";
      }
      return color;
    },
    LVL(xp) {
      return Math.floor(xp / Math.pow(xp, 0.6)) | 0;
    },
  },
  components: { User, Friends },
};
</script>
