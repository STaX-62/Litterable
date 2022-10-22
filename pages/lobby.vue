<template>
  <v-row class="ma-2">
    <v-col cols="12" md="6" sm="12" class="text-center">
      <v-card>
        <draggable v-model="Board" group="grid" :move="onMoveCallback" @end="handleDragEnd" handle=".draggable">
          <transition-group tag="div" class="grid" name="grid">
            <div v-for="(item, index) in Board" :key="index + 0" style="border: thin solid hsla(0, 0%, 100%, 0.12);">
              <div :id="'tile-'+ index" style="position:relative; width:100%;height:100%">
                <div :class="'tile ' + (item.id != null ? 'draggable' : '')" v-if="item.id != null">
                  {{item.id}}
                  <div>
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </draggable>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" sm="12" class="text-center" style="height: 100%">
      <v-row style="height: 100%">
        <v-col cols="12" md="12" sm="6">
          <v-card style="height: 100%">
            <v-card-title>
              Salon de {{ user }}
              <v-chip class="mx-2" outlined>
                {{ Context.roomCode }}
              </v-chip>
              <v-spacer></v-spacer>
              <v-btn icon @click="Leave">
                <v-icon>mdi-logout</v-icon>
              </v-btn>
            </v-card-title>
            <v-row justify="center">
              <v-col v-for="player in Context.players" :key="player" cols="3">
                <Player :player="player" :gameStarted="Context.gameTime" :isReady="isReady(player)"></Player>
                <p class="text-center my-2">
                  {{ player }}
                </p>
              </v-col>
            </v-row>
            <v-divider />
            <div v-if="Context.gameTime != null">
              <v-card-title>
                Vos pièces: <v-spacer></v-spacer> pièces restantes:
                {{ Context.remainingTiles }}</v-card-title>
              <draggable v-model="userTiles" group="grid" class="tile-row" :move="onMoveCallback" @end="handleDragEnd">
                <div class="tile" v-for="(tile, index) in userTiles" :key="index">
                  {{ tile.id }}
                  <div>
                    {{ tile.value }}
                  </div>
                </div>
              </draggable>
            </div>
            <v-card-text v-if="Context.gameTime == null">
              <v-btn :color="isReady(user) ? 'success' : 'red'" @click="Ready()">
                {{ isReady(user) ? "Prêt" : "Pas Prêt" }}
              </v-btn>

              <v-btn color="primary" :disabled="EveryoneReady()" @click="Start()" v-if="isHost">Démarrer
              </v-btn>
              <div v-if="Context.players.length < 2" class="my-2">
                Vous avez besoin d'un joueur de plus pour démarrer
              </div>
            </v-card-text>
            <div v-if="Context.serverMSG != ''" class="my-2">
              Vous avez besoin d'un joueur de plus pour démarrer
            </div>
            <v-btn color="primary" @click="placeWord()" v-if="Context.currentPlayer == user">
              Valider le tour
            </v-btn>
          </v-card>
        </v-col>
        <v-col cols="12" md="12" sm="6" style="height: 50%">
          <v-card>
            <v-card-title>Server Logs</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
// import { GameModel } from '~/machine/GameMachine'
import draggable from "vuedraggable";
// import Sortable from 'sortablejs';
import Player from "~/components/Player.vue";
export default {
  name: "Salon",
  components: {
    draggable,
    Player,
  },
  data() {
    return {
      board: {
        TW: ["0", "7", "14", "105", "119", "210", "217", "224"],
        DW: [
          "16",
          "28",
          "32",
          "42",
          "48",
          "56",
          "64",
          "70",
          "154",
          "160",
          "168",
          "176",
          "182",
          "192",
          "196",
          "208",
        ],
        TL: [
          "20",
          "24",
          "76",
          "80",
          "84",
          "88",
          "136",
          "140",
          "144",
          "148",
          "200",
          "204",
        ],
        DL: [
          "3",
          "11",
          "36",
          "38",
          "45",
          "52",
          "59",
          "92",
          "96",
          "98",
          "102",
          "108",
          "116",
          "122",
          "126",
          "128",
          "132",
          "165",
          "172",
          "179",
          "186",
          "188",
          "213",
          "221",
        ],
        CS: "112",
      },
      Board: Array.from(new Array(225), (x) => { return { id: null, value: null } }),
    };
  },
  computed: {
    Lobby() {
      return this.players;
    },
    user() {
      if (this.$store.getters.getUser != null) {
        return this.$store.getters.getUser.username;
      } else {
        return this.$store.getters.getGuestname;
      }
    },
    Context() {
      return this.$store.getters.getContext;
    },
    userTiles: {
      get() {
        return this.$store.getters.getContext.userTiles;
      },
      set(value) {
        this.$store.commit("setUserTiles", value);
      },
    },
    isHost() {
      console.log(this.user == this.Context.Host);
      console.log(this.user);
      console.log(this.Context.Host);
      return this.user == this.Context.Host;
    },
  },
  mounted() {
    (async () => {
      let channel = this.$socket.subscribe(this.Context.roomCode);
      for await (let data of channel) {
        this.$store.commit("setContext", data);
        if (data.gameTime !== undefined) this.wsContext();
      }
    })();
    this.wsContext();
    this.board.TW.forEach((e) => {
      document.getElementById("tile-" + e).classList.toggle("TW");
    });
    this.board.DW.forEach((e) => {
      document.getElementById("tile-" + e).classList.toggle("DW");
    });
    this.board.TL.forEach((e) => {
      document.getElementById("tile-" + e).classList.toggle("TL");
    });
    this.board.DL.forEach((e) => {
      document.getElementById("tile-" + e).classList.toggle("DL");
    });
    document.getElementById("tile-" + this.board.CS).classList.toggle("CS");
  },
  methods: {
    wsContext() {
      this.$socket
        .invoke("context", {
          roomCode: this.Context.roomCode,
        })
        .then((res) => {
          this.$store.commit("setContext", res);
        });
    },
    async Ready() {
      let result;
      try {
        result = await this.$socket.invoke("ready", {
          roomCode: this.Context.roomCode,
        });
        console.log(result);
        if (result == this.Context.roomCode) {
          this.$router.push("/");
        }
      } catch (error) {
        console.log(error.name);
      }
    },
    Leave() {
      this.$socket.unsubscribe(this.Context.roomCode);
      this.$socket
        .invoke("leave", {
          roomCode: this.Context.roomCode,
        })
        .then((res) => {
          this.$store.commit("setContext", res);
          this.$router.push("/");
        });
    },
    isReady(player) {
      return this.Context.readyPlayers.includes(player);
    },
    EveryoneReady() {
      return !(
        this.Context.readyPlayers.length == this.Context.players.length &&
        this.Context.players.length > 1
      );
    },
    Start() {
      this.$socket
        .invoke("start", {
          roomCode: this.Context.roomCode,
        })
        .then((res) => {
          this.$store.commit("setContext", res);
        });
    },
    UpdateBoard(evt, item) {
      console.log(item);
      console.log(evt);
    },
    startDrag(evt, tile, index) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("tile", tile.id);
      evt.dataTransfer.setData("index", index);
      console.log(tile)
    },
    onDrop(evt, list) {
      const itemID = evt.dataTransfer.getData('tile');
      const index = evt.dataTransfer.getData('index');
      // const item = this.userTiles.find((item) => item.id == itemID);
      // item.list = list;
      console.log(index);
      console.log(itemID);
      console.log(evt)
    },
    onMoveCallback(e, originalEvent) {
      console.log(e)
      const { index, futureIndex } = e.draggedContext;
      this.movingIndex = index;
      this.futureIndex = futureIndex;
      this.Listfrom = e.from._prevClass;
      this.Listto = e.to._prevClass;
      console.log(index)
      console.log(futureIndex)
      return false; // disable sort

      // if (evt.to.classList.contains("tile-row")) {
      //   if (
      //     this.Context.playedTiles.find(
      //       (t) =>
      //         t.id == evt.draggedContext.element.id &&
      //         t.value == evt.draggedContext.element.value
      //     )
      //   ) {
      //     this.Context.playedTiles.splice(
      //       this.Context.playedTiles.findIndex(
      //         (t) =>
      //           t.id == evt.draggedContext.element.id &&
      //           t.value == evt.draggedContext.element.value
      //       ),
      //       1
      //     );
      //   }
      // }
      // if (!evt.to.classList.contains("tile-row")) {
      //   if (
      //     this.Board[7][7][0] === undefined &&
      //     evt.to.parentElement.id != "tile-7-7"
      //   ) {
      //     return false;
      //   }
      //   if (
      //     evt.relatedContext.list.length > 0 ||
      //     evt.draggedContext.element.placement !== undefined ||
      //     this.Context.currentPlayer != this.user
      //   )
      //     return false;
      // }
    },
    handleDragEnd() {
      if (this.Listfrom == "grid" && this.Listto == "grid") {
        this.futureItem = this.Board[this.futureIndex];
        this.movingItem = this.Board[this.movingIndex];
        const _items = Object.assign([], this.Board);
        _items[this.futureIndex] = this.movingItem;
        _items[this.movingIndex] = this.futureItem;
        this.Board = _items;
      }
      if (this.Listfrom == "tile-row" && this.Listto == "grid") {
        this.futureItem = this.userTiles[this.movingIndex];
        const _items = Object.assign([], this.Board);
        _items[this.futureIndex] = this.futureItem;
        this.Board = _items;
        this.$socket
          .invoke("placeTile", {
            roomCode: this.Context.roomCode,
          })
      }

    },
    // TileState(tile, x, y) {
    //   if (
    //     !this.Context.playedTiles.find(
    //       (t) => t.id == tile.id && t.value == tile.value
    //     )
    //   ) {
    //     this.Context.playedTiles.push(tile);
    //   }
    //   if (
    //     this.Board[x - 1][y][0] != undefined ||
    //     this.Board[x + 1][y][0] != undefined ||
    //     this.Board[x][y - 1][0] != undefined ||
    //     this.Board[x][y + 1][0] != undefined
    //   ) {
    //     return "success";
    //   }
    //   return "danger";
    // },
    placeWord() {
      var letters = [];
      for (var x = 0; x < this.Board.length; x++) {
        for (var y = 0; y < this.Board[x].length; y++) {
          if (this.Board[x][y][0]) {
            if (!this.Board[x][y][0].placement) {
              this.Board[x][y][0].placement = { x: x, y: y };
              letters.push(this.Board[x][y][0]);
              console.log(letters);
            }
            console.log(this.Board[x][y][0]);
          }
        }
      }
      console.log(letters);
      console.log(
        this.$machine.send(
          GameModel.events.placeWord(
            this.$user.id,
            letters,
            letters.map((t) => t.id)
          )
        )
      );
    },
  },
};
</script>

<style>
.TW::before {
  content: "3W";
  background: #eb5c72;
}

.DW::before {
  content: "2W";
  background: #edafb8;
}

.TL::before {
  content: "3L";
  background: #666a86;
}

.DL::before {
  content: "2L";
  background: #95b8d1;
}

.CS::before {
  content: "★";
  background: #e8ddb5;
}

.TW::before,
.DW::before,
.TL::before,
.DL::before,
.CS::before {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
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
  ;
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
  border: 1px solid hsla(0, 0%, 2%, 0.466);
}

.tile div {
  position: absolute;
  bottom: 4px;
  right: 5px;
  line-height: 1em;
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

div[color="success"] {
  background: green;
}

div[color="danger"] {
  background: red;
}

.flip-list-move {
  transition: transform 0.5s;
}

.grid-move {
  transition: all 0.3s;
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
