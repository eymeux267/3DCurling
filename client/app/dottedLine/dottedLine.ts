const LINE_LENGTH = 4000;
const LINE_FRAME = 20;

export class DottedLine {
    private dottedLine: THREE.LineSegments;
    private showLineToggle: boolean;
    private frameCounterLine: number;

    constructor() {
        let geometry = new THREE.Geometry();

        for (let i = 0; i < LINE_LENGTH; i++) {
            if (i % 4 === 0) {
                geometry.vertices.push(new THREE.Vector3(0, 0, -(i * 10)));
                geometry.vertices.push(new THREE.Vector3(0, 0, - (i + 1) * 10));
            }
        }
        this.dottedLine = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0x0000ff }));
        this.dottedLine.position.y = 2;
        this.dottedLine.position.z = 0;

        this.showLineToggle = false;
        this.frameCounterLine = 0;
    }

    public getDottedLine(): THREE.LineSegments {
        return this.dottedLine;
    }

    public incrementFrameCounterLine(): void {
        this.frameCounterLine++;
    }

    public hideLine(): void {
        this.dottedLine.material.transparent = true;
        this.dottedLine.material.opacity = 0;
    }

    public showLine(): void {
        this.dottedLine.material.transparent = false;
        this.dottedLine.material.opacity = 1;
    }

    public lineFlashEffect(): void {
        if (this.showLineToggle && this.frameCounterLine > LINE_FRAME) {
            this.showLine();
            this.showLineToggle = false;
            this.frameCounterLine = 0;
        }
        else if (!this.showLineToggle && this.frameCounterLine > LINE_FRAME) {
            this.hideLine();
            this.showLineToggle = true;
            this.frameCounterLine = 0;
        }
    }

    public rotateDottedLine(angle: number): void {
        this.dottedLine.rotateY(THREE.Math.degToRad(angle));
    }
}
