import Vue from 'vue'
import { interpret } from 'xstate'
import { GameMachine, GameModel } from '~/machine/GameMachine'
let rooms = [] as Array<string>;

const machine = interpret(GameMachine).start()
machine.state.context.Room = genKey(rooms, 5);

Vue.prototype.$machine = machine
Vue.prototype.$user = {
    id: 1,
    name: 'STaX',
    xp: 100
}
Vue.prototype.$friends = [
    {
        name: 'Hanakuliooooannnn',
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

export function genKey(rooms: Array<string>, length: number) {
    let result = ''
    var cond = false
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    while (cond == false) {
        result = ''
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length))
        }
        if (!rooms.includes(result))
            cond = true
    }
    return result
}