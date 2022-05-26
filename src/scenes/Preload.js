import Phaser from "phaser";

class Preload extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }
  preload() {
    this.load.image("tiles", "assets/main_lev_build_1.png");
    this.load.tilemapTiledJSON("map", "assets/crystal_map.json");

    this.load.spritesheet("player", "assets/player/move_sprite_1.png", {
      frameWidth: 32,
      spacing: 32,
      frameHeight: 38,
    });
  }

  create() {
    this.scene.start("PlayScene");
  }
}

export default Preload;
