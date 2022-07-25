import { User } from '~/types';
import { Tile } from '../Tiles';
import { arrayRandomizer } from './game';

export function DispenseTile(userTiles: User['tiles'], ContextTiles: Tile[]) {
    var getTile: Tile
    var TileArray = [] as string[]
    var i

    while (userTiles === undefined || userTiles.length < 7) {
        ContextTiles = ContextTiles.filter(t => t.number > 0)
        ContextTiles.forEach(pool => {
            for (i = 0; i < pool.number; i++) {
                TileArray.push(pool.id)
            }
        })
        TileArray = arrayRandomizer(TileArray)
        getTile = ContextTiles.find(c => c.id == TileArray[0])!
        userTiles.push(getTile)
        ContextTiles[ContextTiles.findIndex(c => c.id == TileArray[0])].number--
    }
    return {
        userTiles: userTiles,
        remainingTiles: ContextTiles
    }
}