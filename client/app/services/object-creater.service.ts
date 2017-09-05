import { Injectable } from '@angular/core';
import { RenderService } from '../services/render.service';

const SCALING_RATIO = 269.602;
const STONE_DIAMETER = 0.291 * SCALING_RATIO;

@Injectable()
export class ObjectCreaterService {

    private renderService: RenderService;
    constructor(renderService : RenderService){
        this.renderService = renderService;
    }

    public loadStonesPlayer1(): Promise<THREE.Mesh> {
        return new Promise<THREE.Mesh>((resolve, error) => {
            let loader = new THREE.ColladaLoader();
            for (let i = 0; i < 8; i++) {
                loader.load('/assets/models/dae/curling_stone_red.dae', (collada) => {
                    if (loader === undefined) {
                        error("Unable to load object");
                    } else {
                        let dae;
                        dae = collada.scene;
                        dae.scale.x = dae.scale.y = dae.scale.z = STONE_DIAMETER;
                        dae.name = "Pierre";
                        dae.updateMatrix();
                        dae = dae as THREE.Object3D; // cast .dae to THREE.Mesh
                        dae = dae as THREE.Mesh;

                        console.log('Loading stonePlayerOne[' + i + ']');
                        this.renderService.getStonesPlayerOne()[i].setMesh(dae);
                        this.renderService.getStonesPlayerOne()[i].loadStoneTexture("RED");
                        this.renderService.getStonesPlayerOne()[i].getMesh().position.set(0, 20, 0);

                        this.renderService.getScene().add(this.renderService.getStonesPlayerOne()[0].getMesh());
                        resolve();
                    }
                });
            }
        });
    }

    public loadStonesPlayer2(): Promise<THREE.Mesh> {
        return new Promise<THREE.Mesh>((resolve, error) => {
            let loader = new THREE.ColladaLoader();
            for (let i = 0; i < 8; i++) {
                loader.load('/assets/models/dae/curling_stone_red.dae', (collada) => {
                    if (loader === undefined) {
                        error("Unable to load object");
                    } else {
                        let dae;
                        dae = collada.scene;
                        dae.scale.x = dae.scale.y = dae.scale.z = STONE_DIAMETER;
                        dae.name = "Pierre";
                        dae.updateMatrix();
                        dae = dae as THREE.Object3D; // cast .dae to THREE.Mesh
                        dae = dae as THREE.Mesh;

                        console.log('Loading stonePlayerOne[' + i + ']');
                        this.renderService.getStonesPlayerTwo()[i].setMesh(dae);
                        this.renderService.getStonesPlayerTwo()[i].loadStoneTexture("BLUE");
                        this.renderService.getStonesPlayerTwo()[i].getMesh().position.set(0, 20, 0);

                        resolve();
                    }
                });
            }
        });
    }

    public loadBroom(): Promise<THREE.Mesh> {
        return new Promise<THREE.Mesh>((resolve, error) => {
            let loader = new THREE.ColladaLoader();
            loader.load('/assets/models/dae/broom_curling.dae', (collada) => {
                if (loader === undefined) {
                    error("Unable to load object");
                } else {
                    let dae;
                    dae = collada.scene;
                    dae.scale.x = dae.scale.y = dae.scale.z = 300;
                    dae.name = "Broom";
                    dae.updateMatrix();
                    dae = dae as THREE.Object3D; // cast .dae to THREE.Mesh
                    dae = dae as THREE.Mesh;

                    console.log('Loading Broom');
                    this.renderService.getBroom().setMesh(dae);
                    this.renderService.getBroom().getMesh().position.set(70, 1, -200);
                    this.renderService.getBroom().getMesh().rotateZ(THREE.Math.degToRad(90));

                    this.renderService.getScene().add(this.renderService.getBroom().getMesh());
                    resolve(dae);
                }
            });
        });
    }

    public createSkybox(): void {
        let path = "./app/images/skybox/";
        let format = '.jpg';
        let urls = [
            path + 'posx' + format, path + 'negx' + format,
            path + 'posy' + format, path + 'negy' + format,
            path + 'posz' + format, path + 'negz' + format
        ];
        let reflectionCube = new THREE.CubeTextureLoader().load(urls);
        this.renderService.getScene().background = reflectionCube;

    }
}
