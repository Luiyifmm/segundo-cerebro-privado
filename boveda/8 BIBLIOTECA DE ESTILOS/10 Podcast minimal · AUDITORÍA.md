---
tipo: procedimiento
actualizado: 2026-11-14
estado: 🧪 probado solo sobre las propias referencias
---
# Auditoría del estilo «Podcast minimal»

**Para qué:** revisar un vídeo de este estilo contra el [[10 Podcast minimal (Dope Motions)|libro de reglas]] cuando de verdad hace falta (ver «Cuándo se audita»), y que de cada auditoría salga una lección: lo que falla dos veces se convierte en propuesta de regla.

No sustituye al QC de la casa ([[4 ENTRENAMIENTO/QC TÉCNICO y QC CREATIVO]]): va **después** del QC técnico y es la parte de estilo del QC creativo. Un «OK» de un script no aprueba nada.

## Cuándo se audita (decisión de Luis, 15-11-2026)
**No por rutina.** Solo si se cumple alguna:
1. es el primer vídeo de un estilo o de un cliente;
2. el vídeo volvió de Luis o del cliente con correcciones de fondo;
3. rindió claramente peor de lo normal y se quiere saber por qué;
4. Luis lo pide.

En los demás vídeos: QC técnico y mirar la hoja. Para decidir escenas se consulta el banco de criterio (skill `criterio`), que es lo que se usa siempre.

## Los tres pasos
1. **Medir** (script, 1 minuto):
   ```
   python3 ~/Videos-Remotion/herramientas/qc/auditar-estilo-minimal.py <exportación.mp4> [carpeta]
   ```
   Da `auditoria.md` con formato, duración, primer cambio de plano (regla 4), mediana de plano (5), plano más largo (2) y oscuridad de la parte baja (12), cada uno OK / FALLA frente al rango de las referencias. Y las hojas a 2 fotogramas por segundo.
2. **Mirar** las hojas y rellenar yo la segunda tabla (reglas 1, 3, 7–11, 13–16 y el mapa frase → escena): OK / FALLA / NO VERIFICADO, con el segundo exacto de cada fallo.
3. **Comparar** con una referencia de la misma variante (lado a lado, mismo instante del guion: gancho, primera escena, un gráfico, el cierre) y escribir en 3 líneas qué se ve peor y por qué.

## Qué sale de cada auditoría
- **Nota de 0 a 16:** reglas cumplidas. Se apunta en `7 TRABAJOS EN CURSO/_REGISTRO DE EFICIENCIA.md` junto al tiempo.
- **Correcciones** del vídeo, ordenadas por lo que más se nota.
- **Lección:** si un fallo se repite en dos vídeos, va a `4 ENTRENAMIENTO/PROPUESTAS DE REGLAS.md`. Si tú corriges algo que la auditoría dio por bueno, la regla está mal o falta: también va ahí.
- Lo que el script no puede medir (sonido, curva de movimiento, sincronía fina) se escribe **NO VERIFICADO**, no se omite.

## Comprobado el 14-11
| Vídeo | Resultado |
|---|---|
| r25 (referencia del estilo) | 6 de 6 medidas OK |
| r32 (Jeff Nippard, otro estilo) | Falla el plano más largo (17,9 s) y la parte baja (no hay degradado): el script distingue |

**Límites conocidos:** el «plano más largo» solo aproxima la regla 2 (un cambio de texto sin corte no cuenta como cambio); la medida de la parte baja es la media de todo el vídeo.
