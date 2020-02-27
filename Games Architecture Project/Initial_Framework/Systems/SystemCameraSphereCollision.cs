using System;
using System.Collections.Generic;
using System.IO;
using OpenTK;
using OpenTK.Graphics.OpenGL;
using OpenGL_Game.Components;
using OpenGL_Game.OBJLoader;
using OpenGL_Game.Objects;
using OpenGL_Game.Scenes;

namespace OpenGL_Game.Systems
{
    class SystemCameraSphereCollision : ISystem
    {
        const ComponentTypes MASK = (ComponentTypes.COMPONENT_POSITION | ComponentTypes.COMPONENT_SPHERE_COLLIDER);
        Camera mCamera;
        List<Entity> mCollidingEntities = new List<Entity>();
        public SystemCameraSphereCollision(ref Camera pCamera) //may not be fully detached from program but have had problems passing in just a position.
        {
            mCamera = pCamera;
        }

        public string Name
        {
            get { return "SystemCameraSphereCollision"; }
        }

        public void OnAction(Entity entity)
        {
            
            if ((entity.Mask & MASK) == MASK)
            {
                List<IComponent> components = entity.Components;

                IComponent colliderComponent = components.Find(delegate (IComponent component)
                {
                    return component.ComponentType == ComponentTypes.COMPONENT_SPHERE_COLLIDER;
                });
                float radius = ((ComponentSphereCollider)colliderComponent).GetRadius();

                IComponent positionComponent = components.Find(delegate (IComponent component)
                {
                    return component.ComponentType == ComponentTypes.COMPONENT_POSITION;
                });
                Vector3 position = ((ComponentPosition)positionComponent).Position;

                if((CheckCollision(radius, position)))//if they collide, add to the list of colliding entities
                {
                    mCollidingEntities.Add(entity);
                }
                
            }
        }

        public List<Entity> GetCollidingEntities()
        {
            return mCollidingEntities;
        }

        public void ClearCollidingEntities()
        {
            mCollidingEntities.Clear();
        }

        protected bool CheckCollision(float pRadius, Vector3 pPosition)
        {
            //Do collision check
            if (Vector3.Distance(pPosition, mCamera.cameraPosition) <= pRadius + 1.0f)//1.0f = camera radius
            {
                return true;
            }
            return false;   
        }

    }
}
