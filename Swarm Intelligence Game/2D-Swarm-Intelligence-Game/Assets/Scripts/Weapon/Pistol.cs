using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Pistol : WeaponBase
{
    public Pistol(Creature creature, string bulletPrefabPath, Transform bulletStartPosition) : base(creature, bulletPrefabPath, bulletStartPosition)
    {
    }

    internal override void Shoot()
    {
        GameObject go = GameObject.Instantiate(m_bulletPrefab);
        go.transform.position = m_bulletStartPosition.position;
        go.transform.rotation = m_bulletStartPosition.rotation;

        Bullet bullet = go.GetComponent<Bullet>();
        bullet.Setup(m_creature);
    }
}
