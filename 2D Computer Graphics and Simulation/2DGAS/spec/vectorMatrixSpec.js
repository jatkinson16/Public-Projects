/* These are the Vector tests */
describe("Vector test: ", function () {
    
    describe("Constructor", function () {
        var vector = new Vector(30, 40, 0);
        it("X Set", function () {
            expect(vector.getX()).toEqual(30);
        });
        it("Y Set", function () {
            expect(vector.getY()).toEqual(40);
        });
        it("Z Set", function () {
            expect(vector.getZ()).toEqual(0);
        });
    });

    describe("Add", function () {
        var vector, secondVector, thirdVector;
        vector = new Vector(30, 40, 0);
        secondVector = new Vector(20, 30, 0);
        thirdVector = vector.add(secondVector);

        it("X Set", function () {
            expect(thirdVector.getX()).toEqual(50);
        });
        it("Y Set", function () {
            expect(thirdVector.getY()).toEqual(70);
        });
    });

    describe("Subtract", function () {
        var vector, secondVector, thirdVector;
        vector = new Vector(30, 40, 0);
        secondVector = new Vector(5, 10, 0);
        thirdVector = vector.subtract(secondVector);

        it("X Set", function () {
            expect(thirdVector.getX()).toEqual(25);
        });
        it("Y Set", function () {
            expect(thirdVector.getY()).toEqual(30);
        });
    });

    describe("Multiply", function () {
        var vector, secondVector, scalar;
        scalar = 10;
        vector = new Vector(30, 40, 0);
        secondVector = vector.multiply(scalar);

        it("X Set", function () {
            expect(secondVector.getX()).toEqual(300);
        });
        it("Y Set", function () {
            expect(secondVector.getY()).toEqual(400);
        });
    });

    describe("Divide", function () {
        var vector, secondVector, scalar;
        scalar = 10;
        vector = new Vector(30, 40, 0);
        secondVector = vector.divide(scalar);

        it("X Set", function () {
            expect(secondVector.getX()).toEqual(3);
        });
        it("Y Set", function () {
            expect(secondVector.getY()).toEqual(4);
        });
    });

    describe("Magnitude", function () {
        var vector, magnitude;
        vector = new Vector(30, 40, 0);
        magnitude = vector.magnitude();

        it("Result", function () {
            expect(magnitude).toEqual(50);
        });
    });

    describe("Normalise", function () {
        var vector, normalisedVector, magnitude;
        vector = new Vector(30, 40, 0);
        normalisedVector = vector.normalise();
        magnitude = normalisedVector.magnitude();

        it("Magnitude equals 1", function () {
            expect(magnitude).toEqual(1);
        });

        it("X Set", function () {
            expect(normalisedVector.getX()).toEqual(3 / 5);
        });
        it("Y Set", function () {
            expect(normalisedVector.getY()).toEqual(4 / 5);
        });
    });

    describe("Limit To", function () {
        var vector, limitedVector, magnitude;
        vector = new Vector(30, 40, 0);

        it("Magnitude not exceeding limit", function () {
            limitedVector = vector.limitTo(60);
            magnitude = limitedVector.magnitude();
            expect(magnitude).toEqual(50);
        });

        it("Magnitude exceeding limit", function () {
            limitedVector = vector.limitTo(30);
            magnitude = limitedVector.magnitude();
            expect(magnitude).toEqual(30);
        });
    });

    describe("Dot Product", function () {

        it("Result is zero", function () {
            var vector, secondVector, dotProduct;
            vector = new Vector(30, 40, 0);
            secondVector = new Vector(40, -30, 0);
            dotProduct = vector.dotProduct(secondVector);

            expect(dotProduct).toEqual(0);
        });

        it("Result is positive", function () {
            var vector, secondVector, dotProduct;
            vector = new Vector(30, 40, 0);
            secondVector = new Vector(50, 0, 0);
            dotProduct = vector.dotProduct(secondVector);

            expect(dotProduct).not.toBeLessThan(0);
        });

        it("Result is negative", function () {
            var vector, secondVector, dotProduct;
            vector = new Vector(30, 40, 0);
            secondVector = new Vector(0, -50, 1);
            dotProduct = vector.dotProduct(secondVector);

            expect(dotProduct).toBeLessThan(0);
        });
    });

    describe("Interpolate", function () {
        var vector, secondVector, interpolatedVector, interpolation;
        interpolation = 0.5;
        vector = new Vector(30, 40, 0);
        secondVector = new Vector(60, 80, 0);
        interpolatedVector = vector.interpolate(secondVector, interpolation);

        it("X Set", function () {
            expect(interpolatedVector.getX()).toEqual(45);
        });
        it("Y Set", function () {
            expect(interpolatedVector.getY()).toEqual(60);
        });
    });

    describe("Rotate", function () {
        var vector, rotatedVector, rotation;
        rotation = Math.PI / 2;
        vector = new Vector(30, 40, 0);
        rotatedVector = vector.rotate(rotation);

        it("X Set", function () {
            expect(rotatedVector.getX()).toBeCloseTo(-40.0, 1);
        });
        it("Y Set", function () {
            expect(rotatedVector.getY()).toBeCloseTo(30.0, 1);
        });
    });

    describe("Angle between", function () {
        var vector, secondVector, angleBetween;
        vector = new Vector(30, 40, 0);
        secondVector = new Vector(-40, 30, 0);
        angleBetween = secondVector.angleBetween(vector);

        it("Result is PI/2", function () {
            expect(angleBetween).toBeCloseTo(Math.PI / 2, 1);
        });
    });
});

/* these are the Matrix tests */
describe("Matrix test: ", function () {

    describe("Constructor", function () {
        var matrix = new Matrix(1, 2, 3, 4, 5, 6, 7, 8, 9);

        it("Element (0,0) Set", function () {
            expect(matrix.getElement(0, 0)).toEqual(1);
        });

        it("Element (0,1) Set", function () {
            expect(matrix.getElement(0, 1)).toEqual(2);
        });

        it("Element (0,2) Set", function () {
            expect(matrix.getElement(0, 2)).toEqual(3);
        });

        it("Element (1,0) Set", function () {
            expect(matrix.getElement(1, 0)).toEqual(4);
        });

        it("Element (1,1) Set", function () {
            expect(matrix.getElement(1, 1)).toEqual(5);
        });

        it("Element (1,2) Set", function () {
            expect(matrix.getElement(1, 2)).toEqual(6);
        });

        it("Element (2,0) Set", function () {
            expect(matrix.getElement(2, 0)).toEqual(7);
        });

        it("Element (2,1) Set", function () {
            expect(matrix.getElement(2, 1)).toEqual(8);
        });

        it("Element (2,2) Set", function () {
            expect(matrix.getElement(2, 2)).toEqual(9);
        });
    });

    describe("Create Identity", function () {
        var matrix = Matrix.createIdentity();
        it("Element (0,0) Set", function () {
            expect(matrix.getElement(0, 0)).toEqual(1);
        });

        it("Element (0,1) Set", function () {
            expect(matrix.getElement(0, 1)).toEqual(0);
        });

        it("Element (0,2) Set", function () {
            expect(matrix.getElement(0, 2)).toEqual(0);
        });

        it("Element (1,0) Set", function () {
            expect(matrix.getElement(1, 0)).toEqual(0);
        });

        it("Element (1,1) Set", function () {
            expect(matrix.getElement(1, 1)).toEqual(1);
        });

        it("Element (1,2) Set", function () {
            expect(matrix.getElement(1, 2)).toEqual(0);
        });

        it("Element (2,0) Set", function () {
            expect(matrix.getElement(2, 0)).toEqual(0);
        });

        it("Element (2,1) Set", function () {
            expect(matrix.getElement(2, 1)).toEqual(0);
        });

        it("Element (2,2) Set", function () {
            expect(matrix.getElement(2, 2)).toEqual(1);
        });

    });

    describe("Create Translation", function () {
        var translationVector, matrix;
        translationVector = new Vector(30, 40, 1);
        matrix = Matrix.createTranslation(translationVector);
        it("Element (0,0) Set", function () {
            expect(matrix.getElement(0, 0)).toEqual(1);
        });

        it("Element (0,1) Set", function () {
            expect(matrix.getElement(0, 1)).toEqual(0);
        });

        it("Element (0,2) Set", function () {
            expect(matrix.getElement(0, 2)).toEqual(30);
        });

        it("Element (1,0) Set", function () {
            expect(matrix.getElement(1, 0)).toEqual(0);
        });

        it("Element (1,1) Set", function () {
            expect(matrix.getElement(1, 1)).toEqual(1);
        });

        it("Element (1,2) Set", function () {
            expect(matrix.getElement(1, 2)).toEqual(40);
        });

        it("Element (2,0) Set", function () {
            expect(matrix.getElement(2, 0)).toEqual(0);
        });

        it("Element (2,1) Set", function () {
            expect(matrix.getElement(2, 1)).toEqual(0);
        });

        it("Element (2,2) Set", function () {
            expect(matrix.getElement(2, 2)).toEqual(1);
        });

    });

    describe("Create Scale", function () {
        var scaleVector, matrix;
        scaleVector = new Vector(30, 40, 1);
        matrix = Matrix.createScale(scaleVector);
        it("Element (0,0) Set", function () {
            expect(matrix.getElement(0, 0)).toEqual(30);
        });

        it("Element (0,1) Set", function () {
            expect(matrix.getElement(0, 1)).toEqual(0);
        });

        it("Element (0,2) Set", function () {
            expect(matrix.getElement(0, 2)).toEqual(0);
        });

        it("Element (1,0) Set", function () {
            expect(matrix.getElement(1, 0)).toEqual(0);
        });

        it("Element (1,1) Set", function () {
            expect(matrix.getElement(1, 1)).toEqual(40);
        });

        it("Element (1,2) Set", function () {
            expect(matrix.getElement(1, 2)).toEqual(0);
        });

        it("Element (2,0) Set", function () {
            expect(matrix.getElement(2, 0)).toEqual(0);
        });

        it("Element (2,1) Set", function () {
            expect(matrix.getElement(2, 1)).toEqual(0);
        });

        it("Element (2,2) Set", function () {
            expect(matrix.getElement(2, 2)).toEqual(1);
        });

    });

    describe("Create Rotation", function () {
        var rotation, matrix;
        rotation = Math.PI / 2;
        matrix = Matrix.createRotation(rotation);
        it("Element (0,0) Set", function () {
            expect(matrix.getElement(0, 0)).toEqual(Math.cos(rotation));
        });

        it("Element (0,1) Set", function () {
            expect(matrix.getElement(0, 1)).toEqual(-Math.sin(rotation));
        });

        it("Element (0,2) Set", function () {
            expect(matrix.getElement(0, 2)).toEqual(0);
        });

        it("Element (1,0) Set", function () {
            expect(matrix.getElement(1, 0)).toEqual(Math.sin(rotation));
        });

        it("Element (1,1) Set", function () {
            expect(matrix.getElement(1, 1)).toEqual(Math.cos(rotation));
        });

        it("Element (1,2) Set", function () {
            expect(matrix.getElement(1, 2)).toEqual(0);
        });

        it("Element (2,0) Set", function () {
            expect(matrix.getElement(2, 0)).toEqual(0);
        });

        it("Element (2,1) Set", function () {
            expect(matrix.getElement(2, 1)).toEqual(0);
        });

        it("Element (2,2) Set", function () {
            expect(matrix.getElement(2, 2)).toEqual(1);
        });

    });

    describe("Multiply vector", function () {
        describe("Translation", function () {
            var vector, translationVector, matrix, secondVector;
            vector = new Vector(30, 40, 1);
            translationVector = new Vector(10, 20, 1);
            matrix = Matrix.createTranslation(translationVector);
            secondVector = matrix.multiplyVector(vector);
            it("X Set", function () {
                expect(secondVector.getX()).toEqual(40);
            });

            it("Y Set", function () {
                expect(secondVector.getY()).toEqual(60);
            });

            it("Z Set", function () {
                expect(secondVector.getZ()).toEqual(1);
            });
        });
        describe("Rotation", function () {
            var vector, rotation, matrix, secondVector;
            vector = new Vector(30, 40, 1);
            rotation = Math.PI / 2;
            matrix = Matrix.createRotation(rotation);
            secondVector = matrix.multiplyVector(vector);
            it("X Set", function () {
                expect(secondVector.getX()).toBeCloseTo(-40, 1);
            });

            it("Y Set", function () {
                expect(secondVector.getY()).toBeCloseTo(30, 1);
            });

            it("Z Set", function () {
                expect(secondVector.getZ()).toBeCloseTo(1, 1);
            });
        });
        describe("Scale", function () {
            var vector, scaleVector, matrix, secondVector;
            vector = new Vector(30, 40, 1);
            scaleVector = new Vector(2, 2, 1);
            matrix = Matrix.createScale(scaleVector);
            secondVector = matrix.multiplyVector(vector);
            it("X Set", function () {
                expect(secondVector.getX()).toEqual(60);
            });

            it("Y Set", function () {
                expect(secondVector.getY()).toEqual(80);
            });

            it("Z Set", function () {
                expect(secondVector.getZ()).toEqual(1);
            });
        });
    });

    describe("Multiply", function () {
        var rotation, scaleVector, translationVector, translationMatrix,
            scaleMatrix, rotationMatrix, scaleXTranslationMatrix, translationXScaleMatrix,
            chainedMatrix;
        rotation = Math.PI / 2;
        rotationMatrix = Matrix.createRotation(rotation);
        scaleVector = new Vector(2, 2, 1);
        scaleMatrix = Matrix.createScale(scaleVector);
        translationVector = new Vector(10, 20, 1);
        translationMatrix = Matrix.createTranslation(translationVector);

        describe("Scale X Translate", function () {
            scaleXTranslationMatrix = scaleMatrix.multiply(translationMatrix);
            it("Element (0,0) Set", function () {
                expect(scaleXTranslationMatrix.getElement(0, 0)).toEqual(2);
            });

            it("Element (0,1) Set", function () {
                expect(scaleXTranslationMatrix.getElement(0, 1)).toEqual(0);
            });

            it("Element (0,2) Set", function () {
                expect(scaleXTranslationMatrix.getElement(0, 2)).toEqual(20);
            });

            it("Element (1,0) Set", function () {
                expect(scaleXTranslationMatrix.getElement(1, 0)).toEqual(0);
            });

            it("Element (1,1) Set", function () {
                expect(scaleXTranslationMatrix.getElement(1, 1)).toEqual(2);
            });

            it("Element (1,2) Set", function () {
                expect(scaleXTranslationMatrix.getElement(1, 2)).toEqual(40);
            });

            it("Element (2,0) Set", function () {
                expect(scaleXTranslationMatrix.getElement(2, 0)).toEqual(0);
            });

            it("Element (2,1) Set", function () {
                expect(scaleXTranslationMatrix.getElement(2, 1)).toEqual(0);
            });

            it("Element (2,2) Set", function () {
                expect(scaleXTranslationMatrix.getElement(2, 2)).toEqual(1);
            });
        });

        describe("Translate X Scale", function () {
            translationXScaleMatrix = translationMatrix.multiply(scaleMatrix);
            it("Element (0,0) Set", function () {
                expect(translationXScaleMatrix.getElement(0, 0)).toEqual(2);
            });

            it("Element (0,1) Set", function () {
                expect(translationXScaleMatrix.getElement(0, 1)).toEqual(0);
            });

            it("Element (0,2) Set", function () {
                expect(translationXScaleMatrix.getElement(0, 2)).toEqual(10);
            });

            it("Element (1,0) Set", function () {
                expect(translationXScaleMatrix.getElement(1, 0)).toEqual(0);
            });

            it("Element (1,1) Set", function () {
                expect(translationXScaleMatrix.getElement(1, 1)).toEqual(2);
            });

            it("Element (1,2) Set", function () {
                expect(translationXScaleMatrix.getElement(1, 2)).toEqual(20);
            });

            it("Element (2,0) Set", function () {
                expect(translationXScaleMatrix.getElement(2, 0)).toEqual(0);
            });

            it("Element (2,1) Set", function () {
                expect(translationXScaleMatrix.getElement(2, 1)).toEqual(0);
            });

            it("Element (2,2) Set", function () {
                expect(translationXScaleMatrix.getElement(2, 2)).toEqual(1);
            });
        });

        describe("Chaining", function () {
            var cosAngle, sinAngle;
            cosAngle = Math.cos(Math.PI / 2);
            sinAngle = Math.sin(Math.PI / 2);
            chainedMatrix =
                translationMatrix.multiply(scaleMatrix).multiply(rotationMatrix);
            it("Element (0,0) Set", function () {
                expect(chainedMatrix.getElement(0, 0)).toEqual(2 * cosAngle);
            });

            it("Element (0,1) Set", function () {
                expect(chainedMatrix.getElement(0, 1)).toEqual(2 * -sinAngle);
            });

            it("Element (0,2) Set", function () {
                expect(chainedMatrix.getElement(0, 2)).toEqual(10);
            });

            it("Element (1,0) Set", function () {
                expect(chainedMatrix.getElement(1, 0)).toEqual(2 * sinAngle);
            });

            it("Element (1,1) Set", function () {
                expect(chainedMatrix.getElement(1, 1)).toEqual(2 * cosAngle);
            });

            it("Element (1,2) Set", function () {
                expect(chainedMatrix.getElement(1, 2)).toEqual(20);
            });

            it("Element (2,0) Set", function () {
                expect(chainedMatrix.getElement(2, 0)).toEqual(0);
            });

            it("Element (2,1) Set", function () {
                expect(chainedMatrix.getElement(2, 1)).toEqual(0);
            });

            it("Element (2,2) Set", function () {
                expect(chainedMatrix.getElement(2, 2)).toEqual(1);
            });
        });
	});
	var context;
	beforeEach(()=>{
		// This just creates a mock object we can pass to matrix, instead of getting an actual one.
		// - This is really REALLY useful.
		context = jasmine.createSpyObj('context',['transform','setTransform']);
	});
	describe("Set Transform: ", function () {
		it(".setTransform() called", function () {
			var matrix = new Matrix(
				-200, -143432, -5.60857,
				420, 71, 1.85234,
				65, 234, 5
			);
			matrix.setTransform(context);
			expect(context.setTransform).toHaveBeenCalled();
		});
		describe("Number Set: 1", function(){
			var matrix = new Matrix(
				-200, -143432, -5.60857,
				420, 71, 1.85234,
				65, 234, 5
			);
			it('Correct arguments sent to .setTransform()', function () {
				matrix.setTransform(context);
				expect(context.setTransform).toHaveBeenCalledWith(-200, 420, -143432, 71, -5.60857, 1.85234);
			});
		});

		describe("Number Set: 2", function(){
			var matrix = new Matrix(
				454, -753, -972,
				-534, 631, 982,
				388, 797, -29
			);
			it('Correct arguments sent to .setTransform()', function () {
				matrix.setTransform(context);
				expect(context.setTransform).toHaveBeenCalledWith(454,-534,-753,631,-972,982);
			});
		});
		
	});
	
	describe("Transform: ", function () {
		it(".transform() called", function () {
			var matrix = new Matrix(
				-200, -143432, -5.60857,
				420, 71, 1.85234,
				65, 234, 5
			);
			matrix.transform(context);
			expect(context.transform).toHaveBeenCalled();
		});
		describe("Number Set: 1", function(){
			var matrix = new Matrix(
				-200, -143432, -5.60857,
				420, 71, 1.85234,
				65, 234, 5
			);
			it('Correct arguments sent to .transform()', function () {
				matrix.transform(context);
				expect(context.transform).toHaveBeenCalledWith(-200, 420, -143432, 71, -5.60857, 1.85234);
			});
		});

		describe("Number Set: 2", function(){
			var matrix = new Matrix(
				454, -753, -972,
				-534, 631, 982,
				388, 797, -29
			);
			it('Correct arguments sent to .transform()', function () {
				matrix.transform(context);
				expect(context.transform).toHaveBeenCalledWith(454,-534,-753,631,-972,982);
			});
		});

    });

});
