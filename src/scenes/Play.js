import Phaser from "phaser";
import Player from "../entities/Player";

class Play extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  create() {
    const map = this.createMap();
    const layers = this.createLayers(map);

    const player = this.createPlayer();

    this.physics.add.collider(player, layers.platform_colliders);
  }

  createMap() {
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16,
    });
    map.addTilesetImage("main_lev_build_1", "tiles");
    return map;
  }
  createLayers(map) {
    const tileset = map.getTileset("main_lev_build_1");
    const platform_colliders = map.createLayer(
      "platform_colliders",
      tileset,
      0,
      0
    );
    const environment = map.createLayer("env", tileset, 0, 0);
    const platforms = map.createLayer("platforms", tileset, 0, 0);

    platform_colliders.setCollisionByExclusion(-1, true);
    platform_colliders.setCollisionByProperty({ collides: true });

    return { environment, platforms, platform_colliders };
  }

  createPlayer() {
    const player = new Player(this, 100, 250);
    player.init();
    return player;
  }
}

export default Play;
