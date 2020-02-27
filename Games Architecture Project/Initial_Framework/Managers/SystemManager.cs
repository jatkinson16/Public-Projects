using System.Collections.Generic;
using OpenGL_Game.Systems;
using OpenGL_Game.Objects;

namespace OpenGL_Game.Managers
{
    class SystemManager
    {
        List<ISystem> systemList = new List<ISystem>();

        public SystemManager()
        {
        }

        public void ActionSystems(EntityManager entityManager, bool canDroneMove, bool canPlayerCollide)
        {
            List<Entity> entityList = entityManager.Entities();
            foreach(ISystem system in systemList)
            {
                foreach (Entity entity in entityList)
                {
                    if(entity.Name.Contains("Enemy") && system.Name == "SystemPhysics")
                    {
                        if(canDroneMove)
                        {
                            system.OnAction(entity);
                        }
                    }
                    else if(entity.Name.Contains("CollisionBox") && system.Name == "SystemCameraLineCollision")
                    {
                        if(canPlayerCollide)
                        {
                            system.OnAction(entity);
                        }
                    }
                    else
                    {
                        system.OnAction(entity);
                    }
                    
                }

            }
        }

        public void AddSystem(ISystem system)
        {
            ISystem result = FindSystem(system.Name);
            //Debug.Assert(result != null, "System '" + system.Name + "' already exists");
            systemList.Add(system);
        }

        public ISystem GetSystem(string name)
        {
            return (FindSystem(name));
        }

        private ISystem FindSystem(string name)
        {
            return systemList.Find(delegate(ISystem system)
            {
                return system.Name == name;
            }
            );
        }

    }
}
