using System;

namespace OpenGL_Game.Components
{
    [FlagsAttribute]
    enum ComponentTypes {
        COMPONENT_NONE     = 0,
	    COMPONENT_POSITION = 1 << 0,
        COMPONENT_GEOMETRY = 1 << 1,
        COMPONENT_TEXTURE  = 1 << 2,
        COMPONENT_VELOCITY = 1 << 3,
        COMPONENT_AUDIO = 1 << 4,
        COMPONENT_SPHERE_COLLIDER = 1 << 5,
        COMPONENT_LINE_COLLIDER = 1 << 6,
        COMPONENT_NODE_TRAVERSER = 1 << 7,
        COMPONENT_SKYBOX = 1 << 8,
        COMPONENT_TRAVELLER = 1 << 9,
        COMPONENT_BUMPMAP = 1 << 10
    }

    interface IComponent
    {
        ComponentTypes ComponentType
        {
            get;
        }

        void Close();
    }
}
