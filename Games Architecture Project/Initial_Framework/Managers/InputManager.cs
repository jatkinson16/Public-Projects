using OpenGL_Game.Scenes;
using OpenTK.Input;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenGL_Game.Managers
{
    class InputManager
    {
        Camera mCamera;
        bool[] mKeysPressed;
        public InputManager(ref Camera pCamera)
        {
            mCamera = pCamera;
            mKeysPressed = new bool[255];
        }

        public void ResolveInputs()
        {
            if (mKeysPressed[(char)Key.Up] || mKeysPressed[(char)Key.W])
            {
                mCamera.MoveForward(0.1f);
            }
            if (mKeysPressed[(char)Key.Down] || mKeysPressed[(char)Key.S])
            {
                mCamera.MoveForward(-0.1f);
            }
            if (mKeysPressed[(char)Key.Right] || mKeysPressed[(char)Key.D])
            {
                mCamera.RotateY(0.05f);
            }
            if (mKeysPressed[(char)Key.Left] || mKeysPressed[(char)Key.A])
            {
                mCamera.RotateY(-0.05f);
            }
        }

        

        public void AddToCurrentInputs(char e)
        {
            mKeysPressed[e] = true;
        }

        public void RemoveFromCurrentInputs(char e)
        {
            mKeysPressed[e] = false;
        }

    }
}
