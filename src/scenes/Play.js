import Phaser from "phaser";
import Player from "../entities/Player";
import Enemies from "../groups/enemies";

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
    const enemies = this.createEnemies(layers.enemySpawns);

    this.createEndOfLevel(playerZones.end, player);
    this.setupFollowupCameraOn(player);

    this.createEnemyColliders(enemies, {
      colliders: {
        platformsColliders: layers.platform_colliders,
        player,
      },
    });

    this.plotting = false;
    this.graphics = this.add.graphics();
    this.line = new Phaser.Geom.Line();
    this.graphics.lineStyle(1, 0x0f0);

    this.input.on("pointerdown", this.startDrawing, this);
    this.input.on(
      "pointerup",
      (pointer) => this.finishDrawing(pointer, layers.platforms),
      this
    );
  }

  drawDebug(layer) {
    const collidingTileColor = new Phaser.Display.Color(243, 134, 48, 200);
    layer.renderDebug(this.graphics, {
      tileColor: null,
      collidingTileColor,
    });
  }

  startDrawing(pointer) {
    if (this.tileHits && this.tileHits.length > 0) {
      this.tileHits.forEach((tile) => {
        if (tile.index !== -1) {
          tile.setCollision(false);
        }
      });
    }
    this.line.x1 = pointer.worldX;
    this.line.y1 = pointer.worldY;

    this.plotting = true;
  }

  finishDrawing(pointer, layer) {
    this.line.x2 = pointer.worldX;
    this.line.y2 = pointer.worldY;

    this.graphics.clear();
    this.graphics.strokeLineShape(this.line);

    this.tileHits = layer.getTilesWithinShape(this.line);

    if (this.tileHits.length > 0) {
      this.tileHits.forEach((tile) => {
        if (tile.index !== -1) {
          tile.setCollision(true);
        }
      });
    }
    this.drawDebug(layer);
    this.plotting = false;
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
    const enemySpawns = map.getObjectLayer("enemy_spawns");

    platform_colliders.setCollisionByExclusion(-1, true);
    platform_colliders.setCollisionByProperty({ collides: true });

    return {
      environment,
      platforms,
      platform_colliders,
      playerZones,
      enemySpawns,
    };
  }

  createPlayer(start) {
    const player = new Player(this, start.x, start.y);
    player.init();
    return player;
  }

  createEnemies(spawnsLayer) {
    const enemies = new Enemies(this);
    const enemyTypes = enemies.getTypes();

    spawnsLayer.objects.forEach((spawn) => {
      const enemy = new enemyTypes[spawn.type](this, spawn.x, spawn.y);
      enemies.add(enemy);
    });

    return enemies;
  }

  createPlayerColliders(player, { colliders }) {
    player.addCollider(colliders.platformsColliders);
  }

  createEnemyColliders(enemies, { colliders }) {
    enemies
      .addCollider(colliders.platformsColliders)
      .addCollider(colliders.player);
  }

  setupFollowupCameraOn(player) {
    const { height, width, mapOffset, zoomFactor } = this.config;
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

  update() {
    if (this.plotting) {
      const pointer = this.input.activePointer;
      this.line.x2 = pointer.worldX;
      this.line.y2 = pointer.worldY;
      this.graphics.clear();
      this.graphics.strokeLineShape(this.line);
    }
  }
}

export default Play;
