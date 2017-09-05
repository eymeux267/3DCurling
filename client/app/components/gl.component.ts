import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { RenderService } from '../services/render.service';
import { AudioService } from '../services/audio.service';

const MINIMUM_STONE_SPEED = 60;
const MAXIMUM_STONE_SPEED = 250;
const MAXIMUM_STONE_SPEED_THREE = 22;
const CLOCKWISE = "CLOCKWISE";
const COUNTERCLOCKWISE = "COUNTERCLOCKWISE";
const DEFAULT_CLOCKWISE_ACCELERATION_X = 0.005;
const LEFT_CLICK = 1;
const RED_MATERIAL = new THREE.MeshPhongMaterial({ color: 0xdb061b, wireframe: true });
const NUMBER_POSSIBLE_ANGLES = 61;
const MAX_STONES = 8;
const MAX_DEGREES = 30;
const PLAYER_ONE = "1";
const PLAYER_TWO = "2";

@Component({
    selector: 'my-gl',
    templateUrl: '/assets/templates/gl.component.html',
    styleUrls: [`app/components/gl.component.css`]

})
export class GlComponent {

    private playerName: string;
    private difficulty: boolean;
    private scorePlayer: number;
    private scoreCPU: number;
    private round: number;
    private stonesLeftPlayer: number;
    private stonesLeftCPU: number;

    private stoneSpin: string; // clockwise or counterclockwise
    private stoneInitialSpeed: number;
    private progressBarIsGreen: boolean;

    private mouseIsDown: boolean;
    private stoneHasBeenThrown: boolean;

    private angleDetectionArray: number[]; // each position is assigned to an angle of rotation of the dotted line.
    private currentAngle: number;

    private gameEnded: boolean;
    private endgameAnimationHasStarted: boolean;
    private winnerColor: string;

    viewType: { top: boolean, dive: boolean };

    @ViewChild('progress') elementProgressBar: ElementRef;
    @HostListener('document:keydown', ['$event'])

    public handleKeyboardEvent(event: KeyboardEvent) {
        if ((event.key === "s" || event.key === "S") && !this.stoneHasBeenThrown) {
            this.changeSpin();
        }
        else if (event.key === "c" || event.key === "C") {
            if (this.viewType.top) {
                this.diveView();
            }
            else {
                this.topView();
            }
        }
        else if (event.key === " " && this.stoneHasBeenThrown && this.renderService.checkAllStonesAreMotionless()
        && (this.stonesLeftPlayer > 0 || this.stonesLeftCPU > 0)) {
            this.goToNextShot();
        }
        if (!(this.stonesLeftPlayer > 0) && !(this.stonesLeftCPU > 0)){
            alert("No more stones left to throw, please choose the winner with the buttons");
        }
    }

    constructor(private renderService: RenderService, private audioService: AudioService) {
        this.playerName = "Papa John";
        this.difficulty = false;
        this.scorePlayer = 0;
        this.scoreCPU = 0;
        this.round = 1;
        this.stonesLeftPlayer = MAX_STONES;
        this.stonesLeftCPU = MAX_STONES;
        this.stoneInitialSpeed = 0;
        this.mouseIsDown = false;
        this.progressBarIsGreen = false;
        this.stoneSpin = CLOCKWISE;
        this.angleDetectionArray = new Array();
        for (let i = 0; i < NUMBER_POSSIBLE_ANGLES; i++) {
            this.angleDetectionArray.push(i - MAX_DEGREES);
        }
        this.currentAngle = 0;
        this.stoneHasBeenThrown = false;
        this.viewType = { top: false, dive: true };
        this.gameEnded = false;
        this.endgameAnimationHasStarted = false;
    }

    public mouseDownEventHandler(event: any) {
        if (event.which === LEFT_CLICK && !this.stoneHasBeenThrown) {
            this.mouseIsDown = true;
            this.incrementInitialSpeed();
        }

        if (event.which === LEFT_CLICK && this.stoneHasBeenThrown &&
            this.renderService.getBroom().getBroomColor() === "green") {
            this.renderService.getBroom().animateBroomLeft();
            this.audioService.playBroomSweepingSound();
            this.renderService.detectSweep(event);
        }
    }

    public mouseReleasedEventHandler(event: any) {
        this.mouseIsDown = false;
        if (this.stoneHasBeenThrown &&
            this.renderService.getBroom().getBroomColor() === "green" && event.which === LEFT_CLICK
            && this.renderService.getBroom().getBroomHasBeenSwept()) {
            this.renderService.getBroom().animateBroomRight();
            this.audioService.playBroomDesweepingSound();
        }
    }

    public broomEventHandler(event: any) {
        if (this.stoneHasBeenThrown) {
            this.renderService.broomFollowMouse(event);
        }
    }

    public incrementInitialSpeed() {
        if (this.mouseIsDown === true) {
            setTimeout(() => {
                if (this.mouseIsDown === true && this.stoneInitialSpeed <= MAXIMUM_STONE_SPEED) {
                    this.stoneInitialSpeed++;
                    this.incrementInitialSpeed();
                    let progressBarPercentage = (this.stoneInitialSpeed / MAXIMUM_STONE_SPEED) * 100;
                    this.elementProgressBar.nativeElement.style.width = progressBarPercentage + "%";
                    if (this.stoneInitialSpeed >= 60) {
                        this.progressBarIsGreen = true;
                    }
                }
                else {
                    if (this.throwStone()) {
                        this.stoneHasBeenThrown = true;
                    }
                }

            }, 10);
        }
    }

    public throwStone(): boolean {
        let stoneHasBeenThrown;
        if (this.stoneInitialSpeed >= MINIMUM_STONE_SPEED) {
            this.renderService.removeLine();
            let initialThrowingSpeed = this.convertSpeed();
            stoneHasBeenThrown = true;
            this.renderService.getBroom().getMesh().visible = true;
            let stone = this.renderService.getCurrentStoneShooting();
            stone.setSpeedZ(-initialThrowingSpeed);
            stone.setSpin(this.stoneSpin);
            let initialThrowSpeedX = Math.tan(THREE.Math.degToRad(this.currentAngle)) * (-this.convertSpeed());
            stone.setSpeedX(initialThrowSpeedX);

            if (stone.getSpin() < 0) { //Clockwise
                stone.setInitialSpinAccelerationX(DEFAULT_CLOCKWISE_ACCELERATION_X);
            }
            else {
                stone.setInitialSpinAccelerationX(DEFAULT_CLOCKWISE_ACCELERATION_X);
            }
            console.log(initialThrowingSpeed);
            if (this.renderService.getCurrentPlayerTurn() === PLAYER_ONE) {
                this.stonesLeftPlayer--;
            }
            else if (this.renderService.getCurrentPlayerTurn() === PLAYER_TWO) {
                this.stonesLeftCPU--;
            }
            this.renderService.animateStone(this.renderService.getCurrentPlayerTurn(),
                this.renderService.getCurrentStoneShootingIndex());
        }
        else {
            stoneHasBeenThrown = false;
        }
        this.stoneInitialSpeed = 0;
        return stoneHasBeenThrown;
    }

    public convertSpeed(): number {  // Factor of conversion for three js.
        let initialSpeedThreeJs = (this.stoneInitialSpeed / MAXIMUM_STONE_SPEED) * MAXIMUM_STONE_SPEED_THREE;
        return initialSpeedThreeJs;
    }

    public topView(): void {
        this.viewType.dive = false;
        this.viewType.top = true;
        this.changeView();
        this.renderService.cameraTopView();
    }

    public diveView(): void {
        this.viewType.dive = true;
        this.viewType.top = false;
        this.changeView();
        this.renderService.cameraDiveView();
    }

    public changeView(): void {
        if (this.viewType.dive) {
            this.renderService.switchCamera("PERSPECTIVE");
        }
        else {
            this.renderService.switchCamera("ORTHOGRAPHIC");
        }
    }

    public changeSpin(): void {
        if (this.stoneSpin === CLOCKWISE) {
            this.stoneSpin = COUNTERCLOCKWISE;
        }
        else {
            this.stoneSpin = CLOCKWISE;
        }
    }

    public mouseOverEventHandler(angle: number): void {
        this.renderService.getDottedLine().rotateDottedLine(angle);
        this.currentAngle = angle;
    }

    public mouseLeaveEventHandler(angle: number): void {
        this.renderService.getDottedLine().rotateDottedLine(-angle);
        this.currentAngle = 0;
    }

    public goToNextShot(): void {
        this.renderService.spawnNewStone();
        this.diveView();
        this.stoneHasBeenThrown = false;
        this.renderService.setStoneHasStoppedMoving(false);
        this.renderService.addLine();
        this.progressBarIsGreen = false;
        this.elementProgressBar.nativeElement.style.width = "0%";
        this.renderService.getBroom().
            changeColladaBroomMaterial(this.renderService.getBroom().getMesh(), RED_MATERIAL);
        this.renderService.getBroom().setBroomHasBeenSwept(false);
    }

    public confettiAnimation(): void {
        if (!this.endgameAnimationHasStarted) {
            this.endgameAnimationHasStarted = true;
            this.renderService.confettisAnimation().then(() => {
                this.gameEnded = true;
            });
        }
    }

    public stoneJumpAnimation(winnerColor: string): void {
            this.diveView();
            this.winnerColor = winnerColor;
            this.renderService.startStonesJumpAnimation(winnerColor);
    }

    public newGame(): void{
        window.location.reload(true);
    }
}
