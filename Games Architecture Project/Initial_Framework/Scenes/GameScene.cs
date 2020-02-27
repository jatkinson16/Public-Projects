using OpenTK;
using OpenTK.Graphics.OpenGL;
using OpenTK.Input;
using OpenGL_Game.Components;
using OpenGL_Game.Systems;
using OpenGL_Game.Managers;
using OpenGL_Game.Objects;
using System.Drawing;
using System;
using System.Collections.Generic;

//// NEW for Audio
using System.IO;
using OpenTK.Audio.OpenAL;
using OpenGL_Game.OBJLoader;

namespace OpenGL_Game.Scenes
{
    /// <summary>
    /// This is the main type for your game
    /// </summary>
    class GameScene : Scene
    {
        EntityManager entityManager;
        SystemManager systemManager;
        InputManager inputManager;
        CollisionManager collisionManager;
        public static GameScene gameInstance;
        public Camera camera;
        public static float dt = 0;
        public int keysLeft = 0, lives;
        bool isPortalActive, canPlayerCollide = true, canDroneMove = true;

        public List<Entity> collidingEntities = new List<Entity>();

        public GameScene(SceneManager sceneManager) : base(sceneManager)
        {
            isPortalActive = false;
            lives = 3;
            keysLeft = 0;
            gameInstance = this;
            entityManager = new EntityManager();
            systemManager = new SystemManager();
            
            collisionManager = new CollisionManager(ref gameInstance);
            //enemyManager = new EnemyManager(ref gameInstance);


            // Set the title of the window
            sceneManager.Title = "Game";
            // Set the Render and Update delegates to the Update and Render methods of this class
            sceneManager.renderer = Render;
            sceneManager.updater = Update;
            // Set Keyboard events to go to a method in this class
            sceneManager.keyboardDownDelegate += Keyboard_KeyDown;
            sceneManager.keyboardUpDelegate += Keyboard_KeyUp;

            // Enable Depth Testing
            GL.Enable(EnableCap.DepthTest);
            GL.DepthMask(true);
            GL.Enable(EnableCap.CullFace);
            GL.CullFace(CullFaceMode.Back);

            GL.ClearColor(0.0f, 0.0f, 0.0f, 1.0f);

            // Set Camera
            camera = new Camera(new Vector3(-8, 2, 7), new Vector3(-8, 2, 8), (float)(sceneManager.Width) / (float)(sceneManager.Height), 0.1f, 1000f);
            //map = new Camera(new Vector3(-28.5f, 10, -28.5f), new Vector3(-28.5f, 2, -28.5f), (float)(sceneManager.Width/2) / (float)(sceneManager.Height/2), 0.1f, 100f);
            inputManager = new InputManager(ref camera);
            CreateEntities();
            CreateSystems();

            //ResourceManager.LoadTexture("Textures/heart.png");


        }

        private void CreateEntities()
        {
            Entity newEntity;

            newEntity = new Entity("Key1");
            newEntity.AddComponent(new ComponentPosition(-6.0f, 1.0f, 53.5f));
            //newEntity.AddComponent(new ComponentVelocity(0.0f, 0.0f, -1.0f));
            newEntity.AddComponent(new ComponentGeometry("Geometry/Key/Key.obj"));
            newEntity.AddComponent(new ComponentSphereCollider(0.5f));
            newEntity.AddComponent(new ComponentAudio("Audio/key_collect.wav", -6.0f, 1.0f, 53.5f));
            entityManager.AddEntity(newEntity);
            keysLeft++;

            newEntity = new Entity("Key2");
            newEntity.AddComponent(new ComponentPosition(-53.0f, 1.0f, 52.5f));
            //newEntity.AddComponent(new ComponentVelocity(0.0f, 0.0f, -1.0f));
            newEntity.AddComponent(new ComponentGeometry("Geometry/Key/Key.obj"));
            newEntity.AddComponent(new ComponentSphereCollider(0.5f));
            newEntity.AddComponent(new ComponentAudio("Audio/key_collect.wav", -53.0f, 1.0f, 52.5f));
            entityManager.AddEntity(newEntity);
            keysLeft++;

            newEntity = new Entity("Key3");
            newEntity.AddComponent(new ComponentPosition(-53.0f, 1.0f, 3.5f));
            //newEntity.AddComponent(new ComponentVelocity(0.0f, 0.0f, -1.0f));
            newEntity.AddComponent(new ComponentGeometry("Geometry/Key/Key.obj"));
            newEntity.AddComponent(new ComponentSphereCollider(0.5f));
            newEntity.AddComponent(new ComponentAudio("Audio/key_collect.wav", -53.0f, 1.0f, 3.5f));
            entityManager.AddEntity(newEntity);
            keysLeft++;

            newEntity = new Entity("Portal");
            newEntity.AddComponent(new ComponentPosition(-1.0f, 2.0f, 7.5f));
            newEntity.AddComponent(new ComponentGeometry("Geometry/Portal/portal.obj"));
            newEntity.AddComponent(new ComponentSphereCollider(2.0f));
            ComponentAudio PortalAudioComponent = new ComponentAudio("Audio/buzz.wav", -1.0f, 2.0f, 7.5f);
            
            newEntity.AddComponent(new ComponentTexture("Textures/Portal/portal_active.jpg"));
            PortalAudioComponent.Play();
            newEntity.AddComponent(PortalAudioComponent);

            entityManager.AddEntity(newEntity);


            newEntity = new Entity("Maze");
            newEntity.AddComponent(new ComponentPosition(0.0f, 0.0f, 0.0f)); //5.0, 0, 3.0 = good position for portal
            newEntity.AddComponent(new ComponentGeometry("Geometry/Maze/maze.obj"));
            newEntity.AddComponent(new ComponentBumpMap());
            entityManager.AddEntity(newEntity);

            newEntity = new Entity("MazeFloor");
            newEntity.AddComponent(new ComponentPosition(0.0f, 0.0f, 0.0f)); //5.0, 0, 3.0 = good position for portal
            newEntity.AddComponent(new ComponentGeometry("Geometry/Maze/floor.obj"));
            newEntity.AddComponent(new ComponentBumpMap());
            entityManager.AddEntity(newEntity);

            newEntity = new Entity("Enemy1");
            newEntity.AddComponent(new ComponentPosition(-28.5f, 2.0f, 28.5f));
            newEntity.AddComponent(new ComponentVelocity(0.0f, 0.0f, 0.0f));
            newEntity.AddComponent(new ComponentGeometry("Geometry/Moon/moon.obj"));
            newEntity.AddComponent(new ComponentSphereCollider(2.0f));

            Vector3[] nodes = BuildEnemyNetwork();

            newEntity.AddComponent(new ComponentTraveller(nodes, BuildEnemyNetworkNeighbours(nodes)));
            ComponentAudio audioComponent = new ComponentAudio("Audio/alert.wav", -28.5f, 2.0f, 28.5f);
            newEntity.AddComponent(audioComponent);
            

            entityManager.AddEntity(newEntity);

            newEntity = new Entity("Patroller1");
            newEntity.AddComponent(new ComponentPosition(-3, 2, 53));
            newEntity.AddComponent(new ComponentVelocity(0.0f, 0.0f, 0.0f));
            newEntity.AddComponent(new ComponentGeometry("Geometry/Moon/moon.obj"));
            newEntity.AddComponent(new ComponentSphereCollider(2.0f));
            //audioComponent.Play();
            nodes = BuildPatrolNetwork1();
            newEntity.AddComponent(new ComponentTraveller(nodes, BuildPatrolNetwork1Neighbours(nodes)));

            entityManager.AddEntity(newEntity);

            newEntity = new Entity("Patroller2");
            newEntity.AddComponent(new ComponentPosition(-40.5f, 4, 51.5f));
            newEntity.AddComponent(new ComponentVelocity(0.0f, 0.0f, 0.0f));
            newEntity.AddComponent(new ComponentGeometry("Geometry/Moon/moon.obj"));
            newEntity.AddComponent(new ComponentSphereCollider(2.0f));
            //audioComponent.Play();
            nodes = BuildPatrolNetwork2();
            newEntity.AddComponent(new ComponentTraveller(nodes, BuildPatrolNetwork1Neighbours(nodes)));

            entityManager.AddEntity(newEntity);


            newEntity = new Entity("Skybox");
            newEntity.AddComponent(new ComponentPosition(camera.cameraPosition));
            newEntity.AddComponent(new ComponentGeometry("Geometry/Skybox/skybox.obj"));
            newEntity.AddComponent(new ComponentSkybox());
            entityManager.AddEntity(newEntity);


            newEntity = new Entity("MazeOuterCollisionBox");
            Vector2[] mazePointsOuterWall = new Vector2[] 
            {
                new Vector2(-1,1),
                new Vector2(-16,1),
                new Vector2(-16,6),
                new Vector2(-41,6),
                new Vector2(-41,1),
                new Vector2(-56,1),
                new Vector2(-56,16),
                new Vector2(-51,16),
                new Vector2(-51,41),
                new Vector2(-56,41),
                new Vector2(-56,56),
                new Vector2(-41,56),
                new Vector2(-41,51),
                new Vector2(-16,51),
                new Vector2(-16,56),
                new Vector2(-1,56),
                new Vector2(-1,41),
                new Vector2(-6,41),
                new Vector2(-6,16),
                new Vector2(-1,16)//add another 1,1 vector to check against first?
            };
            newEntity.AddComponent(new ComponentLineCollider(mazePointsOuterWall));
            entityManager.AddEntity(newEntity);

            newEntity = new Entity("MazeInnerCollisionBoxTopLeft");
            Vector2[] mazeInnerWallTopLeft = new Vector2[]
            {
                new Vector2(-11,16),
                new Vector2(-16,16),
                new Vector2(-16,11),
                new Vector2(-26,11),
                new Vector2(-26,21),
                new Vector2(-21,21),
                new Vector2(-21,26),
                new Vector2(-11,26)//be sure to check last against first
            };
            newEntity.AddComponent(new ComponentLineCollider(mazeInnerWallTopLeft));
            entityManager.AddEntity(newEntity);

            newEntity = new Entity("MazeInnerCollisionBoxTopRight");
            Vector2[] mazeInnerWallTopRight = new Vector2[]
            {
                new Vector2(-11,31),
                new Vector2(-21,31),
                new Vector2(-21,36),
                new Vector2(-26,36),
                new Vector2(-26,46),
                new Vector2(-16,46),
                new Vector2(-16,41),
                new Vector2(-11,41)//be sure to check last against first
            };
            newEntity.AddComponent(new ComponentLineCollider(mazeInnerWallTopRight));
            entityManager.AddEntity(newEntity);

            newEntity = new Entity("MazeInnerCollisionBoxBottomLeft");
            Vector2[] mazeInnerWallBottomLeft = new Vector2[]
            {
                new Vector2(-31,11),
                new Vector2(-41,11),
                new Vector2(-41,16),
                new Vector2(-46,16),
                new Vector2(-46,26),
                new Vector2(-36,26),
                new Vector2(-36,21),
                new Vector2(-31,21)//be sure to check last against first
            };
            newEntity.AddComponent(new ComponentLineCollider(mazeInnerWallBottomLeft));
            entityManager.AddEntity(newEntity);

            newEntity = new Entity("MazeInnerCollisionBoxBottomRight");
            Vector2[] mazeInnerWallBottomRight = new Vector2[]
            {
                new Vector2(-36,31),
                new Vector2(-46,31),
                new Vector2(-46,41),
                new Vector2(-41,41),
                new Vector2(-41,46),
                new Vector2(-31,46),
                new Vector2(-31,36),
                new Vector2(-36,36)//be sure to check last against first
            };
            newEntity.AddComponent(new ComponentLineCollider(mazeInnerWallBottomRight));
            entityManager.AddEntity(newEntity);


        }

        private void CreateSystems()
        {
            ISystem newSystem;

            newSystem = new SystemRender();
            systemManager.AddSystem(newSystem);
            //adding the physics
            newSystem = new SystemPhysics();
            systemManager.AddSystem(newSystem);
            //adding the audio
            newSystem = new SystemAudio();
            systemManager.AddSystem(newSystem);

            //Adding the collision system(s)
            newSystem = new SystemCameraSphereCollision(ref camera);
            systemManager.AddSystem(newSystem);

            newSystem = new SystemCameraLineCollision(ref camera);
            systemManager.AddSystem(newSystem);

            newSystem = new SystemSkybox(ref camera);
            systemManager.AddSystem(newSystem);

            newSystem = new SystemBumpRender();
            systemManager.AddSystem(newSystem);

            newSystem = new SystemEnemyNodeTraversal(ref camera);
            systemManager.AddSystem(newSystem);

            newSystem = new SystemPatrolNodeTraversal(ref camera);
            systemManager.AddSystem(newSystem);
        }

        private Vector3[] BuildEnemyNetwork()
        {
            Vector3[] nodePositions =
            {
                new Vector3(-8.5f,2, 16),
                new Vector3(-16f,2, 8.5f),
                new Vector3(-28.5f,2, 8.5f),
                new Vector3(-41,2, 8.5f),
                new Vector3(-48.5f,2, 16),
                new Vector3(-48.5f,2, 28.5f),
                new Vector3(-48.5f,2, 41),
                new Vector3(-41,2, 48.5f),
                new Vector3(-28.5f,2, 48.5f),
                new Vector3(-16,2, 48.5f),
                new Vector3(-8.5f,2, 41),
                new Vector3(-8.5f,2, 28.5f),
                new Vector3(-21f,2, 28.5f),
                new Vector3(-28.5f,2, 36),
                new Vector3(-36,2, 28.5f),
                new Vector3(-28.5f,2, 21),
                new Vector3(-28.5f,2, 28.5f)
            };
            return nodePositions;
        }
        private Dictionary<Vector3, Vector3[]> BuildEnemyNetworkNeighbours(Vector3[] nodePositions) //unique to the game, so some set values for declarations are used
        {
            Dictionary<Vector3, Vector3[]> neighbours = new Dictionary<Vector3, Vector3[]>();

            //rigid and not very eloquent, could probably change later
            //A
            List<Vector3> nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[1]);
            nodeNeighbours.Add(nodePositions[11]);
            neighbours.Add(nodePositions[0], nodeNeighbours.ToArray());
            //B
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[0]);
            nodeNeighbours.Add(nodePositions[2]);
            neighbours.Add(nodePositions[1], nodeNeighbours.ToArray());
            //C
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[1]);
            nodeNeighbours.Add(nodePositions[3]);
            nodeNeighbours.Add(nodePositions[15]);
            neighbours.Add(nodePositions[2], nodeNeighbours.ToArray());
            //D
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[2]);
            nodeNeighbours.Add(nodePositions[4]);
            neighbours.Add(nodePositions[3], nodeNeighbours.ToArray());
            //E
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[3]);
            nodeNeighbours.Add(nodePositions[5]);
            neighbours.Add(nodePositions[4], nodeNeighbours.ToArray());
            //F
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[4]);
            nodeNeighbours.Add(nodePositions[6]);
            nodeNeighbours.Add(nodePositions[14]);
            neighbours.Add(nodePositions[5], nodeNeighbours.ToArray());
            //G
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[5]);
            nodeNeighbours.Add(nodePositions[7]);
            neighbours.Add(nodePositions[6], nodeNeighbours.ToArray());
            //H
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[6]);
            nodeNeighbours.Add(nodePositions[8]);
            neighbours.Add(nodePositions[7], nodeNeighbours.ToArray());
            //I
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[7]);
            nodeNeighbours.Add(nodePositions[9]);
            nodeNeighbours.Add(nodePositions[13]);
            neighbours.Add(nodePositions[8], nodeNeighbours.ToArray());
            //J
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[8]);
            nodeNeighbours.Add(nodePositions[10]);
            neighbours.Add(nodePositions[9], nodeNeighbours.ToArray());
            //K
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[9]);
            nodeNeighbours.Add(nodePositions[11]);
            neighbours.Add(nodePositions[10], nodeNeighbours.ToArray());
            //L
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[0]);
            nodeNeighbours.Add(nodePositions[10]);
            nodeNeighbours.Add(nodePositions[12]);
            neighbours.Add(nodePositions[11], nodeNeighbours.ToArray());
            //M
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[11]);
            nodeNeighbours.Add(nodePositions[13]);
            nodeNeighbours.Add(nodePositions[14]);
            nodeNeighbours.Add(nodePositions[15]);
            neighbours.Add(nodePositions[12], nodeNeighbours.ToArray());
            //N
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[8]);
            nodeNeighbours.Add(nodePositions[12]);
            nodeNeighbours.Add(nodePositions[14]);
            nodeNeighbours.Add(nodePositions[15]);
            neighbours.Add(nodePositions[13], nodeNeighbours.ToArray());
            //O
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[5]);
            nodeNeighbours.Add(nodePositions[12]);
            nodeNeighbours.Add(nodePositions[13]);
            nodeNeighbours.Add(nodePositions[15]);
            neighbours.Add(nodePositions[14], nodeNeighbours.ToArray());
            //P
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[2]);
            nodeNeighbours.Add(nodePositions[12]);
            nodeNeighbours.Add(nodePositions[13]);
            nodeNeighbours.Add(nodePositions[14]);
            neighbours.Add(nodePositions[15], nodeNeighbours.ToArray());
            //center
            nodeNeighbours = new List<Vector3>();
            nodeNeighbours.Add(nodePositions[12]);
            nodeNeighbours.Add(nodePositions[13]);
            nodeNeighbours.Add(nodePositions[14]);
            nodeNeighbours.Add(nodePositions[15]);
            neighbours.Add(nodePositions[16], nodeNeighbours.ToArray());

            return neighbours;
        }
        
        private Vector3[] BuildPatrolNetwork1()
        {
            Vector3[] nodePositions =
            {
                new Vector3(-3,2, 43),
                new Vector3(-13f,2, 43),
                new Vector3(-13,2, 53),
                new Vector3(-3,2, 53)
            };
            return nodePositions;
        }

        private Dictionary<Vector3, Vector3[]> BuildPatrolNetwork1Neighbours(Vector3[] nodePositions) //unique to the game, so some set values for declarations are used
        {
            Dictionary<Vector3, Vector3[]> neighbours = new Dictionary<Vector3, Vector3[]>();

            for(int i =0; i < nodePositions.Length; i++)
            {
                if(i + 1 < nodePositions.Length)//checking to see if at last index
                {
                    List<Vector3> nodeNeighbours = new List<Vector3>();
                    nodeNeighbours.Add(nodePositions[i + 1]); //want it to go in a loop, so will just go to the next node
                    neighbours.Add(nodePositions[i], nodeNeighbours.ToArray());
                }
                else
                {
                    List<Vector3> nodeNeighbours = new List<Vector3>();
                    nodeNeighbours.Add(nodePositions[0]); //want it to go in a loop, so will just go to the next node
                    neighbours.Add(nodePositions[i], nodeNeighbours.ToArray());
                }
            }

            return neighbours;
        }

        private Vector3[] BuildPatrolNetwork2()
        {
            Vector3[] nodePositions =
            {
                new Vector3(-43,2,54),
                new Vector3(-45.75f,3, 51.5f),
                new Vector3(-48.5f,2, 49),
                new Vector3(-51.25f, 3,46.5f),
                new Vector3(-54,2,44),
                new Vector3(-56.5f, 3, 46.5f),
                new Vector3(-54,4,44),
                new Vector3(-51.25f, 2,46.5f),
                new Vector3(-48.5f,4, 49),
                new Vector3(-45.75f,2, 51.5f),
                new Vector3(-43,4,54),
                new Vector3(-40.5f,4,51.5f)

            };
            return nodePositions;
        }
        /// <summary>
        /// Allows the game to run logic such as updating the world,
        /// checking for collisions, gathering input, and playing audio.
        /// </summary>
        /// <param name="e">Provides a snapshot of timing values.</param>
        public override void Update(FrameEventArgs e)
        {
            dt = (float)e.Time;
            System.Console.WriteLine("fps=" + (int)(1.0/dt));

            if (GamePad.GetState(1).Buttons.Back == ButtonState.Pressed)
                sceneManager.Exit();

            // TODO: Add your update logic here
            
            

            // NEW for Audio
            // Update OpenAL Listener Position and Orientation based on the camera
            AL.Listener(ALListener3f.Position, ref camera.cameraPosition);
            AL.Listener(ALListenerfv.Orientation, ref camera.cameraDirection, ref camera.cameraUp);

            //get collisions
            collidingEntities = ((SystemCameraSphereCollision)systemManager.GetSystem("SystemCameraSphereCollision")).GetCollidingEntities();
            collidingEntities.AddRange(((SystemCameraLineCollision)systemManager.GetSystem("SystemCameraLineCollision")).GetCollidingEntities());
            
            //process collisions
            if (collidingEntities.Count > 0)
            {
                collisionManager.ProcessCollisions(collidingEntities);
                collidingEntities.Clear();
                ((SystemCameraSphereCollision)systemManager.GetSystem("SystemCameraSphereCollision")).ClearCollidingEntities();
                ((SystemCameraLineCollision)systemManager.GetSystem("SystemCameraLineCollision")).ClearCollidingEntities();
            }

            inputManager.ResolveInputs();

            if(lives == 0) //then game over
            {
                sceneManager.ChangeScene(SceneManager.SceneTypes.SCENE_GAME_OVER);
            }
            if(keysLeft == 0 && isPortalActive == false) //Turn on Portal
            {
                isPortalActive = true;
                for(int i = 0; i < entityManager.Entities().Count; i++)
                {
                    if(entityManager.Entities()[i].Name == "Portal")
                    {
                        List<IComponent> components = entityManager.Entities()[i].Components;
                        IComponent geometryComponent = components.Find(delegate (IComponent component)
                        {
                            return component.ComponentType == ComponentTypes.COMPONENT_GEOMETRY;
                        });
                        IComponent textureComponent = components.Find(delegate (IComponent component)
                        {
                            return component.ComponentType == ComponentTypes.COMPONENT_TEXTURE;
                        });
                        int texture = ((ComponentTexture)textureComponent).Texture;

                        ((ComponentGeometry)geometryComponent).Geometry().SetTexture(texture);

                        IComponent audioComponent = components.Find(delegate (IComponent component)
                        {
                            return component.ComponentType == ComponentTypes.COMPONENT_AUDIO;
                        });
                        ((ComponentAudio)audioComponent).Stop();

                        int index = components.FindIndex(delegate (IComponent component)
                        {
                            return component.ComponentType == ComponentTypes.COMPONENT_AUDIO;
                        });
                        ((ComponentAudio)audioComponent).Stop();

                        //entityManager.Entities()[i].Components.RemoveAt(index);

                        //ComponentAudio PortalAudioComponent = new ComponentAudio("Audio/portal_on.wav", -1.0f, 2.0f, 7.5f);
                        //PortalAudioComponent.Play();
                        //entityManager.Entities()[i].AddComponent(PortalAudioComponent);

                        ((ComponentAudio)audioComponent).LoadNewAudio("Audio/portal_on.wav");
                        ((ComponentAudio)audioComponent).Play();

                    }
                }
                
            }
        }

        /// <summary>
        /// This is called when the game should draw itself.
        /// </summary>
        /// <param name="e">Provides a snapshot of timing values.</param>
        public override void Render(FrameEventArgs e)
        {
            GL.Viewport(0, 0, sceneManager.Width, sceneManager.Height);
            GL.Clear(ClearBufferMask.ColorBufferBit | ClearBufferMask.DepthBufferBit);

            // Action ALL systems
            systemManager.ActionSystems(entityManager, canDroneMove, canPlayerCollide);

            // Render score
            float width = sceneManager.Width, height = sceneManager.Height, fontSize = Math.Min(width, height) / 10f;
            GUI.clearColour = Color.Transparent;
            GUI.Label(new Rectangle(0, 0, (int)width, (int)(fontSize * 2f)), "Keys Left: " + keysLeft.ToString(), 18, StringAlignment.Near, Color.White);
            GUI.Label(new Rectangle(0, 20, (int)width, (int)(fontSize * 2f)), "Lives: " + lives.ToString(), 18, StringAlignment.Near, Color.White);

            GUI.Render();
        }

        public void ResetDrone()
        {
            for (int i = 0; i < entityManager.Entities().Count; i++)
            {
                if (entityManager.Entities()[i].Name.Contains("Enemy"))
                {
                    List<IComponent> components = entityManager.Entities()[i].Components;
                    IComponent positionComponent = components.Find(delegate (IComponent component)
                    {
                        return component.ComponentType == ComponentTypes.COMPONENT_POSITION;
                    });
                    ((ComponentPosition)positionComponent).Position = new Vector3(-28.5f, 2.0f, 28.5f);

                    IComponent travellerComponent = components.Find(delegate (IComponent component)
                    {
                        return component.ComponentType == ComponentTypes.COMPONENT_TRAVELLER;
                    });

                    ((ComponentTraveller)travellerComponent).Destination = new Vector3(-28.5f, 2.0f, 28.5f);
                }
            }
        }

        public void RemoveEntity(string pEntityName)
        {
            entityManager.RemoveEntity(pEntityName);
        }

        public void TurnOffEnemyMovement()
        {
            canDroneMove = !canDroneMove;
        }

        public void TurnOffWallCollisions()
        {
            canPlayerCollide = !canPlayerCollide;
        }


        public void DoWin()
        {
            sceneManager.ChangeScene(SceneManager.SceneTypes.SCENE_GAME_WIN);
        }

        /// <summary>
        /// This is called when the game exits.
        /// </summary>
        public override void Close()
        {
            sceneManager.keyboardDownDelegate -= Keyboard_KeyDown;
            sceneManager.keyboardUpDelegate -= Keyboard_KeyUp;
            ResourceManager.RemoveAllAssets();
            entityManager.Close();
        }

        public void Keyboard_KeyDown(KeyboardKeyEventArgs e)
        {
            //send input to input manager if it is related to the camera
            if(e.Key == Key.Number1)
            {
                TurnOffEnemyMovement();
            }
            else if(e.Key == Key.Number2)
            {
                TurnOffWallCollisions();
            }
            else
            {
                inputManager.AddToCurrentInputs((char)e.Key);
            }
            
            //keysPressed[(char)e.Key] = true;
        }

        public void Keyboard_KeyUp(KeyboardKeyEventArgs e)
        {
            //input manager do something
            inputManager.RemoveFromCurrentInputs((char)e.Key);
            //keysPressed[(char)e.Key] = false;
        }

        
        
    }
}
