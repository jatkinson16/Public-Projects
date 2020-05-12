class SceneGraphNode {
    constructor(pMatrix) {
        this.setMatrix(pMatrix);
        this.mChildren =[];
    }
    
    getMatrix() {
        return this.mMatrix;
    }
    setMatrix(pMatrix) {
        this.mMatrix = pMatrix;
    }
    getMChildren() {
        return this.mChildren;
    }
    setMChildren(pChildren) {
        this.mChildren = pChildren;
    }
    getNumberOfChildren() {
        return this.mChildren.length;
    }
    getChildAt(index) {
        return this.mChildren[index];
    }
    addChild(pNode) {//adds a child
        if(pNode instanceof Polygon) {//if the child is a polygon, have to go down to the deepest level to ensure that it undergoes all the translations
            if(this.getNumberOfChildren() > 0) {//only add a polygon to the deepest node
                this.mChildren[0].addChild(pNode)
            }
            else {
                this.mChildren.push(pNode);
            }
            
        }
        else {
            this.mChildren.push(pNode);
        }

        
        
    }
    draw(pContext, pMatrix) {//multiplies the transform by the current matrix; be that transform, scale or rotate
        var transform = pMatrix.multiply(this.getMatrix())
        transform.setTransform(pContext);

        for(var i = 0; i < this.getNumberOfChildren(); i++) {//calls it's childs draw functions as well
            this.getChildAt(i).draw(pContext, transform);
        }
        pMatrix.setTransform(pContext);
    }
    
    update(pDeltaTime) {//just calls update to whatever needs it
        for(var i = 0; i < this.getNumberOfChildren(); i++) {
            this.getChildAt(i).update(pDeltaTime);
        }
    }

    //scrapped for now
    accept(visitor) {
        visitor.visit(this);
    }

}