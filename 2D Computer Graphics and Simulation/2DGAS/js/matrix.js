class Matrix {
    constructor(pXX, pXY, pXZ, pYX, pYY, pYZ, pZX, pZY, pZZ) {

        this.mMatrixArray = [[pXX, pXY, pXZ], [pYX, pYY, pYZ], [pZX, pZY, pZZ]];

    }
    


    getElement(pRow, pCol) {//gets the element at a given index
        var value = this.mMatrixArray[pRow][pCol];
        return value;
    }

    static createIdentity() {//creates an identity matrix and returns it
        var identityMatrix = new Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1);
        return identityMatrix;
    }

    static createTranslation(pVector) {//creates a translation given a parameter vector
        var translationMatrix = new Matrix(1, 0, pVector.getX(), 0, 1, pVector.getY(), 0, 0, 1);
        return translationMatrix;
    }

    static createScale(pVector) {//creates a scale given a parameter vector
        var scaleMatrix = new Matrix(pVector.getX(), 0, 0, 0, pVector.getY(), 0, 0, 0, 1);
        return scaleMatrix;
    }

    static createRotation(pScale) {//creates a rotation given a parameter scale
        var rotationMatrix = new Matrix(Math.cos(pScale), Math.sin(pScale * -1), 0, Math.sin(pScale), Math.cos(pScale), 0, 0, 0, 1);
        return rotationMatrix;
    }

    multiply(pMatrix) {//multiplies 2 matricies together
        //creating the first row
        var newXX = (this.getElement(0,0) * pMatrix.getElement(0,0)) + (this.getElement(0,1) * pMatrix.getElement(1,0)) + (this.getElement(0, 2) * pMatrix.getElement(2,0));
        var newXY = (this.getElement(0,0) * pMatrix.getElement(0,1)) + (this.getElement(0,1) * pMatrix.getElement(1,1)) + (this.getElement(0, 2) * pMatrix.getElement(2,1));
        var newXZ = (this.getElement(0,0) * pMatrix.getElement(0,2)) + (this.getElement(0,1) * pMatrix.getElement(1,2)) + (this.getElement(0, 2) * pMatrix.getElement(2,2));

        //creating the second row
        var newYX = (this.getElement(1,0) * pMatrix.getElement(0,0)) + (this.getElement(1,1) * pMatrix.getElement(1,0)) + (this.getElement(1, 2) * pMatrix.getElement(2,0));
        var newYY = (this.getElement(1,0) * pMatrix.getElement(0,1)) + (this.getElement(1,1) * pMatrix.getElement(1,1)) + (this.getElement(1, 2) * pMatrix.getElement(2,1));
        var newYZ = (this.getElement(1,0) * pMatrix.getElement(0,2)) + (this.getElement(1,1) * pMatrix.getElement(1,2)) + (this.getElement(1, 2) * pMatrix.getElement(2,2));

        //creating the third row
        var newZX = (this.getElement(2,0) * pMatrix.getElement(0,0)) + (this.getElement(2,1) * pMatrix.getElement(1,0)) + (this.getElement(2, 2) * pMatrix.getElement(2,0));
        var newZY = (this.getElement(2,0) * pMatrix.getElement(0,1)) + (this.getElement(2,1) * pMatrix.getElement(1,1)) + (this.getElement(2, 2) * pMatrix.getElement(2,1));
        var newZZ = (this.getElement(2,0) * pMatrix.getElement(0,2)) + (this.getElement(2,1) * pMatrix.getElement(1,2)) + (this.getElement(2, 2) * pMatrix.getElement(2,2));

        var newMatrix = new Matrix(newXX, newXY, newXZ, newYX, newYY, newYZ, newZX, newZY, newZZ);

        return newMatrix;
    }

    
    multiplyVector(pVector) {//multiplies a vector by the matrix that was called
        var newX = (this.getElement(0,0) * pVector.getX()) + (this.getElement(0,1) * pVector.getY()) + (this.getElement(0, 2) * pVector.getZ());
        var newY = (this.getElement(1,0) * pVector.getX()) + (this.getElement(1,1) * pVector.getY()) + (this.getElement(1, 2) * pVector.getZ());
        var newZ = (this.getElement(2,0) * pVector.getX()) + (this.getElement(2,1) * pVector.getY()) + (this.getElement(2, 2) * pVector.getZ());

        var newVector = new Vector(newX, newY, newZ);
        return newVector;
    }
    
    setTransform(pContext)//used for drawing, disregards all previous transformations
    {
        pContext.setTransform(
            this.getElement(0,0),
            this.getElement(1,0),
            //this.getElement(2,0),
            this.getElement(0,1),
            this.getElement(1,1),
            //this.getElement(2,1),
            this.getElement(0,2),
            this.getElement(1,2),
            //this.getElement(2,2)
        );
    }

    transform(pContext)//used for drawing
    {
        pContext.transform(
            this.getElement(0,0),
            this.getElement(1,0),
            //this.getElement(2,0),
            this.getElement(0,1),
            this.getElement(1,1),
            //this.getElement(2,1),
            this.getElement(0,2),
            this.getElement(1,2),
            //this.getElement(2,2)
        );
    }


}