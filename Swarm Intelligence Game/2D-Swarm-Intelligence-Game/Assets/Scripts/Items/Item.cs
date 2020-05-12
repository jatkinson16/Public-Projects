using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Item : MonoBehaviour
{
    public enum eItemType
    {
        HEALTH,
        KEY,
        DOOR_LOCKABLE,
        DOOR_DESTRUCTABLE,
        EXIT
    }

    public eItemType ItemType;

    public void Hide()
    {
        this.gameObject.SetActive(false);
    }
}
