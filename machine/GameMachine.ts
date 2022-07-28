import { createMachine } from 'xstate';
import { createModel } from 'xstate/lib/model'
import { GridState, Tile, User } from '../types'
import { hostGameAction, joinGameAction, leaveGameAction, placeWordAction, readyGameAction, restartGameAction, startGameAction, unreadyGameAction } from './actions';
import { canHostGuard, canJoinGuard, canLeaveGuard, canPlayGuard, canReadyGuard, canStartGuard, canUnreadyGuard } from './guards';
import { Tiles } from './ressources/Tiles';

export enum GameStates {
    HOME = 'HOME',
    ROOM = 'ROOM',
    PLAY = 'PLAY',
    VOTE = 'VOTE',
    VICTORY = 'VICTORY',
    DRAW = 'DRAW'
}

export const GameModel = createModel({
    Users: [] as User[],
    currentPlayer: null as null | User['id'],
    Host: null as null | User['id'],
    Room: null as null | string,
    playersReady: [] as Array<User['id']>,
    gameStarted: null as null | Date,
    grid: new Array(225) as GridState,
    Tiles: Tiles
}, {
    events: {
        join: (userId: User["id"], name: User["name"], xp: User["xp"], room: string) => ({ userId, name, xp, room }),
        host: (userId: User["id"], name: User["name"], xp: User["xp"]) => ({ userId, name, xp }),
        leave: (userId: User["id"]) => ({ userId }),
        ready: (userId: User["id"]) => ({ userId }),
        unready: (userId: User["id"]) => ({ userId }),
        start: (userId: User["id"]) => ({ userId }),
        placeWord: (userId: User["id"], tiles: Tile[]) => ({ userId, tiles }),
        confirm: (userId: User["id"]) => ({ userId }),
        vote: (userId: User["id"]) => ({ userId }),
        restart: (userId: User["id"]) => ({ userId })
    }
})

export const GameMachine = GameModel.createMachine({
    id: 'game',
    context: GameModel.initialContext,
    initial: GameStates.HOME,
    states: {
        [GameStates.HOME]: {
            on: {
                join: {
                    cond: canJoinGuard,
                    actions: [GameModel.assign(joinGameAction)],
                    target: GameStates.ROOM
                },
                host: {
                    cond: canHostGuard,
                    actions: [GameModel.assign(hostGameAction)],
                    target: GameStates.ROOM
                }
            }
        },
        [GameStates.ROOM]: {
            on: {
                join: {
                    cond: canJoinGuard,
                    actions: [GameModel.assign(joinGameAction)],
                    target: GameStates.ROOM
                },
                leave: {
                    cond: canLeaveGuard,
                    actions: [GameModel.assign(leaveGameAction)],
                    target: GameStates.ROOM
                },
                ready: {
                    cond: canReadyGuard,
                    actions: [GameModel.assign(readyGameAction)],
                    target: GameStates.ROOM
                },
                unready: {
                    cond: canUnreadyGuard,
                    actions: [GameModel.assign(unreadyGameAction)],
                    target: GameStates.ROOM
                },
                start: {
                    cond: canStartGuard,
                    actions: [GameModel.assign(startGameAction)],
                    target: GameStates.PLAY,
                }
            }
        },
        [GameStates.PLAY]: {
            on: {
                placeWord: {
                    cond: canPlayGuard,
                    actions: [GameModel.assign(placeWordAction)],
                    target: GameStates.PLAY,
                },
                confirm: {
                    target: GameStates.VOTE
                }
            }
        },
        [GameStates.VOTE]: {
            on: {
                vote: {
                    target: GameStates.VICTORY
                }
            }
        },
        [GameStates.VICTORY]: {
            on: {
                restart: {
                    actions: [GameModel.assign(restartGameAction)],
                    target: GameStates.PLAY
                }
            }
        },
        [GameStates.DRAW]: {
            on: {
                restart: {
                    actions: [GameModel.assign(restartGameAction)],
                    target: GameStates.ROOM
                }
            }
        }
    }
})