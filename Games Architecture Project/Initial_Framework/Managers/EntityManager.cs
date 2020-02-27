using System.Collections.Generic;
using OpenGL_Game.Objects;
using System.Diagnostics;

namespace OpenGL_Game.Managers
{
    class EntityManager
    {
        protected List<Entity> entityList;

        public EntityManager()
        {
            entityList = new List<Entity>();
        }

        public void AddEntity(Entity entity)
        {
            Entity result = FindEntity(entity.Name);
            Debug.Assert(result == null, "Entity '" + entity.Name + "' already exists");
            entityList.Add(entity);
        }

        private Entity FindEntity(string name)
        {
            return entityList.Find(delegate(Entity e)
            {
                return e.Name == name;
            }
            );
        }

        public List<Entity> Entities()
        {
            return entityList;
        }

        public void RemoveEntity(string name)
        {
            for(int i = 0; i < entityList.Count; i++)
            {
                if(entityList[i].Name == name)
                {
                    entityList.RemoveAt(i);
                    return;
                }
            }
        }

        public void Close()
        {
            for (int i = 0; i < entityList.Count; i++)
            {
                entityList[i].Close();
            }
        }
    }
}
