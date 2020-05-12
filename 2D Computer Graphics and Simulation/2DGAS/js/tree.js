class Tree{
    constructor(pPosition, pRotation, pScale) {
        this.setPosition(pPosition);
        this.setRotation(pRotation);
        this.setScale(pScale);
        this.initialiseSceneGraph();
        this.mRotatationRate = Math.PI;
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
        var translateVector = new Vector(0,0,1);
        var scaleVector = new Vector(1,1,1);
        var rotation = 0;

        //adding the trunk polygon
        var trunk = new Polygon(translateVector, rotation, scaleVector);
        trunk.addPoint(25, 0);
        trunk.addPoint(-25, 0);
        trunk.addPoint(-25, 160);
        trunk.addPoint(-40, 190);
        trunk.addPoint(40,190);
        trunk.addPoint(25, 160);
        trunk.setFillColour('#412721');
        trunk.setStrokeColour('#000000');
        trunk.setLineJoin('round');
        trunk.setLineWidth(5);

        //adding the leaves polygon
        var leavesScaleVector = new Vector(1.5,1.5,1);
        var leaves = new Polygon(translateVector, rotation, leavesScaleVector);
        leaves.addPoint(this.getPosition());
        leaves.setFillColour('#60A910');
        leaves.setStrokeColour('#000000');
        leaves.setLineJoin('round');
        leaves.setLineWidth(3);


        //adding everything to the scenegraph
        var trunkRootNode = trunk.getRootNode();
        trunkRootNode.addChild(trunk);

        var leavesRootNode = leaves.getRootNode();
        leavesRootNode.addChild(leaves);

        trunk.setRootNode(trunkRootNode);
        leaves.setRootNode(leavesRootNode);

        //final add to the scenegraph
        this.mScaleNode.addChild(trunk.getRootNode());
        this.mScaleNode.addChild(leaves.getRootNode());

        this.mRotationNode.addChild(this.mScaleNode);

        this.mTranslationNode.addChild(this.mRotationNode);
        this.setRootNode(this.mTranslationNode);
    }
    

    draw(pContext, pMatrix) {
        //setting the origin of the tree
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
        currentRotation = pDeltaTime * this.mRotatationRate; //creating a new rotation
        this.setRotation(this.getRotation() + currentRotation)
        this.refreshSceneGraph();
    }

    refreshSceneGraph() {
        var rotationMatrix, translationMatrix;//no translation but present if needed
        //setting the new values
        rotationMatrix = Matrix.createRotation(this.getRotation());
        this.mRotationNode.setMatrix(rotationMatrix);

        translationMatrix = Matrix.createTranslation(this.getPosition());
        this.mTranslationNode.setMatrix(translationMatrix);
    }
}