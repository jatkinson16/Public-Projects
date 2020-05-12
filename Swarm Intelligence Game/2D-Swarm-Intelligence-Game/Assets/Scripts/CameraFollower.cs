using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraFollower : MonoBehaviour
{
    [SerializeField] private Transform Player;

    void LateUpdate()
    {
        if (Player == null) return;

        this.transform.position = new Vector3(Player.position.x, Player.position.y, this.transform.position.z);
    }
}
