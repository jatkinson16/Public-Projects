// the window load event handler
function onLoad() {
    var mainCanvas, mainContext, squares, square, vector, circle, circles, rootNode, originMatrix, physicsObjects, physics, floor;
    //this function will initialise our variables
    function initialiseCanvasContext() {
        //Find the canvas element using its id attribute.
        mainCanvas = document.getElementById('mainCanvas2');
        //If not found
        if (!mainCanvas) {
            //make a message pop up with error
            alert('Error: I cannot find the canvas element!');
            return;
        }
        //get the 2D canvas context
        mainContext = mainCanvas.getContext('2d');
        if(!mainContext) {
            alert('Error: failed to get context!');
            return;
        }
    
        //initialising arrays
        squares = [];
        circles = [];
        var scaleVector = new Vector(1,1,1);
        
        physicsObjects = [];

        //Setting the origin
        var origin = new Vector(mainCanvas.width * 0.5, mainCanvas.height*0.5, 1);
        originMatrix = Matrix.createTranslation(origin);
        originMatrix.setTransform(mainContext);

        //declaring the obstacles
        
        //First for loop declares y, second declares x
        //having 3 rows of obstacles
        for(var i = 0; i< 3; i++) {
            var y = ((i + 1)*200) - 100; //determining the y value

            for(var j = 0; j < 5; j++) {
                //Circles to appear on the middle row
                if(i == 1) {
                    var x = (200 * (j+1)) - 100; //determining the x value
                    vector = new Vector(x, y, 1);
                    circle = new circleObstacle(vector, 0, scaleVector);
                    circles.push(circle);
                }
                else {
                    var x = (200 * j); //determining the x value
                    vector = new Vector(x, y, 1);
                    square = new squareObstacle(vector, ((Math.PI/4) *  (j + 1)), scaleVector);
                    squares.push(square);
                    //((Math.PI/4) *  (j + 1))
                }
                
            }    
        }

        //adding  walls and a floor
        var floorScaleVector = new Vector(12,1,1);
        var floorLocation = new Vector(400,600,1);

        var wallScaleVector = new Vector(1,9,1);
        var wall1Location = new Vector(-35,300,1);
        var wall2Location = new Vector(835, 300, 1);
        var wall1 = new squareObstacle(wall1Location, 0, wallScaleVector);
        var wall2 = new squareObstacle(wall2Location, 0, wallScaleVector);
        floor = new squareObstacle(floorLocation, 0, floorScaleVector);
        
        squares.push(floor);
        squares.push(wall1);
        squares.push(wall2);

        //*/
       
        //initial velocity and acceleration that can be changed at will
        var zeroVector = new Vector(0,0,0);
        var initialVel = new Vector(0,0,0);
        

        //adding the moving items
        for(var i = 0; i < 7; i++) {
            var x = (80*i) + (40* (i + 1));
            vector = new Vector(x, 20, 1);
            if(i == 0 || i==2||i==4||i==6||i==8) {
                circle = new movingCircle(vector, 0, scaleVector, zeroVector,initialVel,50,0.7);
                physicsObjects.push(circle);
            }
            else {
                x = x + 20;
                vector = new Vector(x, 20, 1);
                square = new movingSquare(vector, 0, scaleVector, zeroVector,initialVel,100,0.7);
                physicsObjects.push(square);
            }
        }

        physics = new PhysicsEngine();

        //adding the objects to the physics engine to update later
        for(var i = 0; i<circles.length;i++) {
            physics.addObject(circles[i]);
        }

        
        for(var i = 0; i<squares.length;i++) {
            physics.addObject(squares[i]);
        }
        //*/
        
        for(var i = 0; i<physicsObjects.length;i++) {
            physics.addObject(physicsObjects[i]);
        }


    }
    //this function will actually draw on the canvas
    function draw() {
        var i;

        mainContext.clearRect(-400,-300, mainCanvas.width, mainCanvas.height);
        
        
        
        //Creating the root of the scenegraph
        rootNode = new SceneGraphNode(originMatrix);
        //only need the physics in the scenegraph
        rootNode.addChild(physics);
        rootNode.draw(mainContext, originMatrix);

        var position = new Vector(0,0,1);
        var posMatrix = Matrix.createTranslation(position);


        originMatrix.setTransform(mainContext);

        
    }

    function update(deltaTime) {
        physics.update(deltaTime);
        rootNode.update(deltaTime);

        //animationLoop();
    }

    

    function animationLoop() {
        var thisTime = Date.now();
        var deltaTime = thisTime - lastTime;
        deltaTime = deltaTime/1000;
        draw();
        update(deltaTime);
        lastTime = thisTime;
        requestAnimationFrame(animationLoop);
        
    }
    
    initialiseCanvasContext();
    var lastTime = Date.now();
    animationLoop();
}
window.addEventListener('load', onLoad, false);
