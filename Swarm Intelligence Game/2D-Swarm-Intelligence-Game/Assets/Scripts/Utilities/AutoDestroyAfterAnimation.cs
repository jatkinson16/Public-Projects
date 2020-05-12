using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AutoDestroyAfterAnimation : MonoBehaviour
{
    private void OnAnimationDestroy()
    {
        Destroy(gameObject);
    }
}
