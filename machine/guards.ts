import { GameGuard } from '~/types';
import { verifyPlacement } from './func/game';

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
    console.log(event.tiles)
    console.log(event.tiles.map(t => t.id))
    let placement = verifyPlacement(event.tiles, context.grid, context.gridsize!)
    if (placement.playedWords)
        context.playedWords = placement.playedWords
    return event.userId === context.currentPlayer
        && placement.isValid
}