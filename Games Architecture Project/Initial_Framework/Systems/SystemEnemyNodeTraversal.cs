using OpenGL_Game.Components;
using OpenGL_Game.Objects;
using OpenTK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenGL_Game.Systems
{
    class SystemEnemyNodeTraversal : ISystem
    {
        const ComponentTypes MASK = (ComponentTypes.COMPONENT_POSITION | ComponentTypes.COMPONENT_TRAVELLER | ComponentTypes.COMPONENT_VELOCITY | ComponentTypes.COMPONENT_AUDIO);
        Camera mCamera;
        Dictionary<Entity, bool> currentEnemies; //bool is whether they are chasing the player or not
        

        public SystemEnemyNodeTraversal(ref Camera pCamera)
        {
            mCamera = pCamera;
            currentEnemies = new Dictionary<Entity, bool>();
        }

        public string Name
        {
            get { return "SystemEnemyNodeTraverser"; }
        }

        public void OnAction(Entity entity)
        {
            if ((entity.Mask & MASK) == MASK)
            {
                bool value;
                if(!currentEnemies.TryGetValue(entity, out value))
                {
                    currentEnemies.Add(entity, false);
                }
               
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

                IComponent audioComponent = components.Find(delegate (IComponent component)
                {
                    return component.ComponentType == ComponentTypes.COMPONENT_AUDIO;
                });



                IComponent travellerComponent = components.Find(delegate (IComponent component)
                {
                    return component.ComponentType == ComponentTypes.COMPONENT_TRAVELLER;
                });
                Vector3 position = ((ComponentPosition)positionComponent).Position;
                Vector3 destination = ((ComponentTraveller)travellerComponent).Destination;
                Dictionary<Vector3, Vector3[]> neighbours = ((ComponentTraveller)travellerComponent).Neighbours;

                /*
                if (destination == -1) //if not assigned a destination node, will give it the closest one.
                {
                    destination = FindClosestNode(((ComponentPosition)positionComponent).Position);
                    ((ComponentNodeTraverser)traverserComponent).Destination = destination;

                }
                */

                Vector3 vectorBetween =mCamera.cameraPosition - position;
                


                if(Vector3.Dot(velocity, vectorBetween) > 0)
                {
                    if (currentEnemies[entity] == true)
                    {
                        if (Vector3.Distance(destination, position) <= 0.1f)//then it has reached that node
                        {
                            destination = FindClosestNodeToPlayer(neighbours[destination]);
                            ((ComponentTraveller)travellerComponent).Destination = destination;
                        }
                        //destination = FindClosestNodeToPlayer(nodes[destination].Neighbours());
                        //((ComponentNodeTraverser)traverserComponent).Destination = destination;
                    }
                    else
                    {
                        ((ComponentAudio)audioComponent).PlayOnce();
                    }
                    currentEnemies[entity] = true;
                }
                else
                {
                    if(currentEnemies[entity] == true)
                    {
                        if (Vector3.Distance(destination, position) <= 0.1f)//then it has reached that node
                        {
                            destination = FindClosestNodeToPlayer(neighbours[destination]);
                            ((ComponentTraveller)travellerComponent).Destination = destination;
                        }
                    }
                    currentEnemies[entity] = false;
                }

                if (currentEnemies[entity] == false)
                {
                    if (Vector3.Distance(destination, position) <= 0.1f)//then it has reached that node
                    {
                        destination = FindClosestNodeToPlayer(neighbours[destination]);
                        ((ComponentTraveller)travellerComponent).Destination = destination;
                    }

                    ((ComponentVelocity)velocityComponent).Velocity = CreateVelocityDirection(position, destination);
                }
                else
                {
                    //check to see if a destination is closer to the enemy than the player //Will need to probably change once it pursues based on LineOfSight
                    if (Vector3.Distance(mCamera.cameraPosition, position) < Vector3.Distance(destination, position))
                    {
                        ((ComponentVelocity)velocityComponent).Velocity = CreateVelocityDirection(position, mCamera.cameraPosition);
                        
                    }
                    else
                    {
                        if (Vector3.Distance(destination, position) <= 0.1f)//then it has reached that node
                        {
                            destination = FindClosestNodeToPlayer(neighbours[destination]);
                            ((ComponentTraveller)travellerComponent).Destination = destination;
                        }

                        ((ComponentVelocity)velocityComponent).Velocity = CreateVelocityDirection(position, destination);
                    }
                }

                

                //need to alter so that it allows the enemy to return to closest node after chasing player



                //nodes[currentNode].Neighbours().
            }
        }

        private Vector3 CreateVelocityDirection(Vector3 entityPostition, Vector3 nodePosition)
        {
            Vector3 direction = nodePosition - entityPostition;
            direction.Normalize();
            direction *= new Vector3(1.5f, 1.5f, 1.5f);
            return direction;
        }

        /*
        private int FindClosestNode(Vector3 pPosition)
        {
            float closest = -1;
            int closestNode = -1;
            List<Node> nodeValues = nodes.Values.ToList();
            for (int i = 0; i < nodeValues.Count; i++)
            {
                if (closestNode == -1)
                {
                    closestNode = nodeValues[i].ID();
                    closest = Vector3.Distance(pPosition, nodeValues[i].Position());
                    if(closest == 0) //making sure that the current node isn't checked
                    {
                        closestNode = -1;
                    }
                }
                else
                {
                    float newDist = Vector3.Distance(pPosition, nodeValues[i].Position());
                    if (newDist != 0 && newDist < closest)
                    {
                        closest = newDist;
                        closestNode = nodeValues[i].ID();
                    }
                }
            }

            return closestNode;
        }
        

        private Vector3 FindClosestNode(Vector3 pPosition, Dictionary<Vector3, Vector3[]>pNeighbours)
        {
            float closest = -1;
            Vector3 closestNode = new Vector3(0,0,0); //means can't have a position of 0,0,0
            List<Node> nodeValues = nodes.Values.ToList();
            Vector3[] neighbours = pNeighbours[pPosition];
            for (int i = 0; i < neighbours.Length; i++)
            {
                if (Vector3.Distance(new Vector3(0, 0, 0), closestNode) == 0)
                {
                    closestNode = neighbours[i];
                    closest = Vector3.Distance(pPosition, neighbours[i]);
                    if(closest == 0)
                    {
                        closestNode = new Vector3(0, 0, 0);
                    }
                }
                else
                {
                    float newDist = Vector3.Distance(pPosition, neighbours[i]);
                    if (newDist != 0 && newDist < closest)
                    {
                        closest = newDist;
                        closestNode = neighbours[i];
                    }
                }
            }

            return closestNode;
        }
        */

        private Vector3 FindClosestNodeToPlayer(Vector3[] neighbours)
        {
            float closestDist = -1;
            Vector3 closestNode = new Vector3(0, 0, 0); //means can't have a position of 0,0,0
            for (int i = 0; i < neighbours.Length; i++)
            {
                Vector3 index = neighbours[i];
                if (Vector3.Distance(new Vector3(0, 0, 0), closestNode) == 0)
                {
                    closestNode = index;
                    closestDist = Vector3.Distance(mCamera.cameraPosition, neighbours[i]);
                }
                else
                {
                    float newDist = Vector3.Distance(mCamera.cameraPosition, neighbours[i]);
                    if (newDist != 0 && newDist < closestDist)
                    {
                        closestDist = newDist;
                        closestNode = index;
                    }
                }
            }
            return closestNode;
        }

        /*
        private int FindClosestNodeToPlayer(List<int> neighbours)
        {
            float closestDist = -1;
            int closestNode = -1;
            for (int i = 0; i < neighbours.Count; i++)
            {
                int index = neighbours[i];
                if(closestNode == -1)
                {
                    closestNode = index;
                    closestDist = Vector3.Distance(mCamera.cameraPosition, nodes[index].Position());
                }
                else
                {
                    float newDist = Vector3.Distance(mCamera.cameraPosition, nodes[index].Position());
                    if (newDist != 0 && newDist < closestDist)
                    {
                        closestDist = newDist;
                        closestNode = index;
                    }
                }
            }
            return closestNode;
        }
        */
    }

    
}
