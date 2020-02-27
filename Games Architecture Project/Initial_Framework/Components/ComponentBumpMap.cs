using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenGL_Game.Components
{
    class ComponentBumpMap :IComponent
    {
        public ComponentBumpMap() //no need to keep anything in this component, it is just for the system(s) to recognise it
        {

        }

        public ComponentTypes ComponentType
        {
            get { return ComponentTypes.COMPONENT_BUMPMAP; }
        }


        public void Close()
        {

        }
    }
}
