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
    class SystemCameraLineCollision : ISystem
    {
        const ComponentTypes MASK = (ComponentTypes.COMPONENT_LINE_COLLIDER);
        Camera mCamera;
        List<Entity> mCollidingEntities = new List<Entity>();
        public SystemCameraLineCollision(ref Camera pCamera)
        {
            mCamera = pCamera;
        }

        public string Name
        {
            get { return "SystemCameraLineCollision"; }
        }

        public void OnAction(Entity entity)
        {

            if ((entity.Mask & MASK) == MASK)
            {
                List<IComponent> components = entity.Components;

                IComponent colliderComponent = components.Find(delegate (IComponent component)
                {
                    return component.ComponentType == ComponentTypes.COMPONENT_LINE_COLLIDER;
                });
                //get the array of points
                Vector2[] points = ((ComponentLineCollider)colliderComponent).GetPoints();

                for(int i = 0; i < points.Length - 1; i++)
                {
                    if(CheckCollision(points[i], points[i + 1]))
                    {
                        mCollidingEntities.Add(entity);
                    }
                }

                if(CheckCollision(points[0], points[points.Length - 1])) //need to check the last against the first as well
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

        protected bool CheckCollision(Vector2 pPoint1, Vector2 pPoint2)
        {
            //get the actual line of the 2 vectors passed in
            Vector2 lineToCheckAgainst = pPoint2 - pPoint1;
            Vector2 wallNormal = new Vector2(-lineToCheckAgainst.Y, lineToCheckAgainst.X);
            wallNormal.Normalize();

            //find the lines from each point to the camera
            Vector2 point1ToCamera = mCamera.cameraPosition.Xz - pPoint1;
            Vector2 point2ToCamera = mCamera.cameraPosition.Xz - pPoint2;

            if(point1ToCamera.Length > lineToCheckAgainst.Length || point2ToCamera.Length > lineToCheckAgainst.Length) //if the lineBetween 2 points != the hypoteneuse then it definitely won't collide
            {
                return false;
            }

            //find the angle, between one of the wall points and camera, and the wall, can then use it to find the distance of the camera to the wall. If it's less than the camrea radius, they collide
            double dotOfLines = Vector2.Dot(lineToCheckAgainst, point1ToCamera);
            double angle = Math.Acos((dotOfLines)/(point1ToCamera.Length * lineToCheckAgainst.Length));

            double distanceFromCameraToWall = point1ToCamera.Length * (Math.Sin(angle));

            if(distanceFromCameraToWall <= 1)//1 = camera radius
            {
                return true;
            }


            //create direction vector with 
            return false;
        }

    }
}

