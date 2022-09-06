// import { interpret, InterpreterFrom } from 'xstate'
// import { GameMachine, GameModel } from '../machine/GameMachine'

// describe('machine/guards', () => {

//     describe('canHostGame', () => {
//         let machine: InterpreterFrom<typeof GameMachine>

//         beforeEach(() => {
//             machine = interpret(GameMachine).start()
//         })

//         it('should let a user host', () => {
//             expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//         })

//         it('should not let a user host twice', () => {
//             expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//             expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(false)
//         })

//         it('should not let a user join a game he\'s hosting twice', () => {
//             expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//             expect(machine.send(GameModel.events.join(1, "STaX-62", 3500, machine.state.context.Room!)).changed).toBe(false)
//         })
//     })

//     describe('canJoinGame', () => {
//         let machine: InterpreterFrom<typeof GameMachine>

//         beforeEach(() => {
//             machine = interpret(GameMachine).start()
//         })

//         it('should let a user join', () => {
//             expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//             expect(machine.send(GameModel.events.join(2, "Melow", 7000, machine.state.context.Room!)).changed).toBe(true)
//         })

//         it('should not let a user join twice', () => {
//             expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//             expect(machine.send(GameModel.events.join(2, "Melow", 7000, machine.state.context.Room!)).changed).toBe(true)
//             expect(machine.send(GameModel.events.join(2, "Melow", 7000, machine.state.context.Room!)).changed).toBe(false)
//         })
//     })

//     describe('canLeaveGuard', () => {
//         let machine: InterpreterFrom<typeof GameMachine>

//         beforeEach(() => {
//             machine = interpret(GameMachine).start()
//         })

//         it('should let a user leave', () => {
//             expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//             expect(machine.send(GameModel.events.leave(1)).changed).toBe(true)
//         })

//         it('should not let a user leave twice', () => {
//             expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//             expect(machine.send(GameModel.events.leave(1)).changed).toBe(true)
//             expect(machine.send(GameModel.events.leave(1)).changed).toBe(false)
//         })
//     })

//     describe('canReadyGuard', () => {
//         let machine: InterpreterFrom<typeof GameMachine>

//         beforeEach(() => {
//             machine = interpret(GameMachine).start()
//         })

//         it('should let a user be ready', () => {
//             expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//             expect(machine.send(GameModel.events.ready(1)).changed).toBe(true)
//             expect(machine.state.context.playersReady.includes(1)).toBe(true)
//         })

//         it('should not let a user be unready', () => {
//             expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//             expect(machine.send(GameModel.events.ready(1)).changed).toBe(true)
//             expect(machine.send(GameModel.events.ready(1)).changed).toBe(true)
//             expect(machine.state.context.playersReady.includes(1)).toBe(false)
//         })
//     })

//     describe('canStartGuard', () => {
//         let machine: InterpreterFrom<typeof GameMachine>

//         beforeEach(() => {
//             machine = interpret(GameMachine).start()
//         })

//         it('should let the host start a game', () => {
//             expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//             expect(machine.send(GameModel.events.join(2, "Melow", 7000, machine.state.context.Room!)).changed).toBe(true)
//             expect(machine.send(GameModel.events.ready(1)).changed).toBe(true)
//             expect(machine.send(GameModel.events.ready(2)).changed).toBe(true)
//             expect(machine.send(GameModel.events.start(1)).changed).toBe(true)
//         })

//         it('should not let a user start a game', () => {
//             expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//             expect(machine.send(GameModel.events.join(2, "Melow", 7000, machine.state.context.Room!)).changed).toBe(true)
//             expect(machine.send(GameModel.events.ready(1)).changed).toBe(true)
//             expect(machine.send(GameModel.events.ready(2)).changed).toBe(true)
//             expect(machine.send(GameModel.events.start(2)).changed).toBe(false)
//         })

//         it('should not let the host start a game twice', () => {
//             expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//             expect(machine.send(GameModel.events.join(2, "Melow", 7000, machine.state.context.Room!)).changed).toBe(true)
//             expect(machine.send(GameModel.events.ready(1)).changed).toBe(true)
//             expect(machine.send(GameModel.events.ready(2)).changed).toBe(true)
//             expect(machine.send(GameModel.events.start(1)).changed).toBe(true)
//             expect(machine.send(GameModel.events.start(1)).changed).toBe(false)
//         })
//     })

//     describe('canPlayGuard', () => {
//         let machine: InterpreterFrom<typeof GameMachine>

//         beforeEach(() => {
//             machine = interpret(GameMachine).start()
//         })

//         // it('should let a user play', () => {
//         //     expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.join(2, "Melow", 7000, machine.state.context.Room!)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.ready(1)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.ready(2)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.start(1)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.placeWord(machine.state.context.currentPlayer!, [{ id: "A", number: 9, value: 1 }, { id: "A", number: 9, value: 1 }])).changed).toBe(true)
//         // })

//         // it('should not let a user play if it\'s not his turn', () => {
//         //     expect(machine.send(GameModel.events.host(1, "STaX-62", 3500)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.join(2, "Melow", 7000, machine.state.context.Room!)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.ready(1)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.ready(2)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.start(1)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.placeWord(machine.state.context.Users.find(u => u.id != machine.state.context.currentPlayer!)!.id, [{ id: "A", number: 9, value: 1 }, { id: "A", number: 9, value: 1 }])).changed).toBe(false)
//         // })

//         // it('should not let a user play if he don\'t play his tiles', () => {
//         //     expect(machine.send(GameModel.events.host(1, "STaX-62", 3500, 15)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.join(2, "Melow", 7000, machine.state.context.Room!)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.ready(1)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.ready(2)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.start(1)).changed).toBe(true)
//         //     expect(machine.send(GameModel.events.placeWord(machine.state.context.Users.find(u => u.id != machine.state.context.currentPlayer!)!.id, [{ id: "A", number: 9, value: 1,placement }, { id: "A", number: 8, value: 1 }], [{ id: "A", number: 9, value: 1 }, { id: "A", number: 8, value: 1 }])).changed).toBe(false)
//         // })
//     })
// })