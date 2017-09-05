import { expect } from 'chai';
import { Stone } from './stone';
import { spy } from 'sinon';

const CLOCKWISE = "CLOCKWISE";
const COUNTERCLOCKWISE = "COUNTERCLOCKWISE";

describe('Stone.ts' , () => {

it(`The method getSpeedVectorNorm() always returns a positive value`, () => {
     let stone = new Stone();
     stone.setSpeedX(5);
     expect(stone.getSpeedVectorNorm()).to.not.be.below(0);

     stone.setSpeedX(0);
     stone.setSpeedZ(4);
     expect(stone.getSpeedVectorNorm()).to.not.be.below(0);

     stone.setSpeedX(3);
     stone.setSpeedZ(4);
     expect(stone.getSpeedVectorNorm()).to.not.be.below(0);

     stone.setSpeedX(-3);
     stone.setSpeedZ(4);
     expect(stone.getSpeedVectorNorm()).to.not.be.below(0);

     stone.setSpeedX(1);
     stone.setSpeedZ(-1);
     expect(stone.getSpeedVectorNorm()).to.not.be.below(0);


     stone.setSpeedX(-100);
     stone.setSpeedZ(-25);
     expect(stone.getSpeedVectorNorm()).to.not.be.below(0);
  });

it(`The method getSpeedVectorNorm() returns the correct vector length.`, () => {
     let stone = new Stone();
     stone.setSpeedX(5);
     expect(stone.getSpeedVectorNorm()).to.be.equal(5);

     stone.setSpeedX(0);
     stone.setSpeedZ(4);
     expect(stone.getSpeedVectorNorm()).to.be.equal(4);

     stone.setSpeedX(3);
     stone.setSpeedZ(4);
     expect(stone.getSpeedVectorNorm()).to.be.equal(5);

     stone.setSpeedX(-3);
     stone.setSpeedZ(4);
     expect(stone.getSpeedVectorNorm()).to.be.equal(5);

     stone.setSpeedX(1);
     stone.setSpeedZ(-1);
     expect(stone.getSpeedVectorNorm()).to.be.equal(Math.sqrt(2));


     stone.setSpeedX(-100);
     stone.setSpeedZ(-25);
     expect(stone.getSpeedVectorNorm()).to.be.equal(Math.sqrt(10625));
  });

    it(`The method getDirectionUnitVector() gives the correct vector `, () => {
     let stone = new Stone();
     stone.setSpeedX(5);
     stone.setSpeedZ(5);

     let vector = stone.getDirectionUnitVector();
     expect(vector.z).to.be.equal(stone.getSpeedZ() / stone.getSpeedVectorNorm());
     expect(vector.x).to.be.equal(stone.getSpeedX() / stone.getSpeedVectorNorm());
     expect(Math.pow(vector.z, 2) + Math.pow(vector.x, 2)).to.be.approximately(1, 0.01);

     stone.setSpeedX(10);
     stone.setSpeedZ(-10);
     vector = stone.getDirectionUnitVector();

     expect(vector.z).to.be.equal(stone.getSpeedZ() / stone.getSpeedVectorNorm());
     expect(vector.x).to.be.equal(stone.getSpeedX() / stone.getSpeedVectorNorm());
     expect(Math.pow(vector.z, 2) + Math.pow(vector.x, 2)).to.be.approximately(1, 0.01);

     stone.setSpeedX(-250);
     stone.setSpeedZ(-4.2);
     vector = stone.getDirectionUnitVector();

     expect(vector.z).to.be.equal(stone.getSpeedZ() / stone.getSpeedVectorNorm());
     expect(vector.x).to.be.equal(stone.getSpeedX() / stone.getSpeedVectorNorm());
     expect(Math.pow(vector.z, 2) + Math.pow(vector.x, 2)).to.be.approximately(1, 0.01);

     stone.setSpeedX(-0.3);
     stone.setSpeedZ(0.05);
     vector = stone.getDirectionUnitVector();

     expect(vector.z).to.be.equal(stone.getSpeedZ() / stone.getSpeedVectorNorm());
     expect(vector.x).to.be.equal(stone.getSpeedX() / stone.getSpeedVectorNorm());
     expect(Math.pow(vector.z, 2) + Math.pow(vector.x, 2)).to.be.approximately(1, 0.01);

     stone.setSpeedX(0);
     stone.setSpeedZ(0);
     vector = stone.getDirectionUnitVector();

     expect(vector.z).to.be.equal(0);
     expect(vector.x).to.be.equal(0);
  });

     it(`The method adjustFrictionToDirection() adjusts the friction correctly `, () => {
     let stone = new Stone();
     stone.setSpeedX(0);
     stone.setSpeedZ(0);

     // All these tests are done with the default friction coefficient 0.018.
     stone.adjustFrictionToDirection();

     expect(stone.getAccelerationFrictionX()).to.be.equal(0);
     expect(stone.getAccelerationFrictionZ()).to.be.equal(0);

     stone.setSpeedX(0);
     stone.setSpeedZ(5);
     stone.adjustFrictionToDirection();

     let dirUnitVector = stone.getDirectionUnitVector();

     expect(stone.getAccelerationFrictionX()).to.be.equal(-dirUnitVector.x * 0.018);
     expect(stone.getAccelerationFrictionZ()).to.be.equal(-dirUnitVector.z * 0.018);

     stone.setSpeedX(100);
     stone.setSpeedZ(200);
     stone.adjustFrictionToDirection();

     dirUnitVector = stone.getDirectionUnitVector();

     expect(stone.getAccelerationFrictionX()).to.be.equal(-dirUnitVector.x * 0.018);
     expect(stone.getAccelerationFrictionZ()).to.be.equal(-dirUnitVector.z * 0.018);

     stone.setSpeedX(-100);
     stone.setSpeedZ(33.55);
     stone.adjustFrictionToDirection();

     dirUnitVector = stone.getDirectionUnitVector();

     expect(stone.getAccelerationFrictionX()).to.be.equal(-dirUnitVector.x * 0.018);
     expect(stone.getAccelerationFrictionZ()).to.be.equal(-dirUnitVector.z * 0.018);

     stone.setSpeedX(44.2);
     stone.setSpeedZ(-40.22);
     stone.adjustFrictionToDirection();

     dirUnitVector = stone.getDirectionUnitVector();

     expect(stone.getAccelerationFrictionX()).to.be.equal(-dirUnitVector.x * 0.018);
     expect(stone.getAccelerationFrictionZ()).to.be.equal(-dirUnitVector.z * 0.018);

     stone.setSpeedX(-1.111);
     stone.setSpeedZ(-2.2222);
     stone.adjustFrictionToDirection();

     dirUnitVector = stone.getDirectionUnitVector();

     expect(stone.getAccelerationFrictionX()).to.be.equal(-dirUnitVector.x * 0.018);
     expect(stone.getAccelerationFrictionZ()).to.be.equal(-dirUnitVector.z * 0.018);
  });

    it(`The method isMoving() correctly indicates whether the stone is moving`, () => {
     let stone = new Stone();
     stone.setSpeedX(0);
     stone.setSpeedZ(0);

     expect(stone.isMoving()).to.be.equal(false);

     stone.setSpeedX(5);

     expect(stone.isMoving()).to.be.equal(true);

     stone.setSpeedX(0);
     expect(stone.isMoving()).to.be.equal(false);

     stone.setSpeedX(-4);
     stone.setSpeedZ(-2.2);
     expect(stone.isMoving()).to.be.equal(true);
  });

  it(`The method stoneIsOutOfBounds() correctly checks if the stone hits an edge of the rink`, () => {
     let stone = new Stone();
     stone.setMesh(new THREE.Mesh);
     // leftBorder = -519.44828
     // rightBorder = 519.44828 (RINKWIDTH / 2) - STONERADIUS.
     // z limit=  -10626.827 RINKLENGTH - DISTANCERINKBACKHOUSE - STONERADIUS
     stone.getMesh().position.x = 0;
     stone.getMesh().position.z = 0;
     expect(stone.stoneIsOutOfBounds()).to.be.false;

     stone.getMesh().position.x = 30;
     expect(stone.stoneIsOutOfBounds()).to.be.false;

     stone.getMesh().position.x = 520;
     expect(stone.stoneIsOutOfBounds()).to.be.true;

     stone.getMesh().position.x = 1000;
     expect(stone.stoneIsOutOfBounds()).to.be.true;

     stone.getMesh().position.x = -519.5;
     expect(stone.stoneIsOutOfBounds()).to.be.true;

     stone.getMesh().position.x = 0;
     stone.getMesh().position.z = -5000;
     expect(stone.stoneIsOutOfBounds()).to.be.false;

     stone.getMesh().position.z = -10627;
     expect(stone.stoneIsOutOfBounds()).to.be.true;

     stone.getMesh().position.x = 520;
     stone.getMesh().position.z = -20000;
     expect(stone.stoneIsOutOfBounds()).to.be.true;
  });

   it(`The accelerate() method correctly accelerates the speed of the stone (no spin)`, () => {
     let stone = new Stone();
     stone.setMesh(new THREE.Mesh);
     let initialSpeedX = 5;
     let initialSpeedZ = 5;
     stone.setSpin(CLOCKWISE);
     stone.setInitialSpinAccelerationX(0);
     stone.setSpeedX(initialSpeedX);
     stone.setSpeedZ(initialSpeedZ);
     // Tests are done with frictionCoefficient of 0.018.
     let initialSpeed = stone.getSpeedVectorNorm();
     stone.accelerate();
     expect(stone.getSpeedVectorNorm()).to.be.equal(initialSpeed - 0.018);

     initialSpeed = stone.getSpeedVectorNorm();
     // if we accelerate 50 times.
     for (let i = 0; i < 50; i++){
       stone.accelerate();
     }
     expect(stone.getSpeedVectorNorm()).to.be.approximately(initialSpeed - 0.018 * 50, 0.00001);

     initialSpeed = stone.getSpeedVectorNorm();

     for (let i = 0; i < 50; i++){
       stone.accelerate();
     }
     expect(stone.getSpeedVectorNorm()).to.be.approximately(initialSpeed - 0.018 * 50, 0.00001);

     initialSpeedX = -5;
     initialSpeedZ = -3.33;
     initialSpeed = stone.getSpeedVectorNorm();

     for (let i = 0; i < 50; i++){
       stone.accelerate();
     }
     expect(stone.getSpeedVectorNorm()).to.be.approximately(initialSpeed - 0.018 * 50, 0.00001);

  });

  it(`The accelerate() method correctly accelerates the speed of the stone (with spin)`, () => {
     let stone = new Stone();
     stone.setMesh(new THREE.Mesh);
     let initialSpeedX = 10;
     let initialSpeedZ = 10;
     stone.setSpin(CLOCKWISE);
     stone.setInitialSpinAccelerationX(0.1);
     stone.setSpeedX(initialSpeedX);
     stone.setSpeedZ(initialSpeedZ);
     // Tests are done with frictionCoefficient of 0.018.
     stone.accelerate();

     // The actual acceleration is: speed z / 16 * 0,1 = 0,0625
     expect(stone.getSpeedX()).to.be.approximately(10.04, 0.01);
     expect(stone.getSpeedZ()).to.be.approximately(9.98, 0.01);

     stone.setSpin(COUNTERCLOCKWISE); // spin acceleration should be negative.
     stone.setSpeedX(initialSpeedX);
     stone.setSpeedZ(initialSpeedZ);

     stone.accelerate();
     expect(stone.getSpeedZ()).to.be.approximately(9.98, 0.01);
     expect(stone.getSpeedX()).to.be.approximately(9.92, 0.01);
  });

 it(`The accelerate() with only the friction acceleration eventually 
      immobilizes the stone `, () => {
     let stone = new Stone();
     stone.setSpeedX(0.001);
     stone.setSpeedZ(0.001);
     stone.setMesh(new THREE.Mesh);
     stone.setSpin(CLOCKWISE);
     stone.setInitialSpinAccelerationX(0);

     stone.accelerate();
     expect(stone.getSpeedVectorNorm()).to.be.equal(0);

     stone.setSpeedX(1);
     stone.setSpeedZ(1);
    // 79 times because the speed norm is approx 1.414. it should it take 79 accelerations
    // for the stone to stop.
     for (let i = 0; i < 78; i++ ){
        stone.accelerate();
     }
     expect(stone.getSpeedVectorNorm()).to.be.greaterThan(0);
     stone.accelerate();
     expect(stone.getSpeedVectorNorm()).to.be.equal(0);

     stone.setSpeedX(-1);
     stone.setSpeedZ(-1);
    // 79 times because the speed norm is approx 1.414. it should it take 79 accelerations
    // for the stone to stop.
     for (let i = 0; i < 78; i++ ){
        stone.accelerate();
     }
     expect(stone.getSpeedVectorNorm()).to.be.greaterThan(0);
     stone.accelerate();
     expect(stone.getSpeedVectorNorm()).to.be.equal(0);
  });

  it(`The attribute accelerationFrictionVector changes directions according to the direction 
        of the stone (opposite direction). when the method accelerate() is called `, () => {
     let stone = new Stone();
     stone.setSpeedX(0);
     stone.setSpeedZ(0);
     stone.setMesh(new THREE.Mesh);
     stone.setSpin(CLOCKWISE);
     stone.setInitialSpinAccelerationX(0);
     // All these tests are done with the default friction coefficient 0.018.
     stone.accelerate();

     expect(stone.getAccelerationFrictionX()).to.be.equal(0);
     expect(stone.getAccelerationFrictionZ()).to.be.equal(0);

     stone.setSpeedX(0);
     stone.setSpeedZ(5);
     stone.accelerate();

     let dirUnitVector = stone.getDirectionUnitVector();

     expect(stone.getAccelerationFrictionX()).to.be.equal(-dirUnitVector.x * 0.018);
     expect(stone.getAccelerationFrictionZ()).to.be.equal(-dirUnitVector.z * 0.018);

     stone.setSpeedX(100);
     stone.setSpeedZ(200);
     stone.accelerate();

     dirUnitVector = stone.getDirectionUnitVector();

     expect(stone.getAccelerationFrictionX()).to.be.equal(-dirUnitVector.x * 0.018);
     expect(stone.getAccelerationFrictionZ()).to.be.equal(-dirUnitVector.z * 0.018);

     stone.setSpeedX(-100);
     stone.setSpeedZ(33.55);
     stone.accelerate();

     dirUnitVector = stone.getDirectionUnitVector();

     expect(stone.getAccelerationFrictionX()).to.be.equal(-dirUnitVector.x * 0.018);
     expect(stone.getAccelerationFrictionZ()).to.be.equal(-dirUnitVector.z * 0.018);

     stone.setSpeedX(44.2);
     stone.setSpeedZ(-40.22);
     stone.accelerate();

     dirUnitVector = stone.getDirectionUnitVector();

     expect(stone.getAccelerationFrictionX()).to.be.equal(-dirUnitVector.x * 0.018);
     expect(stone.getAccelerationFrictionZ()).to.be.equal(-dirUnitVector.z * 0.018);

     stone.setSpeedX(-1.111);
     stone.setSpeedZ(-2.2222);
     stone.accelerate();

     dirUnitVector = stone.getDirectionUnitVector();

     expect(stone.getAccelerationFrictionX()).to.be.equal(-dirUnitVector.x * 0.018);
     expect(stone.getAccelerationFrictionZ()).to.be.equal(-dirUnitVector.z * 0.018);
  });

    it(`The accelerate() method immobilizes the stone if it is out of bounds `, () => {
     let stone = new Stone();
     stone.setSpeedX(100);
     stone.setSpeedZ(100);
     stone.setMesh(new THREE.Mesh);
     stone.setSpin(CLOCKWISE);
     stone.setInitialSpinAccelerationX(0);
     stone.getMesh().position.x = 520;  // x out of bounds.
     stone.getMesh().position.z = 0;
     stone.accelerate();
     expect(stone.isMoving()).to.be.false;

     stone.setSpeedX(100);
     stone.setSpeedZ(100);
     stone.getMesh().position.x = 30;  // x is in bounds.
     stone.accelerate();
     expect(stone.isMoving()).to.be.true;

     stone.getMesh().position.z = -11000; // z out of bounds.
     stone.accelerate();
     expect(stone.isMoving()).to.be.false;

  });

    it(`The detectCollision() method correctly detects if a stone hits another stone `, () => {
     let stone1 = new Stone();
     let stone2 = new Stone();
     let stone3 = new Stone();
     let stone4 = new Stone();

     stone1.setMesh(new THREE.Mesh);
     stone1.setSpin(CLOCKWISE);
     stone1.setInitialSpinAccelerationX(0);

     stone2.setMesh(new THREE.Mesh);
     stone2.setSpin(CLOCKWISE);
     stone2.setInitialSpinAccelerationX(0);

     stone3.setMesh(new THREE.Mesh);
     stone3.setSpin(CLOCKWISE);
     stone3.setInitialSpinAccelerationX(0);

     stone4.setMesh(new THREE.Mesh);
     stone4.setSpin(CLOCKWISE);
     stone4.setInitialSpinAccelerationX(0);

     stone1.getMesh().position.x = 0;
     stone1.getMesh().position.z = 0;
     stone2.getMesh().position.x = 300;
     stone3.getMesh().position.x = -300;
     stone4.getMesh().position.x = 0;
     stone4.getMesh().position.z = -500;

     let obstacles = new Array();
     obstacles.push(stone1);  // should work even if stone1 is in the obstacles array.
     obstacles.push(stone2);
     obstacles.push(stone3);
     obstacles.push(stone4);

     // expect it to return null if no collision is detected (distance between stones > radius * 2).
     let ret = stone1.detectCollision(obstacles);
     expect(ret).to.be.null;

     stone2.getMesh().position.x = 110; // lesser than radius * 2 = 115.

     ret = stone1.detectCollision(obstacles);
     expect(ret).to.not.be.null;

     stone2.getMesh().position.z = 100;
     ret = stone1.detectCollision(obstacles);
     expect(ret).to.be.null;  // because distance between stone 1 and 2 is 148.

     stone2.getMesh().position.x = 100;
     stone2.getMesh().position.z = -45.82; // dist between stone 1 and 2 is now 110. They are in contact.
     ret = stone1.detectCollision(obstacles);
     expect(ret).to.not.be.null;
  });

    it(`The detectCollision() method makes a sound effect if the collision is detected `, () => {
     let expect = require("chai").expect;
     let stone1 = new Stone();
     let stone2 = new Stone();
     let stone3 = new Stone();
     let stone4 = new Stone();

     let audioSpy = spy(stone1.getAudioService(), 'playCollisionSoundEffect');

     stone1.setMesh(new THREE.Mesh);
     stone1.setSpin(CLOCKWISE);
     stone1.setInitialSpinAccelerationX(0);

     stone2.setMesh(new THREE.Mesh);
     stone2.setSpin(CLOCKWISE);
     stone2.setInitialSpinAccelerationX(0);

     stone3.setMesh(new THREE.Mesh);
     stone3.setSpin(CLOCKWISE);
     stone3.setInitialSpinAccelerationX(0);

     stone4.setMesh(new THREE.Mesh);
     stone4.setSpin(CLOCKWISE);
     stone4.setInitialSpinAccelerationX(0);

     stone1.getMesh().position.x = 0;
     stone1.getMesh().position.z = 0;
     stone2.getMesh().position.x = 300;
     stone3.getMesh().position.x = -300;
     stone4.getMesh().position.x = 0;
     stone4.getMesh().position.z = -500;

     let obstacles = new Array();
     obstacles.push(stone1);  // should work even if stone1 is in the obstacles array.
     obstacles.push(stone2);
     obstacles.push(stone3);
     obstacles.push(stone4);

     stone1.detectCollision(obstacles);
     expect(audioSpy).to.not.have.been.called;

     stone2.getMesh().position.x = 110; // lesser than radius * 2 = 115.

     stone1.detectCollision(obstacles);
     expect(audioSpy).to.have.been.called;

     stone2.getMesh().position.z = 100;
     stone1.detectCollision(obstacles);
     expect(audioSpy).to.not.have.been.called;  // because distance between stone 1 and 2 is 148.

     stone2.getMesh().position.x = 100;
     stone2.getMesh().position.z = -45.82; // dist between stone 1 and 2 is now 110. They are in contact.
     stone1.detectCollision(obstacles);
     expect(audioSpy).to.have.been.called;
  });

   it(`The detectCollision() method calls handleCollision() if the collision is detected `, () => {
     let expect = require("chai").expect;
     let stone1 = new Stone();
     let stone2 = new Stone();
     let stone3 = new Stone();
     let stone4 = new Stone();

     let handleCollisionSpy = spy(stone1, 'handleCollision');

     stone1.setMesh(new THREE.Mesh);
     stone1.setSpin(CLOCKWISE);
     stone1.setInitialSpinAccelerationX(0);

     stone2.setMesh(new THREE.Mesh);
     stone2.setSpin(CLOCKWISE);
     stone2.setInitialSpinAccelerationX(0);

     stone3.setMesh(new THREE.Mesh);
     stone3.setSpin(CLOCKWISE);
     stone3.setInitialSpinAccelerationX(0);

     stone4.setMesh(new THREE.Mesh);
     stone4.setSpin(CLOCKWISE);
     stone4.setInitialSpinAccelerationX(0);

     stone1.getMesh().position.x = 0;
     stone1.getMesh().position.z = 0;
     stone2.getMesh().position.x = 300;
     stone3.getMesh().position.x = -300;
     stone4.getMesh().position.x = 0;
     stone4.getMesh().position.z = -500;

     let obstacles = new Array();
     obstacles.push(stone1);  // should work even if stone1 is in the obstacles array.
     obstacles.push(stone2);
     obstacles.push(stone3);
     obstacles.push(stone4);

     stone1.detectCollision(obstacles);
     expect(handleCollisionSpy).to.not.have.been.called;

     stone2.getMesh().position.x = 110; // lesser than radius * 2 = 115.

     stone1.detectCollision(obstacles);
     expect(handleCollisionSpy).to.have.been.called;

     stone2.getMesh().position.z = 100;
     stone1.detectCollision(obstacles);
     expect(handleCollisionSpy).to.not.have.been.called;  // because distance between stone 1 and 2 is 148.

     stone2.getMesh().position.x = 100;
     stone2.getMesh().position.z = -45.82; // dist between stone 1 and 2 is now 110. They are in contact.
     stone1.detectCollision(obstacles);
     expect(handleCollisionSpy).to.have.been.called;
  });

  it(`The detectCollision() correctly returns the stone that has been hit in case of a collision `, () => {
     let stone1 = new Stone();
     let stone2 = new Stone();
     let stone3 = new Stone();
     let stone4 = new Stone();

     stone1.setMesh(new THREE.Mesh);
     stone1.setSpin(CLOCKWISE);
     stone1.setInitialSpinAccelerationX(0);

     stone2.setMesh(new THREE.Mesh);
     stone2.setSpin(CLOCKWISE);
     stone2.setInitialSpinAccelerationX(0);

     stone3.setMesh(new THREE.Mesh);
     stone3.setSpin(CLOCKWISE);
     stone3.setInitialSpinAccelerationX(0);

     stone4.setMesh(new THREE.Mesh);
     stone4.setSpin(CLOCKWISE);
     stone4.setInitialSpinAccelerationX(0);

     stone1.getMesh().position.x = 0;
     stone1.getMesh().position.z = 0;
     stone2.getMesh().position.x = 110;
     stone3.getMesh().position.x = -300;
     stone4.getMesh().position.x = 0;
     stone4.getMesh().position.z = -500;

     let obstacles = new Array();
     obstacles.push(stone1);  // should work even if stone1 is in the obstacles array.
     obstacles.push(stone2);
     obstacles.push(stone3);
     obstacles.push(stone4);

     let ret = stone1.detectCollision(obstacles);
     expect(ret).to.deep.equal(stone2);

     stone2.getMesh().position.x = 300;

     stone3.getMesh().position.x = 100;
     ret = stone1.detectCollision(obstacles);
     expect(ret).to.deep.equal(stone3);

     stone3.getMesh().position.x = 700;

     stone4.getMesh().position.x = 100;
     stone4.getMesh().position.z = -45.82; // dist between stone 1 and 4 is now 110. They are in contact.
     ret = stone1.detectCollision(obstacles);
     expect(ret).to.deep.equal(stone4);
  });

  it(`The method handleCollision() uses linear momentum to calculate the speed after collision`, () => {
     let stone1 = new Stone();
     let stone2 = new Stone();
     let stone3 = new Stone();

     let initialSpeedX1 = 10;
     let initialSpeedZ1 = 5;
     let initialSpeedX2 = 0;
     let initialSpeedZ2 = 0;
     let initialSpeedX3 = 3;
     let initialSpeedZ3 = 10;

     stone1.setMesh(new THREE.Mesh);
     stone1.setSpin(CLOCKWISE);
     stone1.setInitialSpinAccelerationX(0);
     stone1.getMesh().position.x = 3;
     stone1.getMesh().position.z = -8;
     stone1.setSpeedX(initialSpeedX1);
     stone1.setSpeedZ(initialSpeedZ1);

     stone2.setMesh(new THREE.Mesh);
     stone2.setSpin(CLOCKWISE);
     stone2.setInitialSpinAccelerationX(0);
     stone2.getMesh().position.x = 118;
     stone2.getMesh().position.z = -8;
     stone2.setSpeedX(0);
     stone2.setSpeedZ(0);

     stone3.setMesh(new THREE.Mesh);
     stone3.setSpin(CLOCKWISE);
     stone3.setInitialSpinAccelerationX(0);
     stone3.getMesh().position.x = 3;
     stone3.getMesh().position.z = 107;
     stone3.setSpeedX(initialSpeedX3);
     stone3.setSpeedZ(initialSpeedZ3);

     // With the current stone1 and stone 2 positions in the X and Z axis, the collisionAxis
     // is approximately x: 1 and z: 0

     stone1.handleCollision(stone2);
    // stone1.handleCollision(stone3);

     expect(stone1.getSpeedX()).to.be.approximately(0, 0.01);

     expect(stone1.getSpeedZ()).to.be.approximately(0, 0.01);
     expect(stone2.getSpeedX()).to.be.approximately(11.2, 0.1);
     expect(stone2.getSpeedZ()).to.be.approximately(0, 0.1);
     let initialLinearMomentum = Math.sqrt(Math.pow(initialSpeedX1, 2) + Math.pow(initialSpeedZ1, 2)) +
      Math.sqrt(Math.pow(initialSpeedX2, 2) + Math.pow(initialSpeedZ2, 2));

      // linear momentum is conserved.
     expect(initialLinearMomentum).to.be.approximately(stone1.getSpeedVectorNorm() + stone2.getSpeedVectorNorm(), 0.1);

     stone1.setSpeedX(initialSpeedX1);
     stone1.setSpeedZ(initialSpeedZ1);
     stone1.getMesh().position.x = 3;
     stone1.getMesh().position.z = -8;

     stone1.handleCollision(stone3);
     expect(stone1.getSpeedX()).to.be.approximately(0, 0.1);
     expect(stone1.getSpeedZ()).to.be.approximately(10.4, 0.1);
     expect(stone3.getSpeedX()).to.be.approximately(0, 0.1);
     expect(stone3.getSpeedZ()).to.be.approximately(11.1803, 0.5);

     // linear momentum is conserved.
     initialLinearMomentum = Math.sqrt(Math.pow(initialSpeedX1, 2) + Math.pow(initialSpeedZ1, 2)) +
     Math.sqrt(Math.pow(initialSpeedX3, 2) + Math.pow(initialSpeedZ3, 2));
     expect(initialLinearMomentum).to.be.approximately(stone1.getSpeedVectorNorm() + stone3.getSpeedVectorNorm(), 0.1);

  });

  it(`The method getCollisionAxis() always returns the correct axis`, () => {
     let stone1 = new Stone();
     let stone2 = new Stone();

     stone1.setMesh(new THREE.Mesh);
     stone1.setSpin(CLOCKWISE);
     stone1.setInitialSpinAccelerationX(0);

     stone2.setMesh(new THREE.Mesh);
     stone2.setSpin(CLOCKWISE);
     stone2.setInitialSpinAccelerationX(0);

     stone1.getMesh().position.x = 3;
     stone1.getMesh().position.z = -8;
     stone2.getMesh().position.x = 6;
     stone2.getMesh().position.z = -16;
     let ret = stone1.getCollisionAxis(stone2);
     expect(ret.x).to.be.approximately(0.35, 0.01);
     expect(ret.z).to.be.approximately(-0.93, 0.01);

     stone1.getMesh().position.x = -3;
     stone1.getMesh().position.z = -8;
     stone2.getMesh().position.x = 6;
     stone2.getMesh().position.z = 16;
     ret = stone1.getCollisionAxis(stone2);
     expect(ret.x).to.be.approximately(0.35, 0.01);
     expect(ret.z).to.be.approximately(0.93, 0.01);
  });
});

