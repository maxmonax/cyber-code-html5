namespace DB {

  export const TILES = [
    {
      name: 'grass',
      tiles: ['grass_05', 'grass_10', 'grass_12', 'grass_14']
    },
    {
      name: 'dirt',
      tiles: ['dirt_06', 'dirt_12', 'dirt_14', 'dirt_18']
    },
    {
      name: 'sand',
      tiles: ['sand_07', 'sand_13', 'sand_14', 'sand_18']
    }
  ];

  export function getTileFrameName(tile_name_id: number, tile_id: number): string {
    return TILES[tile_name_id].tiles[tile_id];
  }

}