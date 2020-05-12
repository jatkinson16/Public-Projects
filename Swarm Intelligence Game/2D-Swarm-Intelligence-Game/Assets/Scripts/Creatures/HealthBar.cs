using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HealthBar : MonoBehaviour
{
    [SerializeField] private Transform HealthBarForeground;

    public void SetHealthBar(float scale)
    {
        scale = Mathf.Clamp01(scale);

        HealthBarForeground.localScale = Vector3.one * scale;
    }
}
