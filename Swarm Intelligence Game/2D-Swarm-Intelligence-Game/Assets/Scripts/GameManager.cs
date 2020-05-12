using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

public class GameManager : MonoBehaviour
{
    public bool IsGameStarted { get; private set; }

    public Player Player { get; private set; }

    public Enemy[] m_enemy_list { get; private set; }

    private Creature[] m_creatureList;

    private TilemapCollider2D tilemap;

    public int currentLevel;

    public UIMenu m_menu;
    private void Awake()
    {

        Player p;
        GameObject.FindGameObjectWithTag("Player").TryGetComponent<Player>(out p);
        this.Player = p;
        currentLevel = 1;
        SceneManager.LoadSceneAsync(currentLevel, LoadSceneMode.Additive);


        IsGameStarted = true;
    }

    void Start()
    {

        m_creatureList = FindObjectsOfType<Creature>();
        m_enemy_list = FindObjectsOfType<Enemy>();

        tilemap = GetComponent<TilemapCollider2D>();

        m_menu = FindObjectOfType<UIMenu>();

        //tilemap = GetComponent<TilemapCollider2D>();
        foreach (var creature in m_creatureList)
        {
            creature.SetupOnStart(this);
        }

        m_menu.SetupOnStart(this);

        m_menu.StartGame();
    }

    private void OnEnable()
    {
        SceneManager.sceneLoaded += OnLevelChange;
    }

    private void OnDisable()
    {
        SceneManager.sceneLoaded -= OnLevelChange;
    }

    private void OnLevelChange(Scene scene, LoadSceneMode mode)
    {
        IsGameStarted = true;
        m_creatureList = FindObjectsOfType<Creature>();
        m_enemy_list = FindObjectsOfType<Enemy>();

        tilemap = GetComponent<TilemapCollider2D>();

        m_menu = FindObjectOfType<UIMenu>();

        GameObject start = GameObject.FindGameObjectWithTag("start");
        Player.Reset(start.transform.position);

        foreach (var creature in m_creatureList)
        {
            creature.SetupOnStart(this);
        }

        if(m_menu != null)
        {
            m_menu.SetupOnStart(this);

            m_menu.StartGame();
        }
        
    }

    internal void Replay()
    {
        IsGameStarted = true;
        SceneManager.UnloadSceneAsync(currentLevel);
        SceneManager.LoadSceneAsync(currentLevel, LoadSceneMode.Additive);

    }

    internal void GameOver()
    {
        IsGameStarted = false;

        m_menu.GameOver();
    }

    public void NextLevel()
    {    
        SceneManager.UnloadSceneAsync(currentLevel);

        if(currentLevel >= 3)
        {
            currentLevel = 1;
        }
        else
        {
            currentLevel++;
        }

        if (SceneManager.sceneCountInBuildSettings > currentLevel)
        {
            SceneManager.LoadSceneAsync(currentLevel, LoadSceneMode.Additive);
        }





    }

    internal void GameWin()
    {
        IsGameStarted = false;

        m_menu.GameWin();
    }

    internal void NotEnoughKeys()
    {
        m_menu.NotEnoughKeys();
    }
}
