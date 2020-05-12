using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class UIMenu : MonoBehaviour
{
    [SerializeField] private Text txtKeys;

    [SerializeField] private Text txtLevel;

    [SerializeField] private Button btnReplay;

    [SerializeField] private Button btnNextLevel;

    [SerializeField] private Button btnQuit;

    [SerializeField] private Animator AnimStartGame;

    [SerializeField] private Animator AnimGameOver;

    [SerializeField] private Animator AnimGameWin;

    [SerializeField] private Animator AnimNotEnoughKeys;



    private Player m_player;

    private GameManager m_gameManager;

    public void SetupOnStart(GameManager mngr)
    {
        m_gameManager = mngr;
        m_player = mngr.Player;

        btnReplay.onClick.AddListener(OnClickReplay);
        //btnReplay.onClick.AddListener(OnClickNextLevel);
        btnNextLevel.onClick.AddListener(OnClickNextLevel);
        btnQuit.onClick.AddListener(OnClickQuit);
    }

    private void OnClickReplay()
    {
        bool isInter = btnReplay.IsInteractable();
        if (isInter)
        {
            m_gameManager.Replay();
        }
        btnReplay.interactable = false;
    }

    private void OnClickNextLevel()
    {
        bool isInter = btnNextLevel.IsInteractable();
        if(isInter)
        {
            m_gameManager.NextLevel();
        }

        btnNextLevel.interactable = false;
        
    }

    private void OnClickQuit()
    {
        Application.Quit();
    }


    public void StartGame()
    {
        AnimStartGame.Play("start");
    }

    public void GameOver()
    {
        txtKeys.gameObject.SetActive(false);
        txtLevel.gameObject.SetActive(false);

        AnimGameOver.Play("start");
    }

    public void GameWin()
    {
        txtKeys.gameObject.SetActive(false);
        txtLevel.gameObject.SetActive(false);

        AnimGameWin.Play("start");
    }

    public void NotEnoughKeys()
    {
        AnimNotEnoughKeys.Play("start");
    }

    private void Update()
    {
        if (m_player != null)
        {
            if(m_player.KeyCount <5)
            {
                txtLevel.text = string.Format("Level {0}", m_gameManager.currentLevel);
                txtKeys.text = string.Format("Keys: {0}", m_player.KeyCount);
            }
            else
            {
                //txtLevel.gameObject.SetActive(false);
                txtKeys.text = string.Format("Head to the exit!");
            }
            
        }
    }

    private void OnDestroy()
    {
        if (btnReplay) btnReplay.onClick.RemoveAllListeners();
    }
}
