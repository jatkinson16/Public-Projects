using System;
using System.Collections.Generic;
using UnityEngine;

public class WeaponBase
{
    protected GameObject m_bulletPrefab;

    protected Transform m_bulletStartPosition;

    protected Creature m_creature;

    public WeaponBase(Creature creature, string bulletPrefabPath, Transform bulletStartPosition)
    {
        m_bulletPrefab = Resources.Load<GameObject>(bulletPrefabPath);

        m_bulletStartPosition = bulletStartPosition;

        m_creature = creature;
    }

    internal virtual void Shoot() { }

}
