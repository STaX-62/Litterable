<template>
  <div class="">
    <v-badge bordered bottom :icon="playerBadgeIcon" :color="playerBadgeColor" :content="playerBadgeContent" offset-x="15" offset-y="22">
      <!--
                offset-x="20"
              offset-y="23"
              -->
      <v-btn icon class="my-3" @click="ReadyOther()">
        <v-avatar :color="avatarColor" size="40">
          {{ player.name.slice(0, 1) }}
        </v-avatar>
      </v-btn>
    </v-badge>
  </div>
</template>

<script>
// import { GameModel } from '~/machine/GameMachine'

export default {
  name: 'Player',
  props: {
    player: Object,
    gameStarted: Number,
    isReady: Boolean
  },
  computed: {
    playerBadgeIcon() {
      if (this.gameStarted)
        return ''
      if (this.isReady && !this.gameStarted)
        return 'mdi-check'
      if (!this.isReady)
        return 'mdi-close'
    },
    playerBadgeColor() {
      if (this.gameStarted)
        return ''
      if (this.isReady && !this.gameStarted)
        return 'success'
      if (!this.isReady)
        return 'red'
    },
    playerBadgeContent() {
      if (this.gameStarted)
        return this.player.points
      else return ''
    },
    avatarColor() {
      if (this.player.name == this.$user.name) {
        return 'pink'
      }
      if (this.$friends.filter(f => f.name == this.player.name)) {
        return 'indigo '
      }
      return 'primary'
    }
  },
  methods: {
    // TEST /////////
    ReadyOther() {
      // this.$machine.send(GameModel.events.ready(this.player.id))
    },
    ///////////////////
  }
}
</script>
