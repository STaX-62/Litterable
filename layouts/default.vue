<template>
  <v-app fixed dark>
    <v-app-bar app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <h4 class="mx-2">
        lvl. {{ LVL(user.xp) }}
      </h4>
      <v-progress-linear value="15" style="width: 100px" color="#EDAFB8" />
      <h4 class="mx-2">
        {{ user.name }}#{{ user.id }}
      </h4>
      <v-badge bordered dot :value="notifications" color="deep-purple accent-4" offset-x="13" offset-y="13">
        <v-btn icon>
          <v-avatar color="pink" size="40">
            {{ user.name.slice(0, 1) }}
          </v-avatar>
        </v-btn>
      </v-badge>
      <v-badge v-for="player in Lobby" :key="player.id" bordered bottom :content="LVL(player.xp)" color="deep-purple accent-4" offset-x="25" offset-y="15">
        <v-btn icon>
          <v-avatar color="indigo" size="40">
            {{ player.name.slice(0, 1) }}
          </v-avatar>
        </v-btn>
      </v-badge>

      <v-btn icon class="ml-2" @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-account-multiple</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" right app>
      <v-list dense>
        <v-subheader>Amis</v-subheader>
        <v-list-item-group v-for="(friend, index) in friends" :key="index" color="primary">
          <v-list-item @click.native="right = !right">
            <v-list-item-action>
              <v-avatar :color="getAvatarColor(friend)" size="40">
                {{ friend.name.slice(0, 1) }}
              </v-avatar>
            </v-list-item-action>
            <v-list-item-title>
              {{ friend.name }}#{{ friend.id }}
            </v-list-item-title>
            <v-btn icon class="ml-2" @click.stop="Invite(friend)">
              <v-icon>mdi-email</v-icon>
            </v-btn>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-footer app>
      <span>&copy; Clément Mouronval {{ new Date().getFullYear() }}</span>
      <span class="mx-2">
        <v-icon>mdi-twitch</v-icon> <a href="https://twitch.fr/tup_stax">tup_stax</a>
      </span>
      <span class="mx-2">
        <v-icon>mdi-github</v-icon> <a href="https://github.com/STaX-62">STaX-62</a>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
// import { GameModel } from '~/machine/GameMachine'
export default {
  name: 'DefaultLayout',
  data() {
    return {
      rightDrawer: false,
      title: 'Litterable',
      notifications: 2,
      LobbyUsers: [],
      // audio: new Audio('/joinsound.mp3')
    }
  },
  computed: {
    user() {
      return this.$user
    },
    friends() {
      return this.$friends
    },
    Lobby() {
      return this.LobbyUsers.filter(u => u.id !== this.$user.id)
    }
  },
  mounted() {
    // this.$machine.onChange(() => {
    //   if (this.$machine.state.context.Users.length > this.LobbyUsers.length) {
    //     // this.audio.play()
    //   }
    //   this.LobbyUsers = this.$machine.state.context.Users
    // })
  },
  methods: {
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
      let color = 'red'
      if (friend.isOnline) {
        color = 'primary'
      }
      if (this.Lobby.filter(u => u.id == friend.id).length > 0) {
        color = 'success'
      }
      return color
    },
    LVL(xp) {
      return Math.floor(xp / Math.pow(xp, 0.6)) | 0
    }
  }
}
</script>
