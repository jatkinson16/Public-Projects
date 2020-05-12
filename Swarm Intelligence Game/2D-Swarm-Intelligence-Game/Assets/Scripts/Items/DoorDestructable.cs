using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DoorDestructable : Item, IDamagable
{
    public void DoDamage(float dmg)
    {
        Hide();
    }
}
