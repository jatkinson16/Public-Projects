using OpenGL_Game.Managers;
using OpenTK;
// NEW for Audio
using System.IO;
using OpenTK.Audio.OpenAL;

namespace OpenGL_Game.Components
{
    class ComponentAudio : IComponent
    {
        Vector3 sourcePosition;
        int audioSource;
        int audio; //the audio buffer
        bool isPlaying;

        public ComponentAudio(string audioName, Vector3 pSourcePosition)
        {
            //sourcePosition = pSourcePosition;
            isPlaying = false;
            audioSource = AL.GenSource();
            audio = ResourceManager.LoadAudio(audioName);
            SetPosition(pSourcePosition);
        }

        public ComponentAudio(string audioName, float x, float y, float z)
        {
            //sourcePosition = new Vector3(x, y, z);
            isPlaying = false;
            audioSource = AL.GenSource();
            audio = ResourceManager.LoadAudio(audioName);
            SetPosition(new Vector3(x, y, z));
        }


        public void LoadNewAudio(string audioName)
        {
            audioSource = AL.GenSource();
            audio = ResourceManager.LoadAudio(audioName);
            SetPosition(sourcePosition);
        }

        public int Audio
        {
            get { return audio; }
        }

        public void SetPosition(Vector3 emitterPosition)
        {
            sourcePosition = emitterPosition;
            AL.Source(audioSource, ALSource3f.Position, ref sourcePosition);
        }

        public void Play()
        {
            if (!isPlaying)
            {
                isPlaying = true;
                AL.Source(audioSource, ALSourcei.Buffer, audio); // attach the buffer to a source
                AL.Source(audioSource, ALSourceb.Looping, true); // source loops infinitely
                AL.SourcePlay(audioSource); // play the audio source
            }

        }

        public void PlayOnce()
        {
            AL.Source(audioSource, ALSourcei.Buffer, audio); // attach the buffer to a source
            AL.SourcePlay(audioSource); // play the audio source
        }

        public void Stop()
        {
            isPlaying = false;
            AL.SourcePause(audioSource);
        }

        public void Close()
        {
            AL.SourceStop(audioSource);
            AL.DeleteSource(audioSource);
        }

        public ComponentTypes ComponentType
        {
            get { return ComponentTypes.COMPONENT_AUDIO; }
        }
    }
}
