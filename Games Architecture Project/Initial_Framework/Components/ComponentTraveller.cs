using OpenTK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenGL_Game.Components
{
    class ComponentTraveller : IComponent
    {
        
        Vector3 mCurrentDestination;
        Vector3[] mNodes;
        Dictionary<Vector3, Vector3[]> mNeighbourList;

        public ComponentTraveller(Vector3[] pNodes, Dictionary<Vector3, Vector3[]> pNeighbourList)
        {
            mNodes = pNodes;
            mNeighbourList = pNeighbourList;
            mCurrentDestination = mNodes[mNodes.Length-1];
        }

        public Vector3[] Nodes
        {
            get { return mNodes; }
            set { mNodes = value; }
        }

        public Dictionary<Vector3, Vector3[]> Neighbours
        {
            get { return mNeighbourList; }
            set { mNeighbourList = value; }
        }


        public Vector3 Destination
        {
            get { return mCurrentDestination; }
            set { mCurrentDestination = value; }
        }

        public ComponentTypes ComponentType
        {
            get { return ComponentTypes.COMPONENT_TRAVELLER; }
        }

        public void Close()
        {

        }
    }
}
