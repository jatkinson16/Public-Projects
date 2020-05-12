class PhysicsEngine {
    constructor () {
        this.listOfObjects = [];
    }

    //returns number of objects currently being run through the physics engine
    getNumberOfObjects() {
        return this.listOfObjects.length;
    }

    //adds an object to the physics engine
    addObject(pObject) {
        this.listOfObjects.push(pObject);

        //Need to generate bounding boxes for squares when added
        if(pObject instanceof movingSquare || pObject instanceof squareObstacle) {
            this.generateBoundingBox(this.getNumberOfObjects() - 1);
        }
        
    }
    
    //returns the object at a specific index
    getObjectAt(pIndex) {
        if(pIndex < this.getNumberOfObjects()) {
            return this.listOfObjects[pIndex];
        }
        else { //making sure index isn't outside of array bounds
            return false;
        }
    }

    //finding and creating bounds for squares
    generateBoundingBox(pIndex) {

        var rotation = this.listOfObjects[pIndex].getRotation();
        var rotationMatrix = Matrix.createRotation(rotation);

        
        var object = this.listOfObjects[pIndex].getPolygon();
        var scale = this.listOfObjects[pIndex].getScale();
        var scaleMatrix = Matrix.createScale(scale);
        var vector = new Vector(0,0,0);
        var tempScale = new Vector(1,1,1);
        var tempPolygon = new Polygon(vector, 0, tempScale)

        //getting reference of object in relation to the canvas
        var trueOrigin = this.listOfObjects[pIndex].getPosition();
        
        for(var i = 0; i< object.getNumberOfPoints();i++) {
            var tempVector = new Vector(0,0,0);
            
            //need to rotate the points so that rotated objects have their proper point positions
            var transform = Matrix.createTranslation(object.getPointAt(i));
            var newMatrix = rotationMatrix.multiply(transform);
            newMatrix = scaleMatrix.multiply(newMatrix);

            tempVector.setX(newMatrix.getElement(0,2));
            tempVector.setY(newMatrix.getElement(1,2));
            
            var point = tempVector.add(trueOrigin);
            tempPolygon.addPoint(point.getX(), point.getY(), point.getZ());
        }

        //having the min/max values stored in arrays since there can be multiple points at the lowest x or y value, a non-rotated square is a good example
        var minX = [];
        minX.push(tempPolygon.getPointAt(0));
        var maxX = [];
        maxX.push(tempPolygon.getPointAt(0));
        var minY = [];
        minY.push(tempPolygon.getPointAt(0));
        var maxY = [];
        maxY.push(tempPolygon.getPointAt(0));

        //find min x
        for(var i = 1; i < tempPolygon.getNumberOfPoints(); i++) {
            if(tempPolygon.getPointAt(i).getX() < minX[0].getX()) {
                minX = [];
                minX.push(tempPolygon.getPointAt(i));
            } else if(tempPolygon.getPointAt(i).getX() == minX[0].getX()) {
                minX.push(tempPolygon.getPointAt(i))
            }
        }

        //find max x
        for(var i = 1; i < tempPolygon.getNumberOfPoints(); i++) {
            if(tempPolygon.getPointAt(i).getX() > maxX[0].getX()) {
                maxX = [];
                maxX.push(tempPolygon.getPointAt(i));
            } else if(tempPolygon.getPointAt(i).getX() == maxX[0].getX()) {
                maxX.push(tempPolygon.getPointAt(i));
            }
        }

        //find min y
        for(var i = 1; i < tempPolygon.getNumberOfPoints(); i++) {
            if(tempPolygon.getPointAt(i).getY() < minY[0].getY()) {
                minY = [];
                minY.push(tempPolygon.getPointAt(i));
            } else if(tempPolygon.getPointAt(i).getY() == minY[0].getY()) {
                minY.push(tempPolygon.getPointAt(i));
            }
        }

        //find max y
        for(var i = 1; i < tempPolygon.getNumberOfPoints(); i++) {
            if(tempPolygon.getPointAt(i).getY() > maxY[0].getY()) {
                maxY = [];
                maxY.push(tempPolygon.getPointAt(i));
            } else if(tempPolygon.getPointAt(i).getY() == maxY[0].getY()) {
                maxY.push(tempPolygon.getPointAt(i));
            }
        }

        //They are stored as vectors still since it is worthless having just a x or y value
        this.listOfObjects[pIndex].setMaxX(maxX);
        this.listOfObjects[pIndex].setMinX(minX);
        this.listOfObjects[pIndex].setMaxY(maxY);
        this.listOfObjects[pIndex].setMinY(minY);
    }

    //Collision detection for 2 circles
    circleCircleCollision(circle1, circle2) {

        //no need to check 2 obstacles against each other
        if(circle1 instanceof circleObstacle && circle2 instanceof circleObstacle) {
            return false;
        }

        //getting their canvas-related positions
        var circle1Pos = circle1.getPosition();
        var circle2Pos = circle2.getPosition();
        //find distance between the circles
        var distanceX = Math.abs(circle2Pos.getX() - circle1Pos.getX());
        var distanceY = Math.abs(circle2Pos.getY() - circle1Pos.getY());
        var distance = (distanceX * distanceX) + (distanceY * distanceY);
        distance = Math.sqrt(distance);
        
        //if the distance between points is less than the total of the circle's radius', they collide
        if(distance < circle1.getRadius() + circle2.getRadius()) {
            return true;
        }
        return false;
    }

    //collision detection for 2 squares
    squareSquareCollision(square1, square2) {

        //no need to check against 2 obstacles
        if(square1 instanceof squareObstacle && square2 instanceof squareObstacle) {
            return false;
        } else if(square1 instanceof squareObstacle) {
            //checking if square 2 is in square 1

            //check x, if between both min and max, check y of MinX, if between min and max
            //Checking against the first maxX etc of the second square instead of all values since they will have the same y or x no-matter the other co-ord
            for(var i = 0; i < square2.getNumberOfMinX(); i++) {
                if(square2.getMinX(i).getX() > square1.getMinX(0).getX() && square2.getMinX(i).getX() < square1.getMaxX(0).getX()) {
                    //check Y of the minX, see if it is in the bounds of the second squares maxY and minY
                    if(square2.getMinX(i).getY() > square1.getMinY(0).getY() && square2.getMinX(i).getY() < square1.getMaxY(0).getY()) {
                        //set to colliding
                        return true;
                    }
                }
            }

            //checking MaxX
            for(var i = 0; i < square2.getNumberOfMaxX(); i++) {
                if(square2.getMaxX(i).getX() > square1.getMinX(0).getX() && square2.getMaxX(i).getX() < square1.getMaxX(0).getX()) {
                    //check Y of the minX, see if it is in the bounds of the second squares maxY and minY
                    if(square2.getMaxX(i).getY() > square1.getMinY(0).getY() && square2.getMaxX(i).getY() < square1.getMaxY(0).getY()) {
                        //set to colliding
                        return true;
                    }
                }
            }
        
            //checking MinY
            for(var i = 0; i < square2.getNumberOfMinY(); i++) {
                if(square2.getMinY(i).getY() > square1.getMinY(0).getY() && square2.getMinY(i).getY() < square1.getMaxY(0).getY()) {
                    //check Y of the minX, see if it is in the bounds of the second squares maxY and minY
                    if(square2.getMinY(i).getX() > square1.getMinX(0).getX() && square2.getMinY(i).getX() < square1.getMaxX(0).getX()) {
                        //set to colliding
                        return true;
                    }
                }
            }
    
            //checking MaxY
            for(var i = 0; i < square2.getNumberOfMaxY(); i++) {
                if(square2.getMaxY(i).getY() > square1.getMinY(0).getY() && square2.getMaxY(i).getY() < square1.getMaxY(0).getY()) {
                    //check Y of the minX, see if it is in the bounds of the second squares maxY and minY
                    if(square2.getMaxY(i).getX() > square1.getMinX(0).getX() && square2.getMaxY(i).getX() < square1.getMaxX(0).getX()) {
                        //set to colliding
                    return true;
                    }
                }
            }
        } else if(square2 instanceof squareObstacle) {
            //Checking to see if square 1 is in square 2

            //check x, if between both min and max, check y of MinX, if between min and max
            //Checking against the first maxX etc of the second square instead of all values since they will have the same y or x no-matter the other co-ord
            for(var i = 0; i < square1.getNumberOfMinX(); i++) {
                if(square1.getMinX(i).getX() > square2.getMinX(0).getX() && square1.getMinX(i).getX() < square2.getMaxX(0).getX()) {
                    //check Y of the minX, see if it is in the bounds of the second squares maxY and minY
                    if(square1.getMinX(i).getY() > square2.getMinY(0).getY() && square1.getMinX(i).getY() < square2.getMaxY(0).getY()) {
                        //set to colliding
                        return true;
                    }
                }
            }

            //checking MaxX
            for(var i = 0; i < square1.getNumberOfMaxX(); i++) {
                if(square1.getMaxX(i).getX() > square2.getMinX(0).getX() && square1.getMaxX(i).getX() < square2.getMaxX(0).getX()) {
                    //check Y of the minX, see if it is in the bounds of the second squares maxY and minY
                    if(square1.getMaxX(i).getY() > square2.getMinY(0).getY() && square1.getMaxX(i).getY() < square2.getMaxY(0).getY()) {
                        //set to colliding
                        return true;
                    }
                }
            }
        

            //checking MinY
            for(var i = 0; i < square1.getNumberOfMinY(); i++) {
                if(square1.getMinY(i).getY() > square2.getMinY(0).getY() && square1.getMinY(i).getY() < square2.getMaxY(0).getY()) {
                    //check Y of the minX, see if it is in the bounds of the second squares maxY and minY
                    if(square1.getMinY(i).getX() > square2.getMinX(0).getX() && square1.getMinY(i).getX() < square2.getMaxX(0).getX()) {
                        //set to colliding
                        return true;
                    }
                }
            }
        

            //checking MaxY
            for(var i = 0; i < square1.getNumberOfMaxY(); i++) {
                if(square1.getMaxY(i).getY() > square2.getMinY(0).getY() && square1.getMaxY(i).getY() < square2.getMaxY(0).getY()) {
                    //check Y of the minX, see if it is in the bounds of the second squares maxY and minY
                    if(square1.getMaxY(i).getX() > square2.getMinX(0).getX() && square1.getMaxY(i).getX() < square2.getMaxX(0).getX()) {
                        //set to colliding
                        return true;
                    }
                }
            }
        }

        //if all failed; no colliding
        return false;
    }

    //collision detection between a circle and square
    squareCircleCollision(square, circle) {
        var squarePos = square.getPosition();
        var squareLength = square.getMaxY(0).getY() - square.getMinY(0).getY(); //find the height/length of the square
        
        var circlePos = circle.getPosition();
        var closestPoint;
        var previousClosestPoint;

        //no need to check 2 obstacles against each other
        if(square instanceof squareObstacle && circle instanceof circleObstacle) {
            return false;
        }  
        else if(square instanceof squareObstacle) { //then circle is the one moving
            var circleRadius = circle.getRadius();
            //points used to check collision = 2 closest points of square to the circle
            var point1;
            var point2;
            var circleIsBelow = false;
            //find distance between radius and each point
            if(square.getNumberOfMaxX() == 1) { //then square is rotated

                //find bound where circle is
                if(circlePos.getX() > square.getMinY(0).getX() && circlePos.getX() <= square.getMaxX(0).getX() + circleRadius) { //resides to the right side of square
                    if(circlePos.getY() >= square.getMinY(0).getY() - circleRadius && circlePos.getY() < square.getMaxX(0).getY()) {//resides in top right
                        point1 = square.getMinY(0);
                        point2 = square.getMaxX(0);
                    }
                    else if(circlePos.getY() > square.getMaxX(0).getY() && circlePos.getY() <= square.getMaxY(0).getY() + circleRadius) {//resides in bottom right
                        point1 = square.getMaxX(0);
                        point2 = square.getMaxY(0);
                        circleIsBelow = true;
                    }
                    else if(circlePos.getY() == squarePos.getY()) {//then circle is directly above or below
                        if(circlePos.getY() - circle.getRadius() <= square.getMaxY(0).getY() || circlePos.getY() + circle.getRadius() >= square.getMinY(0).getY()) {//if circles y pos +/- radius is between max or min y, they collide
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                    //*/
                }
                else if(circlePos.getX() >= square.getMinX(0).getX() - circleRadius && circlePos.getX() < square.getMinY(0).getX()) { //resides to left of square
                    if(circlePos.getY() >= square.getMinY(0).getY() - circleRadius && circlePos.getY() < square.getMinX(0).getY()) {//resides in top left
                        point1 = square.getMinY(0);
                        point2 = square.getMinX(0);
                    }
                    else if(circlePos.getY() > square.getMinX(0).getY() && circlePos.getY() <= square.getMaxY(0).getY() + circleRadius) {//resides in bottom left
                        point1 = square.getMinY(0);
                        point2 = square.getMaxY(0);
                        circleIsBelow = true;
                    }
                    else if(circlePos.getY() == squarePos.getY()) {//then circle is directly above or below
                        if(circlePos.getY() - circle.getRadius() <= square.getMaxY(0).getY() && circlePos.getY() + circle.getRadius() >= square.getMinY(0).getY()) {//if circles y pos +/- radius is between max or min y, they collide
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                    //*/
                }
                else { //circle x is same as center x
                    if(circlePos.getX() == squarePos.getX()) { // circle and square are parallel on the y axis
                        if(circlePos.getY() - circle.getRadius() <= square.getMaxY(0).getY() && circlePos.getY() + circle.getRadius() >= square.getMinY(0).getY()) {//if in between min and max y's
                        return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                    
                }

                var vectorToCircle;
                var lineVector;

                //find the vector of the 2 closest points
                var distX = Math.abs(point2.getX() - point1.getX());
                var distY = Math.abs(point2.getY() - point1.getY());

                lineVector = new Vector(distX, distY, 1);

                //find the vector of one of the points to the center of the circle
                var centerDistX, centerDistY;
                if(circleIsBelow) {//circle is below obstacle
                    centerDistX = Math.abs(circlePos.getX() - point2.getX());
                    centerDistY = Math.abs(circlePos.getY() - point2.getY());
                }
                else {//circle is above square
                    centerDistX = Math.abs(point2.getX() - circlePos.getX());
                    centerDistY = Math.abs(point2.getY() - circlePos.getY());
                }
                

                vectorToCircle = new Vector(centerDistX, centerDistY, 1);
                var centerDist = vectorToCircle.magnitude();

                //find the angle between
                var angle = vectorToCircle.angleBetween(lineVector);
                if(angle > Math.PI) {
                    angle = Math.PI - (angle - Math.PI);
                }

                //using math theorems, can deduce that the opposite side to a triangle of hypoteneuse centerDist and angle of angle radians, opposite side is the true distance
                var trueDist = centerDist * Math.sin(angle);

                if(trueDist <= circle.getRadius()) {
                    return true;
                }
                else {
                    return false;
                }

            }
            else {
                //to see if circle intersects, just add radius of circle to the bounds of the square  
                //if circle's position is between the square's extended bounds, it collides
                if(circlePos.getX() > square.getMinX(0).getX() - circleRadius &&
                circlePos.getX() < square.getMaxX(0).getX() + circleRadius &&
                circlePos.getY() > square.getMinY(0).getY() - circleRadius &&
                circlePos.getY() < square.getMaxY(0).getY() + circleRadius) {
                return true;
                }
            }
            
            

            return false;
        } else {//then square is the one moving

        
            if(squarePos.getX() < circlePos.getX() - (squareLength/2)) { //square is to the left of circle, only maxX values of square have a chance of colliding
                //checking max x values
                for(var i = 0; i < square.getNumberOfMaxX(); i++) {
                    var point = square.getMaxX(i);
                    var distanceX = Math.abs(circlePos.getX() - point.getX());
                    var distanceY = Math.abs(circlePos.getY() - point.getY());
    
                    var vectorBetween = new Vector(distanceX, distanceY, 1);
    
                    var distanceBetween = vectorBetween.magnitude();
    
                    if(closestPoint == undefined) {
                        closestPoint = square.getMaxX(i);
                    } else {
                        if(distanceBetween < closestPoint.magnitude()) {                 
                            closestPoint = square.getMaxX(i);
                        } 
                    }
                
                }
            }
            else if(squarePos.getX() > circlePos.getX() + (squareLength/2)) {//square is to the right of circle, only minX values have a chance of hitting it
                //Checking the minimum X's
                for(var i = 0; i < square.getNumberOfMinX(); i++) {
                    var point = square.getMinX(i);
                    var distanceX = Math.abs(circlePos.getX() - point.getX());
                    var distanceY = Math.abs(circlePos.getY() - point.getY());

                    var vectorBetween = new Vector(distanceX, distanceY, 1);

                    var distanceBetween = vectorBetween.magnitude();

                    if(closestPoint == undefined) {
                        closestPoint = square.getMinX(i);
                    } else {
                        if(distanceBetween < closestPoint.magnitude()) {                 
                            closestPoint = square.getMinX(i);
                        } 
                    }
                }
            }
            else { //square is directly above circle
                
                var distanceToCheck = (squareLength/2) + circle.getRadius();//distance if square is falling straight down = radius + square height/2
                var distanceX = Math.abs(circlePos.getX() - squarePos.getX());
                var distanceY = Math.abs(circlePos.getY() - squarePos.getY());
                var vectorBetween = new Vector(distanceX, distanceY, 1);

                var distanceBetween = vectorBetween.magnitude();
                if(distanceBetween <= distanceToCheck) {
                    return true;
                }
            }
            //Find the shortest distance
            var distX = Math.abs(circlePos.getX() - squarePos.getX());
            var distY = Math.abs(circlePos.getY() - squarePos.getY());

            //calculate the vector taking one point to the other
            var vectorBetween = new Vector(distX, distY, 1);
            var distanceBetween = vectorBetween.magnitude();

            //accounts for all points, only if directly on point
            if(distanceBetween <= circle.getRadius()) {
                return true;
            }
        }
        //*/
        
        
        //If the circle centre isn't within the square's bounds, will only collide with a corner 
        if(circlePos.getX()>= square.getMaxX(0).getX() || circlePos.getX() <= square.getMinX(0).getX()) {
            return false;
        }
        if(circlePos.getY() >= square.getMaxY(0).getY() || circlePos.getY() <= square.getMinY(0).getY()) {
            return false;
        }

        //first, find next closest point to object (Calculated during finding the closest point, with mostly working as intended(Oh how I miss passing in by value))

        //in some cases, closest point isn't defined even though it certainly should. It only occurs where the circle hits the squares so is assumed to always return true
        if(closestPointVector == undefined) {
            return true;
        }
        //*/
        //next, generate a vector from the point joining to the closest point
        var distClosestPointsX = Math.abs(previousClosestPoint.getX() - closestPoint.getX());
        var distClosestPointsY = Math.abs(previousClosestPoint.getY() - closestPoint.getY());

        var closestPointVector = new Vector(distClosestPointsX, distClosestPointsY,1);

        var angle = closestPointVector.angleBetween(vectorBetween);
        var smallestDistance = distanceBetween * Math.sin(angle);
        //find angle, using vector.angleBetween with vector generated and vectorBetween.

        //Distance from center of circle to nearest side of square = distanceBetween * Sin(angle calculated above)

        //if distance calculated is < radius, they collide
        if(smallestDistance <= circle.getRadius()) {
            return true;
        }
        
        return false;  

    }

    //collision response for 2 circles, one of which is an obstacle
    circleCircleObstacleReaction(circleIndex1,circleIndex2) {
        //circle1 always passed in as moving object
        var newVelocity;
        var circle1Pos = this.listOfObjects[circleIndex1].getPosition();
        var circle2Pos = this.listOfObjects[circleIndex2].getPosition();
        //find distance between the circles
        var distanceX = Math.abs(circle2Pos.getX() - circle1Pos.getX());
        var distanceY = Math.abs(circle2Pos.getY() - circle1Pos.getY());

        //find the point on the circle obstacle where they collide
        var vectorBetween = new Vector(distanceX, distanceY, 1);
        var vectorToCollisionPoint = vectorBetween.limitTo(this.listOfObjects[circleIndex2].getRadius())

        //find the angle between
        //finding which side the moving circle is on - for calculating angle
        var rotationMatrix;
        //if moving circles x is more than the obstacle's, collides on the right and angle needs to be done from vectorCollisionPoint to Velocity
        if(circle1Pos.getX() > circle2Pos.getX()) {
            var angle = vectorToCollisionPoint.angleBetween(this.listOfObjects[circleIndex1].getVelocity());
            if(angle == Math.PI || angle == 0) {
                newVelocity = this.listOfObjects[circleIndex1].getVelocity().inverse();
            } 
            else {
                //var angle = this.listOfObjects[circleIndex1].getVelocity().angleBetween(vectorToCollisionPoint); 
                angle = angle - (Math.PI/2);
                
                //finding the angle - will always be less than PI due to the maths
                var trueAngle = Math.PI - (angle * 2);
                rotationMatrix = Matrix.createRotation(trueAngle); 
                var transform = Matrix.createTranslation(this.listOfObjects[circleIndex1].getVelocity());

                var finalMatrix = rotationMatrix.multiply(transform);
                newVelocity = new Vector(finalMatrix.getElement(0,2), finalMatrix.getElement(1,2), 1);
            }  
            

            
        }
        else if(circle1Pos.getX() < circle2Pos.getX()){ //circle is to the left of obstacle, so angle needs to be done from velocity to vectorCollisionPoint
            var angle = this.listOfObjects[circleIndex1].getVelocity().angleBetween(vectorToCollisionPoint);
            angle = angle - (Math.PI/2);
            
            //finding the angle - will always be less than PI due to the maths
            var trueAngle = Math.PI - (angle * 2);
            rotationMatrix = Matrix.createRotation(trueAngle); 
            var transform = Matrix.createTranslation(this.listOfObjects[circleIndex1].getVelocity());

            var finalMatrix = rotationMatrix.multiply(transform);
            newVelocity = new Vector(finalMatrix.getElement(0,2), finalMatrix.getElement(1,2), 1);

            
        }
        else { //circle parralel on the x axis with obstacle
            newVelocity = this.listOfObjects[circleIndex1].getVelocity().inverse();
            
        }

        //have to push moving circle back out of obstacle bounds
        
        var previousPos = this.listOfObjects[circleIndex1].getPreviousPosition()
        this.listOfObjects[circleIndex1].setPosition(previousPos);
        //*/
        

        this.listOfObjects[circleIndex1].setVelocity(newVelocity);
    }

    //collision response between 2 squares, 1 of which is an obstacle
    squareSquareObstacleReaction(squareIndex1,squareIndex2) {
        //index 1 is always the moving square

        //Check to see if square obstacle are axis alligned or rotated (will only have one of each maximum/minimum if rotated even a bit) - will leave at 90
        //However if it lands perfectly on top it will just rebound up
        if(this.listOfObjects[squareIndex2].getNumberOfMaxX() == 1 && (this.listOfObjects[squareIndex1].getPosition().getX() != this.listOfObjects[squareIndex2].getPosition().getX())) {
            var transform;
            var rotationMatrix;
            if(this.listOfObjects[squareIndex1].getPosition().getX() > this.listOfObjects[squareIndex2].getPosition().getX()) {//moving square is to the right of obstacle
                
                rotationMatrix = Matrix.createRotation((Math.PI/2) * 3); //always changes by 90(270 for on the right side) degrees
                
            }
            else { //square is to the left of the obstacle
                rotationMatrix = Matrix.createRotation(Math.PI/2); //always changes by 90(270 for on the right side) degrees
            }
            
            transform = Matrix.createTranslation(this.listOfObjects[squareIndex1].getVelocity());
            var velocity = this.listOfObjects[squareIndex1].getVelocity();
            var finalMatrix = rotationMatrix.multiply(transform);
            velocity = new Vector(finalMatrix.getElement(0,2), finalMatrix.getElement(1,2), 1);
            this.listOfObjects[squareIndex1].setVelocity(velocity);

        } else {
            var velocity = this.listOfObjects[squareIndex1].getVelocity();
            velocity = velocity.inverse();

            

            this.listOfObjects[squareIndex1].setVelocity(velocity);
        }
        //setting previous position so that it doesn't clip into the obstacle
        var previousPos = this.listOfObjects[squareIndex1].getPreviousPosition();
        this.listOfObjects[squareIndex1].setPosition(previousPos);

        
    }

    //collision response for a square and circle, where circle is the obstacle
    squareCircleObstacleReaction(squareIndex,circleIndex) {
        //passing in the indexes since you need to change the actual values
        var squarePos = this.listOfObjects[squareIndex].getPosition();
        var circlePos = this.listOfObjects[circleIndex].getPosition();
        var square = this.listOfObjects[squareIndex];
        var closestPoint;
        var newVelocity;

        //if the square is directly above the circle
        if((circlePos.getX() < square.getMaxX(0).getX() && circlePos.getX() > square.getMinX(0).getX()) || (circlePos.getY() < square.getMaxY(0).getY() && circlePos.getY() > square.getMinY(0).getY())) {
            var velocity = this.listOfObjects[squareIndex].getVelocity();
            velocity = velocity.inverse();
            this.listOfObjects[squareIndex].setVelocity(velocity);
            var previousPos = this.listOfObjects[squareIndex].getPreviousPosition();
            this.listOfObjects[squareIndex].setPosition(previousPos);
        }
        else {
            //find distance between radius and each point
        
            for(var i = 0; i < square.getNumberOfMaxX(); i++) {
                var point = square.getMaxX(i);
                var distanceX = Math.abs(point.getX() - circlePos.getX());
                var distanceY = Math.abs(point.getY() - circlePos.getY());

                var vectorBetween = new Vector(distanceX, distanceY, 1);

                var distanceBetween = vectorBetween.magnitude();

                if(closestPoint == undefined) {
                    closestPoint = square.getMaxX(i);
                } else {
                    if(distanceBetween < closestPoint.magnitude()) {                 
                        closestPoint = square.getMaxX(i);
                    } 
                }
            
            }

        
            //Checking the minimum X's
            for(var i = 0; i < square.getNumberOfMinX(); i++) {
                var point = square.getMinX(i);
                var distanceX = Math.abs(point.getX() - circlePos.getX());
                var distanceY = Math.abs(point.getY() - circlePos.getY());

                var vectorBetween = new Vector(distanceX, distanceY, 1);

                var distanceBetween = vectorBetween.magnitude();

                if(closestPoint == undefined) {
                    closestPoint = square.getMinX(i);
                } else {
                    if(distanceBetween < closestPoint.magnitude()) {                 
                        closestPoint = square.getMinX(i);
                    } 
                }
            }

            //Find the distances between
            var distX = Math.abs(circlePos.getX() - closestPoint.getX());
            var distY = Math.abs(circlePos.getY() - closestPoint.getY());

            //calculate the vector taking one point to the other
            var vectorBetween = new Vector(distX, distY, 1);
            var rotationMatrix;

            //is square left or right of circle obstacle
            if(squarePos.getX() > circlePos.getX()) {//square is to the right
                var angle = vectorBetween.angleBetween(this.listOfObjects[squareIndex].getVelocity())  - (Math.PI/2);
                var trueAngle = Math.PI - (angle * 2);
                rotationMatrix = Matrix.createRotation(trueAngle); 
                var transform = Matrix.createTranslation(this.listOfObjects[squareIndex].getVelocity());

                var finalMatrix = rotationMatrix.multiply(transform);
                newVelocity = new Vector(finalMatrix.getElement(0,2), finalMatrix.getElement(1,2), 1);
            }
            else {//square is to the left
                var angle = this.listOfObjects[squareIndex].getVelocity().angleBetween(vectorBetween)  - (Math.PI/2);
                var trueAngle = Math.PI - (angle * 2);
                rotationMatrix = Matrix.createRotation(trueAngle); 
                var transform = Matrix.createTranslation(this.listOfObjects[squareIndex].getVelocity());

                var finalMatrix = rotationMatrix.multiply(transform);
                newVelocity = new Vector(finalMatrix.getElement(0,2), finalMatrix.getElement(1,2), 1);
            }

            //setting the position back so that it doesn't intersect with obstacle
            velocity = newVelocity;
            this.listOfObjects[squareIndex].setVelocity(velocity);
            var previousPos = this.listOfObjects[squareIndex].getPreviousPosition();
            this.listOfObjects[squareIndex].setPosition(previousPos);

        }
    }

    //collision response for a square and circle, where square is the obstacle
    circleSquareObstacleReaction(squareIndex,circleIndex) {
        var circleIsBelow;
        //Check to see if square obstacle are axis alligned or rotated (will only have one of each maximum/minimum if rotated even a bit) - will leave at 90
        //However if it lands perfectly on top it will just rebound up
        if(this.listOfObjects[squareIndex].getNumberOfMaxX() == 1 && (this.listOfObjects[circleIndex].getPosition().getX() != this.listOfObjects[squareIndex].getPosition().getX())) {
            var transform;
            var rotationMatrix;
            if(this.listOfObjects[circleIndex].getPosition().getX() > this.listOfObjects[squareIndex].getPosition().getX()) {//moving square is to the right of obstacle
                
                rotationMatrix = Matrix.createRotation((Math.PI/2) * 3); //always changes by 90(270 for on the right side) degrees
                
            }
            else { //square is to the left of the obstacle
                rotationMatrix = Matrix.createRotation((Math.PI/2)); //always changes by 90(270 for on the right side) degrees
            }

            //finding where the circle is in relation to the square
            if(this.listOfObjects[circleIndex].getPosition().getY() > this.listOfObjects[squareIndex].getPosition().getY()) {
                circleIsBelow = true;
            }
            else {
                circleIsBelow = false;
            }

            
            transform = Matrix.createTranslation(this.listOfObjects[circleIndex].getVelocity());
            var velocity = this.listOfObjects[circleIndex].getVelocity();

            //need to subtract velocity if the circle is below, need to add if it is above
            if(circleIsBelow) {
                var previousPos = this.listOfObjects[circleIndex].getPreviousPosition().subtract(velocity);
                this.listOfObjects[circleIndex].setPosition(previousPos);
            }
            else {
                var previousPos = this.listOfObjects[circleIndex].getPreviousPosition().add(velocity);
                this.listOfObjects[circleIndex].setPosition(previousPos);
            }
            
            //reset the position
            var finalMatrix = rotationMatrix.multiply(transform);
            velocity = new Vector(finalMatrix.getElement(0,2), finalMatrix.getElement(1,2), 1);
            this.listOfObjects[circleIndex].setVelocity(velocity);

        } else { //the circle is colliding with a flat face of a square, so just rebounds up
            var velocity = this.listOfObjects[circleIndex].getVelocity();
            velocity = velocity.inverse();     
            this.listOfObjects[circleIndex].setVelocity(velocity);

            
        }

        var previousPos = this.listOfObjects[circleIndex].getPreviousPosition();
        this.listOfObjects[circleIndex].setPosition(previousPos);
        

    }

    //if both objects are moving
    movingObjectReaction(index1,index2) {
        var newIndex1Velocity;
        var newIndex2Velocity;
        var object1 = this.listOfObjects[index1];
        var object2 = this.listOfObjects[index2];
        var index1Velocity = object1.getVelocity();
        var index2Velocity = object2.getVelocity();
        var index1RotationMatrix;
        var index2RotationMatrix;

        //find the angle between
        var angle = index2Velocity.angleBetween(index1Velocity);
        if(angle > Math.PI) {
            angle = angle - Math.PI;
        }

        index1RotationMatrix = Matrix.createRotation(angle); 
        var index1Transform = Matrix.createTranslation(this.listOfObjects[index1].getVelocity());

        var finalIndex1Matrix = index1RotationMatrix.multiply(index1Transform);
        newIndex1Velocity = new Vector(finalIndex1Matrix.getElement(0,2), finalIndex1Matrix.getElement(1,2), 1);
        this.listOfObjects[index1].setVelocity(newIndex1Velocity);

        index2RotationMatrix = Matrix.createRotation(angle); 
        var index2Transform = Matrix.createTranslation(this.listOfObjects[index2].getVelocity());

        var finalIndex2Matrix = index2RotationMatrix.multiply(index2Transform);
        newIndex2Velocity = new Vector(finalIndex2Matrix.getElement(0,2), finalIndex2Matrix.getElement(1,2), 1);
        this.listOfObjects[index2].setVelocity(newIndex2Velocity);

        var index2PreviousPos = this.listOfObjects[index2].getPreviousPosition();
        this.listOfObjects[index2].setPosition(index2PreviousPos);

        var index1PreviousPos = this.listOfObjects[index1].getPreviousPosition();
        this.listOfObjects[index1].setPosition(index1PreviousPos);

    }

    findCollisions() {
        //for each object; call calculate collisions against all other objects

        var iIsSquare;
        var jIsSquare;

        var iIsCircle;
        var jIsCircle;
        for(var i = 0; i < this.getNumberOfObjects(); i++) {
            //checking if object is a square(if not, is a circle)
            if(this.getObjectAt(i) instanceof movingSquare || this.getObjectAt(i) instanceof squareObstacle) {
                iIsSquare = true;
                iIsCircle = false;
            }
            else {
                iIsSquare = false;
                iIsCircle = true;
            }
            for(var j = i+1; j < this.getNumberOfObjects(); j++) { //finding the second value after the first
                if(this.getObjectAt(j) instanceof movingSquare || this.getObjectAt(j) instanceof squareObstacle) {
                    jIsSquare = true;
                    jIsCircle = false;
                }
                else {
                    jIsSquare = false;
                    jIsCircle = true;
                }

                //if both are squares
                if(iIsSquare && jIsSquare) {
                    var isColliding;
                    isColliding = this.squareSquareCollision(this.getObjectAt(i), this.getObjectAt(j));
                    if(isColliding) {
                        this.listOfObjects[i].setCollisionStatus(isColliding);
                        this.listOfObjects[j].setCollisionStatus(isColliding);
                        //finding which one is the obstacle(first parameter must be the moving object)
                        if(this.listOfObjects[i] instanceof squareObstacle) {
                            this.squareSquareObstacleReaction(j, i);
                        } else if(this.listOfObjects[j] instanceof squareObstacle){
                            this.squareSquareObstacleReaction(i, j);
                        } else { //if both objects are moving squares
                            this.movingObjectReaction(i, j);
                        }
                    }
                }
                else if(iIsCircle && jIsCircle) {
                    var isColliding;
                    isColliding = this.circleCircleCollision(this.getObjectAt(i), this.getObjectAt(j));
                    if(isColliding) {
                        this.listOfObjects[i].setCollisionStatus(isColliding);
                        this.listOfObjects[j].setCollisionStatus(isColliding);
                        //finding which one is the obstacle(first parameter must be the moving object)
                        if(this.listOfObjects[i] instanceof circleObstacle) {
                            this.circleCircleObstacleReaction(j, i);
                        } else if(this.listOfObjects[j] instanceof circleObstacle){
                            this.circleCircleObstacleReaction(i, j);
                        } else { //if both objects are moving circles
                            this.movingObjectReaction(i, j);
                        }
                    }
                }
                //if one circle, one square
                else {
                    if(iIsSquare) { //i is a square, j is a circle
                        var isColliding;
                        isColliding = this.squareCircleCollision(this.getObjectAt(i), this.getObjectAt(j));
                        if(isColliding) {
                            this.listOfObjects[i].setCollisionStatus(isColliding);
                            this.listOfObjects[j].setCollisionStatus(isColliding);
                            if(this.listOfObjects[i] instanceof movingSquare && this.listOfObjects[j] instanceof movingCircle) {
                                this.movingObjectReaction(i,j);
                            } 
                            else if(this.listOfObjects[i] instanceof movingSquare) {//then circle is obstacle 
                                this.squareCircleObstacleReaction(i,j);
                            }
                            else { //then square is obstacle
                                this.circleSquareObstacleReaction(i,j);
                            }
                            
                        }
                    }
                    else { //i is a circle, j is a square
                        var isColliding;
                        isColliding = this.squareCircleCollision(this.getObjectAt(j), this.getObjectAt(i));
                        if(isColliding) {
                            this.listOfObjects[i].setCollisionStatus(isColliding);
                            this.listOfObjects[j].setCollisionStatus(isColliding);
                            if(this.listOfObjects[j] instanceof movingSquare && this.listOfObjects[i] instanceof movingCircle) {
                                this.movingObjectReaction(j,i);
                            } 
                            else if(this.listOfObjects[j] instanceof movingSquare) {//then circle is obstacle 
                                this.squareCircleObstacleReaction(j,i);
                            }
                            else { //then square is obstacle
                                this.circleSquareObstacleReaction(j,i);
                            }
                        }
                    }
                }
            }
            
        }
    }


    draw(pContext, pMatrix) {
        for(var i = 0; i < this.getNumberOfObjects(); i++) {
            this.listOfObjects[i].draw(pContext, pMatrix);
        }
        pMatrix.setTransform(pContext);
    }

    update(pDeltaTime) {
        
        //resetting collision status
        for(var i = 0; i < this.getNumberOfObjects();i++) {
            this.listOfObjects[i].setCollisionStatus(false);
        }
        for(var i = 0; i < this.getNumberOfObjects(); i++) {
            
            
            //only updating the forces of the objects that are meant to move
            if(this.listOfObjects[i] instanceof movingSquare || this.listOfObjects[i] instanceof movingCircle) {
                

                var dragCoeff = this.listOfObjects[i].getDragCoeff();
                var acceleration = this.listOfObjects[i].getAcceleration();
                var mass = this.listOfObjects[i].getMass();
                var velocity = this.listOfObjects[i].getVelocity();
                var g = new Vector(0,9.81,0);

                //finding the drag force
                var fDrag = this.calculateDrag(dragCoeff, velocity);
                var fGravity = g.multiply(mass);
                var resultantForce = this.updateForce(fDrag, fGravity); //finding the resultant force
        
                acceleration = this.calculateAcceleration(resultantForce, mass); //finding the acceleration
                
                this.listOfObjects[i].setAcceleration(acceleration); 

                var oldVelocity = velocity
                velocity = this.calculateVelocity(velocity, acceleration, pDeltaTime);//finding velocity
                this.listOfObjects[i].setVelocity(velocity);

                

                var position = this.calculateNewPosition(velocity, oldVelocity, pDeltaTime);

                var newPosition = this.listOfObjects[i].getPosition().add(position); //finding the new position
                var oldPos = this.listOfObjects[i].getPosition();
                this.listOfObjects[i].setPreviousPosition(oldPos);
                this.listOfObjects[i].setPosition(newPosition);

            }
            
            //don't need to change square obstacles bounding boxes since they are not moving
            if(this.listOfObjects[i] instanceof movingSquare) {
                this.generateBoundingBox(i);
            }

            
        }

        this.findCollisions();

        for(var i = 0; i < this.getNumberOfObjects(); i++) {
            this.listOfObjects[i].update(pDeltaTime);
        }
    }

    //Physics maths
    calculateDrag(pDragCoeff, pVelocity) {
        var k1 = (pDragCoeff * pVelocity.magnitude());
        var velocitySquared = (pVelocity.magnitude()) * (pVelocity.magnitude());
        var k2 = (pDragCoeff * velocitySquared);

        var dragVelocity = k1 + k2;
        var Fdrag = pVelocity.multiply(-1 * dragVelocity);
        return Fdrag;
    }

    updateForce(pDrag, pGravity) { //F = F1 + F2...
        var Fdrag = pDrag;
        var Fgravity = pGravity
        var resultantForce = Fgravity;
        resultantForce = resultantForce.add(Fdrag);
        return resultantForce;
    }

    calculateAcceleration(pForce, pObjectMass) {//F = Ma -> a = F/M
        var acceleration = pForce.divide(pObjectMass);
        return acceleration;
    }

    calculateVelocity(pOldVelocity, pAcceleration, pTime) { //V = v(a * t)
        var changeInVelocity = (pAcceleration.multiply(pTime));
        var velocity = pOldVelocity.add(changeInVelocity);
        return velocity;
    }

    calculateNewPosition(pNewVelocity, pOldVelocity) {//d = (v1 + v2)/2
        var combinedVelocity = (pNewVelocity.add(pOldVelocity));
        var positionVector = combinedVelocity.divide(2);
        
        return positionVector;
    }

    

    
}