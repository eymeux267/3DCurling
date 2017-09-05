const STONE_RADIUS = 57.5;
const FRAME_BROOMING = 2;

export class Broom {
    private mesh: THREE.Mesh;
    private broomColor: string;
    private broomHasBeenSwept: boolean;
    private frameCounterBroomRight: number;
    private frameCounterBroomLeft: number;

    constructor() {
        this.broomColor = "";
        this.broomHasBeenSwept = false;
        this.frameCounterBroomRight = 0;
        this.frameCounterBroomLeft = 0;
    }

    getMesh(): THREE.Mesh {
        return this.mesh;
    }

    setMesh(mesh: THREE.Mesh): void {
        this.mesh = mesh;
    }

    getBroomColor(): string {
        return this.broomColor;
    }

    setBroomColor(color: string): void {
        this.broomColor = color;
    }

    getBroomHasBeenSwept(): boolean {
        return this.broomHasBeenSwept;
    }

    setBroomHasBeenSwept(bool: boolean): void {
        this.broomHasBeenSwept = bool;
    }

    animateBroomRight(): void {
        let animationFrameId = window.requestAnimationFrame(_ => this.animateBroomRight());
        this.mesh.position.x += STONE_RADIUS;
        this.frameCounterBroomRight++;
        if (this.frameCounterBroomRight > FRAME_BROOMING) {
            this.frameCounterBroomRight = 0;
            cancelAnimationFrame(animationFrameId);
        }
    }

    animateBroomLeft(): void {
        this.broomHasBeenSwept = true;
        let animationFrameId = window.requestAnimationFrame(_ => this.animateBroomLeft());
        this.mesh.position.x -= STONE_RADIUS;
        this.frameCounterBroomLeft++;
        if (this.frameCounterBroomLeft > FRAME_BROOMING) {
            this.frameCounterBroomLeft = 0;
            cancelAnimationFrame(animationFrameId);
        }
    }

    changeColladaBroomMaterial(node: any, material: THREE.MeshPhongMaterial): void {
        node.material = material;
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                this.changeColladaBroomMaterial(node.children[i], material);
            }
        }
    }

}
