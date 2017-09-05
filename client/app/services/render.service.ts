import { Injectable } from '@angular/core';
import { Stone } from './../stone/stone';
import { Broom } from './../broom/broom';
import { DottedLine } from './../dottedLine/dottedLine';
import { ObjectCreaterService } from './object-creater.service';

const SCALING_RATIO = 269.602;
const RINK_LENGTH = 44.51 * SCALING_RATIO;
const RINK_WIDTH = 4.28 * SCALING_RATIO;
const RINK_CENTER = 22.255 * SCALING_RATIO;
const DISTANCE_RINK_BACK_HOUSE = 4.88 * SCALING_RATIO;
const DISTANCE_HOGLINE_HOUSE = 6.4 * SCALING_RATIO;
const HOUSE_SIZE = 3.66 * SCALING_RATIO;
const DISTANCE_CENTER_HOUSE = 17.375 * SCALING_RATIO;
const HOGLINE_THICKNESS = 0.3709 * SCALING_RATIO;
const BORDER_HEIGHT = 300;
const RED_MATERIAL = new THREE.MeshPhongMaterial({ color: 0xdb061b, wireframe: true });
const GREEN_MATERIAL = new THREE.MeshPhongMaterial({ color: 0x13d831, wireframe: true });
const PLAYER_ONE = "1";
const PLAYER_TWO = "2";
const RED_COLOR = "RED";
const BLUE_COLOR = "BLUE";
const AMOUNT_OF_CONFETTIS = 500;
const SWEEPING_RIGHT_LIMIT = 200;
const SWEEPING_LEFT_LIMIT = -200;
const SWEEPING_UPPER_LIMIT = -300;
const SWEEPING_LOWER_LIMIT = 0;

enum enumCamera { PERSPECTIVE, ORTHOGRAPHIC }

@Injectable()
export class RenderService {
    private scene: THREE.Scene;
    private activeCamera: any;
    private currentCamera: enumCamera;
    private renderer: THREE.Renderer;
    private meshFloor: THREE.Mesh;
    private dottedLine: DottedLine;
    private broom: Broom;

    // To keep track of whose turn it is
    private currentPlayerShooting: string;
    private currentStoneShootingIndex: number;
    private stoneHasStoppedMoving: boolean;

    // To keep track which stone is currently is Moving
    private currentPlayerStoneMoving: string;
    private currentStoneMoving: Stone;
    private stoneIsGoingUp: boolean;


    private stonesPlayerOne: Stone[];
    private stonesPlayerTwo: Stone[];
    private collidableStones: Stone[];

    private objectCreaterService: ObjectCreaterService;

    public init(container: HTMLElement) {

        // Add 8 stones for both players
        this.stonesPlayerOne = new Array();
        this.stonesPlayerTwo = new Array();
        this.collidableStones = new Array();
        this.objectCreaterService = new ObjectCreaterService(this);
        this.broom = new Broom();
        this.dottedLine = new DottedLine();

        for (let i = 0; i < 8; i++) {
            this.stonesPlayerOne[i] = new Stone();
            this.stonesPlayerTwo[i] = new Stone();
            this.stonesPlayerOne[i].setIndex(i);
            this.stonesPlayerTwo[i].setIndex(i);
            this.stonesPlayerOne[i].setColor("red");
            this.stonesPlayerTwo[i].setColor("blue");
        }

        this.currentPlayerShooting = this.currentPlayerStoneMoving = PLAYER_ONE;
        this.currentStoneMoving = new Stone();
        this.currentStoneShootingIndex = 0;
        this.currentStoneMoving = this.stonesPlayerOne[this.currentStoneShootingIndex];
        this.stoneHasStoppedMoving = false;
        this.stoneIsGoingUp = true;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, devicePixelRatio: window.devicePixelRatio });
        this.renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8, true);

        // Scene
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0x444444));

        // Lighting dirLight 1
        let dirLight = new THREE.DirectionalLight(0xeeeeee);
        dirLight.position.set(0, 50, 100);
        dirLight.position.normalize();
        this.scene.add(dirLight);

        // Lighting dirLight 2
        let dirLight2 = new THREE.DirectionalLight(0xeeeeee);
        dirLight2.position.set(5, 5, 5);
        dirLight2.position.normalize();
        this.scene.add(dirLight);

        // Show the floor
        this.meshFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(RINK_WIDTH, RINK_LENGTH, 2, 2),
            new THREE.MeshPhongMaterial({ color: 0xffffff })
        );
        this.meshFloor.rotation.x -= Math.PI / 2;
        this.meshFloor.position.z = -(RINK_CENTER - DISTANCE_RINK_BACK_HOUSE);
        this.scene.add(this.meshFloor);

        // Hogline 1
        let hogline = new THREE.Mesh(
            new THREE.PlaneGeometry(RINK_WIDTH, HOGLINE_THICKNESS, 2, 2),
            new THREE.MeshPhongMaterial({ color: 0x1059E0 })
        );
        hogline.position.set(0, 1, -DISTANCE_HOGLINE_HOUSE);
        hogline.rotateX(-Math.PI / 2);
        this.scene.add(hogline);

        // Hogline 2
        let hogline2 = new THREE.Mesh(
            new THREE.PlaneGeometry(RINK_WIDTH, HOGLINE_THICKNESS, 2, 2),
            new THREE.MeshPhongMaterial({ color: 0x1059E0 })
        );
        hogline2.position.set(0, 1, -(RINK_LENGTH - 2 * DISTANCE_RINK_BACK_HOUSE - DISTANCE_HOGLINE_HOUSE));
        hogline2.rotateX(-Math.PI / 2);
        this.scene.add(hogline2);

        // Load 1st house
        let house = new THREE.Mesh(
            new THREE.PlaneGeometry(HOUSE_SIZE, HOUSE_SIZE, 2, 2),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/assets/images/curlinghouse.png') })
        );
        house.rotation.x -= Math.PI / 2;
        house.position.set(0, 1, -(RINK_CENTER - DISTANCE_CENTER_HOUSE - DISTANCE_RINK_BACK_HOUSE));
        this.scene.add(house);

        //Load 2nd house
        let house2 = new THREE.Mesh(
            new THREE.PlaneGeometry(HOUSE_SIZE, HOUSE_SIZE, 2, 2),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/assets/images/curlinghouse.png') })
        );
        house2.rotation.x -= Math.PI / 2;
        house2.position.set(0, 1, -(RINK_CENTER + DISTANCE_CENTER_HOUSE - DISTANCE_RINK_BACK_HOUSE));
        this.scene.add(house2);

        // Load border 1
        let border = new THREE.Mesh(
            new THREE.PlaneGeometry(RINK_LENGTH, BORDER_HEIGHT, 2, 2),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/assets/images/wood1.jpg') })
        );
        border.position.set(-(RINK_WIDTH) / 2, 1, -(RINK_CENTER - DISTANCE_RINK_BACK_HOUSE));
        border.rotation.y += Math.PI / 2;
        this.scene.add(border);

        // Load border 2
        let border2 = new THREE.Mesh(
            new THREE.PlaneGeometry(RINK_WIDTH, BORDER_HEIGHT, 2, 2),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/assets/images/wood1.jpg') })
        );
        border2.position.set(0, 1, -(RINK_LENGTH - DISTANCE_RINK_BACK_HOUSE));
        this.scene.add(border2);

        // Load border 3
        let border3 = new THREE.Mesh(
            new THREE.PlaneGeometry(RINK_LENGTH, BORDER_HEIGHT, 2, 2),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/assets/images/wood1.jpg') })
        );
        border3.position.set((RINK_WIDTH) / 2, 1, -(RINK_CENTER - DISTANCE_RINK_BACK_HOUSE));
        border3.rotation.y -= Math.PI / 2;
        this.scene.add(border3);

        // Camera
        this.activeCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, RINK_LENGTH);
        this.cameraDiveView();
        this.currentCamera = enumCamera.PERSPECTIVE;

        // Line animation
        this.drawDottedLine();
        this.animateLineFlash();

        // Loading stones + animation
        this.objectCreaterService.loadStonesPlayer1().then(() => {
            this.collidableStones.push(this.stonesPlayerOne[0]);
        });
        this.objectCreaterService.loadStonesPlayer2();

        // Load broom + animation
        this.objectCreaterService.loadBroom().then(() => {
            this.broom.getMesh().visible = false;
            this.broom.changeColladaBroomMaterial(this.broom.getMesh(), RED_MATERIAL);
            this.broom.setBroomColor("red");
        });

        this.objectCreaterService.createSkybox();

        // Insert the canvas into the DOM
        // var container = document.getElementById("glContainer");
        if (container.getElementsByTagName('canvas').length === 0) {
            container.appendChild(this.renderer.domElement);
        }

        // bind to window resizes
        window.addEventListener('resize', _ => this.onResize());
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public getCurrentStoneShootingIndex(): number {
        return this.currentStoneShootingIndex;
    }

    public setStoneHasStoppedMoving(bool: boolean): void {
        this.stoneHasStoppedMoving = bool;
    }

    public getDottedLine(): DottedLine {
        return this.dottedLine;
    }

    public getStonesPlayerOne(): Stone[] {
        return this.stonesPlayerOne;
    }

    public getStonesPlayerTwo(): Stone[] {
        return this.stonesPlayerTwo;
    }

    public getCurrentStoneShooting(): Stone {
        if (this.currentPlayerShooting === PLAYER_ONE) {
            return this.stonesPlayerOne[this.currentStoneShootingIndex];
        }
        else if (this.currentPlayerShooting === PLAYER_TWO) {
            return this.stonesPlayerTwo[this.currentStoneShootingIndex];
        }
    }

    public getCurrentPlayerTurn(): string {
        return this.currentPlayerShooting;
    }

    public getBroom(): Broom {
        return this.broom;
    }

    public adjustBroomColor(): void {
        let stone;
        if (this.currentPlayerShooting === PLAYER_ONE) {
            stone = this.stonesPlayerOne[this.currentStoneShootingIndex];
        }
        else if (this.currentPlayerShooting === PLAYER_TWO) {
            stone = this.stonesPlayerTwo[this.currentStoneShootingIndex];
        }
        if (stone.getMesh().position.z <
            -DISTANCE_HOGLINE_HOUSE - HOGLINE_THICKNESS / 2 && this.broom.getBroomColor() !== "green") {
            this.broom.changeColladaBroomMaterial(this.broom.getMesh(), GREEN_MATERIAL);
            this.broom.setBroomColor("green");
        }
        else if (stone.getMesh().position.z
            > -DISTANCE_HOGLINE_HOUSE - HOGLINE_THICKNESS / 2 && this.broom.getBroomColor() !== "red") {
            this.broom.changeColladaBroomMaterial(this.broom.getMesh(), RED_MATERIAL);
            this.broom.setBroomColor("red");
        }
    }

    public animateStone(player: string, index: number): void {
        let stone;
        if (player === PLAYER_ONE) {
            stone = this.stonesPlayerOne[index];
        }
        else {
            stone = this.stonesPlayerTwo[index];
        }
        let animationFrameId = window.requestAnimationFrame(_ => this.animateStone(player, index));
        this.adjustBroomColor();
        if (Math.abs(stone.getSpeedZ()) > 0.01) {
            stone.getMesh().
                rotateZ(stone.getSpin());
            stone.getMesh().position.z +=
                stone.getSpeedZ();
            stone.getMesh().position.x +=
                stone.getSpeedX();
            stone.accelerate();
            if (this.currentStoneShootingIndex === index && player === this.currentPlayerShooting
                && this.currentCamera === enumCamera.PERSPECTIVE) {
                this.translateCamera(stone.
                    getSpeedX(), 0, stone.getSpeedZ());
            }
            this.broom.getMesh().position.x += stone.getSpeedX();
            this.broom.getMesh().position.z += stone.getSpeedZ();

            let collidedStone: Stone;
            collidedStone = stone.detectCollision(this.collidableStones);
            if (collidedStone !== null) {
                if (collidedStone.getColor() === "red") {
                    this.currentStoneMoving = this.stonesPlayerOne[collidedStone.getIndex()];
                    this.currentPlayerStoneMoving = PLAYER_ONE;
                }
                else if (collidedStone.getColor() === "blue") {
                    this.currentStoneMoving = this.stonesPlayerTwo[collidedStone.getIndex()];
                    this.currentPlayerStoneMoving = PLAYER_TWO;
                }

                console.log("Stone to animate:" + this.currentStoneMoving);
                console.log("StonesPlayerOne: " + this.stonesPlayerOne[collidedStone.getIndex()]);
                this.currentStoneMoving.setSpeedX(
                    collidedStone.getSpeedX());
                this.currentStoneMoving.setSpeedZ(
                    collidedStone.getSpeedZ());
                this.currentStoneMoving.setAccelerationFrictionX(
                    collidedStone.getAccelerationFrictionX());

                this.animateStone(this.currentPlayerStoneMoving, this.currentStoneMoving.getIndex());
            }
        }

        else if (Math.abs(stone.getSpeedZ()) < 0.01) {
            stone.getMesh().rotateZ(0);
            stone.setSpeedX(0); // To make sure it is completely motionless.
            stone.setSpeedZ(0);
            this.stoneHasStoppedMoving = true;
            cancelAnimationFrame(animationFrameId);
        }
    }

    public spawnNewStone(): void {
        if (this.currentPlayerShooting === PLAYER_ONE) {
            this.currentPlayerShooting = this.currentPlayerStoneMoving = PLAYER_TWO;
            this.stonesPlayerTwo[this.currentStoneShootingIndex].setIsInPlay(true);
            this.stonesPlayerTwo[this.currentStoneShootingIndex].loadStoneTexture(BLUE_COLOR);
            this.collidableStones.push(this.stonesPlayerTwo[this.currentStoneShootingIndex]);
            this.currentStoneMoving = this.stonesPlayerTwo[this.currentStoneShootingIndex];
            this.scene.add(this.stonesPlayerTwo[this.currentStoneShootingIndex].getMesh());
        }
        else {
            this.currentPlayerShooting = this.currentPlayerStoneMoving = PLAYER_ONE;
            this.currentStoneShootingIndex++;
            this.stonesPlayerOne[this.currentStoneShootingIndex].setIsInPlay(true);
            this.stonesPlayerOne[this.currentStoneShootingIndex].loadStoneTexture(RED_COLOR);
            this.collidableStones.push(this.stonesPlayerOne[this.currentStoneShootingIndex]);
            this.currentStoneMoving = this.stonesPlayerOne[this.currentStoneShootingIndex];
            this.scene.add(this.stonesPlayerOne[this.currentStoneShootingIndex].getMesh());
        }
        this.broom.getMesh().visible = false;
    }

    private drawDottedLine(): void {
        this.scene.add(this.dottedLine.getDottedLine());
    }

    public removeLine(): void {
        this.scene.remove(this.dottedLine.getDottedLine());
    }

    public addLine(): void {
        this.scene.add(this.dottedLine.getDottedLine());
    }

    public animateLineFlash(): void {
        window.requestAnimationFrame(_ => this.animateLineFlash());
        this.dottedLine.lineFlashEffect();
        this.dottedLine.incrementFrameCounterLine();
        this.render();
    }

    public onWindowResize(): void {
        let factor = 0.8;
        let newWidth: number = window.innerWidth * factor;
        let newHeight: number = window.innerHeight * factor;

        this.activeCamera.aspect = newWidth / newHeight;
        this.activeCamera.updateProjectionMatrix();

        this.renderer.setSize(newWidth, newHeight);
    }

    public render(): void {
        this.renderer.render(this.scene, this.activeCamera);
    }

    public onResize(): void {
        const width = window.innerWidth * 0.95;
        const height = window.innerHeight - 90;

        this.activeCamera.aspect = width / height;
        this.activeCamera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    public translateMesh(x: number, y: number): void {
        this.stonesPlayerOne[this.currentStoneShootingIndex].getMesh().position.x += x;
        this.stonesPlayerOne[this.currentStoneShootingIndex].getMesh().position.y += y;
    }

    public rotateMesh(x: number, y: number, z: number): void {
        this.stonesPlayerOne[this.currentStoneShootingIndex].getMesh().rotateX(50);
        this.stonesPlayerOne[this.currentStoneShootingIndex].getMesh().updateMatrix();
    }

    public translateCamera(x: number, y: number, z: number): void {
        this.activeCamera.position.x += x === undefined ? 0 : x;
        this.activeCamera.position.y += y === undefined ? 0 : y;
        this.activeCamera.position.z += z === undefined ? 0 : z;
        this.activeCamera.updateProjectionMatrix();
    }

    public cameraTopView(): void {
        this.activeCamera.rotation.set(- Math.PI / 2, 0, 0);
        this.activeCamera.position.set(0, 6000, -3500);
    }

    public cameraDiveView(): void {
        this.activeCamera.rotation.set(- Math.PI / 8, 0, 0);
        this.activeCamera.position.set(0, 1000, 1000);
    }

    public switchCamera(cam: string): void {
        if (cam === "PERSPECTIVE") {
            this.activeCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, RINK_LENGTH);
            this.currentCamera = enumCamera.PERSPECTIVE;
            console.log("PerspectiveCamera");
        }
        else if (cam === "ORTHOGRAPHIC") {
            this.activeCamera = new THREE.OrthographicCamera(6 * window.innerWidth / -2,
                6 * window.innerWidth / 2, 22 * window.innerHeight / 2, 15 * window.innerHeight / -2, 1, 10000);
            this.currentCamera = enumCamera.ORTHOGRAPHIC;
            console.log("OrthographicCamera");
        }
    }

    public checkAllStonesAreMotionless(): boolean {
        let allStonesMotionless = true;
        for (let i = 0; i <= this.currentStoneShootingIndex; i++) {
            if (this.stonesPlayerOne[i].isMoving()
                || this.stonesPlayerTwo[i].isMoving()) {
                allStonesMotionless = false;
            }
        }
        return allStonesMotionless;
    }

    public detectSweep(event: any): void {
        event.preventDefault();

        let mousePosition = new THREE.Vector3();

        mousePosition.x = ((event.clientX - this.renderer.domElement.getBoundingClientRect().left)
            / this.renderer.domElement.clientWidth) * 2 - 1;
        mousePosition.y = -((event.clientY - this.renderer.domElement.getBoundingClientRect().top)
            / this.renderer.domElement.clientHeight) * 2 + 1;

        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mousePosition, this.activeCamera);
        let intersects = raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            console.log('Sweeping coordinates are : ' + 'x: ' + intersects[0].point.x + ' z: ' + intersects[0].point.z);

            if (this.currentPlayerStoneMoving === PLAYER_ONE) {
                if (intersects[0].point.x - this.stonesPlayerOne[this.currentStoneMoving.getIndex()]
                    .getMesh().position.x < SWEEPING_RIGHT_LIMIT &&
                    intersects[0].point.x - this.stonesPlayerOne[this.currentStoneMoving.getIndex()]
                        .getMesh().position.x > SWEEPING_LEFT_LIMIT &&
                    intersects[0].point.z - this.stonesPlayerOne[this.currentStoneMoving.getIndex()]
                        .getMesh().position.z > SWEEPING_UPPER_LIMIT &&
                    intersects[0].point.z - this.stonesPlayerOne[this.currentStoneMoving.getIndex()]
                        .getMesh().position.z < SWEEPING_LOWER_LIMIT) {
                    console.log('Sweeping...');
                    this.stonesPlayerOne[this.currentStoneMoving.getIndex()].setFrictionToSweepedFriction();
                    this.stonesPlayerOne[this.currentStoneMoving.getIndex()].setSpinFactorToSweepedFactor();
                    setTimeout(() => {
                        this.stonesPlayerOne[this.currentStoneMoving.getIndex()].setFrictionToNormal();
                        this.stonesPlayerOne[this.currentStoneMoving.getIndex()].setSpinFactorToNormal();
                        console.log('Stone is back to normal friction');
                    }, 1000);
                }
                else {
                    console.log('Sweep closer please...');
                }
            }

            else if (this.currentPlayerStoneMoving === PLAYER_TWO) {
                if (intersects[0].point.x - this.stonesPlayerTwo[this.currentStoneMoving.getIndex()].
                    getMesh().position.x < SWEEPING_RIGHT_LIMIT &&
                    intersects[0].point.x - this.stonesPlayerTwo[this.currentStoneMoving.getIndex()].
                        getMesh().position.x > SWEEPING_LEFT_LIMIT &&
                    intersects[0].point.z - this.stonesPlayerTwo[this.currentStoneMoving.getIndex()].
                        getMesh().position.z > SWEEPING_UPPER_LIMIT &&
                    intersects[0].point.z - this.stonesPlayerTwo[this.currentStoneMoving.getIndex()].
                        getMesh().position.z < SWEEPING_LOWER_LIMIT) {
                    console.log('Sweeping...');
                    this.stonesPlayerTwo[this.currentStoneMoving.getIndex()].setFrictionToSweepedFriction();
                    this.stonesPlayerTwo[this.currentStoneMoving.getIndex()].setSpinFactorToSweepedFactor();
                    setTimeout(() => {
                        this.stonesPlayerTwo[this.currentStoneMoving.getIndex()].setFrictionToNormal();
                        this.stonesPlayerTwo[this.currentStoneMoving.getIndex()].setSpinFactorToNormal();
                        console.log('Stone is back to normal friction');
                    }, 1000);
                }
                else {
                    console.log('Sweep closer please...');
                }
            }
        }
    }

    public broomFollowMouse(event: any) {
        let mousePosition = new THREE.Vector3();

        mousePosition.x = ((event.clientX - this.renderer.domElement.getBoundingClientRect().left)
            / this.renderer.domElement.clientWidth) * 2 - 1;
        mousePosition.y = -((event.clientY - this.renderer.domElement.getBoundingClientRect().top)
            / this.renderer.domElement.clientHeight) * 2 + 1;

        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mousePosition, this.activeCamera);
        let intersects = raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            this.broom.getMesh().position.x = intersects[0].point.x;
            this.broom.getMesh().position.y = intersects[0].point.y;
            this.broom.getMesh().position.z = intersects[0].point.z;
        }
    }

    public confettisAnimation(): Promise<void> {
        return new Promise<void>((resolve) => {
            // confettis
            let confettis = new Array<THREE.Mesh>(AMOUNT_OF_CONFETTIS);
            let confettisStoppedCounter = 0;

            for (let i = 0; i < confettis.length; i++) {
                let confettiGeometry = new THREE.PlaneGeometry(10, Math.random() * 50);
                let confettiMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
                confettis[i] = new THREE.Mesh(confettiGeometry, confettiMaterial);
                confettis[i].position.set(0, window.innerHeight - 100, - 100);
                this.scene.add(confettis[i]);
                this.animateConfetti(confettis[i]).then(() => {
                    confettisStoppedCounter++;
                    if (confettisStoppedCounter === AMOUNT_OF_CONFETTIS) {
                        console.log("Animation ended");
                        resolve();
                    }
                });
            }
        });
    }

    public animateConfetti(confetti: THREE.Mesh): Promise<void> {
        return new Promise<void>((resolve) => {

            window.requestAnimationFrame(_ => {
                this.animateConfetti(confetti).then(() => {
                    resolve();
                });
            });

            let confettiSpeed = (Math.random() * 2) / Math.random() + 2;
            if (confetti.position.y > 100) {
                confetti.position.y -= confettiSpeed;
                if (confetti.position.x + 100 < RINK_WIDTH / 2) {
                    confetti.position.x += Math.random() * 100;
                }
                if (confetti.position.x - 100 > -RINK_WIDTH / 2) {
                    confetti.position.x -= Math.random() * 100;
                }
            }
            else {
                resolve();
            }

        });
    }

    public startStonesJumpAnimation(winnerColor: string): void {
        let stonesToAnimate;
        if (winnerColor === RED_COLOR) {
            this.stonesPlayerOne[0].setIsInPlay(true);
            stonesToAnimate = this.stonesPlayerOne;
        }
        else if (winnerColor === BLUE_COLOR) {
            stonesToAnimate = this.stonesPlayerTwo;
        }
        for (let i = 0; i < stonesToAnimate.length; i++) {
            if (stonesToAnimate[i].getIsInPlay()) {
                stonesToAnimate[i].animateStoneJump();
            }
        }
    }
}
