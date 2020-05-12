// the window load event handler
function onLoad() {
    var mainCanvas, mainContext, houses, house, vector, tree, treesBackLayer, treesFrontLayer, rootNode, background, sun, originMatrix;
    //this function will initialise our variables
    function initialiseCanvasContext() {
        //Find the canvas element using its id attribute.
        mainCanvas = document.getElementById('mainCanvas');
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
    
        //generating arrays
        houses = [];
        treesBackLayer = [];
        treesFrontLayer = [];
        var houseScaleVector = new Vector(1,1,1);
        

        //Setting the origin
        var origin = new Vector(mainCanvas.width * 0.5, mainCanvas.height*0.5, 1);
        originMatrix = Matrix.createTranslation(origin);
        originMatrix.setTransform(mainContext);

        for(var i = 0; i< 2; i++) {
            vector = new Vector(((i+1) * 190) + (i*300), 300, 1);
            house = new House(vector, (Math.PI/2 * i), houseScaleVector);
            houses.push(house);
        }

        var treesBackLayerScaleVector = new Vector(0.8,0.8,1);
        //first layer of trees
        for(var i = 0; i< 3; i++) {
            vector = new Vector(((i*340) + 100), 190, 1);
            tree = new Tree(vector, (Math.PI/4 * i), treesBackLayerScaleVector);
            treesBackLayer.push(tree);
        }
        
        //second layer of trees
        var treesFrontLayerScaleVector = new Vector(1.2,1.2,1);
        for(var i = 0; i< 2; i++) {
            vector = new Vector((i*500), 230, 1);
            tree = new Tree(vector, (Math.PI/2 * (i - 1)), treesFrontLayerScaleVector);
            treesFrontLayer.push(tree);
        }

        //creating the background
        var backgroundVector = new Vector(mainCanvas.width/2, mainCanvas.height/2, 1);
        var backgroundScale = new Vector(1,1,1);
        background = new Background(backgroundVector, 0, backgroundScale);

        //Creating the sun
        var sunScaleVector = new Vector(1,1,1);
        var sunVector = new Vector(705, 95, 1)
        sun = new Sun(sunVector, 0, sunScaleVector);
        
    }
    //this function will actually draw on the canvas
    function draw() {
        var i;
        mainContext.clearRect(-400,-300, mainCanvas.width, mainCanvas.height) //clears canvas, ensures the screen doesn't looks weird
        
        //Creating the root of the scenegraph
        rootNode = new SceneGraphNode(originMatrix);

        //adding the background
        rootNode.addChild(background);

        //adding the sun
        rootNode.addChild(sun);

        //adding teh first array of trees
        for (i = 0; i < treesBackLayer.length; i++) {
            rootNode.addChild(treesBackLayer[i]);
        }
        
       //adding the houses
        for (i = 0; i < houses.length; i++) {
            rootNode.addChild(houses[i]);
        }
        
        //adding the second array of trees
        for (i = 0; i < treesFrontLayer.length; i++) {
            rootNode.addChild(treesFrontLayer[i]);
        }
        
        rootNode.draw(mainContext, originMatrix);

        
    }

    function update(deltaTime) {
        rootNode.update(deltaTime);
        //animationLoop();
    }

    
    //loop through the draw/update stuff
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
