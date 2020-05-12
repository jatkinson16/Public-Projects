class Vector {
    constructor(pX, pY, pZ) {
        this.setX(pX);
        this.setY(pY);
        this.setZ(pZ);
    }
    getX() {
        return this.mX;
    }
    setX(pX) {
        this.mX = pX;
    }
    getY() {
        return this.mY;
    }
    setY(pY) {
        this.mY = pY;
    }
    getZ() {
        return this.mZ;
    }
    setZ(pZ) {
        this.mZ = pZ;
    }

    add(pVector) {//adding 2 vectors together
        var newX = pVector.getX() + this.getX();
        var newY = pVector.getY() + this.getY();
        var newZ = pVector.getZ() + this.getZ();
        
        var newVector = new Vector(newX, newY, newZ);
        
        return newVector;
    }

    subtract(pVector) {//subtracting a parameter vector from the vector calling the function
        var newX = this.getX() - pVector.getX();
        var newY = this.getY() - pVector.getY();
        var newZ = this.getZ() - pVector.getZ();

        var newVector = new Vector(newX, newY, newZ);
        
        return newVector;
    }

    multiply(pScale) {//multiplying a vector by a given scale
        var newX = this.getX() * pScale;
        var newY = this.getY() * pScale;
        var newZ = this.getZ() * pScale;

        var newVector = new Vector(newX, newY, newZ);
        
        return newVector;
    }

    divide(pScale) {//dividing a vector by a given scale
        var newX = this.getX() / pScale;
        var newY = this.getY() / pScale;
        var newZ = this.getZ() / pScale;

        var newVector = new Vector(newX, newY, newZ);
        
        return newVector;
    }

    magnitude() {//calculating the magnitude of a given vector
        var squaredResult = (this.getX() * this.getX()) +  (this.getY() * this.getY());
        var magnitude = Math.sqrt(squaredResult);
        return magnitude;
    }

    normalise() {//normalising a given vector
        var magnitude = this.magnitude()
        var newX = this.getX() / magnitude;
        var newY = this.getY() / magnitude;
        var newZ = this.getZ() / magnitude;

        var newVector = new Vector(newX, newY, newZ);
        
        return newVector;
    }

    limitTo(pScale) {//limiting a vector to a certain magnitude
        if(this.magnitude() <= pScale) {
            return this;
        }
        else {
            var mNormalisedVector = this.normalise();
            var mLimitedVector = mNormalisedVector.multiply(pScale);
            return mLimitedVector;
        }
    }

    dotProduct(pVector) {//calculating the dot product of a vector
        var xTotal = this.getX() * pVector.getX();
        var yTotal = this.getY() * pVector.getY();
        //var zTotal = this.getZ() * pVector.getZ();

        //var result = xTotal + yTotal + zTotal;
        var result = xTotal + yTotal;
        return result;
    }
    

    interpolate(pVector, pScalar) {//interpolating 2 vectors by a given scalar
        var mVector1 = this.multiply(1 - pScalar);
        var mVector2 = pVector.multiply(pScalar);
        var newVector = mVector1.add(mVector2);
        return newVector;
    }

    rotate(pAngle) {//rotating a vector by a given angle
        var newX = (this.getX() * Math.cos(pAngle)) - (this.getY() * Math.sin(pAngle));
        var newY = (this.getX() * Math.sin(pAngle)) + (this.getY() * Math.cos(pAngle));

        return new Vector(newX, newY, this.getZ());
        
    }

    angleBetween(pVector) {//finding the angle between 2 vectors
        var dotProductResult = this.dotProduct(pVector);   
        var magnitude1 = this.magnitude();

        var magnitude2 = pVector.magnitude();

        var combined = (magnitude1*magnitude2)
        var valueBeforeAcos = dotProductResult/combined;
        var angle = Math.acos(valueBeforeAcos);


        return angle;
    }

    inverse() {//inverting a vector
        return this.multiply(-1);
    }
}