class House {
    constructor(pPosition, pRotation, pScale) {
        this.setPosition(pPosition);
        this.setRotation(pRotation);
        this.setScale(pScale);
        this.initialiseSceneGraph();
        this.mRotatationRate = Math.PI;
        this.mMoveRate = new Vector(60, 0, 0);
    }
    getPosition() {
        return this.mPosition;
    }
    setPosition(pPosition) {
        this.mPosition = pPosition;
    }
    getRotation() {
        return this.mRotation;
    }
    setRotation(pRotation) {
        this.mRotation = pRotation;
    }
    getScale() {
        return this.mScale;
    }
    setScale(pScale) {
        this.mScale = pScale;
    }
    getRootNode() {
        return this.mRootNode;
    }
    setRootNode(pRootNode) {
        this.mRootNode = pRootNode;
    }
    getTranslationNode() {
        return this.mTranslationNode;
    }
    setTranslationNode(pTranslationNode) {
        this.mTranslationNode = pTranslationNode;
    }
    getScaleNode() {
        return this.mScaleNode;
    }
    setScaleNode(pScaleNode) {
        this.mScaleNode = pScaleNode;
    }
    getRotationNode() {
        return this.mRotationNode;
    }
    setRotationNode(pRotationNode) {
        this.mRotationNode = pRotationNode;
    }

    initialiseSceneGraph() {
        //Mandatory nodes for all branches
        //first layer
        var translationMatrix = Matrix.createTranslation(this.getPosition());
        this.setTranslationNode(new SceneGraphNode(translationMatrix));
        //Second layer
        var rotationMatrix = Matrix.createRotation(this.getRotation());
        this.setRotationNode(new SceneGraphNode(rotationMatrix));
        //Third layer
        var scaleMatrix = Matrix.createScale(this.getScale());
        this.setScaleNode(new SceneGraphNode(scaleMatrix));

        //Passing in 0 vectors since there is no transform needed for these parts
        var positionVector = new Vector(0,0,1);
        var scaleVector = new Vector(1,1,1);
        var rotation = 0;

        //creating the wall
        var wall = new Polygon(positionVector, rotation, scaleVector);
        wall.addPoint(100, 0, 1);
        wall.addPoint(100, 100, 1);
        wall.addPoint(-100, 100, 1);
        wall.addPoint(-100, 0, 1);
        wall.setFillColour('#00FF00');
        wall.setStrokeColour('#000000');
        wall.setLineJoin('round');
        wall.setLineWidth(5);

        //creating the roof
        var roof = new Polygon(positionVector, rotation, scaleVector);
        roof.addPoint(0, -100, 1);
        roof.addPoint(100, 0, 1);
        roof.addPoint(-100, 0, 1);
        roof.setFillColour('#FF0093');
        roof.setStrokeColour('#000000');
        roof.setLineJoin('round');
        roof.setLineWidth(5);

        //creating the door
        var door = new Polygon(positionVector, rotation, scaleVector);
        door.addPoint(-25, 25, 1);
        door.addPoint(25, 25, 1);
        door.addPoint(25, 100, 1);
        door.addPoint(-25, 100, 1);
        door.setFillColour('#FF0093');
        door.setStrokeColour('#000000');
        door.setLineJoin('round');
        door.setLineWidth(5);

        //creating the windows
        var window1 = new Polygon(positionVector, rotation, scaleVector);
        window1.addPoint(45, 30, 1);
        window1.addPoint(80, 30, 1);
        window1.addPoint(80, 75, 1);
        window1.addPoint(45, 75, 1);
        window1.setFillColour('#A5D3FF');
        window1.setStrokeColour('#000000');
        window1.setLineJoin('round');
        window1.setLineWidth(5);
        
        
        var window2 = new Polygon(positionVector, rotation, scaleVector);
        window2.addPoint(-80, 30, 1);
        window2.addPoint(-45, 30, 1);
        window2.addPoint(-45, 75, 1);
        window2.addPoint(-80, 75, 1);
        window2.setFillColour('#A5D3FF');
        window2.setStrokeColour('#000000');
        window2.setLineJoin('round');
        window2.setLineWidth(5);

        //setting the bottom node the that of the polygon
        var wallRootNode = wall.getRootNode();
        wallRootNode.addChild(wall);

        var roofRootNode = roof.getRootNode();
        roofRootNode.addChild(roof);

        var doorRootNode = door.getRootNode();
        doorRootNode.addChild(door);

        var window1RootNode = window1.getRootNode();
        window1RootNode.addChild(window1);

        var window2RootNode = window2.getRootNode();
        window2RootNode.addChild(window2);

        wall.setRootNode(wallRootNode);
        roof.setRootNode(roofRootNode);
        door.setRootNode(doorRootNode);
        window1.setRootNode(window1RootNode);
        window2.setRootNode(window2RootNode);

        //adding everything to the scenegraph
        this.mScaleNode.addChild(wall.getRootNode());
        this.mScaleNode.addChild(roof.getRootNode());
        this.mScaleNode.addChild(door.getRootNode());
        this.mScaleNode.addChild(window1.getRootNode());
        this.mScaleNode.addChild(window2.getRootNode());
        
        this.mRotationNode.addChild(this.mScaleNode);

        this.mTranslationNode.addChild(this.mRotationNode);
        this.setRootNode(this.mTranslationNode);
    }
    
    draw(pContext, pMatrix) {
        //Changing the origin to the place where the house will be placed
        var transform;
        transform = Matrix.createTranslation(this.getPosition());
        transform.setTransform(pContext);

        for(var i = 0; i < this.getRootNode().getNumberOfChildren(); i++) {
            this.getRootNode().getChildAt(i).draw(pContext, transform);
        }

        pMatrix.setTransform(pContext)
    }

    update(pDeltaTime) {
        var currentRotation, currentPos;
        currentRotation = pDeltaTime * this.mRotatationRate;
        this.setRotation(this.getRotation() + currentRotation)
        

        //changing where the house is on the screen
        currentPos = this.mMoveRate.multiply(pDeltaTime);
        this.setPosition(this.getPosition().add(currentPos));
        //*/
        this.refreshSceneGraph();
        
    }

    refreshSceneGraph() {
        var rotationMatrix, translationMatrix;
        //setting the rotation
        rotationMatrix = Matrix.createRotation(this.getRotation());
        this.mRotationNode.setMatrix(rotationMatrix);

        //setting the translation
        translationMatrix = Matrix.createTranslation(this.getPosition());
        this.mTranslationNode.setMatrix(translationMatrix);
    }

}