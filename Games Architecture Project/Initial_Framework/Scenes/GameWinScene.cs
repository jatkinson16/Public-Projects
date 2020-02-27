using System;
using OpenTK;
using OpenTK.Graphics.OpenGL;
using System.Drawing;
using OpenTK.Input;
using OpenGL_Game.Managers;

namespace OpenGL_Game.Scenes
{
    class GameWinScene : Scene
    {
        public GameWinScene(SceneManager sceneManager) : base(sceneManager)
        {
            // Set the title of the window
            sceneManager.Title = "Game Win";
            // Set the Render and Update delegates to the Update and Render methods of this class
            sceneManager.renderer = Render;
            sceneManager.updater = Update;

            sceneManager.mouseDelegate += Mouse_BottonPressed;
            sceneManager.keyboardDownDelegate += Keyboard_KeyDown;
        }

        public override void Update(FrameEventArgs e)
        {
        }

        public override void Render(FrameEventArgs e)
        {
            GL.Viewport(0, 0, sceneManager.Width, sceneManager.Height);
            GL.Clear(ClearBufferMask.ColorBufferBit | ClearBufferMask.DepthBufferBit);

            GL.MatrixMode(MatrixMode.Projection);
            GL.LoadIdentity();
            GL.Ortho(0, sceneManager.Width, 0, sceneManager.Height, -1, 1);

            GUI.clearColour = Color.CornflowerBlue;

            //Display the text
            float width = sceneManager.Width, height = sceneManager.Height, fontSize = Math.Min(width, height) / 10f;
            //GUI.Label(new Rectangle(100, (int)(fontSize / 2f), (int)width, (int)(fontSize * 2f)), "You Win!", (int)fontSize, StringAlignment.Center);
            GUI.Label(new Rectangle(0, (int)(fontSize / 2f) + 100, (int)width, (int)(fontSize * 2f)), new Bitmap("Textures/Menu/game_win.jpg"));
            GUI.Render();
        }

        public void Mouse_BottonPressed(MouseButtonEventArgs e)
        {
            switch (e.Button)
            {
                default:
                    sceneManager.ChangeScene(SceneManager.SceneTypes.SCENE_MAIN_MENU);
                    //sceneManager.StartNewGame();
                    break;
            }
        }

        public void Keyboard_KeyDown(KeyboardKeyEventArgs e)
        {
            switch (e.Key)
            {
                default:
                    sceneManager.ChangeScene(SceneManager.SceneTypes.SCENE_MAIN_MENU);
                    //sceneManager.StartNewGame();
                    break;
            }
        }

        public override void Close()
        {
            GL.Clear(ClearBufferMask.ColorBufferBit | ClearBufferMask.DepthBufferBit);
            sceneManager.mouseDelegate -= Mouse_BottonPressed;
            sceneManager.keyboardDownDelegate -= Keyboard_KeyDown;
        }
    }
}
