import Phaser from "phaser";
import PlayScene from "./scenes/Play";
import PreloadScene from "./scenes/Preload";

const WIDTH = 1280;
const HEIGHT = 600;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
};

const Scenes = [PreloadScene, PlayScene];
const createScene = (Scene) => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);
const config = {
  // WebGL
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    // Arcade physics plugin, manages physics simulation
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: initScenes(),
};

// default 60fps
// delta time between frames in ms

new Phaser.Game(config);
