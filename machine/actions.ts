import { GameAction, GameContext } from '~/types';
import { addTiles, arrayRandomizer, nextPlayer } from './func/game';
import { DispenseTile } from './func/tileDispenser';
import { GameModel } from './GameMachine';

export const joinGameAction: GameAction<"join"> = (context, event) => ({
    Users: [...context.Users, { id: event.userId, name: event.name, xp: event.xp, points: 0, tiles: [] }]
})

export const hostGameAction: GameAction<"host"> = (context, event) => ({
    Users: [...context.Users, { id: event.userId, name: event.name, xp: event.xp, points: 0, tiles: [] }],
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

export const startGameAction: GameAction<"start"> = (context, event) => {
    let order = arrayRandomizer(context.Users)
    let ContextTiles = context.Tiles
    var r;
    order.forEach(u => {
        r = DispenseTile(u.tiles, ContextTiles)
        u.tiles = r.userTiles
        ContextTiles = r.remainingTiles
    })
    return {
        gameStarted: new Date(),
        Users: order,
        Tiles: ContextTiles,
        currentPlayer: order[0].id
    }
}

export const placeWordAction: GameAction<"placeWord"> = (context, event) => {
    let ContextTiles = context.Tiles
    let Users = context.Users
    var r = DispenseTile(context.Users.find(u => u.id = event.userId)!.tiles, ContextTiles)
    Users.find(u => u.id = event.userId)!.tiles = r.userTiles
    ContextTiles = r.remainingTiles

    return {
        Users: Users,
        Tiles: ContextTiles,
        grid: addTiles(context.grid, event.tiles),
        currentPlayer: nextPlayer(context.Users, context.currentPlayer!)
    }
}

export const restartGameAction: GameAction<"restart"> = (context, event) => ({
    grid: GameModel.initialContext.grid,
    currentPlayer: null
})

// export const setCurrentPlayerAction = (context: GameContext) => ({
//     currentPlayer: context.Users[Math.floor(Math.random() * context.Users.length)].id
// })
