import { GridState, Tile, User } from '~/types';

export function arrayRandomizer(array: any[]) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export function addTiles(grid: GridState, tiles: Tile[]) {
    tiles.forEach(tile => {
        grid[tile.placement!] = tile
    })
    return grid
}

export function nextPlayer(Users: User[], currentPlayer: User['id']) {
    var index = Users.findIndex(u => u.id == currentPlayer)
    if (index + 1 < Users.length)
        return Users[index + 1].id

    return Users[0].id
}