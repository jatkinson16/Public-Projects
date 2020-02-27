using OpenTK;
using System.Collections.Generic;

namespace OpenGL_Game.Components
{
    class ComponentSphereCollider : IComponent
    {
        float mRadius;

        public ComponentSphereCollider(float pRadius)
        {
            mRadius = pRadius;
        }

        public float GetRadius()
        {
            return mRadius;
        }


        public ComponentTypes ComponentType
        {
            get { return ComponentTypes.COMPONENT_SPHERE_COLLIDER; }
        }

        public void Close()
        {

        }
    }
}
