import Vue from 'vue'
import socketClusterClient from 'socketcluster-client'

Vue.prototype.$socket = socketClusterClient.create({
    hostname: process.env.SERVER_IP,
    port: parseInt(process.env.SERVER_PORT!),
})


Vue.prototype.$user = {
    username: '',
    exp: 0,
    uid: '',
}
Vue.prototype.$friends = [
    {
        name: 'Hanakulio',
        id: 3400,
        isOnline: true,
        xp: 2500
    },
    {
        name: 'Noixeuh',
        id: 4269,
        isOnline: true,
        xp: 30000
    },
    {
        name: 'Melowan',
        id: 80,
        isOnline: false,
        xp: 400
    }
]