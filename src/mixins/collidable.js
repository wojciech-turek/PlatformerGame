export default {
  addCollider(colliders, callback) {
    this.scene.physics.add.collider(this, colliders, callback, null, this);
    return this;
  },
};
