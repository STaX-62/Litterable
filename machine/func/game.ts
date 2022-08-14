import { Tile, User } from '~/types';
import { dictionary } from '../ressources/dictionary';

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

export function addTilesToGrid(grid: Tile[][], tiles: Tile[]) {
    tiles.forEach(tile => {
        console.log(tile)
        grid[tile.placement!.y][tile.placement!.x] = tile
    })
    return grid
}

export function countPoints(User: User, words: Tile[][]) {
    var count = 0;
    words.forEach(w => {
        w.forEach(letter => {
            count += letter.value
        });
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

export function verifyPlacement(tiles: Tile[], grid: Tile[][], gridsize: number) {
    let result = findWords(tiles, grid, gridsize)
    if (result.errors)
        return {
            isValid: false
        }

    if (!grid.some(y => y.some(x => x))) {
        if (!(result.words[0][0].placement!.y == 7 && result.words[0][0].placement!.x == 7))
            return {
                isValid: false
            }
    }
    if (!result.words.every(w => dictionary.includes(w.map(i => i.id).join(''))))
        return {
            isValid: false
        }

    return {
        isValid: true,
        playedWords: result.words
    }
}

function findWords(tiles: Tile[], grid: Tile[][], gridsize: number) {
    let wordsFound = [] as Tile[][]
    var presumedDirection = '' as string
    var errors = 0 as number
    let wordarray = [] as Tile[]

    var minX = Math.min(...tiles.map(i => i.placement!.x))
    var maxX = Math.max(...tiles.map(i => i.placement!.x))
    var minY = Math.min(...tiles.map(i => i.placement!.y))
    var maxY = Math.max(...tiles.map(i => i.placement!.y))

    presumedDirection = playedDirection(tiles)

    console.log(presumedDirection)

    if (presumedDirection == '')
        errors++

    tiles.forEach(t => {
        console.log('grid available: ' + isGridTileAvailable(t, grid, gridsize))
        if (!isGridTileAvailable(t, grid, gridsize))
            errors++
    });

    if (errors == 0) {
        if (presumedDirection == 'right') {
            var righttiles = tiles
            // trouve les lettres existantes à gauche de la première lettre du mot
            if (grid[minY][minX - 1]) {
                for (var x = minX; x >= 0; x--) {
                    console.log(grid[minY][x])
                    if (!grid[minY][x])
                        break
                    wordarray.splice(0, 0, grid[minY][x])
                }
            }

            console.log(wordarray)
            // ajoute les lettres du mot et les lettres de la grilles si il y a un nouvel espace entre les lettres
            for (var x = 0; x <= maxX - minX; x++) {
                if (righttiles.findIndex(t => t.placement!.x == x + minX) == -1) {
                    if (grid[minY][x + minX])
                        wordarray.push(grid[minY][x + minX])
                    else errors++
                }
                else {
                    wordarray.push(righttiles.splice(righttiles.findIndex(t => t.placement!.x == x + minX), 1)[0])
                }
            }
            console.log(wordarray)
            // ajoute les lettres suivant la derniere lettre rentrée 
            if (grid[minY][maxX + 1]) {
                for (var x = maxX; x < gridsize; x++) {
                    if (!grid[minY][x])
                        break
                    wordarray.push(grid[minY][x])
                }
            }
            console.log(wordarray)
            wordsFound.push(wordarray)

            // cherches les autres mots créé sur la verticalité
            tiles.forEach(t => {
                // cherche une lettre en dessous de la première lettre placée
                if (grid[t.placement!.y + 1][t.placement!.x]) {
                    wordarray.push(t)
                    for (var y = t.placement!.y; y < gridsize; y++) {
                        if (!grid[y][t.placement!.x])
                            break
                        wordarray.push(grid[y][t.placement!.x])
                    }
                }
                // cherche une lettre sur la gauche de la première lettre placée
                if (grid[t.placement!.y - 1][t.placement!.x]) {
                    if (!grid[t.placement!.y - 1][t.placement!.x])
                        wordarray.splice(0, 0, t)
                    for (var y = t.placement!.y; y >= 0; y--) {
                        if (!grid[y][t.placement!.x])
                            break
                        wordarray.splice(0, 0, grid[y][t.placement!.x])
                    }
                    wordsFound.push(wordarray)
                }
                // ajoute le mot si il n'y avait pas de lettre au dessus
                if (grid[t.placement!.y + 1][t.placement!.x] && !grid[t.placement!.y - 1][t.placement!.x]) {
                    wordsFound.push(wordarray)
                }
            })
        }


        if (presumedDirection == 'down') {

            console.log('goes in down')
            var downtiles = tiles

            // trouve les lettres existantes au dessus de la première lettre du mot
            if (grid[minY - 1][minX]) {
                for (var y = minY; y >= 0; y--) {
                    if (!grid[y][minX])
                        break
                    wordarray.splice(0, 0, grid[y][minX])
                }
            }

            // ajoute les lettres du mot et les lettres de la grilles si il y a un nouvel espace entre les lettres
            for (var y = 0; y <= maxY - minY; y++) {
                if (downtiles.findIndex(t => t.placement!.y == y) == -1) {
                    if (grid[y + minY][minX])
                        wordarray.push(grid[y + minY][minX])
                    else errors++
                }
                else {
                    wordarray.push(downtiles.splice(downtiles.findIndex(t => t.placement!.y == y), 1)[0])
                }
            }
            // ajoute les lettres en dessous de la derniere lettre rentrée 
            if (grid[maxY + 1][minX]) {
                for (var y = maxY; y < gridsize; y++) {
                    if (!grid[y][minX])
                        break
                    wordarray.push(grid[y][minX])
                }
            }
            wordsFound.push(wordarray)
            // cherches les autres mots créé sur l'horizontalité
            tiles.forEach(t => {
                // cherche une lettre à droite de la première lettre placée
                if (grid[t.placement!.y][t.placement!.x + 1]) {
                    wordarray.push(t)
                    for (var x = t.placement!.x; x < gridsize; x++) {
                        if (!grid[t.placement!.y][x])
                            break
                        wordarray.push(grid[t.placement!.y][x])
                    }
                }
                // cherche une lettre sur la gauche de la première lettre placée
                if (grid[t.placement!.y][t.placement!.x - 1]) {
                    if (!grid[t.placement!.y][t.placement!.x - 1])
                        wordarray.splice(0, 0, t)
                    for (var x = t.placement!.x; x >= 0; x--) {
                        if (!grid[t.placement!.y][x])
                            break
                        wordarray.splice(0, 0, grid[t.placement!.y][x])
                    }
                    wordsFound.push(wordarray)
                }
                // ajoute le mot si il n'y avait pas de lettre à gauche
                if (grid[t.placement!.y][t.placement!.x + 1] && !grid[t.placement!.y][t.placement!.x - 1]) {
                    wordsFound.push(wordarray)
                }
            })
        }
    }

    console.log(wordsFound)
    console.log(errors)
    return {
        words: wordsFound,
        direction: presumedDirection,
        errors: errors
    }
}

function isGridTileAvailable(tile: Tile, grid: Tile[][], gridsize: number) {
    if (tile.placement === undefined)
        return false
    if (tile.placement!.x === undefined || tile.placement!.x < 0 || tile.placement!.x > gridsize)
        return false
    if (tile.placement!.y === undefined || tile.placement!.y < 0 || tile.placement!.y > gridsize)
        return false
    if (grid[tile.placement!.y][tile.placement!.x])
        return false
    return true
}

function playedDirection(tiles: Tile[]) {
    var presumedDirection = ''
    if (tiles.length > 1) {
        if (tiles.every((letter) => letter.placement!.y == tiles[0].placement!.y)) // vérifie si toutes les lettres sont sur la même ligne
            presumedDirection = 'right'
        if (tiles.every((letter) => letter.placement!.x == tiles[0].placement!.x)) // vérifie si toutes les lettres sont sur la même colonne
            presumedDirection = 'down'
    }

    return presumedDirection
}
