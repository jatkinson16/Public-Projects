class Background {
    constructor(pPosition, pRotation, pScale) {
        this.setPosition(pPosition);
        this.setRotation(pRotation);
        this.setScale(pScale);
        this.initialiseSceneGraph();
        this.mRotatationRate = -Math.PI;
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

        var positionVector = new Vector(0,0,1);
        var scaleVector = new Vector(2,2,2);
        var rotation = 0;

        //creating the sky
        var skyRectangle = new Polygon(positionVector, rotation, scaleVector);
        skyRectangle.addPoint(-400, -300, 1);
        skyRectangle.addPoint(400, -300, 1);
        skyRectangle.addPoint(400, 300, 1);
        skyRectangle.addPoint(-400, 300, 1);

        skyRectangle.setFillColour('#688DFF');

        skyRectangle.setLineWidth(5);


        //creating the grass
        var grassRectangle = new Polygon(positionVector, rotation, scaleVector);
        grassRectangle.addPoint(-400, 0, 1);
        grassRectangle.addPoint(400, 0, 1);
        grassRectangle.addPoint(400, 300, 1);
        grassRectangle.addPoint(-400, 300, 1);

        grassRectangle.setFillColour('#003200');

        grassRectangle.setLineWidth(5);

        //adding the polygon as the bottom node for the scene graph
        var skyRootNode = skyRectangle.getRootNode();
        skyRootNode.addChild(skyRectangle);
        skyRectangle.setRootNode(skyRootNode);

        var grassRootNode = grassRectangle.getRootNode();
        grassRootNode.addChild(grassRectangle);
        grassRectangle.setRootNode(grassRootNode);

        //building the scenegraph segment
        this.mScaleNode.addChild(skyRectangle.getRootNode());
        this.mScaleNode.addChild(grassRectangle.getRootNode());

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
        var currentRotation;
        currentRotation = pDeltaTime * this.mRotatationRate; //changing rotation by the rate
        this.setRotation(this.getRotation() + currentRotation)
        this.refreshSceneGraph();
    }

    refreshSceneGraph() {
        var rotationMatrix, translationMatrix;
        
        //set rotation to the new one
        rotationMatrix = Matrix.createRotation(this.getRotation());
        this.mRotationNode.setMatrix(rotationMatrix);

        //set translation to the new one
        translationMatrix = Matrix.createTranslation(this.getPosition());
        this.mTranslationNode.setMatrix(translationMatrix);
    }
 }