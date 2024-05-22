class Camera {
    static DIRECTIONS = {
        FORWARD: 0,
        BACKWARD: 1,
        LEFT: 2,
        RIGHT: 3,
        UP: 4,
        DOWN: 5
    }

    constructor() {
        this.fov = 60;
        this.aspect = canvas.width/canvas.height;
        this.near = 0.1;
        this.far = 1000;
        this.speed = 0.1;
        this.rotAlpha = 5;

        this.eye = new Vector3( [0, 0, 3] );
        this.at = new Vector3( [0, 0, -1] );
        this.up = new Vector3( [0, 1, 0] );
        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();

        this.projectionMatrix.setPerspective(this.fov, this.aspect, this.near, this.far);
        this.updateView();
    }

    moveForward() {
        var f = new Vector3();
        f.set(this.at); // compute the forward vector
        f.sub(this.eye);
        f.normalize();
        f.mul(this.speed);
        this.at = this.at.add(f);
        this.eye = this.eye.add(f);
    }

    moveBackwards() {
        var b = new Vector3(); // Compute backwards vector
        b.set(this.eye);
        b.sub(this.at);
        b.normalize();
        b.mul(this.speed);
        this.at = this.at.add(b);
        this.eye = this.eye.add(b);
    }

    moveLeft() {
        var f = new Vector3();
        f.set(this.at); // compute the forward vector
        f.sub(this.eye);
        f.normalize();

        var s = new Vector3();
        s.set(Vector3.cross(this.up, f)); // compute side vector
        s.normalize();
        s.mul(this.speed);
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    moveRight() {
        var f = new Vector3();
        f.set(this.at); // compute the forward vector
        f.sub(this.eye);
        f.normalize();
        
        var s = new Vector3();
        s.set(Vector3.cross(f, this.up)); // compute side vector
        s.normalize();
        s.mul(this.speed);
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    // Help with mouse camera movement used from:
    // https://people.ucsc.edu/~jwdicker/Asgn3/BlockyWorld.html
    pan(alpha, direction) {
        if (alpha == 0) { return; }

        // Find the forward vector
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        // Calculate the axis of rotation for up/down movements
        let xRotate = Vector3.cross(f, this.up).elements;

        // Find the current angle between the 'up' and 'forward' vectors
        const THETA = ((Math.acos(Vector3.dot(this.up, f) / (this.up.magnitude() * f.magnitude()))) * 180) / Math.PI;

        // Define a lambda function to keep the vertical pan in range
        function keepInRange(alpha, direction) {
            // The smallest angle between the 'up' vector and the 'forward' vector
            const EPSILON = 0.001;

            let newTheta = (direction) ? THETA - alpha : THETA + alpha;

            if(newTheta > (180 - EPSILON) || newTheta < EPSILON) {
                // Rotating would put the camera out of bounds. Don't rotate
                return 0;
            } else {
                return alpha;
            }
        }

        // Rotate in the given direction
        let rotationMatrix = new Matrix4();
        switch(direction) {
        case Camera.DIRECTIONS.LEFT:
            rotationMatrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
            break;
        case Camera.DIRECTIONS.RIGHT:
            rotationMatrix.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
            break;
        case Camera.DIRECTIONS.UP:
            alpha = keepInRange(alpha, true);
            // console.log(alpha);
            rotationMatrix.setRotate(alpha, xRotate[0], xRotate[1], xRotate[2]);
            break;
        case Camera.DIRECTIONS.DOWN:
            alpha = keepInRange(alpha, false);
            // console.log(alpha);
            rotationMatrix.setRotate(-alpha, xRotate[0], xRotate[1], xRotate[2]);
            break;
        default:
            console.warn(`Invalid direction passed to Camera.pan(): ${direction}`);
            return;
        }
        let fPrime = rotationMatrix.multiplyMatrixVector3(f);
        fPrime.normalize();

        // Set the view
        this.at.set(this.eye);
        this.at.add(fPrime);
        this.updateView();
    }

    panLeft() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye); // compute forward vector
        f.normalize();
        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(this.rotAlpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        var f_prime = new Vector3();
        f_prime.set(rotationMatrix.multiplyMatrixVector3(f));

        var added = new Vector3();
        added.set(this.eye);
        added.add(f_prime);
        this.at.set(added);
    }

    panRight() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye); // compute forward vector
        f.normalize();
        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-this.rotAlpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        var f_prime = new Vector3();
        f_prime.set(rotationMatrix.multiplyMatrixVector3(f));

        var added = new Vector3();
        added.set(this.eye);
        added.add(f_prime);
        this.at.set(added);
    }

    updateView() {
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2], 
            this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }
}