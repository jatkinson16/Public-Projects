using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MachineGun : WeaponBase
{
    private float m_fireRate = 0.5f;

    private float m_timePause = 1f;

    private float m_timeCurrent;

    private float m_timeStart;

    public MachineGun(Creature creature, string bulletPrefabPath, Transform bulletStartPosition) : base(creature, bulletPrefabPath, bulletStartPosition)
    {
    }

    internal override void Shoot()
    {
        if(Time.time - m_timeStart > m_timePause)
        {
            m_timeStart = Time.time;
            m_timeCurrent = 0f;
        }

        m_timeCurrent += Time.deltaTime;

        if (m_timeCurrent >= m_fireRate)
        {
            m_timeStart = Time.time;
            m_timeCurrent = 0f;

            GameObject go = GameObject.Instantiate(m_bulletPrefab);
            go.transform.position = m_bulletStartPosition.position;
            go.transform.rotation = m_bulletStartPosition.rotation;

            Bullet bullet = go.GetComponent<Bullet>();
            bullet.Setup(m_creature);
        }
    }
}
