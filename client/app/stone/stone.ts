import { AudioService } from '../services/audio.service';

const CLOCKWISE_SPIN = -0.01;
const COUNTER_CLOCKWISE_SPIN = 0.01;
const DEFAULT_FRICTION_COEFFICIENT = 0.018;
const BROOM_FRICTION_COEFFICIENT = 0.001;
const DEFAULT_SPIN_FACTOR = 16;
const BROOMING_SPIN_FACTOR = 32;
const SCALING_RATIO = 269.602;
const RINK_LENGTH = 44.51 * SCALING_RATIO;
const RINK_WIDTH = 4.28 * SCALING_RATIO;
const DISTANCE_RINK_BACK_HOUSE = 4.88 * SCALING_RATIO;
const STONE_RADIUS = 57.5;
const MAX_HEIGHT_JUMP = 250;
const MIN_HEIGHT_JUMP = 10;
const FRAME_JUMP = 10;


export class Stone {
    private mesh: THREE.Mesh;
    private spin: number;
    private isInPlay: boolean;
    private speedVector: { x: number, z: number };  // In x and z (y is useless). (In units / frame).
    private accelerationFrictionVector: { x: number, z: number }; // In x and z (y is useless). (In units / frame).
    private accelerationSpinX: number; // additional acceleration due to spin.
    private spinFactor: number;
    private initialAccelerationSpinX: number;
    private frictionCoefficient: number;
    private audioService: AudioService;
    private color: string;
    private index: number; // index of the stone in the array.
    private stoneIsGoingUp: boolean;

    constructor() {
        this.audioService = new AudioService();
        this.speedVector = { x: 0, z: 0 };
        this.accelerationFrictionVector = { x: 0, z: 0 };
        this.accelerationSpinX = 0;
        this.isInPlay = false;
        this.frictionCoefficient = DEFAULT_FRICTION_COEFFICIENT;
        this.spinFactor = DEFAULT_SPIN_FACTOR;
        this.index = null;
        this.stoneIsGoingUp = false;
    }

    setColor(color: string): void {
        this.color = color;
    }

    getColor(): string {
        return this.color;
    }

    setIndex(index: number): void {
        this.index = index;
    }

    getIndex(): number {
        return this.index;
    }

    setMesh(mesh: THREE.Mesh): void {
        this.mesh = mesh;
    }

    getMesh(): THREE.Mesh {
        return this.mesh;
    }

    getAudioService(): AudioService {
        return this.audioService;
    }

    setSpin(spin: string): void {
        if (spin === "CLOCKWISE") {
            this.spin = CLOCKWISE_SPIN;
        }
        else if (spin === "COUNTERCLOCKWISE"){
            this.spin = COUNTER_CLOCKWISE_SPIN;
        }
    }

    getDirectionUnitVector() {
        let vectorNorm = this.getSpeedVectorNorm();
        let x, z;
        if (vectorNorm !== 0){
            x = this.speedVector.x / vectorNorm;
            z = this.speedVector.z / vectorNorm;
        }
        else{
            x = 0;
            z = 0;
        }
        return { x: x, z: z };
    }

    setInitialSpinAccelerationX(acceleration: number): void {
        this.initialAccelerationSpinX = acceleration;
    }

    getSpin(): number {
        return this.spin;
    }

    setFrictionToNormal(): void {
        this.frictionCoefficient = DEFAULT_FRICTION_COEFFICIENT;
    }

    setFrictionToSweepedFriction(): void {
        this.frictionCoefficient = BROOM_FRICTION_COEFFICIENT;
    }

    setSpinFactorToNormal(): void {
        this.spinFactor = DEFAULT_SPIN_FACTOR;
    }

    setSpinFactorToSweepedFactor(): void {
        this.spinFactor = BROOMING_SPIN_FACTOR;
    }

    setIsInPlay(bool: boolean): void {
        this.isInPlay = bool;
    }

    getIsInPlay(): boolean {
        return this.isInPlay;
    }

    setSpeedZ(speedZ: number): void {
        this.speedVector.z = speedZ;
    }

    setSpeedX(speedX: number): void {
        this.speedVector.x = speedX;
    }

    getSpeedVectorNorm(): number {
        return Math.sqrt(Math.pow(this.speedVector.x, 2) + Math.pow(this.speedVector.z, 2));
    }

    setAccelerationSpinX(acceleration: number): void {
        this.accelerationSpinX = acceleration;
    }

    getAccelerationSpinX(): number {
        return this.accelerationSpinX;
    }

    setAccelerationFrictionZ(accelerationZ: number): void {
        this.accelerationFrictionVector.z = accelerationZ;
    }

    setAccelerationFrictionX(accelerationX: number): void {
        this.accelerationFrictionVector.x = accelerationX;
    }

    getSpeedZ(): number {
        return this.speedVector.z;
    }

    getSpeedX(): number {
        return this.speedVector.x;
    }

    getAccelerationFrictionZ(): number {
        return this.accelerationFrictionVector.z;
    }

    getAccelerationFrictionX(): number {
        return this.accelerationFrictionVector.x;
    }

    stoneIsOutOfBounds(): boolean {
        if (Math.abs(this.getMesh().position.x) > (RINK_WIDTH / 2) - STONE_RADIUS ||
                Math.abs(this.getMesh().position.z) > RINK_LENGTH - DISTANCE_RINK_BACK_HOUSE - STONE_RADIUS) {
            return true;
        }
        else {
            return false;
        }
    }

    adjustFrictionToDirection(): void {
        let dirUnitVector = this.getDirectionUnitVector();
        this.setAccelerationFrictionZ(-dirUnitVector.z * this.frictionCoefficient);
        this.setAccelerationFrictionX(-dirUnitVector.x * this.frictionCoefficient);
    }

    //To be called once per frame of the animation.
    accelerate(): void {

        let speedBeforeAccelZ = this.getSpeedZ();

        this.adjustFrictionToDirection();

        this.speedVector.z += this.accelerationFrictionVector.z;
        this.speedVector.x += this.accelerationFrictionVector.x;
        //proportional to z speed
        this.accelerationSpinX = (Math.abs(this.speedVector.z) / this.spinFactor) * this.initialAccelerationSpinX;
        if (this.spin === COUNTER_CLOCKWISE_SPIN) {
            this.accelerationSpinX = -this.accelerationSpinX;
        }
        if (Math.abs(this.speedVector.z) < 6) {   // Remove spin acceleration if stone is too slow.
            this.accelerationSpinX = 0;
        }
        this.speedVector.x += this.accelerationSpinX;

        if (this.stoneIsOutOfBounds()) {
            this.setSpeedX(0);
            this.setSpeedZ(0);
        }
        if ((speedBeforeAccelZ > 0 && this.getSpeedZ() < 0)
                || (speedBeforeAccelZ < 0 && this.getSpeedZ() > 0)) {
            this.setSpeedX(0);
            this.setSpeedZ(0);
        }
    }

    isMoving(): boolean {
        return (this.speedVector.x === 0 && this.speedVector.z === 0) ? false : true;
    }

    detectCollision(obstacles: Stone[]): Stone {
        for (let i = 0; i < obstacles.length; i++) {
            if (this.getMesh().id !== obstacles[i].getMesh().id
                && this.getMesh().position.distanceTo(obstacles[i].getMesh().position) < STONE_RADIUS * 2) {
                this.audioService.playCollisionSoundEffect();
                this.handleCollision(obstacles[i]);
                return obstacles[i];
            }
        }
        return null; // no collision.
    }

    handleCollision(stoneB: Stone): void {
        ////////////////////////////////////////////////////////////////////////////////////////
        //  e: restitution coefficient     LM: Linear momentum                                //
        //  Perfectly elastic collision: so e= 1 and e= (vbf - vaf)/(vai - vbi) = 1           //
        //  All stones have the same mass, so we dont consider it because they cancel out     //
        //  LM is conserved, so vai + vbi = vaf + vbf                                         //
        //  We have the following equations: vai + vaf = vbi + vbf and vai + vbi = vaf + vbf  //
        //  Known values: vai and vbi                                                         //
        //  2 equations, 2 unknowns                                                           //
        //  By isolating, we get vbf = vai and vaf = vbi + vbf - vai                          //
        //  The final speed is in the direction of the collision axis                         //
        ////////////////////////////////////////////////////////////////////////////////////////
        let vai = this.getSpeedVectorNorm();
        let vbi = stoneB.getSpeedVectorNorm();
        let vaf, vbf: number;
        vbf = vai;
        vaf = vbi - vbf + vai;
        let collisionAxis = this.getCollisionAxis(stoneB);
        let vafx = collisionAxis.x * vaf;
        let vbfx = collisionAxis.x * vbf;
        let vafz = collisionAxis.z * vaf;
        let vbfz = collisionAxis.z * vbf;

        this.setSpeedX(vafx);
        this.setSpeedZ(vafz);
        stoneB.setSpeedX(vbfx);
        stoneB.setSpeedZ(vbfz);
    }

    getCollisionAxis(stoneB: Stone) { // TO-DO: Need a type
        let x = stoneB.getMesh().position.x - this.getMesh().position.x;
        let z = stoneB.getMesh().position.z - this.getMesh().position.z;
        let norm = Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2));   // to get the unit vector.
        x = x / norm;
        z = z / norm;
        return { x: x, z: z };
    }

    changeColladaStoneMaterial(node: any, material: THREE.MeshPhongMaterial): void {
        node.material = material;
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                this.changeColladaStoneMaterial(node.children[i], material);
            }
        }
    }

    loadStoneTexture(color: string): void {
        this.changeColladaStoneMaterial(this.mesh, new THREE.MeshPhongMaterial({
            map:
            new THREE.TextureLoader().load('/assets/images/granite.jpg')
        }));
        this.changeColladaStoneMaterial(this.mesh.children[5], new THREE.MeshPhongMaterial({
            map:
            new THREE.TextureLoader().load('/assets/images/handle_texture.jpg')
        }));
        if (color === "RED") {
            this.changeColladaStoneMaterial(this.mesh.children[3], new THREE.MeshPhongMaterial({
                map:
                new THREE.TextureLoader().load('/assets/images/texture_red.jpg')
            }));
        }
        else if (color === "BLUE") {
            this.changeColladaStoneMaterial(this.mesh.children[3], new THREE.MeshPhongMaterial({
                map:
                new THREE.TextureLoader().load('/assets/images/texture_blue.jpg')
            }));
        }
    }

    animateStoneJump(): void{
         window.requestAnimationFrame(_ => this.animateStoneJump());

         if (this.mesh.position.y === MAX_HEIGHT_JUMP){
            this.stoneIsGoingUp = false;
         }
         else if (this.mesh.position.y === MIN_HEIGHT_JUMP){
             this.stoneIsGoingUp = true;
         }

         if (this.stoneIsGoingUp){
            this.mesh.position.y += FRAME_JUMP;
         }
         else if ( !this.stoneIsGoingUp){
             this.mesh.position.y -= FRAME_JUMP;
         }
    }
}
