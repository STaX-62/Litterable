<template>
  <v-row class="ma-2">
    <v-col cols="12" md="6" sm="12" class="text-center">
      <v-card class="grid">
        <div v-for="id in 225" :id="'tile-' + id" :key="id" style="border: thin solid hsla(0, 0%, 100%, 0.12); position: relative" dropzone="" />
      </v-card>
    </v-col>
    <v-col cols="12" md="6" sm="12" class="text-center" style="height: 100%">
      <v-card style="height: 100%">
        <v-card-title>
          Salon de {{ $user.name }}
          <v-chip class="mx-2" outlined>
            {{ $machine.state.context.Room }}
          </v-chip>
        </v-card-title>
        <v-row>
          <v-col v-for="player in Lobby" :key="player.id">
            <v-badge bordered bottom :icon="isReady(player) ? 'mdi-check' : 'mdi-close'" :color="isReady(player) ? 'success' : 'red'" offset-x="15" offset-y="22">
              <!--
                offset-x="20"
              offset-y="23"
              -->
              <v-btn icon class="my-3" @click="ReadyOther(player)">
                <v-avatar :color="avatarColor(player)" size="40">
                  {{ player.name.slice(0, 1) }}
                </v-avatar>
              </v-btn>
            </v-badge>
            <p class="text-center">
              {{ player.name }}
            </p>
          </v-col>
        </v-row>
        <v-divider />
        <div v-if="gameTime != null">
          <v-card-title> Vos pièces:</v-card-title>
          <div class="tile-row">
            <div style="padding:5px" v-for="(tile, index) in userTiles" :key="index">
              <div class="tile elevation-20">
                {{ tile.id }}
              </div>
            </div>
          </div>
        </div>
        <v-card-text v-if="gameTime == null">
          <v-btn :color="isReady($user) ? 'success' : 'red'" @click="Ready()">
            {{ isReady($user) ? 'Prêt' : 'Pas Prêt' }}
          </v-btn>
          <v-btn color="primary" :disabled="EveryoneReady()" @click="Start()" v-if="isHost()">
            Démarrer
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { GameModel } from '~/machine/GameMachine'
export default {
  name: 'Salon',
  data() {
    return {
      board: {
        TW: [1, 8, 15, 106, 120, 211, 218, 225],
        DW: [
          17, 29, 33, 43, 49, 57, 65, 71, 155, 161, 169, 177, 183, 193, 197, 209
        ],
        TL: [21, 25, 77, 81, 85, 89, 137, 141, 145, 149, 201, 205],
        DL: [
          4, 12, 37, 39, 46, 53, 60, 93, 97, 99, 103, 109, 117, 123, 127, 129,
          133, 166, 173, 180, 187, 189, 214, 222
        ],
        CS: 113
      },
      LobbyUsers: [],
      ReadyUsers: [],
      Host: null,
      gameTime: null,
      userTiles: []
    }
  },
  computed: {
    Lobby() {
      return this.LobbyUsers
    },
  },
  mounted() {
    this.$machine.onChange(() => {
      this.LobbyUsers = this.$machine.state.context.Users
      this.ReadyUsers = this.$machine.state.context.playersReady
      this.Host = this.$machine.state.context.Host
      this.gameTime = this.$machine.state.context.gameStarted
      this.userTiles = this.$machine.state.context.Users.find(u => u.id == this.$user.id).tiles
      console.log(new Date())
      console.log(this.$machine.state.context.gameStarted)
      console.log(this.$machine.state.context.Users)
    })
    this.$machine.send(
      GameModel.events.host(this.$user.id, this.$user.name, this.$user.xp)
    )
    for (var i = 1; i <= 225; i++) {
      this.board.TW.forEach((e) => {
        if (i == e) {
          document.getElementById('tile-' + i).classList.toggle('TW')
        }
      })
      this.board.DW.forEach((e) => {
        if (i == e) {
          document.getElementById('tile-' + i).classList.toggle('DW')
        }
      })
      this.board.TL.forEach((e) => {
        if (i == e) {
          document.getElementById('tile-' + i).classList.toggle('TL')
        }
      })
      this.board.DL.forEach((e) => {
        if (i == e) {
          document.getElementById('tile-' + i).classList.toggle('DL')
        }
      })
      if (i == this.board.CS) {
        document.getElementById('tile-' + i).classList.toggle('CS')
      }
    }
  },
  methods: {
    Ready() {
      if (this.ReadyUsers.filter(u => u == this.$user.id).length > 0) {
        this.$machine.send(GameModel.events.unready(this.$user.id))
      } else {
        this.$machine.send(GameModel.events.ready(this.$user.id))
      }
    },
    /// ////////////////
    // TEST
    ReadyOther(player) {
      if (this.ReadyUsers.filter(u => u == player.id).length > 0) {
        this.$machine.send(GameModel.events.unready(player.id))
      } else {
        this.$machine.send(GameModel.events.ready(player.id))
      }
    },
    /// ////////////////
    isReady(player) {
      return this.ReadyUsers.filter(u => u == player.id).length > 0
    },
    EveryoneReady() {
      return !(this.ReadyUsers.length == this.LobbyUsers.length)
    },
    isHost() {
      return this.$user.id == this.Host
    },
    Start() {
      console.log(this.$machine.send(GameModel.events.start(this.$user.id)))
    },
    avatarColor(player) {
      if (player.name == this.$user.name) {
        return 'pink'
      }
      if (this.$friends.filter(f => f.name == player.name)) {
        return 'indigo '
      }
      return 'primary'
    }
  }
}
</script>

<style>
.TW::before {
  content: '3W';
  background: #eb5c72;
}

.DW::before {
  content: '2W';
  background: #edafb8;
}

.TL::before {
  content: '3L';
  background: #666a86;
}

.DL::before {
  content: '2L';
  background: #95b8d1;
}

.CS::before {
  content: '★';
  background: #e8ddb5;
}

.TW::before,
.DW::before,
.TL::before,
.DL::before,
.CS::before {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  width: 100%;
  height: calc(100vh - 140px);
  position: relative;
}

.tile {
  background: #dac67e;
  color: black;
  height: 50px;
  width: 50px;
  border-radius: 10px;
  line-height: 50px;
}

.tile-row {
  display: flex;
  width: 50%;
  margin: auto;
  justify-content: center;
}

@media (max-width: 600px) {
  .grid {
    height: 100vw;
  }
}
</style>
