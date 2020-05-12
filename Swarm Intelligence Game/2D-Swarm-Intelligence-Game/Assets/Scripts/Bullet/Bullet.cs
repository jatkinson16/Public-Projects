using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bullet : MonoBehaviour
{
    [SerializeField] private float Speed = 10f;

    [SerializeField] private float Damage = 34f;

    private Animator m_anim;

    private Creature m_owner;

    private bool m_isMoving;

    private float m_ownerSpeed;

    internal void Setup(Creature creature)
    {
        m_owner = creature;
        m_isMoving = true;

        Rigidbody2D rbcr = creature.GetComponent<Rigidbody2D>();

        m_ownerSpeed = rbcr.velocity.magnitude;
    }

    private void Awake()
    {
        m_anim = GetComponentInChildren<Animator>();
        m_anim.Play("Idle");
    }

    void Update()
    {
        if (!m_isMoving) return;

        DoMove();
    }

    private void DoMove()
    {
        transform.Translate(Vector3.right * Time.deltaTime * (Speed + m_ownerSpeed));
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.tag.Equals("bullet")) return;

        m_isMoving = false;

        IDamagable damagable = collision.GetComponent<IDamagable>();
        if (damagable != null)
        {
            Creature creature = damagable as Creature;
            if (creature != null && creature == m_owner)
            {
                m_isMoving = true;
                return;
            }

            damagable.DoDamage(100);
        }

        DoDestroy();
    }

    private void DoDestroy()
    {
        m_anim.Play("Impact");
        Destroy(gameObject, 0.5f);
    }
}
