import { GameContext, GridState, Tile, User } from '~/types';

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

export function addTilesToGrid(grid: GridState[][], tiles: Tile[]) {
    tiles.forEach(tile => {
        grid[tile.placement!.y][tile.placement!.x] = tile
    })
    return grid
}

export function countPoints(User: User, word: Tile[]) {
    var count = 0;
    word.forEach(letter => {
        count += letter.value
    })
    User.points += count
    return User
}

export function nextPlayer(Users: User[], currentPlayer: User['id']) {
    var index = Users.findIndex(u => u.id == currentPlayer)
    if (index + 1 < Users.length)
        return Users[index + 1].id

    return Users[0].id
}

export function verifyPlacement(word: Tile[], direction: string) {
    if (direction == 'right') {
        if (!word.every((letter) => letter.placement!.y == word[0].placement!.y)) // vérifie si toutes les lettres sont sur la même ligne
            return false
        if (word.length != (word[word.length].placement!.x - word[0].placement!.x)) // verifie si toutes les lettres se suivent sans laisser d'espace
            return false
    }

    if (direction == 'down') {
        if (!word.every((letter) => letter.placement!.x == word[0].placement!.x)) // vérifie si toutes les lettres sont sur la même ligne
            return false
        if (word.length != (word[word.length].placement!.y - word[0].placement!.y)) // verifie si toutes les lettres se suivent sans laisser d'espace
            return false
    }
    return true
}