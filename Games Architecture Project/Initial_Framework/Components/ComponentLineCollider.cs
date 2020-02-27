using OpenTK;
using System.Collections.Generic;

namespace OpenGL_Game.Components
{
    class ComponentLineCollider : IComponent
    {
        Vector2[] mPoints;

        public ComponentLineCollider(Vector2[] pPoints)
        {
            mPoints = pPoints;
        }

        public Vector2[] GetPoints()
        {
            return mPoints;
        }

        public ComponentTypes ComponentType
        {
            get { return ComponentTypes.COMPONENT_LINE_COLLIDER; }
        }

        public void Close()
        {

        }
    }
}