<template>
  <v-row class="ma-2">
    <v-col cols="12" md="6" sm="12" class="text-center">
      <v-card>
        <div class="grid">

          <div v-for="(val, x) in Board" :key="x" style=" position: relative;">
            <div v-for="(val, y) in Board[x]" :id="'tile-' + y + '-' + x" :key="y" style=" position: relative;">
              <draggable v-model="Board[x][y]" class="grid-tile" group="grid" style="width:calc(3rem + 2px); height: calc(3rem + 2px);border: thin solid hsla(0, 0%, 100%, 0.12);"
                :move="onMoveCallback">

                <div class="tile" v-for="(tile, index) in Board[x][y]" :key="index" :color="TileState(tile, x, y)">
                  {{ tile.id }}
                  <div style="position:absolute;bottom:4px;right:5px;line-height: 1em;">{{ tile.value }} </div>
                </div>
                <transition-group name="grid"></transition-group>
              </draggable>
              <!-- <v-text-field solo :v-model=" message[index]" style="z-index: 2;" hide-details maxlength="1">
            </v-text-field> -->
            </div>
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
        <v-row justify="center">
          <v-col v-for="player in Lobby" :key="player.id" cols="3">
            <Player :player="player" :gameStarted="gameTime" :isReady="isReady(player)"></Player>
            <p class="text-center">
              {{ player.name }}
            </p>
          </v-col>
        </v-row>
        <v-divider />
        <div v-if="gameTime != null">
          <v-card-title> Vos pièces: <v-spacer></v-spacer> pièces restantes: {{ remainingTiles }}</v-card-title>

          <draggable v-model="userTiles" group="grid" class="tile-row" :move="onMoveCallback">
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
        <v-btn color="primary" @click="placeWord()">
          Valider le tour
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
// import { GameModel } from '~/machine/GameMachine'
import draggable from 'vuedraggable'
import Player from '~/components/Player.vue'
export default {
  name: 'Salon',
  components: {
    draggable,
    Player
  },
  data() {
    return {
      board: {
        TW: ['0-0', '0-7', '0-14', '7-0', '7-14', '14-0', '14-7', '14-14'],
        DW: [
          '1-1', '1-13', '2-2', '2-12', '3-3', '3-11', '4-4', '4-10',
          '10-4', '10-10', '11-3', '11-11', '12-2', '12-12', '13-1', '13-13'
        ],
        TL: ['1-5', '1-9', '5-1', '5-5', '5-9', '5-13', '9-1', '9-5', '9-9', '9-13', '13-5', '13-9'],
        DL: ['0-3', '0-11', '2-6', '2-8', '3-0', '3-7', '3-14', '6-2', '6-6', '6-8', '6-12', '7-3',
          '7-11', '8-2', '8-6', '8-8', '8-12', '11-0', '11-7', '11-14', '12-6', '12-8', '14-3', '14-11'
        ],
        CS: '7-7'
      },
      LobbyUsers: [],
      ReadyUsers: [],
      playedTiles: [],
      Host: null,
      gameTime: null,
      userTiles: [],
      remainingTiles: 0,
      Board: Array.from(new Array(15), x => Array.from(new Array(15), y => [])),
      currentPlayer: null
    }
  },
  computed: {
    Lobby() {
      return this.LobbyUsers
    }
  },
  mounted() {
    // this.$machine.onChange(() => {
    //   this.currentPlayer = this.$machine.state.context.currentPlayer
    //   this.LobbyUsers = this.$machine.state.context.Users
    //   this.ReadyUsers = this.$machine.state.context.playersReady
    //   this.Host = this.$machine.state.context.Host
    //   this.gameTime = this.$machine.state.context.gameStarted
    //   this.userTiles = this.$machine.state.context.Users.find(u => u.id == this.$user.id).tiles
    //   this.remainingTiles = 0
    //   for (const t of this.$machine.state.context.Tiles.values()) {
    //     this.remainingTiles = this.remainingTiles + t.number
    //   }
    //   console.log(new Date())
    //   console.log(this.$machine.state.context.gameStarted)
    //   console.log(this.$machine.state.context.Users)
    // })
    // this.$machine.send(
    //   GameModel.events.host(this.$user.id, this.$user.name, this.$user.xp, 15)
    // )
    this.board.TW.forEach(e => {
      document.getElementById('tile-' + e).classList.toggle('TW')
    })
    this.board.DW.forEach(e => {
      document.getElementById('tile-' + e).classList.toggle('DW')
    })
    this.board.TL.forEach(e => {
      document.getElementById('tile-' + e).classList.toggle('TL')
    })
    this.board.DL.forEach(e => {
      document.getElementById('tile-' + e).classList.toggle('DL')
    })
    document.getElementById('tile-' + this.board.CS).classList.toggle('CS')
  },
  methods: {
    Ready() {
      if (this.ReadyUsers.filter(u => u == this.$user.id).length > 0) {
        this.$machine.send(GameModel.events.ready(this.$user.id))
      } else {
        this.$machine.send(GameModel.events.ready(this.$user.id))
      }
    },
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
      if (evt.to.classList.contains('tile-row')) {
        if (this.playedTiles.find(t => t.id == evt.draggedContext.element.id && t.value == evt.draggedContext.element.value)) {
          this.playedTiles.splice(this.playedTiles.findIndex(t => t.id == evt.draggedContext.element.id && t.value == evt.draggedContext.element.value), 1)
        }
      }
      if (!evt.to.classList.contains('tile-row')) {
        if (this.Board[7][7][0] === undefined && evt.to.parentElement.id != "tile-7-7") {
          return false
        }
        if (evt.relatedContext.list.length > 0 || evt.draggedContext.element.placement !== undefined /*|| this.currentPlayer != this.$user.id */)
          return false;
      }
    },
    TileState(tile, x, y) {
      if (!this.playedTiles.find(t => t.id == tile.id && t.value == tile.value)) {
        this.playedTiles.push(tile)
      }
      if ((this.Board[x - 1][y][0] != undefined || this.Board[x + 1][y][0] != undefined || this.Board[x][y - 1][0] != undefined || this.Board[x][y + 1][0] != undefined)) {
        return 'success'
      }
      return 'danger'
    },
    placeWord() {
      var letters = []
      for (var x = 0; x < this.Board.length; x++) {
        for (var y = 0; y < this.Board[x].length; y++) {
          if (this.Board[x][y][0]) {
            if (!this.Board[x][y][0].placement) {
              this.Board[x][y][0].placement = { x: x, y: y }
              letters.push(this.Board[x][y][0])
              console.log(letters)
            }
            console.log(this.Board[x][y][0])
          }
        }
      }
      console.log(letters)
      console.log(this.$machine.send(GameModel.events.placeWord(this.$user.id, letters, letters.map(t => t.id))))
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

.grid-enter-active,
.grid-leave-active {
  transition: all 0.5s ease;
}

.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: translateX(30px);
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
  transition: all 0.5s ease;
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

div[color=success] {
  background: green;
}

div[color=danger] {
  background: red;
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
