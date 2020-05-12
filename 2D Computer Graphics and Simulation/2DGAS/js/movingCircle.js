class movingCircle {
    constructor(pPosition, pRotation, pScale, pVelocity, pAcceleration, pMass, pK) {
        this.setPosition(pPosition);
        this.setRotation(pRotation);
        this.setScale(pScale);
        this.initialiseSceneGraph();
        this.setDragCoeff(pK);
        this.setVelocity(pVelocity);
        this.setAcceleration(pAcceleration);
        this.setMass(pMass);
        this.setCollisionStatus(false);

    }

    getVelocity() {
        return this.mVelocity;
    }
    setVelocity(pVelocity) {
        this.mVelocity = pVelocity;
    }
    getAcceleration() {
        return this.mAcceleration;
    }
    setAcceleration(pAcceleration) {
        this.mAcceleration = pAcceleration;
    }
    getMass() {
        return this.mMass;
    }
    setMass(pMass) {
        this.mMass = pMass;
    }
    getDragCoeff() {
        return this.mK;
    }
    setDragCoeff(pK) {
        this.mK = pK;
    }

    //Used to indicate  whether it has collided or not
    getCollisionStatus() {
        return this.mIsColliding;
    }
    setCollisionStatus(pBool) {
        if(this.mIsColliding != pBool) {
            this.mIsColliding = pBool;
        }
    }

    //used after collisions to ensure the circle doesn't keep colliding
    getPreviousPosition() {
        return this.mPreviousPosition;
    }
    setPreviousPosition(pPosition) {
        this.mPreviousPosition = pPosition;
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
    getPolygon() {
        return this.mPolygon;
    }
    setPolygon(pPolygon) {
        this.mPolygon = pPolygon;
    }
    getRadius() {
        return this.mRadius;
    }
    setRadius(pRadius) {
        this.mRadius = pRadius;
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
        var scaleVector = new Vector(0.3,0.3,1);
        var rotation = 0;

        var circle = new Polygon(positionVector, rotation, scaleVector);
        circle.addPoint(0,0,1);
        circle.setStrokeColour('#000000');
        circle.setLineJoin('round');
        circle.setLineWidth(5);
        
        var tempScaleVector = new Vector(0.3,0.3,1);
        var radius = tempScaleVector.multiply(60).getX();
        this.setRadius(radius);

        //adding the polygon to the bottom of the scenegraph
        var circleRootNode = circle.getRootNode();
        circleRootNode.addChild(circle);

        circle.setRootNode(circleRootNode);

        this.setPolygon(circle);

        this.mScaleNode.addChild(circle.getRootNode());

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
        
        if(this.getCollisionStatus()) {//changes colour if it collides
            if(this.getPolygon().strokeColour == '#FF0000') {
                this.getPolygon().setStrokeColour('#00FF00');
            }
            else if(this.getPolygon().strokeColour == '#00FF00') {
                this.getPolygon().setStrokeColour('#0000FF');
            }
            else {
                this.getPolygon().setStrokeColour('#FF0000');
            }
            
        }
        this.refreshSceneGraph();
        
    }

    refreshSceneGraph() {
        var translationMatrix;
        
        translationMatrix = Matrix.createTranslation(this.getPosition());
        this.mTranslationNode.setMatrix(translationMatrix);
    }


    
    rebound() {
        var oldDirection = this.getTranslationNode;
        
    }
}