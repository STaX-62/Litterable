import Vue from 'vue'
import socketClusterClient from 'socketcluster-client'

Vue.prototype.$socket = socketClusterClient.create({
    hostname: 'localhost',
    port: 8000,
})
// let rooms = [] as Array<string>;
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

// export function genKey(rooms: Array<string>, length: number) {
//     let result = ''
//     var cond = false
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

//     while (cond == false) {
//         result = ''
//         for (let i = 0; i < length; i++) {
//             result += characters.charAt(
//                 Math.floor(Math.random() * characters.length))
//         }
//         if (!rooms.includes(result))
//             cond = true
//     }
//     return result
// }