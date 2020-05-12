//Built, but not implemented fully due to time constraints, so scrapped

class Visitor {
    constructor() {
        this.mTransform = [];
    }

    visit(pNode) {
        if(pNode.getType() === 'Group') {
            visitGroup(pNode);
        }
    }

    visitGroup(pNode) {
        var index, child;
        for(index = 0; index < pNode.numChildren(); index +=1) {
            child = pNode.getChild(index);
            child.accept(this);
        }
    }

    visitTransform(pNode) {
        this.pushTransform(pNode.getTransform());
        this.visitGroup(pNode);
        this.popTransform();
    }

    popTransform() {
        if(this.mTransform.length != 0) {
            this.mTransform.pop();
        }
    }

    peekTransform() {
        if(this.mTransform.length != 0) {
            return this.mTransform[this.mTransform.length - 1];
        }
    }

    pushTransform(pNode) {
        if(this.mTransform.length === 0) {
            this.mTransform.push(pNode);
        }
        else {
            var currentTransform = this.peekTransform();
            currentTransform = currentTransform.multiply(pNode);
            this.mTransform.push(currentTransform);
        }
    }
}