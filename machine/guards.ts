import { GameContext, GameEvent, GameGuard } from '~/types';
import { dictionary } from './ressources/dictionary';

export const canJoinGuard: GameGuard<"join"> = (context, event) => {
    return context.Users.length < 4 && context.Users.find(u => u.id === event.userId) === undefined && context.Room == event.room
}

export const canHostGuard: GameGuard<"host"> = (context, event) => {
    return context.Users.length < 4 && context.Users.find(u => u.id === event.userId) === undefined
}

export const canLeaveGuard: GameGuard<"leave"> = (context, event) => {
    return !!context.Users.find(u => u.id === event.userId)
}

export const canReadyGuard: GameGuard<"ready"> = (context, event) => {
    return context.playersReady.find(u => u === event.userId) === undefined
}

export const canUnreadyGuard: GameGuard<"unready"> = (context, event) => {
    return !!context.playersReady.find(u => u === event.userId)
}

export const canStartGuard: GameGuard<"start"> = (context, event) => {
    return context.Host == event.userId
}
// (event.tiles.every(t => t.placement! % 15 == event.tiles[0].placement) ||  ) 
export const canPlayGuard: GameGuard<"placeWord"> = (context, event) => {
    return event.userId === context.currentPlayer && dictionary.includes(event.tiles.map(i => i.id).join(''))
}