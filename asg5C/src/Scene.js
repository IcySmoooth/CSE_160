import * as THREE from 'three';

class Scene {
    constructor(camera) {
        this.camera = camera;

        this.scene = new THREE.Scene();
    }

    onSceneStart() {}
    update() {}
    onSceneStop() {}
}