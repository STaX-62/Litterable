export const state = () => ({
    user: null,
    LoadingChanges: false
})

export const getters = {
    getUser(state) {
        return state.user
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
        console.log(u)
        state.user = u
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
        if (window.location.hash) {
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
            if (Object.hasOwn(hashObj, '_csrf') && Object.hasOwn(hashObj, 'access_token')) {
                var result = await this.$axios
                    .post("/connectuser", hashObj, {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "GET",
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    })
                commit("setUser", result.data)
                var token = localStorage.setItem('token', result.data.token);
                commit('socketcluster/connectWithToken', result.data.token)
                window.location.hash = "";
            }
        }
        else {
            var token = localStorage.getItem('token');
            if (token) {
                var result = await this.$axios
                    .get("/connecttoken", {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "GET",
                            Authorization: "Bearer " + token
                        },
                    }).then(user => {
                        commit("setUser", user.data)
                    })
            }
        }
    },
    async setFriendlistmode({ commit }, n) {
        var token = localStorage.getItem('token');
        commit('setLoadingChanges', true);
        await this.$axios.post("/friendlistmode", { value: n },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST",
                    Authorization: "Bearer " + token
                }
            }).then(res => {
                commit('setLoadingChanges', false);
                commit('setFriendlistmode', n)
            }).catch(error => console.log(error))
        // state.user.friendlistmode = n
    }
}