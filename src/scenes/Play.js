import Phaser from "phaser";
import Player from "../entities/Player";

class Play extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;
  }

  create() {
    const map = this.createMap();
    const layers = this.createLayers(map);
    const playerZones = this.getPlayerZones(layers.playerZones);
    const player = this.createPlayer(playerZones.start);
    this.createPlayerColliders(player, {
      colliders: {
        platformsColliders: layers.platform_colliders,
      },
    });
    this.createEndOfLevel(playerZones.end, player);
    this.setupFollowupCameraOn(player);
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
    const playerZones = map.getObjectLayer("player_zones");

    platform_colliders.setCollisionByExclusion(-1, true);
    platform_colliders.setCollisionByProperty({ collides: true });

    return { environment, platforms, platform_colliders, playerZones };
  }

  createPlayer(start) {
    const player = new Player(this, start.x, start.y);
    player.init();
    return player;
  }

  createPlayerColliders(player, { colliders }) {
    player.addCollider(colliders.platformsColliders);
  }

  setupFollowupCameraOn(player) {
    const { height, width, mapOffset, zoomFactor } = this.config;
    console.log(height);
    this.physics.world.setBounds(0, 0, width + mapOffset, height + 100);
    this.cameras.main
      .setBounds(0, 0, width + mapOffset, height)
      .setZoom(zoomFactor);
    this.cameras.main.startFollow(player);
  }
  getPlayerZones(playerZonesLayer) {
    const playerZones = playerZonesLayer.objects;
    return { start: playerZones[0], end: playerZones[1] };
  }
  createEndOfLevel(end, player) {
    const endZone = this.physics.add
      .sprite(end.x, end.y, "end")
      .setOrigin(0.5, 1)
      .setAlpha(0)
      .setSize(5, 200);

    const endOfLevelOverlap = this.physics.add.overlap(player, endZone, () => {
      endOfLevelOverlap.active = false;
      console.log("Player has won!");
    });
  }
}

export default Play;
