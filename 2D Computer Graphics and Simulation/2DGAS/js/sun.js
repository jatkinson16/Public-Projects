class Sun{
    constructor(pPosition, pRotation, pScale) {
        this.setPosition(pPosition);
        this.setRotation(pRotation);
        this.setScale(pScale);
        this.initialiseSceneGraph();
        this.mRotatationRate = Math.PI;
        this.mMoveRate = new Vector(-60, 0, 0);
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
        
        //creating the body of the sun
        var sunbody = new Polygon(positionVector, rotation, scaleVector);
        sunbody.addPoint(this.getPosition());
        sunbody.setFillColour('#FFFF00');
        sunbody.setStrokeColour('#000000');
        sunbody.setLineJoin('round');
        sunbody.setLineWidth(5);

        var rayArray = [];
        var rayVector = new Vector(0, 70, 1)

        //creating the rays of the sun
        for(var i = 0; i<8; i++) {
            var rayRotation = i * (Math.PI/4);
            rayArray.push(new Polygon(rayVector, rayRotation, scaleVector));
            rayArray[i].addPoint(10,0);
            rayArray[i].addPoint(0, 20);
            rayArray[i].addPoint(-10, 0);

        
            rayArray[i].setFillColour('#FFFF00');
            rayArray[i].setStrokeColour('#000000');
            rayArray[i].setLineJoin('round');
            rayArray[i].setLineWidth(5);
        }


        //adding everything to the scenegraph
        var sunbodyRootNode = sunbody.getRootNode();
        sunbodyRootNode.addChild(sunbody);

        sunbody.setRootNode(sunbodyRootNode);
        this.mScaleNode.addChild(sunbody.getRootNode());

        for(var i = 0; i<rayArray.length; i++) {
            var rayRootNode = rayArray[i].getRootNode();
            rayRootNode.addChild(rayArray[i]);
            rayArray[i].setRootNode(rayRootNode);
        }
        
        for(var i = 0; i<rayArray.length; i++) {
            this.mScaleNode.addChild(rayArray[i].getRootNode());
        }
        
        
        //final adding to the scenegraph
        this.mRotationNode.addChild(this.mScaleNode);

        this.mTranslationNode.addChild(this.mRotationNode);
        this.setRootNode(this.mTranslationNode);
    }
    

    draw(pContext, pMatrix) {
        //setting the origin of the sun
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
        currentRotation = pDeltaTime * this.mRotatationRate; //creating the new rotation
        this.setRotation(this.getRotation() + currentRotation)
        
        
        currentPos = this.mMoveRate.multiply(pDeltaTime); //creating the new translation
        this.setPosition(this.getPosition().add(currentPos));
        //*/
        this.refreshSceneGraph();


    }

    refreshSceneGraph() {
        var rotationMatrix, translationMatrix;
        //setting the new values
        rotationMatrix = Matrix.createRotation(this.getRotation());
        this.mRotationNode.setMatrix(rotationMatrix);

        translationMatrix = Matrix.createTranslation(this.getPosition());
        this.mTranslationNode.setMatrix(translationMatrix);
    }
}