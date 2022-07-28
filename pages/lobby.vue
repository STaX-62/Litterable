<template>
  <v-row class="ma-2">
    <v-col cols="12" md="6" sm="12" class="text-center">
      <v-card>
        <div class="grid">
          <div v-for="(val, index) in 225" :id="'tile-' + index" :key="index" style=" position: relative;">
            <draggable v-model="newBoard[index]" class="grid-tile" group="people" style="width:calc(3rem + 2px); height: calc(3rem + 2px);border: thin solid hsla(0, 0%, 100%, 0.12);"
              :move="onMoveCallback">
              <div class="tile" v-for="(tile, index) in newBoard[index]" :key="index">
                {{ tile.id }}
                <div style="position:absolute;bottom:4px;right:5px;line-height: 1em;">{{ tile.value }} </div>
              </div>
            </draggable>
            <!-- <v-text-field solo :v-model=" message[index]" style="z-index: 2;" hide-details maxlength="1">
            </v-text-field> -->
          </div>
        </div>
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
          <v-card-title> Vos pièces: <v-spacer></v-spacer> pièces restantes: {{ remainingTiles }}</v-card-title>

          <draggable v-model="userTiles" group="people" @start="drag = true" @end="drag = false" class="tile-row" :move="onMoveCallback">
            <div class="tile" v-for="(tile, index) in userTiles" :key="index">
              {{ tile.id }}
              <div style="position:absolute;bottom:4px;right:5px;line-height: 1em;">{{ tile.value }} </div>
            </div>
          </draggable>
        </div>
        <v-card-text v-if="gameTime == null">
          <v-btn :color="isReady($user) ? 'success' : 'red'" @click="Ready()">
            {{ isReady($user) ? 'Prêt' : 'Pas Prêt' }}
          </v-btn>
          <v-btn color="primary" :disabled="EveryoneReady()" @click="Start()" v-if="isHost()">
            Démarrer
          </v-btn>
        </v-card-text>
        <v-btn color="primary" :disabled="EveryoneReady()" @click="placeWord()">
          Valider
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { GameModel } from '~/machine/GameMachine'
import draggable from 'vuedraggable'
export default {
  name: 'Salon',
  components: {
    draggable
  },
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
      userTiles: [],
      remainingTiles: 0,
      Board: Array.from(new Array(225), x => []),
      newBoard: Array.from(new Array(225), x => []),
      drag: false
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
      this.remainingTiles = 0
      for (const t of this.$machine.state.context.Tiles.values()) {
        this.remainingTiles = this.remainingTiles + t.number
      }
      console.log(new Date())
      console.log(this.$machine.state.context.gameStarted)
      console.log(this.$machine.state.context.Users)
    })
    this.$machine.send(
      GameModel.events.host(this.$user.id, this.$user.name, this.$user.xp)
    )
    for (var i = 0; i < 225; i++) {
      this.board.TW.forEach((e) => {
        if (i == e - 1) {
          document.getElementById('tile-' + i).classList.toggle('TW')
        }
      })
      this.board.DW.forEach((e) => {
        if (i == e - 1) {
          document.getElementById('tile-' + i).classList.toggle('DW')
        }
      })
      this.board.TL.forEach((e) => {
        if (i == e - 1) {
          document.getElementById('tile-' + i).classList.toggle('TL')
        }
      })
      this.board.DL.forEach((e) => {
        if (i == e - 1) {
          document.getElementById('tile-' + i).classList.toggle('DL')
        }
      })
      if (i == this.board.CS - 1) {
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
    onMoveCallback(evt, originalEvent) {
      if (evt.relatedContext.list.length > 0 || evt.draggedContext.element.placement === undefined)
        return false;
    },
    placeWord() {
      this.$machine.send(GameModel.events.placeWord())
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
  z-index: -1;
  width: calc(3rem + 2px);
  height: calc(3rem + 2px);
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 1s z-index;
  border: thin solid hsla(0, 0%, 100%, 0.12);
}

.grid {
  display: grid;
  z-index: 1;
  grid-template-columns: repeat(15, calc(3rem + 2px));
  grid-template-rows: repeat(15, calc(3rem + 2px));
  width: fit-content;
  margin: 0 auto;
  position: relative;
  background: transparent;
}

.tile {
  background: #dac67e;
  color: black;
  height: 3rem;
  width: 3rem;
  border-radius: 10px;
  line-height: 3rem;
  transform: translate(0, 0);
  margin: auto;
}

.tile-row {
  display: grid;
  grid-template-columns: repeat(7, calc(3rem + 5px));
  grid-template-rows: 3rem;
  width: 50%;
  padding: 10px;
  margin: 10px auto;
  justify-content: center;
  border: thin solid hsla(0, 0%, 100%, 0.12);
}

.flip-list-move {
  transition: transform 0.5s;
}

@media (max-width: 1600px) {

  :root {
    font-size: 60%;
  }
}

@media (max-width: 1050px) {

  :root {
    font-size: 50%;
  }
}

@media (max-width: 960px) {

  :root {
    font-size: 1.8vw;
  }
}

@media (max-width: 600px) {
  .grid {
    height: 100vw;
  }
}
</style>
