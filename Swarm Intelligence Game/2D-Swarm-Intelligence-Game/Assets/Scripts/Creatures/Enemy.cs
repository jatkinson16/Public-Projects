using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class Enemy : Creature
{
    private Rigidbody2D m_rgb2d;

    private Transform m_playerTransform;

    private Vector2 m_InitialPosition;

    //Need to specify as system random since unity has its own random function
    private System.Random r = new System.Random();

    [SerializeField] private Transform EnemyBody;

    [SerializeField] private float ViewDistance = 3;

    [SerializeField] private float WallAvoidDistance = 3;

    [SerializeField] private float GroupingDistance = 10;

    [SerializeField] private float CohesionDistance = 40;

    [SerializeField] private float BalancingForce = 0.5f; //used to determine how close an ally can be before moving away

    [SerializeField] private float AttackPlayerDistance = 9;

    private float m_targetDistance;

    private int m_numberOfKeys;

    private bool m_isTargetOnDistance;


    //private List<Enemy> m_listOfNearbyAllies = new List<Enemy>();

    
    

    public override void SetupOnStart(GameManager mngr)
    {
        m_gameManager = mngr;
        base.SetupOnStart(m_gameManager);

        m_InitialPosition = m_rgb2d.transform.position;

        m_playerTransform = m_gameManager.Player.transform;
        m_numberOfKeys = m_gameManager.Player.KeyCount;
        
        //float i = r.Next(-100, 101);

        m_Direction = new Vector2(r.Next(-100, 101), r.Next(-100, 101));//randomise direction
        m_Direction.Normalize();//normalise the direction
        

        m_speedMoving = 250f;

        m_speedRotating = 5f;
    }

    protected override void Awake()
    {
        base.Awake();

        m_rgb2d = GetComponent<Rigidbody2D>();

        MachineGun weapon = new MachineGun(this, "bulletMachineGun", BulletStartPosition);
        SetWeapon(weapon);
    }

    protected override void Update()
    {
        base.Update();

        

        if (!m_gameManager.IsGameStarted) return;

        //Rule 1: avoid collisions, if approaching a wall, obstacle or player, turn away from it

        Vector2 allignToAllies = GetAverageDirection();
        Vector2 avoidAlliesDirection = GetAvoidAlliesDirection();
        Vector2 obstacleAvoidDirection = GetAvoidObstacles();
        Vector2 cohesionDirection = GetCohesion();
        Vector2 playerAttackDirection = GetPlayerAttackDirection();
        
        
        if(playerAttackDirection.magnitude == 0)
        {
            m_Direction = obstacleAvoidDirection; //set the direction to prioritise avoiding obstacles
            m_Direction += allignToAllies;
            m_Direction += avoidAlliesDirection;
            
            m_Direction += cohesionDirection;
        }
        else
        {
            //m_Direction = obstacleAvoidDirection;
            m_Direction = playerAttackDirection;
            m_Direction += obstacleAvoidDirection;
            m_Direction += allignToAllies;
            m_Direction += avoidAlliesDirection;

            m_Direction += cohesionDirection;
        }

        


        if (m_Direction.magnitude == 0) //There may be calculations that result in the direction becoming 0. If that is the case, just reset it
        {
            m_Direction = new Vector2(r.Next(-100, 101), r.Next(-100, 101));//randomise direction
            m_Direction.Normalize();//normalise the direction
        }

        //rotate to new direction
        float angle = Mathf.Atan2(m_Direction.y, m_Direction.x) * Mathf.Rad2Deg;
        Quaternion targetRotation = Quaternion.AngleAxis(angle, Vector3.forward);
        EnemyBody.rotation = Quaternion.Slerp(EnemyBody.rotation, targetRotation, Time.deltaTime * m_speedRotating);

        ////Original code, moves to player if they are within range, basic enemy ai
        ///
        //m_isTargetOnDistance = false;
        //m_targetDistance = Vector2.Distance(m_playerTransform.position, this.transform.position);
        //if (m_targetDistance < ViewDistance)
        //{
        //    LayerMask mask = LayerMask.GetMask("Default");
        //    RaycastHit2D hit = Physics2D.Linecast(m_playerTransform.position, this.transform.position, mask);
        //    if (hit.collider == null)
        //    {
        //        m_isTargetOnDistance = true;
        //    }
        //}

        //if (m_isTargetOnDistance)
        //{
        //    m_targetDirection = m_playerTransform.position - transform.position;
        //    float angle = Mathf.Atan2(m_targetDirection.y, m_targetDirection.x) * Mathf.Rad2Deg;
        //    Quaternion targetRotation = Quaternion.AngleAxis(angle, Vector3.forward);
        //    EnemyBody.rotation = Quaternion.Slerp(EnemyBody.rotation, targetRotation, Time.deltaTime * m_speedRotating);
        //}

    }

    public Vector2 GetAverageDirection()
    {
        Vector2 avgDirection = new Vector2(0, 0);
        foreach (Enemy e in m_gameManager.m_enemy_list)
        {
            float dist = Vector2.Distance(transform.position, e.transform.position);
            if ((dist > 0) && (dist < GroupingDistance))
            {
                Vector2 diff = transform.position - e.transform.position;
                diff.Normalize();
                diff = diff / dist; //use distance to weight how large the resultant vector is(a smaller dist = bigger affect)
                avgDirection = avgDirection + diff;
            }
        }
        return avgDirection;
    }

    public Vector2 GetAvoidAlliesDirection()
    {
        Vector2 avoidAlliesDirection = new Vector2(0, 0);
        foreach (Enemy e in m_gameManager.m_enemy_list)
        {
            float dist = Vector2.Distance(transform.position, e.transform.position);
            if ((dist > 0) && (dist < BalancingForce))
            {
                Vector2 diff = transform.position - e.transform.position;
                diff.Normalize();
                diff = diff / dist; //use distance to weight how large the resultant vector is(a smaller dist = bigger affect)
                avoidAlliesDirection = avoidAlliesDirection + diff;
            }
        }

        return avoidAlliesDirection;

    }

    public Vector2 GetAvoidObstacles()
    {
        //Use raycasting to tell whether it is close to a wall or not
        LayerMask mask = LayerMask.GetMask("Default");

        m_Direction.Normalize();
        float xRotated = (m_Direction.x * Mathf.Cos(Mathf.PI / 2)) - (m_Direction.y * Mathf.Sin(Mathf.PI / 2));
        float yRotated = (m_Direction.x * Mathf.Sin(Mathf.PI / 2)) - (m_Direction.y * Mathf.Cos(Mathf.PI / 2));
        Vector2 rotatedDirection1 = new Vector2(xRotated, yRotated);
        rotatedDirection1.Normalize();

        Vector2 rotatedDirection2 = rotatedDirection1 * -1;
        rotatedDirection2.Normalize();

        RaycastHit2D frontHit = Physics2D.Raycast(transform.position, m_Direction, WallAvoidDistance, mask);
        RaycastHit2D RightHit = Physics2D.Raycast(transform.position, rotatedDirection1, WallAvoidDistance + 0.5f, mask);
        RaycastHit2D LeftHit = Physics2D.Raycast(transform.position, rotatedDirection2, WallAvoidDistance + 0.5f, mask);

        Vector2 avoidDirection = new Vector2(0, 0);
        if (frontHit.collider != null)//if != null, then wall is within range, and must avoid
        {
            avoidDirection = m_Direction * new Vector2(-1, -1);//randomise direction
            avoidDirection.Normalize();//normalise the direction
        }
        else if (RightHit.collider != null)//if != null, then wall is within range, and must avoid
        {
            //Then turn in a different direction
            float a = r.Next(-80, -10);
            Vector2 rotate = Rotate(a, m_Direction);
            avoidDirection = rotate;
        }
        else if (LeftHit.collider != null)//if != null, then wall is within range, and must avoid
        {
            //Then turn in a different direction
            float a = r.Next(10, 80);
            Vector2 rotate = Rotate(a, m_Direction);
            avoidDirection = rotate;
        }
        else if (m_gameManager.Player.KeyCount == 0 && (Vector2.Distance(m_playerTransform.position, m_rgb2d.transform.position) < ViewDistance))//then player is in range, avoid too if no keys have been aquired
        {
            //find the vector between, then uses that to see where the player is in relation to the entity
            Vector2 vectorBetween = new Vector2(m_rgb2d.transform.position.x - m_playerTransform.position.x, (m_rgb2d.transform.position.y - m_playerTransform.position.y));
            vectorBetween.Normalize();
            m_Direction.Normalize();

            avoidDirection = m_Direction + vectorBetween;
        }
        return avoidDirection;
    }

    public Vector2 GetPlayerAttackDirection()
    {
        Vector2 playerAttackDirection = new Vector2(0, 0);
        float playerDist = Vector2.Distance(m_playerTransform.position, m_rgb2d.transform.position);
        if (m_gameManager.Player.KeyCount > 0 && (playerDist < AttackPlayerDistance))//then attack the player
        {
            //playerAttackDirection = m_playerTransform.position - transform.position;
            AttackPlayerDistance = 3 + (m_gameManager.Player.KeyCount *4) ;
            //m_speedMoving = 150f + ((m_gameManager.Player.KeyCount + 1) * 20);

            Vector2 diff = m_playerTransform.position - transform.position;
            diff.Normalize();
            diff = diff / playerDist; //use distance from player to weight how large the resultant vector is(a smaller dist = bigger affect), so it can avoid walls too
            playerAttackDirection = playerAttackDirection + diff;

        }
        
        return playerAttackDirection;
    }

    public Vector2 GetCohesion()
    {
        Vector2 avgPosition = new Vector2(0, 0);
        int count = 0;
        foreach (Enemy e in m_gameManager.m_enemy_list)
        {
            float dist = Vector2.Distance(transform.position, e.transform.position);
            if ((dist > 0) && (dist < CohesionDistance))
            {
                avgPosition = avgPosition + new Vector2(e.transform.position.x, e.transform.position.y);
                count++;
            }
        }
        if(count > 0)
        {
            avgPosition = avgPosition / count;
            Vector2 newPos = avgPosition - new Vector2(transform.position.x, transform.position.y);
            return Vector2.ClampMagnitude(newPos, 0.05f);
        }
        else
        {
            return new Vector2(0, 0);
        }
    }

    private void FixedUpdate()
    {
        if (!m_gameManager.IsGameStarted) return;

        m_rgb2d.velocity = EnemyBody.right * m_speedMoving * Time.deltaTime;

        //if (m_isTargetOnDistance && m_targetDistance > 1f)
        //{
        //    m_rgb2d.velocity = EnemyBody.right * m_speedMoving * Time.deltaTime;
        //}
        //else
        //{
        //    m_rgb2d.velocity = Vector2.zero;
        //}
    }

    private void Respawn()
    {
        Health = HealthMax;
        m_rgb2d.transform.position = m_InitialPosition;
    }

    protected override void CheckShoot()
    {
        //if (m_isTargetOnDistance && m_targetDistance < GroupingDistance)
        //{
        //    DoShoot();
        //}
    }

    protected override void DoKill()
    {
        GameObject asset = Resources.Load<GameObject>("EnemyExplosionDeath");
        GameObject go = Instantiate(asset);

        go.transform.position = this.transform.position;

        //this.gameObject.SetActive(false);
        Respawn();
    }

}
