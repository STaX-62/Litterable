import { GameAction, GameContext } from '~/types';
import { GameModel } from './GameMachine';

export const joinGameAction: GameAction<"join"> = (context, event) => ({
    Users: [...context.Users, { id: event.userId, name: event.name, xp: event.xp }]
})

export const hostGameAction: GameAction<"host"> = (context, event) => ({
    Users: [...context.Users, { id: event.userId, name: event.name, xp: event.xp }],
    Host: event.userId
})

export const readyGameAction: GameAction<"ready"> = (context, event) => ({
    playersReady: [...context.playersReady, event.userId],
})

export const unreadyGameAction: GameAction<"unready"> = (context, event) => ({
    playersReady: context.playersReady.filter(p => p !== event.userId)
})

export const leaveGameAction: GameAction<"leave"> = (context, event) => ({
    Users: context.Users.filter(p => p.id !== event.userId)
})

export const startGameAction: GameAction<"start"> = (context, event) => ({
    gameStarted: new Date()
})

export const restartGameAction: GameAction<"restart"> = (context, event) => ({
    grid: GameModel.initialContext.grid,
    currentPlayer: null
})

export const setCurrentPlayerAction = (context: GameContext) => ({
    currentPlayer: context.Users[Math.floor(Math.random() * context.Users.length)].id
})
