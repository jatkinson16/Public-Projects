using OpenGL_Game.Components;
using OpenGL_Game.Objects;
using OpenTK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenGL_Game.Systems
{
    class SystemPatrolNodeTraversal :ISystem
    {
        const ComponentTypes MASK = (ComponentTypes.COMPONENT_POSITION | ComponentTypes.COMPONENT_TRAVELLER | ComponentTypes.COMPONENT_VELOCITY);
        const ComponentTypes ENEMYMASK = (ComponentTypes.COMPONENT_POSITION | ComponentTypes.COMPONENT_TRAVELLER | ComponentTypes.COMPONENT_VELOCITY | ComponentTypes.COMPONENT_AUDIO);
        Camera mCamera;

        public SystemPatrolNodeTraversal(ref Camera pCamera)
        {
            mCamera = pCamera;
        }

        public string Name
        {
            get { return "SystemPatrolNodeTraversal"; }
        }

        public void OnAction(Entity entity)
        {
            if ((entity.Mask & MASK) == MASK && (entity.Mask & ENEMYMASK) == MASK)
            {

                List<IComponent> components = entity.Components;

                IComponent positionComponent = components.Find(delegate (IComponent component)
                {
                    return component.ComponentType == ComponentTypes.COMPONENT_POSITION;
                });

                IComponent velocityComponent = components.Find(delegate (IComponent component)
                {
                    return component.ComponentType == ComponentTypes.COMPONENT_VELOCITY;
                });
                Vector3 velocity = ((ComponentVelocity)velocityComponent).Velocity;




                IComponent patrolComponent = components.Find(delegate (IComponent component)
                {
                    return component.ComponentType == ComponentTypes.COMPONENT_TRAVELLER;
                });
                Vector3 position = ((ComponentPosition)positionComponent).Position;
                Vector3 destination = ((ComponentTraveller)patrolComponent).Destination;
                Dictionary<Vector3, Vector3[]> neighbours = ((ComponentTraveller)patrolComponent).Neighbours;

                if (Vector3.Distance(position, destination) < 0.1f || (position.Xzy == destination.Xzy))//then change destination
                {
                    Vector3 newDestination = neighbours[destination][0];
                    ((ComponentTraveller)patrolComponent).Destination = newDestination;
                    ((ComponentVelocity)velocityComponent).Velocity = CreateVelocityDirection(position, newDestination);
                }
            }
        }

        private Vector3 CreateVelocityDirection(Vector3 currentPostition, Vector3 destinationPosition)
        {
            Vector3 direction = destinationPosition - currentPostition;
            direction.Normalize();
            direction *= new Vector3(2f, 2f, 2f);
            return direction;
        }
    }
}
