import { GameContext, GameEvent, GameGuard } from '~/types';
import { verifyPlacement } from './func/game';
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
    return context.Host == event.userId && context.Users.length >= 2
}

export const canPlayGuard: GameGuard<"placeWord"> = (context, event) => {
    return event.userId === context.currentPlayer
        && event.word.every(w => dictionary.includes(w.word.map(i => i.id).join('')))
        && event.tiles.every(t =>
            context.Users.find(u => u.id == context.currentPlayer)!.tiles.includes(t)
        )
        && event.word.every(w => verifyPlacement(w.word, w.direction))
}