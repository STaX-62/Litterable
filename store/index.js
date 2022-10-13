import Vue from "vue"

export const state = () => ({
    user: null,
    guestname: null,
    room: null,
    LoadingChanges: false,
    Context: {
        roomCode: null,
        Host: null,
        players: [],
        readyPlayers: [],
        playedTiles: [],
        gameTime: null,
        userTiles: [],
        remainingTiles: 0,
        userpoints: 0,
        currentPlayer: null,
        serverMSG: ""
    },
})

export const getters = {
    getUser(state) {
        return state.user
    },
    getContext(state) {
        return state.Context
    },
    getGuestname(state) {
        return state.guestname
    },
    getGuestname(state) {
        return state.guestname
    },
    getLoadingChanges(state) {
        return state.LoadingChanges
    },
    getFriends(state) {
        if (state.user) {
            return state.user.friends
        }
        return []
    }
}

export const mutations = {
    setUser(state, u) {
        state.user = {
            username: u.username,
            exp: u.exp,
            friends: u.friends,
            whitelist: u.whitelist,
            friendlistmode: u.friendlistmode,
            notifications: u.notifications,
        }
        state.Context.roomCode = u.room.roomCode ?? null;
        state.Context.players = u.room.players ?? null;
    },
    setGuestname(state, n) {
        state.guestname = "guest-" + n
    },
    setContext(state, c) {
        Object.assign(state.Context, c);
    },
    setUserTiles(state, t) {
        state.Context.userTiles = t
    },
    setLoadingChanges(state, value) {
        state.LoadingChanges = value
    },
    setFriendlistmode(state, value) {
        state.user.friendlistmode = value
    }
}

export const actions = {
    async getUserData({ commit }) {
        var token = localStorage.getItem('token');
        console.log(typeof token == "string")

        if (window.location.hash && typeof token != "string") {
            var hashObj = {};
            var hasharray = document.location.hash
                .substring(1, document.location.hash.length)
                .split("&");
            hasharray.forEach((entry) => {
                var value = entry.split("=");
                if (value[0] == "state") {
                    hashObj["_csrf"] = value[1];
                } else {
                    hashObj[value[0]] = value[1];
                }
            });
            if (Object.hasOwn(hashObj, 'access_token')) {
                try {
                    var result = await this.$axios
                        .post("/connectuser", hashObj, {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                        })
                    console.log(result.data)
                    commit("setUser", result.data)
                    localStorage.setItem('token', result.data.token);
                    Vue.prototype.$socket.authenticate(result.data.token)
                    commit('socketcluster/connectWithToken', result.data.token)
                } catch (error) {
                    console.log(error.name);
                }
            }
            window.location.hash = "";
            return;
        }

        if (typeof token == "string") {
            try {
                var result = await this.$axios
                    .get("/connecttoken", {
                        headers: {
                            Authorization: "Bearer " + token
                        },
                    })
                console.log(Vue.prototype.$socket.authState)
                if (Vue.prototype.$socket.authState == "unauthenticated")
                    Vue.prototype.$socket.authenticate(token)
                console.log(result.data)
                commit("setUser", result.data)
            } catch (error) {
                console.log(error.name);
            }
            return;
        }
        try {
            var guestId = await Vue.prototype.$socket.invoke('guest')
            commit("setGuestname", guestId)
        } catch (error) {
            console.log(error.name);
        }
    },
    async setFriendlistmode({ commit }, n) {
        var token = localStorage.getItem('token');
        commit('setLoadingChanges', true);
        await this.$axios.post("/friendlistmode", { value: n },
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }).then(res => {
                commit('setLoadingChanges', false);
                commit('setFriendlistmode', n)
            }).catch(error => console.log(error))
    }
}