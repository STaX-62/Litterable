import { ContextFrom, EventFrom } from 'xstate';
import { GameModel } from './machine/GameMachine'

export type User = {
    id: number,
    name: string,
    xp: number,
    points: number,
    tiles: Array<Tile>
}

export type Notification = {
    id: number,
    title: string,
    content: number,
    user: string
}

export type Tile = {
    id: TileState,
    number: number,
    value: number,
    placement?: number
}

export type TileState = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "$"
export type GridState = Array<Tile>
export type GameContext = ContextFrom<typeof GameModel>
export type GameEvents = EventFrom<typeof GameModel>
export type GameEvent<T extends GameEvents["type"]> = GameEvents & { type: T }
export type GameGuard<T extends GameEvents["type"]> = (
    context: GameContext,
    event: GameEvent<T>
) => boolean
export type GameAction<T extends GameEvents["type"]> = (
    context: GameContext,
    event: GameEvent<T>
) => Partial<GameContext>