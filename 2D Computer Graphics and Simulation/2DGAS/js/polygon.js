class Polygon {
    constructor(pPosition, pRotation, pScale) {
        this.setPosition(pPosition);
        this.setRotation(pRotation);
        this.setScale(pScale);
        this.initialiseSceneGraph();

        this.pointsArray = [];
    }

    addPoint(pX, pY, pZ) {//adds a point at the specified co-ordinates

        var vector = new Vector(pX, pY, pZ);
        this.pointsArray.push(vector);
    }
    getNumberOfPoints() {
        return this.pointsArray.length;
    }
    getPointAt(pIndex) {
        return this.pointsArray[pIndex];
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
    
    //setting draw styles
    setStrokeColour(pColour) {
        this.strokeColour = pColour;
    }

    setFillColour(pColour) {
        this.fillColour = pColour;
    }

    setLineWidth(pWidth) {
        this.lineWidth = pWidth;
    }

    setLineJoin(pStyle) {
        this.lineJoinStyle = pStyle;
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

        this.mTranslationNode.addChild(this.mScaleNode);

        this.mRotationNode.addChild(this.mTranslationNode);

        
        this.setRootNode(this.mRotationNode);
    }

    draw(pContext, pMatrix) {
        //choose a line width
        pContext.lineWidth = this.lineWidth;
        //set the line join
        pContext.lineJoin = this.lineJoinStyle;
        //set the stroke style
        pContext.strokeStyle = this.strokeColour;
        //set the fill colour
        pContext.fillStyle = this.fillColour;
        
        if(this.pointsArray.length == 1) {//if it only has one point, is a circle
            pContext.beginPath();
            pContext.arc(0, 0, 60, 0,2* Math.PI, false);
        }
        else {
            if(this.pointsArray.length > 1) {
                pContext.beginPath();
                pContext.moveTo(this.pointsArray[0].getX(), this.pointsArray[0].getY())
                for(var i = 1; i < this.pointsArray.length; i++) {
                    pContext.lineTo(this.pointsArray[i].getX(), this.pointsArray[i].getY())
                }
            }
        }

        pContext.closePath();
        if(this.fillColour != undefined) {
            pContext.fill();
        }
        if(this.strokeColour != undefined) {
            pContext.stroke();
        }
        
        
        pMatrix.setTransform(pContext)
    }

    update(pDeltaTime) {
        //nothing needs to update, all done in parent scenegraph nodes
    }

    
    
}