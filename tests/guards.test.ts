import { interpret, InterpreterFrom } from 'xstate'
import { GameMachine, GameModel } from '../machine/GameMachine'

describe('machine/guards', () => {

    describe('canHostGame', () => {
        let machine: InterpreterFrom<typeof GameMachine>

        beforeEach(() => {
            machine = interpret(GameMachine).start()
        })

        it('should let a user host', () => {
            expect(machine.send(GameModel.events.host(1, "STaX-62", 3500)).changed).toBe(true)
        })

        it('should not let a user host twice', () => {
            expect(machine.send(GameModel.events.host(1, "STaX-62", 3500)).changed).toBe(true)
            expect(machine.send(GameModel.events.host(1, "STaX-62", 3500)).changed).toBe(false)
        })

        it('should not let a user join a game he\'s hosting twice', () => {
            expect(machine.send(GameModel.events.host(1, "STaX-62", 3500)).changed).toBe(true)
            expect(machine.send(GameModel.events.join(1, "STaX-62", 3500, machine.state.context.Room!)).changed).toBe(false)
        })
    })

    describe('canJoinGame', () => {
        let machine: InterpreterFrom<typeof GameMachine>

        beforeEach(() => {
            machine = interpret(GameMachine).start()
        })

        it('should let a user join', () => {
            expect(machine.send(GameModel.events.host(1, "STaX-62", 3500)).changed).toBe(true)
            expect(machine.send(GameModel.events.join(2, "Melow", 7000, machine.state.context.Room!)).changed).toBe(true)
        })

        it('should not let a user join twice', () => {
            expect(machine.send(GameModel.events.host(1, "STaX-62", 3500)).changed).toBe(true)
            expect(machine.send(GameModel.events.join(2, "Melow", 7000, machine.state.context.Room!)).changed).toBe(true)
            expect(machine.send(GameModel.events.join(2, "Melow", 7000, machine.state.context.Room!)).changed).toBe(false)
        })
    })

    describe('canLeaveGuard', () => {
        let machine: InterpreterFrom<typeof GameMachine>

        beforeEach(() => {
            machine = interpret(GameMachine).start()
        })

        it('should let a user leave', () => {
            expect(machine.send(GameModel.events.host(1, "STaX-62", 3500)).changed).toBe(true)
            expect(machine.send(GameModel.events.leave(1)).changed).toBe(true)
        })

        it('should not let a user leave twice', () => {
            expect(machine.send(GameModel.events.host(1, "STaX-62", 3500)).changed).toBe(true)
            expect(machine.send(GameModel.events.leave(1)).changed).toBe(true)
            expect(machine.send(GameModel.events.leave(1)).changed).toBe(false)
        })
    })

    describe('canReadyGuard', () => {
        let machine: InterpreterFrom<typeof GameMachine>

        beforeEach(() => {
            machine = interpret(GameMachine).start()
        })

        it('should let a user be ready', () => {
            expect(machine.send(GameModel.events.host(1, "STaX-62", 3500)).changed).toBe(true)
            expect(machine.send(GameModel.events.ready(1)).changed).toBe(true)
        })

        it('should not let a user be ready twice', () => {
            expect(machine.send(GameModel.events.host(1, "STaX-62", 3500)).changed).toBe(true)
            expect(machine.send(GameModel.events.ready(1)).changed).toBe(true)
            expect(machine.send(GameModel.events.ready(1)).changed).toBe(false)
        })
    })

    describe('canUnreadyGuard', () => {
        let machine: InterpreterFrom<typeof GameMachine>

        beforeEach(() => {
            machine = interpret(GameMachine).start()
        })

        it('should let a user be unready', () => {
            expect(machine.send(GameModel.events.host(1, "STaX-62", 3500)).changed).toBe(true)
            expect(machine.send(GameModel.events.unready(1)).changed).toBe(true)
        })

        it('should not let a user be unready twice', () => {
            expect(machine.send(GameModel.events.host(1, "STaX-62", 3500)).changed).toBe(true)
            expect(machine.send(GameModel.events.unready(1)).changed).toBe(true)
            expect(machine.send(GameModel.events.unready(1)).changed).toBe(false)
        })
    })
})