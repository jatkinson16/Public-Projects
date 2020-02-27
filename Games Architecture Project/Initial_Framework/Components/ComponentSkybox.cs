using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using OpenTK;

namespace OpenGL_Game.Components
{
    class ComponentSkybox : IComponent
    {

        public ComponentSkybox() //no need to keep anything in this component, it is just for the system(s) to recognise it
        {
            
        }

        public ComponentTypes ComponentType
        {
            get { return ComponentTypes.COMPONENT_SKYBOX; }
        }


        public void Close()
        {

        }
    }
}
