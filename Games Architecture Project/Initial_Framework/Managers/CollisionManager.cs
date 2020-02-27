using System.Collections.Generic;
using OpenGL_Game.Objects;
using System.Diagnostics;
using OpenGL_Game.Components;
using OpenTK;
using OpenGL_Game.Scenes;

namespace OpenGL_Game.Managers
{
    class CollisionManager
    {
        GameScene mGameScene;
        public CollisionManager(ref GameScene pGameScene)
        {
            mGameScene = pGameScene;
        }

        public void ProcessCollisions(List<Entity> pCollidingEntities)
        {
            for(int i = 0; i< pCollidingEntities.Count;i++)
            {
                if(pCollidingEntities[i].Name.Contains("Portal") && mGameScene.keysLeft == 0)
                {
                    mGameScene.DoWin();
                }
                else if(pCollidingEntities[i].Name.Contains("Enemy") || pCollidingEntities[i].Name.Contains("Patroller")) //eventually use mask to check?
                {
                    //Change the camera position to reflect the change (MOVE TO COLLISION MANAGER)
                    mGameScene.camera.cameraPosition = new Vector3(-8, 2, 7);
                    //mGameScene.score++;
                    mGameScene.camera.cameraDirection = new Vector3(-8, 2, 8) - mGameScene.camera.cameraPosition;
                    mGameScene.camera.UpdateView(); //remember to call update view to apply the changes
                    mGameScene.ResetDrone();
                    mGameScene.lives--;

                } else if(pCollidingEntities[i].Name.Contains("CollisionBox"))
                {
                    mGameScene.camera.cameraPosition = mGameScene.camera.previousCameraPosition;
                    mGameScene.camera.UpdateView();
                }
                else if(pCollidingEntities[i].Name.Contains("Key"))
                {
                    mGameScene.keysLeft--;

                    List<IComponent> components = pCollidingEntities[i].Components;

                    IComponent audioComponent = components.Find(delegate (IComponent component)
                    {
                        return component.ComponentType == ComponentTypes.COMPONENT_AUDIO;
                    });

                    ((ComponentAudio)audioComponent).PlayOnce();

                    mGameScene.RemoveEntity(pCollidingEntities[i].Name);
                }
                
                
            }
        }

    }
}
