

===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro =====
> Proyecto estratégico de infraestructura personal de agentes de IA. Este espacio será el punto de partida oficial para diseñar, construir, documentar, evaluar y eventualmente convertir el sistema en productos o servicios.
## Norte estratégico
Construir una plataforma modular que integre agentes, modelos, herramientas, memoria, planificación, evaluación y automatización sin quedar atada a un único proveedor.
Principio rector: utilidad demostrable → sistema estable → workflows reproducibles → producto → negocio.
## Estado actual
Etapa: Arquitectura y diseño V1.
Prioridad inmediata: cerrar el Blueprint técnico antes de instalar componentes de forma definitiva.
Regla: ninguna herramienta entra en la arquitectura solo porque sea interesante. Debe justificar una capacidad concreta, ser evaluada y tener alternativa razonable cuando sea posible.
## Arquitectura conceptual
```USUARIO
  ↓
MISSION CONTROL / CONTROL PLANE
  ↓
INTELLIGENCE & POLICY LAYER
  ├─ Clarification
  ├─ Planning
  ├─ Delegation
  ├─ Approval
  └─ Evaluation
  ↓
AGENTS
  ├─ Hermes
  ├─ OpenClaw
  └─ futuros agentes especializados
  ↓
TOOL LAYER
  ├─ MCP
  ├─ APIs
  ├─ Browser
  ├─ Files
  └─ Code
  ↓
MEMORY & STATE
  ├─ Knowledge Memory → Obsidian / documentos
  ├─ Episodic Memory → sesiones / decisiones / resultados
  └─ Operational State → base de datos / jobs / estados
  ↓
AI GATEWAY
  └─ OmniRoute
  ↓
MODEL PROVIDERS
  ├─ DeepSeek
  ├─ Gemini
  ├─ Qwen
  └─ otros / modelos locales
## Capacidades objetivo
- Planificación de tareas complejas.
- Preguntas adaptativas de aclaración antes de ejecutar cuando exista ambigüedad.
- Delegación entre agentes.
- Selección inteligente de modelos según tarea, costo, latencia y calidad.
- Memoria persistente y estructurada.
- Uso controlado de herramientas mediante MCP/APIs.
- Human-in-the-loop para acciones sensibles o irreversibles.
- Evaluación objetiva de resultados.
- Observabilidad: logs, errores, latencia y consumo.
- Automatización programada.
- Portabilidad entre VPS, proveedores y modelos.
- Interfaz central propia.
## Principios no negociables
1. Diseñar antes de instalar.
1. Modularidad antes que comodidad.
1. Soberanía de datos y memoria.
1. Seguridad desde el primer día.
1. No depender de free tiers como fundamento estratégico.
1. No confundir cantidad de herramientas con capacidad real.
1. Medir resultados, costo y fiabilidad.
1. Toda dependencia importante debe poder sustituirse o aislarse.
1. Primero demostrar utilidad; después comercializar.
1. Documentar decisiones y razones, no solo comandos.
## Componentes candidatos
## Decisiones y advertencias
- El repositorio de Agentic OS usado como referencia visual no debe convertirse automáticamente en la base de un producto comercial; su licencia y restricciones deben respetarse.
- No adoptamos como regla fija realizar 20–40 preguntas antes de actuar. Adoptamos clarificación adaptativa según ambigüedad, riesgo y necesidad de información.
- OmniRoute es una capa de routing, no la inteligencia del sistema.
- Obsidian no será tratado como toda la memoria: se separarán conocimiento, episodios y estado operativo.
- La distribución “Omarship” mencionada en un informe externo no está suficientemente verificada; queda fuera de la V1 hasta comprobar origen, soporte y utilidad.
- Hostinger, Oracle y Google deben tratarse como opciones intercambiables de infraestructura, no como decisiones irreversibles.
## Roadmap macro
### Fase 0 — Arquitectura
Definir capacidades, interfaces, seguridad, memoria, evaluación y criterios de aceptación.
### Fase 1 — Infraestructura
VPS/Linux, usuario no root, firewall, acceso privado, backups, monitoreo y recuperación.
### Fase 2 — Gateway
OmniRoute, autenticación, proveedores, routing, límites y fallback.
### Fase 3 — Agentes
Hermes + OpenClaw, herramientas, MCP, permisos y primeras tareas.
### Fase 4 — Memoria
Knowledge/Episodic/Operational Memory, Obsidian y almacenamiento de estado.
### Fase 5 — Intelligence Layer
Clarificación, planificación, delegación, aprobación y evaluación.
### Fase 6 — Mission Control
Interfaz propia para supervisar agentes, tareas, modelos, memoria, costos y eventos.
### Fase 7 — Automatización
Jobs programados, workflows y ejecución recurrente con controles.
### Fase 8 — Validación
Pruebas fin-a-fin, reinicios, fallos, seguridad, costos, latencia y calidad.
### Fase 9 — Productización
Identificar workflows con valor económico, empaquetarlos y diseñar una primera oferta.
## Métricas
- Tasa de éxito por tipo de tarea.
- Tiempo de ejecución.
- Costo por tarea.
- Número de intervenciones humanas.
- Errores por agente/herramienta.
- Calidad evaluada del resultado.
- Disponibilidad del sistema.
- Tiempo de recuperación tras fallo.
- Dependencias críticas.
- Valor económico estimado del workflow.
## Criterio de V1 terminada
La V1 no estará terminada por tener muchas herramientas instaladas. Estará terminada cuando podamos ejecutar una tarea real de principio a fin: recibir una solicitud, aclararla si es necesario, planificarla, ejecutar herramientas/agentes, usar un modelo apropiado, guardar memoria/estado, evaluar el resultado y presentar evidencia del proceso de forma segura.
## Próximos documentos
1. Blueprint técnico definitivo V1.
1. Arquitectura de infraestructura y red.
1. Sistema de memoria.
1. Política de agentes, herramientas y autonomía.
1. Sistema de evaluación y observabilidad.
1. Diseño de Mission Control.
1. Registro de decisiones.
1. Backlog y experimentos.
1. Investigación de oportunidades de producto.
→ [subpágina] 01 — Arquitectura y sistema
→ [subpágina] 02 — Infraestructura y seguridad
→ [subpágina] 03 — Agentes y herramientas
→ [subpágina] 04 — Modelos y routing
→ [subpágina] 05 — Memoria y conocimiento
→ [subpágina] 06 — Mission Control
→ [subpágina] 07 — Experimentos y benchmarks
→ [subpágina] 08 — Workflows y automatizaciones
→ [subpágina] 09 — Producto y negocio
→ [subpágina] 10 — Fuentes y vigilancia tecnológica
→ [subpágina] 🎬 AI Content Agency — Proyecto V1


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 01 — Arquitectura y sistema =====
Área dedicada a la arquitectura, componentes, interfaces entre capas y decisiones técnicas del Agentic Intelligence Platform.


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 02 — Infraestructura y seguridad =====
VPS, red, firewall, VPN, secretos, backups, recuperación, observabilidad y hardening.


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 03 — Agentes y herramientas =====
Hermes, OpenClaw, MCP, skills, permisos, roles, herramientas y patrones de delegación.


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 04 — Modelos y routing =====
Proveedores, modelos, OmniRoute, routing, costos, límites, benchmarks y fallback.


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 05 — Memoria y conocimiento =====
Knowledge Memory, Episodic Memory, Operational State, Obsidian, ingesta documental y recuperación de contexto.


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 06 — Mission Control =====
Diseño y desarrollo de la interfaz propia: tareas, agentes, memoria, costos, eventos, aprobaciones y observabilidad.


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 07 — Experimentos y benchmarks =====
Pruebas controladas, resultados, comparaciones agente/modelo, fallos y aprendizajes.


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 08 — Workflows y automatizaciones =====
Casos de uso reales, workflows reproducibles, jobs y automatizaciones.


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 09 — Producto y negocio =====
Oportunidades de producto, servicios, IaC, consultoría, validación de mercado y futura comercialización.


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 10 — Fuentes y vigilancia tecnológica =====
Documentación oficial, repositorios, licencias, cambios de versiones y decisiones que requieran revisión periódica.


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 🎬 AI Content Agency — Proyecto V1 =====
## 📚 Biblioteca del proyecto — Research & Intelligence
> Centro de investigación: competencia, repositorios GitHub, arquitectura reciclable, decisiones de integración y fuentes. Los documentos siguientes son la base viva de inteligencia del proyecto.
- ‣
- ‣
- ‣
Regla: cada nueva herramienta se registra con qué hace → qué reciclamos → licencia → riesgos → decisión → enlace.
> Proyecto independiente del Agentic Intelligence Platform. No modifica ni reemplaza el sistema de infraestructura/agentes existente. Lo reutiliza como plataforma cuando una capacidad esté validada.
## 0. Veredicto de diseño
Objetivo: construir una agencia de producción de contenido audiovisual dirigida por IA que pueda recibir un objetivo creativo, analizar los materiales disponibles, planificar la edición, ejecutar la mayor parte del trabajo automáticamente, revisar el resultado y entregar un proyecto/exportación utilizable.
Criterio rector: minimizar intervención humana sin sacrificar calidad creativa ni control.
Regla de arquitectura: no construiremos siete chatbots independientes. Construiremos un Director/Orquestador que coordina especialistas y herramientas deterministas sobre un estado de proyecto común.
Regla de producto: CapCut Pro sigue siendo el editor cotidiano; DaVinci Resolve Free se incorpora como segundo motor cuando aporte una ventaja demostrable; FFmpeg y herramientas locales ejecutan el trabajo mecánico y reproducible.
Regla económica: V1 debe poder demostrarse sin comprar software, APIs o infraestructura adicional. Si una capacidad requiere dinero, primero se busca sustituto local/open-source o se convierte en experimento opcional.
## 1. Qué estamos construyendo realmente
No estamos construyendo "una IA que edita videos".
Estamos construyendo un sistema de producción audiovisual autónomo:
```OBJETIVO DEL CREADOR
        ↓
DIRECTOR IA
        ↓
BRIEF CREATIVO + PLAN DE PRODUCCIÓN
        ↓
INGESTA Y LIBRERÍA DE ASSETS
        ↓
ROUGH CUT
        ↓
LIMPIEZA ── SUBTÍTULOS ── AUDIO ── COLOR ── MOTION
        ↓
ENSAMBLAJE
        ↓
REVISIÓN AUTOMÁTICA
        ↓
CORRECCIONES AUTOMÁTICAS
        ↓
QC FINAL
        ↓
EXPORT / PROYECTO EDITABLE
El sistema debe poder explicar qué hizo, por qué lo hizo, qué herramienta utilizó y qué queda pendiente.
## 2. Usuario objetivo de V1
Primero: nosotros mismos como creador/editor.
Esto evita construir para un cliente hipotético. Cada capacidad debe resolver un problema que aparezca en una producción real.
### Tipo de contenido inicial
Short-form vertical de 30–90 segundos, especialmente contenido motivacional, narrativo, talking-head y montajes musicales.
Razón: permite probar rápidamente idea → selección de clips → limpieza → ritmo → subtítulos → música → revisión → exportación sin necesitar un sistema completo de largometraje.
## 3. Definición de éxito
V1 será aprobada únicamente si consigue, con un proyecto real:
- recibir una instrucción de alto nivel;
- hacer las preguntas mínimas necesarias y no un cuestionario innecesario;
- inspeccionar automáticamente los archivos disponibles;
- generar un plan editorial;
- seleccionar material útil;
- ejecutar cortes y limpieza;
- generar subtítulos;
- preparar audio;
- aplicar decisiones visuales reproducibles;
- ensamblar un borrador;
- revisar el resultado con criterios explícitos;
- corregir automáticamente los errores corregibles;
- producir una versión final o detenerse con un diagnóstico claro;
- registrar todas las decisiones y artefactos;
- requerir intervención humana solo en decisiones creativas de alto impacto o acciones irreversibles.
### Métricas principales
Nota: estos números son objetivos de ingeniería, no promesas de calidad artística. Se revisan después del primer benchmark real.
## 4. Arquitectura aprobada para V1
```                 ┌──────────────────┐
                 │   CREADOR        │
                 └────────┬─────────┘
                          ↓
            ┌─────────────────────────┐
            │ DIRECTOR / ORQUESTADOR  │
            └───────────┬─────────────┘
                        ↓
     ┌──────────────────┼──────────────────┐
     ↓                  ↓                  ↓
IDEA/EDITORIAL      MEDIA LIBRARIAN      QC
     │                  │                  │
     └────────────┬─────┴──────────────┐   │
                  ↓                    │   │
          EDITING WORKER              │   │
                  │                    │   │
     ┌────────────┼────────────┐       │   │
     ↓            ↓            ↓       │   │
  CLEANUP     CAPTIONS       AUDIO     │   │
     │            │            │       │   │
     └────────────┼────────────┘       │   │
                  ↓                    │   │
            VISUAL WORKER             │   │
          color / motion / reframing  │   │
                  │                    │   │
                  └──────────┬─────────┘   │
                             ↓             │
                       ASSEMBLY             │
                             ↓             │
                          REVIEW ──────────┘
                             ↓
                    CORRECT / APPROVE
                             ↓
                       FINAL EXPORT
### Importante: agentes ≠ herramientas
Agente: decide, interpreta, planifica y evalúa.
Herramienta: ejecuta una operación concreta de forma determinista.
Ejemplos:
- Whisper transcribe; el agente decide qué texto conservar.
- FFmpeg corta/concatena; el agente decide los cortes.
- detector de silencios mide silencios; el agente decide si eliminarlos.
- DaVinci/CapCut ejecuta edición; el agente prepara instrucciones/artefactos.
Esto reduce al mínimo las alucinaciones del LLM en operaciones audiovisuales.
## 5. Agentes V1
### A — Director
Responsabilidad: convertir el objetivo del creador en un plan ejecutable.
Entrada: objetivo, duración, plataforma, material, estilo y restricciones.
Salida: brief creativo + estructura + criterios de éxito + plan de trabajo.
No edita directamente.
### B — Media Librarian
Responsabilidad: comprender y localizar assets.
Debe indexar automáticamente:
- vídeo;
- audio;
- música;
- B-roll;
- SFX;
- imágenes;
- subtítulos;
- proyectos previos;
- metadatos técnicos;
- contenido visual detectable.
No queremos "más carpetas". Queremos búsqueda semántica y metadatos útiles.
### C — Editing Worker
Responsabilidad: producir el rough cut.
Capacidades iniciales:
- detectar tomas utilizables;
- eliminar silencios;
- detectar repeticiones/takes fallidos;
- ordenar clips;
- ajustar duración;
- sincronizar con música cuando corresponda.
### D — Caption/Audio Worker
Responsabilidad:
- transcripción;
- subtítulos;
- limpieza de diálogo;
- normalización;
- mezcla básica;
- detección de problemas de audio.
### E — Visual Worker
Responsabilidad inicial:
- reencuadre;
- consistencia visual;
- decisiones de color reproducibles;
- motion graphics sencillos.
Color y motion no necesitan ser agentes independientes en V1. Se convierten en agentes separados solo cuando exista una carga de trabajo o criterio de decisión que lo justifique.
### F — QC Director
Responsabilidad crítica: no aceptar su propio trabajo automáticamente.
Debe revisar:
- duración;
- formato/aspect ratio;
- silencios problemáticos;
- cortes extraños;
- palabras/subtítulos incorrectos;
- niveles de audio;
- frames negros;
- assets faltantes;
- ritmo básico;
- cumplimiento del brief;
- presencia de errores técnicos.
Resultado obligatorio:
APPROVED, REVISE o BLOCKED + evidencia.
## 6. Editores: estrategia dual
### CapCut Pro
Rol: editor cotidiano y destino de producción inicial.
Ventaja: ya forma parte del flujo real y no necesitamos aprender otro editor para demostrar valor.
### DaVinci Resolve Free
Rol: segundo backend de edición y laboratorio de automatización.
La investigación actual muestra que existen proyectos MCP que ya separan un "director" de un servidor que controla Resolve, con herramientas tipadas, verificación de cambios, planificación, revisión y almacenamiento de ejecuciones. Esto encaja con nuestra arquitectura y reduce el incentivo a construir esa capa desde cero. urlDaVinci-MCPhttps://github.com/Iamkewl/Davinci-MCP
También existen implementaciones que apuntan a automatizar Resolve Free mediante archivos de intercambio y herramientas locales, dejando el procesamiento determinista fuera del LLM. urlUnofficial DaVinci MCPhttps://github.com/wassermanproductions/unofficial-davinci-mcp
### Decisión
No elegimos un editor único todavía.
Construimos primero una capa editorial abstracta:
Project → Assets → Timeline → Cuts → Captions → Audio → Visual Decisions → Export
Después conectamos backends.
## 7. Backend determinista
Primera capa de ejecución:
- FFmpeg
- Whisper/faster-whisper
- VAD
- detección de escenas
- extracción de frames
- generación de proxies
- análisis de audio
- herramientas de imagen/vídeo locales
- scripts Python
Principio: el LLM decide; el motor determinista ejecuta.
## 8. Integración con la plataforma existente
Este proyecto no reemplaza el Agentic Intelligence Platform.
Lo utiliza como infraestructura superior cuando esté disponible:
```AGENTIC INTELLIGENCE PLATFORM
             ↓
     Model Gateway / Memory / Policy / Observability
             ↓
      AI CONTENT AGENCY
             ↓
 Director → Workers → Tools → Editors
La plataforma existente conserva su papel generalista.
Esta agencia es el primer dominio vertical real donde probaremos si esa arquitectura produce valor.
Referencia arquitectónica existente: ‣.
## 9. Build vs Buy vs Integrate
Regla: si un proyecto open-source resuelve ≥70% de una capacidad y tiene licencia/arquitectura aceptables, primero se integra o bifurca; no se reescribe.
## 10. Flujo operativo V1
### Paso 1 — Intake automático
El usuario entrega:
- objetivo;
- archivos;
- plataforma;
- duración aproximada;
- referencia opcional.
El sistema inspecciona automáticamente los archivos antes de preguntar.
### Paso 2 — Clarificación adaptativa
El Director pregunta solo si existe una ambigüedad que pueda cambiar significativamente el resultado.
Ejemplo: si ya existen vídeos, música, formato y duración, no preguntar de nuevo qué material tiene.
### Paso 3 — Plan creativo
El Director produce:
- hook;
- narrativa;
- estructura temporal;
- estilo;
- ritmo;
- criterios visuales;
- criterios de audio;
- estrategia de subtítulos;
- criterios de QC.
### Paso 4 — Indexación
El Librarian analiza y etiqueta los assets automáticamente.
### Paso 5 — Rough cut
Editing Worker crea un primer montaje sin requerir que el usuario coloque manualmente cada clip.
### Paso 6 — Especialización
Cleanup → Captions/Audio → Visual.
### Paso 7 — Ensamblaje
Se genera un artefacto de timeline independiente del editor.
### Paso 8 — QC
El sistema inspecciona el resultado.
### Paso 9 — Auto-repair
Si el error es corregible y seguro, se corrige automáticamente.
Ejemplos:
- subtítulo desfasado;
- silencio excesivo;
- audio fuera de rango;
- clip faltante;
- duración fuera del límite.
### Paso 10 — Human gate
Solo se solicita intervención humana cuando:
- existe una decisión estética subjetiva de alto impacto;
- faltan assets esenciales;
- el sistema no puede resolver una contradicción;
- se requiere una acción irreversible/publicación.
### Paso 11 — Export
Se genera:
- vídeo final;
- proyecto editable cuando sea posible;
- subtítulos;
- manifest del proyecto;
- informe QC;
- registro de ejecución.
## 11. Artefactos estándar
Todo proyecto debe producir:
```project.json
assets.json
creative_brief.json
edit_plan.json
cuts.json
captions.srt
audio_plan.json
visual_plan.json
timeline.json
qc_report.json
run_log.json
Estos artefactos son la verdadera independencia del sistema respecto al editor.
## 12. Human-in-the-loop mínimo
### Automático por defecto
- ingestión;
- análisis de archivos;
- transcripción;
- selección preliminar;
- cortes mecánicos;
- subtítulos;
- limpieza de audio;
- ensamblaje;
- QC técnico;
- correcciones seguras;
- exportación local.
### Revisión humana
- dirección creativa final cuando el criterio sea subjetivo;
- aprobación de publicación;
- acciones destructivas o externas.
Objetivo: el humano actúa como director, no como operador de timeline.
## 13. Roadmap ejecutable
### Fase 1 — Prueba de realidad
1. Crear repositorio nuevo del proyecto.
1. Instalar/verificar FFmpeg.
1. Instalar/verificar Whisper/faster-whisper.
1. Crear estructura mínima de proyecto.
1. Procesar automáticamente una carpeta real de vídeos.
1. Generar transcripciones y metadatos.
1. Producir un primer rough cut sin usar todavía CapCut.
Gate: si no podemos automatizar un vídeo simple de principio a fin, no añadimos más agentes.
### Fase 2 — Director + Librarian
1. Definir project.json.
1. Crear índice de assets.
1. Implementar brief creativo.
1. Implementar selección basada en criterios.
1. Registrar decisiones.
Gate: el sistema debe poder recibir una carpeta y explicar qué assets utilizaría y por qué.
### Fase 3 — Pipeline editorial
1. Cleanup.
1. Captions.
1. Audio.
1. Timeline.
1. Export.
Gate: vídeo vertical completo generado con mínima intervención.
### Fase 4 — QC + auto-repair
1. Crear rúbrica.
1. Añadir comprobaciones deterministas.
1. Añadir revisión visual.
1. Añadir auto-repair seguro.
1. Repetir hasta alcanzar los objetivos de V1.
Gate: el sistema debe detectar sus errores más importantes antes de pedir al humano que revise.
### Fase 5 — DaVinci / CapCut adapters
1. Evaluar DaVinci MCP existente.
1. Probar generación/importación de timeline.
1. Investigar qué partes de CapCut pueden automatizarse sin depender de una API frágil.
1. Comparar resultados contra el backend FFmpeg.
Gate: cada editor debe justificar su existencia por calidad, velocidad o control.
### Fase 6 — Director autónomo
1. Integrar Hermes.
1. Conectar herramientas mediante permisos.
1. Añadir planificación/reintentos.
1. Conectar memoria/observabilidad del Agentic Platform.
1. Reducir intervención humana mediante métricas reales.
Gate final: producción de un vídeo real con ≤3 intervenciones humanas normales y trazabilidad completa.
## 14. Lo que deliberadamente NO construiremos todavía
- 7 agentes permanentes.
- Marketplace.
- SaaS.
- aplicación móvil.
- Kubernetes.
- sistema de billing.
- entrenamiento de modelos propios.
- router ML.
- generación de vídeo avanzada como núcleo.
- automatización total de publicación en redes.
- UI compleja.
- una nueva herramienta de edición desde cero.
Razón: ninguna de estas cosas demuestra primero que podemos producir mejor contenido con menos trabajo humano.
## 15. Criterios de revisión de cada componente
Antes de añadir cualquier herramienta/agente debemos responder:
1. ¿Qué trabajo humano elimina?
1. ¿Qué calidad mejora?
1. ¿Puede medirse?
1. ¿Puede ejecutarse localmente o a $0?
1. ¿Tiene alternativa?
1. ¿Aumenta o reduce la complejidad?
1. ¿Puede fallar de forma segura?
1. ¿Puede probarse sin depender de todo el sistema?
1. ¿Se integra mediante una interfaz estable?
1. ¿Si desaparece mañana, podemos sustituirlo?
Si no pasa este filtro, no entra en V1.
## 16. Benchmark fundador
Usaremos un único vídeo real como prueba de referencia.
Debe contener suficientes elementos para ejercitar:
- material bruto;
- diálogo o voz;
- música;
- B-roll;
- subtítulos;
- cortes;
- cambios de ritmo;
- algún tratamiento visual.
Cada nueva versión del sistema debe ejecutarse sobre el mismo benchmark y registrar:
tiempo → intervención humana → errores → calidad → herramientas utilizadas → coste → resultado.
No declararemos progreso por cantidad de código. Declararemos progreso por reducción de trabajo humano + mejora de resultado.
## 17. Puerta de aprobación del proyecto
El proyecto solo avanza de fase si cumple:
- Valor: elimina trabajo real.
- Calidad: el resultado es utilizable.
- Autonomía: el sistema puede continuar sin supervisión constante.
- Seguridad: los fallos no destruyen trabajo ni publican sin autorización.
- Economía: V1 sigue siendo esencialmente gratuita.
- Modularidad: una herramienta puede reemplazarse.
- Observabilidad: sabemos qué ocurrió.
- Reproducibilidad: podemos repetir el experimento.
- Experiencia de creador: el usuario piensa en el resultado, no en configurar agentes.
## 18. Primera misión
Misión #001 — producir automáticamente un Reel vertical de 30–60 s a partir de una carpeta de material bruto + una instrucción creativa.
Resultado esperado:
```INPUT
  carpeta de clips + música + objetivo

        ↓

AUTONOMOUS PIPELINE
  ingest → index → plan → select → cleanup
  → captions → audio → assemble → QC → repair

        ↓

OUTPUT
  final.mp4
  captions.srt
  project.json
  qc_report.json
  run_log.json
No añadiremos la siguiente capacidad hasta que esta misión funcione de forma repetible.
## 19. Estado
Estado: Diseño V1 aprobado para comenzar implementación.
Siguiente acción única: ejecutar la Misión #001 con un conjunto pequeño de archivos reales y medir el punto de partida.
Regla de trabajo: una capacidad funcional por vez; cada capacidad debe probarse antes de añadir otra.
→ [subpágina] 📚 Research & Intelligence — Competencia, repos y reciclaje
→ [subpágina] 🧩 Proyectos Git — Inventario de reutilización
→ [subpágina] ♻️ Qué reciclaremos — Decisiones de arquitectura
→ [subpágina] 


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 🎬 AI Content Agency — Proyecto V1 / 📚 Research & Intelligence — Competencia, repos y reciclaje =====
## 🚨 NUEVO HALLAZGO — HIGGSFIELD OPEN SOURCE (17 SEP 2026)
Alta prioridad para investigación. La organización oficial verificada de Higgsfield en GitHub mantiene públicos su CLI, Skills, SDKs y otros componentes. El CLI está bajo MIT y expone generación audiovisual, workflows, análisis y ejecución desde terminal; el paquete oficial de Skills conecta ese stack con agentes como Claude Code, Codex y Cursor. urlHiggsfield GitHub oficialhttps://github.com/higgsfield-ai
Acción: auditar estos repositorios antes de construir capacidades equivalentes. El hallazgo refuerza nuestra arquitectura Director → Skills/Tools → motores → QC, y abre la posibilidad de usar Higgsfield como capa de generación mientras nuestro sistema mantiene la orquestación, memoria, reglas editoriales y control de calidad.
Nueva referencia: 🚨 Higgsfield Open Source — Hell Grind + Agentic Stack — página hija de este banco.
Repositorio de inteligencia del proyecto AI Content Agency. Aquí guardaremos investigación de competencia, proyectos open-source, enlaces, decisiones de integración y componentes que podamos reciclar en lugar de construir desde cero.
## Regla de investigación
No reinventar lo que ya existe. Si una solución open-source resuelve aproximadamente ≥70% de una capacidad, primero evaluamos integración, adaptación o fork según licencia, calidad, mantenimiento y compatibilidad.
## 1. Competencia y patrones que reciclamos
### OpusClip
Qué hace: transforma material bruto, especialmente talking-head, en contenido publicable mediante selección, captions, B-roll, motion, música y SFX; además permite dirigir cambios en lenguaje natural.
Qué reciclamos:
- flujo raw footage → producción → revisión humana mínima;
- idea de un Director/AI Producer;
- explicación de decisiones del sistema;
- edición dirigida por intención, no por operaciones aisladas.
Qué NO copiamos: backend cerrado ni producto completo.
### Higgsfield AI Video Editor
Qué hace: edición basada en texto/transcripción, eliminación de silencios/rellenos, B-roll, limpieza de audio, captions, estabilización, color y reframing.
Qué reciclamos:
- edición por intención;
- transcript como interfaz de edición;
- pipeline unificado en vez de muchas herramientas desconectadas;
- automatización de limpieza + captions + audio + reframing.
### Reuters + CuttingRoom ShortCut
Patrón importante: edición y búsqueda mediante lenguaje natural, reglas editoriales definidas en lenguaje natural y combinación de contenido externo con assets propios.
Qué reciclamos:
- una Content Constitution / Editorial Rules;
- MCP como capa de conexión entre agente y herramientas;
- human-in-the-loop para decisiones editoriales relevantes;
- reglas verificables antes de exportar.
### Conclusión competitiva
No competiremos creando "otro editor con IA". La oportunidad es una capa de producción/orquestación que coordine modelos, agentes, herramientas y editores existentes.
## 2. Open-source / GitHub a evaluar
### Pireel
Repositorio: https://github.com/pireel/pireel
Rol potencial: backend/editor experimental AI-native, local y controlable mediante MCP.
Reciclable:
- canvas/timeline;
- captions;
- graphics;
- storyboard/themes;
- export;
- arquitectura de agente + MCP.
Riesgo: AGPL-3.0 para el editor. Antes de cualquier uso comercial, revisar compatibilidad de licencia y si conviene integración externa en lugar de incorporación directa.
### DaVinci-MCP
Repositorio: https://github.com/Iamkewl/Davinci-MCP
Rol potencial: automatización de DaVinci Resolve mediante MCP.
Reciclable:
- separación Director → Resolve tools;
- herramientas tipadas;
- verificación de cambios;
- planificación/revisión;
- almacenamiento de ejecuciones.
Decisión provisional: integrar/evaluar antes de construir una capa propia equivalente.
### Unofficial DaVinci MCP
Repositorio: https://github.com/wassermanproductions/unofficial-davinci-mcp
Rol potencial: automatización de Resolve, incluyendo workflows compatibles con Resolve Free mediante archivos de intercambio.
Reciclable:
- separación entre decisiones y procesamiento determinista;
- FCPXML/LUT workflows;
- generación de artefactos reproducibles.
### mcpCut
Repositorio: https://github.com/musyta-labs/mcpcut
Rol potencial: referencia arquitectónica para un editor controlado por agentes.
Reciclable:
- snapshots inmutables;
- operaciones journaled/versionadas;
- undo/versioning;
- rendering FFmpeg/MLT;
- CLI determinista;
- validación estructural;
- SQLite/Postgres;
- seguridad de subprocess y validación de argumentos.
Valor para nuestro diseño: probablemente una de las mejores referencias para definir nuestro modelo de Project/Timeline/Operation/Artifact sin copiar necesariamente su implementación.
### MakeMyClip
Repositorio: https://github.com/MakeMyClip/editor
Rol potencial: referencia para editor AI-native local.
Reciclable:
- catálogo pequeño de herramientas deterministas;
- FFmpeg como motor;
- logs de sesión;
- snapshots/undo;
- JSON reproducible;
- ejecución local.
### CapCut MCP — capcut-ai-editor
Repositorio: https://github.com/mrbuslov/capcut-ai-editor
Rol potencial: experimento para conectar nuestro sistema con CapCut, nuestro editor cotidiano.
Reciclable:
- lectura de subtítulos generados por CapCut;
- eliminación de silencios/takes duplicados;
- generación/exportación de proyecto CapCut.
Riesgo: dependencia de estructuras/proyectos locales de CapCut que pueden cambiar. No convertirlo en el núcleo del sistema.
### CapCut MCP
Repositorio: https://github.com/burnshall-ui/capcut-mcp
Rol potencial: inspección/manipulación de proyectos locales CapCut.
Reciclable:
- inspección de timeline;
- lectura de clips;
- manipulación estructurada de JSON local.
Decisión provisional: usar como adaptador experimental, sujeto a pruebas de estabilidad.
## 3. Arquitectura que extraemos de la competencia
```CREATOR
   ↓
CONTENT BRIEF
   ↓
DIRECTOR / ORCHESTRATOR
   ↓
EDITORIAL RULES / CONTENT CONSTITUTION
   ↓
MEDIA INTELLIGENCE
   ↓
EDITING PLAN / EDITING DSL
   ↓
┌───────────────┬────────────────┬────────────────┐
CAPCUT       DAVINCI          PIREEL          DETERMINISTIC
ADAPTER      ADAPTER          ADAPTER         ENGINES
                                               ↓
                                      FFmpeg / Whisper / VAD
   └───────────────┬────────────────┴────────────────┘
                   ↓
                   QC
                   ↓
          AUTO-REPAIR / HUMAN REVIEW
                   ↓
                 EXPORT
### Principio central
LLM decide → DSL/API validada → herramienta ejecuta → QC verifica.
El LLM no debe recibir acceso indiscriminado a comandos FFmpeg ni modificar directamente estados frágiles.
## 4. Content Constitution — versión inicial
```content_rules:
  objective:
    - retain_attention
    - communicate_message
    - avoid_filler
  visual:
    - no_random_broll
    - broll_must_support_narrative
  captions:
    - readable
    - synchronized
    - mobile_first
  audio:
    - voice_priority: high
    - avoid_clipping
  export:
    - vertical: 1080x1920
    - platform: instagram_reels
Estas reglas son una base inicial; se convertirán en configuración editable por proyecto/cliente.
## 5. Build vs Integrate
## 6. Qué NO debemos construir todavía
- Otro editor de vídeo completo.
- Un agente permanente por cada tarea pequeña.
- Nuestro propio motor de transcripción.
- Nuestro propio motor de render.
- Una UI compleja antes de probar el motor.
- Integraciones irreversibles con un único editor.
- Automatización basada en estructuras privadas de CapCut como dependencia nuclear.
## 7. Primer benchmark real
Vertical slice:
folder of video → media analysis → transcription → silence detection → cut plan → clean video → QC
Si esto funciona con material real, añadimos Director y posteriormente adapters/editor automation.
## 8. Métricas para decidir si una integración se queda
Una herramienta/proyecto solo permanece si demuestra:
1. reduce trabajo humano;
1. mejora calidad o velocidad;
1. es reproducible;
1. tiene licencia aceptable;
1. está suficientemente mantenido;
1. no crea dependencia crítica innecesaria;
1. puede sustituirse sin rediseñar todo el sistema.
## 9. Fuentes y enlaces principales
- OpusClip: https://www.opus.pro/
- Higgsfield: https://higgsfield.ai/
- Pireel: https://github.com/pireel/pireel
- DaVinci-MCP: https://github.com/Iamkewl/Davinci-MCP
- Unofficial DaVinci MCP: https://github.com/wassermanproductions/unofficial-davinci-mcp
- mcpCut: https://github.com/musyta-labs/mcpcut
- MakeMyClip Editor: https://github.com/MakeMyClip/editor
- CapCut AI Editor MCP: https://github.com/mrbuslov/capcut-ai-editor
- CapCut MCP: https://github.com/burnshall-ui/capcut-mcp
## 10. Estado
Research V1 — consolidado.
Próximo uso de esta página: registrar cada nueva herramienta/proyecto descubierto con qué hace → qué reciclamos → licencia → riesgo → decisión.
→ [subpágina] 🚨 Higgsfield Open Source — Hell Grind + Agentic Stack


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 🎬 AI Content Agency — Proyecto V1 / 📚 Research & Intelligence — Competencia, repos y reciclaje / 🚨 Higgsfield Open Source — Hell Grind + Agentic Stack =====
## Hallazgo — 17 septiembre 2026
Higgsfield ha publicado una parte importante de su stack y, según la organización oficial verificada de GitHub, mantiene actualmente repositorios públicos como CLI, Skills, SDKs y tooling. La organización oficial es higgsfield-ai, verificada por GitHub y vinculada a higgsfield.ai. citeturn1search0
### Lo más relevante para nuestro proyecto
1. Higgsfield CLI — MIT
- Generación de imágenes, vídeo, 3D, audio y análisis de vídeo desde terminal.
- 40+ modelos/workflows expuestos por CLI.
- Soporta pipelines como reframe, draw-to-video, voice-change, dubbing y análisis de vídeo.
- Tiene salida JSON, polling de jobs y estimación de costes.
- Licencia MIT. citeturn1search1
2. Higgsfield Skills — MIT
- Paquete oficial de skills para agentes.
- Incluye higgsfield-generate, higgsfield-soul, higgsfield-product-photoshoot.
- Integra Claude Code, Codex y Cursor mediante skills.
- Esto es especialmente relevante para nuestra arquitectura porque demuestra un patrón: agente → skill → CLI → plataforma de generación. citeturn1search2
3. Hell Grind — pipeline de producción
La información pública disponible describe el sistema de producción detrás de una película de IA de larga duración como un pipeline abierto: construcción de personajes, hojas de localización, layout espacial por escena, construcción de diálogo y disciplina de iteración. La documentación comunitaria que referencia el material oficial identifica explícitamente Hell Grind como un sistema de producción open-sourced por Higgsfield. citeturn1search4turn1search5
### Impacto en AI Content Agency
Esto cambia nuestra investigación, pero no cambia nuestro objetivo.
No debemos intentar copiar Higgsfield. Debemos estudiar qué partes de su stack podemos reutilizar como infraestructura de generación audiovisual.
Nuestra arquitectura pasa a considerar:
Director / Orchestrator → Editorial Rules → Media Intelligence → Editing Plan → Generation Tools → Editor Adapters → QC
Y Higgsfield puede ocupar la capa de generación/transformación audiovisual, mientras nuestro sistema conserva el control de:
- objetivo del contenido;
- memoria del proyecto;
- selección de assets;
- planificación de edición;
- reglas editoriales;
- composición del vídeo;
- evaluación/QC;
- reparación;
- exportación.
### Decisión provisional
ESTADO: INVESTIGAR + INTEGRAR, NO RECONSTRUIR.
Antes de programar capacidades propias equivalentes, debemos auditar:
1. repositorios oficiales;
1. licencias;
1. CLI/API/MCP;
1. skills;
1. workflows disponibles;
1. qué código es realmente reutilizable;
1. qué requiere cuenta/API de Higgsfield;
1. qué componentes pueden funcionar con coste cero;
1. qué partes sirven para CapCut/DaVinci/FFmpeg;
1. qué partes son útiles para nuestro Director.
### Repositorios oficiales prioritarios
- Higgsfield GitHub: https://github.com/higgsfield-ai
- CLI: https://github.com/higgsfield-ai/cli
- Skills: https://github.com/higgsfield-ai/skills
### Insight estratégico
La oportunidad más interesante no es que Higgsfield haya publicado código.
Es que están exponiendo un patrón muy cercano a nuestra visión:
agentes + skills + herramientas de generación + workflows + automatización desde terminal.
Eso refuerza nuestra decisión de construir una capa de orquestación propia, en lugar de construir desde cero cada motor audiovisual.
### ⚠️ Importante
Encontramos varios proyectos llamados “Open Higgsfield” en GitHub que no pertenecen a Higgsfield AI. Por ejemplo, joymadhu49/open-higgsfield se declara independiente y no afiliado a Higgsfield AI. No deben mezclarse con los repositorios oficiales. citeturn0search0
Regla: para referencias críticas, priorizar la organización oficial higgsfield-ai y documentación directamente atribuible a Higgsfield.


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 🎬 AI Content Agency — Proyecto V1 / 🧩 Proyectos Git — Inventario de reutilización =====
Inventario vivo de proyectos GitHub que podemos usar, integrar, adaptar o tomar como referencia.
## Criterio de entrada
Cada nuevo repo se registra con:
- problema que resuelve;
- licencia;
- actividad/mantenimiento;
- dependencias;
- qué código/arquitectura podemos reutilizar;
- qué no debemos copiar;
- coste de integración;
- riesgo de lock-in;
- decisión: INTEGRAR / ADAPTAR / FORK / REFERENCIA / DESCARTAR.
## Regla
Primero integrar. Después adaptar. Solo construir desde cero cuando exista una razón clara.


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 🎬 AI Content Agency — Proyecto V1 / ♻️ Qué reciclaremos — Decisiones de arquitectura =====
## De la competencia
- Flujo de producción orientado a objetivo.
- Director/AI Producer.
- Edición mediante lenguaje natural/transcripción.
- Búsqueda y selección inteligente de assets.
- Reglas editoriales explícitas.
- QC + revisión humana solo donde aporte valor.
## De proyectos open-source
- MCP como capa de herramientas.
- Herramientas tipadas y validadas.
- Estado de proyecto/timeline estructurado.
- Operaciones versionadas y reversibles.
- Snapshots y logs.
- FFmpeg como motor determinista.
- Whisper/VAD para audio y transcripción.
- FCPXML/artefactos como puente cuando un editor no ofrece una API adecuada.
- Adaptadores separados por editor.
## De nuestra plataforma existente
- Hermes como agente reutilizable.
- OpenClaw cuando exista una capacidad concreta que justifique su incorporación.
- OmniRoute/adaptador como capa de routing de modelos.
- Memory, Policy, Observability y Mission Control del Agentic Intelligence Platform cuando estén validados.
## Lo que construiremos nosotros
1. Director/Orchestrator.
1. Content Constitution / Editorial Rules.
1. Media Intelligence e índice semántico.
1. Editing DSL/API abstracta.
1. QC y rúbrica de evaluación.
1. Integración de memoria de decisiones creativas.
1. Adapters únicamente donde la integración existente no sea suficiente.
## Principio de diseño
```LLM / AGENT
    ↓ decide
EDITING DSL / TOOL API
    ↓ valida
DETERMINISTIC ENGINE
    ↓ ejecuta
ARTIFACT
    ↓
QC
El valor propio estará en orquestar, decidir, evaluar y aprender, no en reescribir herramientas audiovisuales maduras.
## Regla de descarte
Si una pieza no reduce trabajo humano, no mejora calidad/velocidad o añade complejidad sin retorno medible, queda fuera de V1.


===== Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 🎬 AI Content Agency — Proyecto V1 / Reels de referencia — análisis de ganchos, edición y marca =====


-- base de datos en "Notion / AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro / 🎬 AI Content Agency — Proyecto V1 / Reels de referencia — análisis de ganchos, edición y marca": 150 filas; columnas: Texto de la publicación, Cuenta, Gancho (primeras palabras), Estilo de edición, Comentarios, Formato, Fuentes, Reproducciones, Enlace, Duración (s), Formato detallado, Por qué funciona, Tipo de gancho, Likes, B-roll, Música, Colores, Reel
   · @bastian.xu · Tutorial con demostración
   · @mentalchisociety · Clip de película con título
   · @ponteati · Encuesta con opciones numeradas
   · @checouperezcuadra · Busto en exterior
   · @pulsooriginal · Documental con título fijo
   · @juradonegocios · Monólogo sobre negro
   · @hunterbrooksyt · Busto con tarjetas arriba
   · @ssebamkt · Vlog lifestyle sin cara (carrusel de 7 clips, 000-006)
   · @ebrahim · Clip de entrevista con título fijo
   · @heyjamesking · Comparativa A vs B con barras
   · @relatos348 · Explicativo de pizarra
   · @unaigoomezz · Busto en blanco y negro
   · @neurorandy · Lista numerada con columna de iconos
   · @austingeorgas · Selfie horizontal con cita
   · @juradonegocios · Lista numerada sobre negro
   · @ekkobuild · Clase con datos al lado
   · @arket.mkt · Pantalla partida con gráfico arriba
   · @alberto.riehl · Busto en exterior con subtítulo grande
   · @miguelangel.goldencapital · Lista por edades
   · @xiscogg · Comparativa A vs B
   · @alfredomarinn · Lista numerada con columna lateral
   · @cesar · Mosaico de cifras
   · @pulsooriginal · Documental con título fijo
   · @zee.bagz11 · Busto sobre captura
   · @arz.urus · Montaje de lujo con frase fija
   · @matparodi.mkt · Pantalla partida con dibujos animados
   · @hormozi · Historia con fotos
   · @ziad_zebra · Clip con título fijo
   · @ivanvibecodes · Lista numerada con cronómetro
   · @groomforwealth · Gancho fijo arriba con bandas negras
   · @paco.benitez · Busto con b-roll de fondo
   · @bryson.bowman · Busto con tarjetas de cine arriba
   · @victorperez.ia · Lista numerada con columna lateral
   · @tvtheforeman · Clip de calle con una palabra
   · @coralmujaes · Lista numerada con columna de iconos
   · @themarkshapiro · Clip de entrevista con subtítulo grande
   · @clogamez · Comparativa de tres columnas
   · @mrfreevalue · Montaje con título fijo
   · @diego.garciae · Comparativa A vs B
   · @gerardnuneez · Meme de gimnasio
   · @jorge_calzada100 · Encuesta con opciones A-E
   · @herasgrowth · Lista numerada a los lados
   · @austingeorgas · Selfie horizontal con cita
   · @colomonterg · Pantalla partida con diagrama arriba
   · @babystickley · Montaje con texto fijo arriba
   · @eliefarage · Meme de dos planos
   · @adrianguerraaa · Busto con tarjeta abajo
   · @peter.visuals · Motion graphics puro
   · @empresario_tips · Clip de orador con subtítulo cinético
   · @juradonegocios · Lista numerada sobre negro con cronómetro
   · @ahmedkabbaj2.0 · Busto con tarjetas arriba
   · @danmartell · Busto con título y avatares arriba
   · @oscar.dorado.finanzas · Explicativo con caricaturas
   · @tippoldavid · Clip de entrevista con subtítulo en caja
   · @zachking · Efectos especiales con humor
   · @alextroyy_ · Podcast con insertos gráficos
   · @estebanpiracruz · Collage de b-roll con persona recortada
   · @lclightbox · Sketch con clip de película
   · @morantttttttttttt · Lista numerada con contador
   · @paul.mccubbinn · Pantalla partida con animación arriba
   · @lavidadeunabratz · Podcast con título y b-roll abajo
   · @artem.novitckii · Captura de herramienta con texto
   · @wiseelliot · Podcast con subtítulo grande
   · @tinocontentt · Gancho fijo arriba con bandas negras
   · @babystickley · Montaje con texto fijo arriba
   · @victorherasemprendedor · Busto sobre negro con subtítulo grande
   · @javireelbe · Podcast con micro
   · @wealthivora · Animación sin cara
   · @franco.lulli · Lista numerada con columna lateral
   · @royrayfer · Demostración de herramienta
   · @cuzimroy · Una palabra por pantalla
   · @nassim.26700 · Busto con título y esquema
   · @arz.urus · Montaje de lujo con frase fija
   · @onsidianmen · Clip de podcast
   · @fernandogonzalezmentor · Reacción a clip
   · @hannahbhammond · Busto en coche con gráfico
   · @tinocontentt · Gancho fijo arriba con bandas negras
   · @christian_villar · Busto en exterior con subtítulo mixto
   · @gabrimolinaa · Busto con tarjetas de cine arriba
   · @diego.garciae · Comparativa A vs B
   · @mrliamrobins · Busto sobre capturas
   · @bastian.xu · Collage de b-roll con persona recortada
   · @jaelweberrealtor · Comparativa de tres niveles
   · @ecomsidehustleofficial · Busto sobre capturas
   · @zeidarellano · Collage de b-roll con persona recortada
   · @alfredomarinn · Comparativa A vs B
   · @paco.benitez · Clip de conferencia
   · @tobysaied · Conversación a dos
   · @ericmentorfitness · Selfie en exterior
   · @zeidarellano · Collage de b-roll con persona recortada
   · @nickjayala · Podcast oscuro con firma
   · @lisisgomezsm · Ilustración explicativa
   · @neuromark.pro · Vídeo ensayo de marca
   · @zacharywinterton · Motion graphics de marca
   · @fabipetruzzi · Lista numerada con columna lateral
   · @bastian.xu · Busto cercano con micro
   · @jesus.braincode · Comparativa A vs B
   · @alberto.riehl · Busto en exterior con subtítulo grande
   · @caronuvan · Comparativa A vs B
   · @zeidarellano · Collage de b-roll con persona recortada
   · @metromedia.house · Mosaico de clips
   · @ramongonzalez.media · Pantalla partida con diagrama arriba
   · @shiftto_abundance · Afirmaciones sobre visual abstracto
   · @thomaskralow · Escena montada con etiquetas
   · @_celiarubio · Busto con vídeo incrustado
   · @adrien.ninet · Motion graphics de interfaz
   · @estoicosesp · Clip de película con cita
   · @coralmujaes · Lista numerada con columna de iconos
   · @codebyjavi · Tutorial con pantalla
   · @mikolofit · Clasificación en tres columnas
   · @miguelangelcorreafx · Busto con titular grande
   · @checouperezcuadra · Lista con pantalla de apoyo
   · @alex_pro_fit · Lista numerada con columna lateral
   · @christianpolk · Clip de llamada con título en caja
   · @juradonegocios · Lista numerada sobre negro
   · @checouperezcuadra · Busto con bandas negras
   · @juanmota.fit · Tutorial fitness con tarjetas
   · @victorherashabla · Gancho fijo arriba con bandas negras
   · @tradernovato24 · Sketch casero
   · @osscarbapu · Collage de b-roll con persona recortada
   · @youtubemillonario · Comparativa A vs B
   · @cuzimroy · Una palabra por pantalla
   · @coachsocialmatias · Análisis de clip viral
   · @zeidarellano · Collage de b-roll con persona recortada
   · @leilahormozi · Busto oscuro con subtítulo pequeño
   · @gabrimolinaa · Busto con tarjetas de cine arriba
   · @zeidarellano · Collage de b-roll con persona recortada
   · @tinocontentt · Gancho fijo arriba con bandas negras
   · @janbasx · Busto con título en caja
   · @whoismandachi · Clip cinematográfico con título fijo
   · @_trade_dna_ · Lista A vs B con iconos
   · @ramongonzalezdp · Gancho fijo arriba con bandas negras
   · @soyjoaquinvega · Diario con día numerado
   · @checouperezcuadra · Lista numerada con contador
   · @gabrimolinaa · Busto con tarjetas de cine arriba
   · @david7eduardo · Montaje emocional con frase
   · @danilodominguezcruz · Gancho fijo arriba con bandas negras
   · @menaboyy · Busto con título gráfico
   · @hoytrading · Clip con título y gráfico
   · @jaimehigueraes · Busto oscuro con subtítulo mixto
   · @automatribe1 · Grabación de pantalla a cámara
   · @vivajeshua · Busto con b-roll de pintura arriba
   · @jorgegarciamentor · Podcast con micro
   · @ryansterling · Busto con gráfico arriba
   · @eltegram · Comparativa A vs B
   · @santiagoclavijoarias · Tutorial con capturas
   · @rosa__baldo · Reacción emocional
   · @elpinguinodemario · Tutorial con pantalla
   · @realidadoculta.tv · Clip con título y sello
   · @grindyrix · Clip de orador con subtítulo cinético


===== Notion / MIT =====
→ [subpágina] Checklist diario (3 metas)


===== Notion / MIT / Checklist diario (3 metas) =====
## Cómo usar
- Cada día escribe 3 metas y marca cuando termines.
- Si no completas algo, muévelo al día siguiente (o reescríbelo si ya no aplica).
## Semana (plantilla)
## Hoy
[ ] Meta 1: 3 videos
[ ] Meta 2: Tares Espanol
[ ] Meta 3: Sistema Notion
[ ] Tarea cienci de datos


===== Notion / 2026 =====


-- base de datos en "Notion / 2026": 7 filas; columnas: Creado, Etiquetas, Nombre


===== Notion / 2026 / * Cerrar el año ganando almenos 2000usd al mes (2-3 clientes) =====



===== Notion / 2026 / *Exelentes calificaciones en la universidad =====



===== Notion / 2026 / *mantener rutina de ejercicio minimo 150 =====



===== Notion / 2026 / *Haber editado como minimo 10 videos al mes =====



===== Notion / 2026 / *empezar un proyecto propio (cuenta personal donde suba mis pensamientos o enseñanzas de manera artistica) 3 videos al mes =====



===== Notion / 2026 / 5 am de pie =====



===== Notion / 2026 / Rutina =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL =====
# 🎛️ Panel de control
> Todo el sistema vive aquí. Empieza por el tablero de la semana.
## 📚 Las secciones
→ [subpágina] 1. Visión, Objetivos y Prioridades
→ [subpágina] 2. Horarios y Rutinas
→ [subpágina] 3. Sistema de Productividad
→ [subpágina] 4. Cuerpo: Entrenamiento y Salud
→ [subpágina] 5. Sistema de Aprendizaje
→ [subpágina] 6. Negocio y Finanzas
→ [subpágina] 7. Identidad, Disciplina y Distracciones
→ [subpágina] 8. Plan de Implementación (30 y 90 días)
## ⚙️ Los sistemas vivos
→ [subpágina] 📆 Calendario (sincronizado con Notion Calendar)
→ [subpágina] 🗓️ Horario Semanal
→ [subpágina] Scorecard Diario
→ [subpágina] 🎬 Práctica Deliberada
→ [subpágina] 💼 Pipeline de Clientes
→ [subpágina] 🧭 Revisión Semanal
→ [subpágina] 🎥 Pipeline de Producción de Video
## 🏛️ Mis 4 pilares
## 🚦 Fase actual: Semanas 1–4
Solo dos cosas. Todo lo demás espera su turno.
[ ] Despertar según el plan (semana 1 = 7:30 → semana 4 = 6:00)
[ ] Proteger los dos bloques profundos de la mañana
🎯 Las 5 acciones de mayor impacto
📋 Cómo usar este sistema cada día
## 📆 Calendario sincronizado
Esta es la base que se conecta con Notion Calendar. Tiene fechas reales (18–23 de agosto ya cargadas). Conecta esta base específica en la app — no "Horario Semanal" (esa es la plantilla, no tiene fechas).
> El objetivo no es tener días más ocupados. Es que mis acciones diarias sean votos por la persona que estoy construyendo.
> Documento vivo. Se revisa cada domingo 19:00 y se ajusta cada 30/90 días.
# 🎥 Pipeline de Producción de Video
## Cómo funciona (compártelo con tu colaborador)
El flujo: 🔴 Raw → ✂️ Recortado → 🎬 En edición → 👀 Revisión → 🔁 Correcciones (si hace falta) → ✅ Listo → 📤 Subido
1. Tu colaborador graba/recibe el material, lo sube a Drive, crea la tarjeta con el link en "Link Drive (raw)", y la mueve a ✂️ Recortado cuando termine su parte.
1. Tú tomas las tarjetas en "Recortado", las mueves a 🎬 En edición mientras trabajas, y a 👀 Revisión cuando termines — con el link del video editado.
1. Revisión: si algo necesita cambios, se anota en el campo "Comentarios de revisión" y la tarjeta vuelve a 🔁 Correcciones — la persona asignada ve exactamente qué corregir, sin necesidad de buscar el mensaje en el chat.
1. Cuando ya está aprobado: ✅ Listo → y al publicarlo, 📤 Subido.
Las dos vistas que tienes:
- 🗂️ Tablero de producción — vista Kanban, arrastras las tarjetas entre columnas (igual al sistema que recordabas).
- 🔥 Urgentes — solo lo marcado como prioridad urgente, para no perderlo entre lo demás.
Por qué esto reemplaza "Hecho" en el nombre del archivo: ahora cada video tiene su propio historial — quién lo tiene, qué falta, y para cuándo — en vez de depender de renombrar carpetas o preguntar por WhatsApp en qué va cada cosa.
→ [subpágina] 🎯 Enfoque Mensual


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 1. Visión, Objetivos y Prioridades =====
# Mi visión
Convertirme en un editor de video que conecta emocionalmente, no solo que hace cosas que se ven bien — y construir sobre eso una agencia sostenible, mientras avanzo en Ciencia de Datos y me convierto en alguien con cuerpo fuerte, temple para actuar sin motivación, y criterio para cortar lo que no sirve.
> ser → hacer → tener. No persigo resultados primero; construyo la identidad y los resultados siguen.
# Mis objetivos principales
# Mis prioridades (en este orden)
1. Habilidad de edición + primeros clientes ← prioridad absoluta
1. Sueño y energía ← la base que sostiene todo lo demás
1. Universidad (Ciencia de Datos)
1. Redes sociales / patrón de comida
> Todo lo que no esté aquí, espera. Si algo nuevo quiere entrar, algo tiene que salir.
# Las 5 acciones de mayor impacto
1. Proteger el bloque profundo de 7:35–9:45 todos los días. Es donde se construye el ingreso.
1. Sustituir consumo de tutoriales por recrear ediciones específicas — 80% haciendo, 20% viendo.
1. Ajustar el sueño gradualmente hasta 6:00 a.m. — desbloquea la energía de todo lo demás.
1. Reconectar con el cliente de 10€/reel mostrando trabajo nuevo, sin pedir nada.
1. Subir la fricción de Instagram — recupera ~3 h/día.
---n# Plan de 3 meses hacia los $500/mes (paso intermedio)n<table header-row="true">n<tr>n<td>Mes</td>n<td>Objetivo del mes</td>n<td>Acción clave</td>n</tr>n<tr>n<td>1 (sept–oct)</td>n<td>Reactivar cliente actual + prospectar 2-3 nuevos</td>n<td>Reconectar mostrando trabajo nuevo; enviar propuesta a 3 negocios/creadores locales</td>n</tr>n<tr>n<td>2 (oct–nov)</td>n<td>Cerrar 1 cliente nuevo, mantener el actual</td>n<td>Definir paquete de precio ($15-20/reel) para clientes nuevos; no renegociar tarifa con el actual todavía</td>n</tr>n<tr>n<td>3 (nov–dic)</td>n<td>Sostener 2 clientes activos, llegar a $500</td>n<td>Medir reels/semana, ajustar capacidad con el colaborador si hace falta</td>n</tr>n</table>n> Métrica semanal (no mensual): USD facturados por semana — para detectar atraso a tiempo, no el 30 de noviembre.


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 2. Horarios y Rutinas =====
> Los horarios detallados están en la base de datos Horario Semanal (en la página principal), filtrable por día.
# Reglas del horario
- Los dos bloques profundos de la mañana son intocables. Todo lo demás se puede mover.
- Los bloques de 13:30–15:00 y 15:15–17:00 son intercambiables entre universidad y edición según lo que apriete esa semana.
- Si un día no hay clase programada en la franja 18:00–22:00, ese bloque se libera para edición extra o para descansar sin culpa.
- Fin de semana: misma estructura, más relajada. Domingo protegido para familia.
# Mi rutina de mañana
Ver secuencia completa
# Mi rutina de noche
Ver secuencia completa
# Plan de ajuste de sueño (semanas 1–4)
Reglas no negociables:
- Luz natural directa apenas despierto
- Misma hora incluso fin de semana (±30 min máximo)
- Nada de siestas después de las 2 p.m.
- Dormir 2 h más tarde el sábado borra 4 días de progreso
> El problema no era la hora, era la duración. Dormía 10–11 h cuando necesito 7,5–8. Las 5 a.m. no son mágicas: si en la semana 4 el rendimiento a las 6:00–6:30 ya es bueno, ahí me quedo. Se decide con mis datos, no con un libro.


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 3. Sistema de Productividad =====
Herramienta: Obsidian (nota diaria simple). Nada más complejo — el sistema sirve a la producción, no la reemplaza.
# Ritmos del sistema
# Mi revisión semanal (Domingo 19:00–19:30)
Preguntas fijas
# Banco de referencia viral
Cada edit de práctica va a Obsidian con una nota de qué técnica intenté replicar. Esto se convierte con el tiempo en mi biblioteca de recursos reutilizables.


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 4. Cuerpo: Entrenamiento y Salud =====
# Entrenamiento
- Base actual: 150 flexiones + 150 sentadillas diarias (recomendación de mi psicólogo — se mantiene sin cambios)
- Movimiento diario: caminar en los descansos (9:45 y 15:00) en vez de quedarme sentado
- Recuperación: el sueño es la palanca #1 de energía física ahora mismo
> ⚠️ Cualquier progresión más allá de esto debe evaluarla un entrenador o fisioterapeuta en persona, no un plan genérico.
# Alimentación
Como bien y saludable gracias a mi abuela. El punto a observar es el patrón de comer entre comidas.
En semanas 5–8: solo observar, sin restringir. Anotar cuándo pasa y qué estaba haciendo antes.
> ⚠️ Si el patrón resulta frecuente o incómodo, vale la pena mencionárselo directamente a mi psicólogo — él sí puede evaluarlo con contexto real. No es algo que se resuelva con reglas de dieta genéricas.
# Meditación (desde semana 9)
- 5–10 min, mismo horario diario, justo después de la planificación matutina
- Enfoque en la respiración (focused attention) — el tipo con más evidencia y el más simple de sostener
- Conecta directo con Temple: entrenar tolerancia a la incomodidad en dosis controladas
> La evidencia muestra beneficios reales en atención y estado de ánimo, pero a partir de ~8 semanas de práctica diaria, no a los 3 días. Es una inversión, no un atajo.


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 5. Sistema de Aprendizaje =====
> Regla base: 80% haciendo, 20% consumiendo.
# Para edición (Oficio)
- Recrear ediciones virales específicas (un corte, un speed ramping, una transición exacta)
- Editar contenido real cada semana, aunque sea de práctica
- Buscar feedback específico: comparar lado a lado con el original que intenté igualar
- Tutoriales solo cuando me trabo en algo puntual, nunca como calentamiento
> Ver videos es aprendizaje pasivo — eso no es práctica deliberada. Acumular horas viendo contenido no mueve la habilidad.
# Para Ciencia de Datos
- Recuperación activa: después de cada clase grabada, cerrar el video y escribir de memoria los 3 conceptos clave
- Repetición espaciada: Anki o nota en Obsidian con revisión día 1, 3, 7, 14
- Enseñar: explicar el concepto en voz alta o a alguien más para detectar qué no entendí
# Mis materias este semestre
- Lectura e Interpretación de Textos
- Matemática Fundamental
- Lógica Matemática y Programación
- Algoritmos y Programación
- Introducción a Ciencia de Datos
- Construcción de Bases de Datos


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 6. Negocio y Finanzas =====
# Clasificación de actividades
# Acciones semanales prioritarias (próximas 4–6 semanas)
1. Reconectar con el contacto de 10€/reel — mostrar 2–3 piezas nuevas, sin pedir trabajo directamente. Que el nivel hable.
1. 1 pieza de portafolio nueva por semana, aunque no haya cliente.
1. Definir niche — short-form vertical es donde ya tengo tracción real. Probablemente ahí está la respuesta, no en explorar más opciones.
# Precio
No cobrar según "lo que cobran otros editores", sino según el valor entregado y la disposición a pagar del cliente. Un reel que genera ventas vale más que uno que solo se ve bien.
El modelo retainer mensual es la jugada correcta cuando tenga 2–3 clientes recurrentes.
# Mi sistema financiero
Estado actual: 0 ingresos, deuda de 200.000 COP.
- En cuanto entre el primer pago: liquidar la deuda completa antes de gastar en otra cosa.
- No construir sistema de inversión ni categorías complejas todavía. Eso llega cuando haya flujo real.
- Intentar armar un sistema financiero sofisticado sobre cero ingresos es exactamente el tipo de "organización que reemplaza producción" que debo evitar.
> ⚠️ Esto es estructura general, no asesoría financiera profesional.


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 7. Identidad, Disciplina y Distracciones =====
# Mis 4 pilares
Cada acción es un voto por la identidad que estoy construyendo.
Ejercicio diario (cierre nocturno): una frase por pilar respondiendo "¿qué hice hoy que fue un voto por esto?"
# Mis reglas contra las distracciones
> Para construir un hábito: gradual. Para eliminar un hábito diseñado para engancharme: subir la fricción de golpe.
1. Cerrar sesión de Instagram después de cada uso. No guardar la contraseña en el navegador. Escribirla a mano cada vez — esos 20 segundos eliminan el 80% de las entradas por aburrimiento.
1. Bloqueo por horario: extensión tipo StayFocusd o Cold Turkey bloqueando Instagram en 7:35–12:00 y 18:00–22:00. No depende de decidir en el momento.
1. Una ventana fija al día: 17:00–17:20. Fuera de eso, bloqueado por el sistema, no por mi fuerza de voluntad.
1. Declutter de 30 días: quitar lo opcional por completo un mes, luego reintroducir Instagram solo con propósito claro (promocionar mi trabajo).
# Lo que debo DEJAR de hacer
- ❌ Ver tutoriales sin aplicar nada (aprendizaje pasivo ≠ mejora)
- ❌ Instagram inconsciente (~4 h/día)
- ❌ Dormir 10–11 h y despertar arrastrando
- ❌ Intentar cambiar 6 áreas de vida al mismo tiempo
- ❌ Esperar a "tener motivación" para empezar el bloque profundo
- ❌ Confundir organizar el sistema con producir trabajo
# Lo que debo EMPEZAR a hacer
- ✅ Práctica deliberada con objetivo específico y feedback
- ✅ Publicar/mostrar trabajo aunque no esté perfecto
- ✅ Proteger 2 bloques profundos diarios como si fueran citas médicas
- ✅ Cerrar el día con las 4 preguntas de identidad
- ✅ Revisión semanal cada domingo, sin excepción
- ✅ Medir en vez de suponer


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 8. Plan de Implementación (30 y 90 días) =====
> Principio de mínimo viable: pocos cambios a la vez, para no abandonar por exceso.
# Plan de 90 días
# Mes 1 en detalle
Semana 1
Semana 2
Semana 3
Semana 4
# Resultado esperado a los 90 días
Nivel de edición recuperado → cliente reconectado → primera facturación → scorecard funcionando → sueño estabilizado en 6:00–6:30.


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 📆 Calendario (sincronizado con Notion Calendar) =====


-- base de datos en "Notion / MI SISTEMA OPERATIVO PERSONAL / 📆 Calendario (sincronizado con Notion Calendar)": 183 filas; columnas: Tipo, Cuándo, Pilar, Protegido, Bloque
   · Reunión ‣
   · 🎯 Meta: Recuperar edición y volver a facturar
   · 🎓 Fin de semestre — Compensar
   · 📱 Meta: Instagram <1h diaria
   · 😴 Meta: Sueño estable, energía real al despertar
   · 💰 Meta intermedia: $500 USD/mes, 2 clientes activos
   · CLASE — Ciencia de Datos (flexible si no hay clase ese día)
   · CLASE — Ciencia de Datos (flexible si no hay clase ese día)
   · CLASE — Ciencia de Datos (flexible si no hay clase ese día)
   · CLASE — Ciencia de Datos (flexible si no hay clase ese día)
   · CLASE — Ciencia de Datos (flexible si no hay clase ese día)
   · CLASE — Ciencia de Datos (flexible si no hay clase ese día)
   · CLASE — Ciencia de Datos (flexible si no hay clase ese día)
   · Ventana única de redes sociales (20 min)
   · Ventana única de redes sociales (20 min)
   · BLOQUE PROFUNDO #1 — Práctica deliberada de edición
   · Bloque flexible según lo que pida la semana
   · Ventana única de redes sociales (20 min)
   · BLOQUE PROFUNDO #1 — Práctica deliberada de edición
   · Descanso real, sin culpa
   · BLOQUE PROFUNDO #1 — Práctica deliberada de edición
   · Bloque flexible según lo que pida la semana
   · BLOQUE PROFUNDO #1 — Práctica deliberada de edición
   · Bloque flexible según lo que pida la semana
   · Descanso real, sin culpa
   · Descanso real, sin culpa
   · Bloque flexible según lo que pida la semana
   · Descanso real, sin culpa
   · BLOQUE PROFUNDO #1 — Práctica deliberada de edición
   · BLOQUE PROFUNDO #1 — Práctica deliberada de edición
   · Ventana única de redes sociales (20 min)
   · Descanso real, sin culpa
   · Descanso real, sin culpa
   · Bloque flexible según lo que pida la semana
   · Bloque flexible según lo que pida la semana
   · Descanso real, sin culpa
   · Ventana única de redes sociales (20 min)
   · Ventana única de redes sociales (20 min)
   · BLOQUE PROFUNDO #1 — Práctica deliberada de edición
   · Ventana única de redes sociales (20 min)
   · Bloque flexible según lo que pida la semana
   · Ducha + alistarse
   · Dormir — sostener para lograr 5am mañana
   · Ejercicio — entrenamiento matutino
   · Dormir — sostener para lograr 5am mañana
   · Ejercicio — entrenamiento matutino
   · Ducha + alistarse
   · Despertar + luz natural + agua (prueba 5am)
   · Ducha + alistarse
   · Despertar + luz natural + agua (prueba 5am)
   · Ejercicio — entrenamiento matutino
   · Dormir — sostener para lograr 5am mañana
   · Dormir — sostener para lograr 5am mañana
   · Dormir — sostener para lograr 5am mañana
   · Ducha + alistarse
   · Despertar + luz natural + agua (prueba 5am)
   · Dormir — sostener para lograr 5am mañana
   · Ducha + alistarse
   · Ejercicio — entrenamiento matutino
   · Despertar + luz natural + agua (prueba 5am)
   · Despertar + luz natural + agua (prueba 5am)
   · Ducha + alistarse
   · Ejercicio — entrenamiento matutino
   · Ejercicio — entrenamiento matutino
   · Despertar + luz natural + agua (prueba 5am)
   · Ejercicio — entrenamiento matutino
   · Despertar + luz natural + agua (prueba 5am)
   · Dormir — sostener para lograr 5am mañana
   · Ducha + alistarse
   · Reunión ‣
   · Reunión ‣
   · Descanso activo — caminar, estirar, agua
   · Desayuno con la abuela
   · Ventana única de redes sociales (20 min)
   · BLOQUE PROFUNDO #1 — Práctica deliberada de edición
   · Ejercicio — 150 flexiones + 150 sentadillas
   · Descanso real, sin culpa
   · CLASE — Ciencia de Datos
   · Almuerzo familiar
   · Desayuno + tiempo con la abuela
   · Bloque flexible según lo que pida la semana
   · Ducha + alistarse
   · Despertar + luz natural + agua
   · BLOQUE PROFUNDO #1 — Práctica deliberada de edición
   · Ducha + alistarse
   · Almuerzo en familia
   · Ventana única de redes sociales (20 min)
   · BLOQUE PROFUNDO #1 — Práctica deliberada de edición
   · BLOQUE PROFUNDO #1 — Práctica deliberada de edición
   · Despertar + luz natural + agua
   · Desayuno con la abuela
   · Descanso real, sin culpa
   · Dormir
   · Cena
   · Almuerzo en familia
   · Dormir
   · Desayuno familiar
   · Cena ligera + preparación para clase
   · Despertar + luz natural + agua
   · Cena ligera + preparación para clase
   · Despertar + luz + agua
   · Rutina nocturna — sin pantallas, lectura, cierre de 5 min
   · Ducha + alistarse
   · Break
   · Descanso real, sin culpa
   · Descanso activo — caminar, estirar, agua
   · Prepararse para salir
   · Almuerzo en familia
   · Break
   · Desayuno con la abuela
   · Dormir
   · Universidad — aula virtual, tareas, repaso
   · Despertar + luz natural + agua
   · Desayuno con la abuela
   · Ejercicio — 150 flexiones + 150 sentadillas
   · Break
   · Libre/personal — nada obligatorio
   · Bloque flexible — edición o universidad
   · TIEMPO EXTENDIDO DE FAMILIA — sin trabajo
   · Rutina nocturna + dormir
   · Planificación — 3 MIT del día
   · Ejercicio — 150 flexiones + 150 sentadillas
   · Universidad — aula virtual, tareas, repaso
   · Break
   · REVISIÓN SEMANAL + planificar la semana
   · Planificación — 3 MIT del día
   · Break
   · Despertar + luz + agua
   · Dormir
   · Despertar + luz natural + agua
   · Planificación — 3 MIT del día
   · Universidad — aula virtual, tareas, repaso
   · Ventana única de redes sociales (20 min)
   · Ejercicio
   · Desayuno con la abuela
   · Rutina nocturna — sin pantallas, lectura, cierre de 5 min
   · Descanso real, sin culpa
   · Cena ligera + preparación para clase
   · Revisión rápida de la semana
   · Cena ligera + preparación para clase
   · IGLESIA CON LA ABUELA — no se negocia
   · Ventana única de redes sociales (20 min)
   · Almuerzo en familia
   · CLASE — Ciencia de Datos
   · Libre — mandados, descanso
   · Ducha + alistarse
   · Universidad — aula virtual, tareas, repaso
   · Dormir
   · Rutina nocturna — sin pantallas, lectura, cierre de 5 min
   · Ejercicio — 150 flexiones + 150 sentadillas
   · Ventana única de redes sociales (20 min)
   · Cena ligera + preparación para clase
   · BLOQUE PROFUNDO #2 — Edición u outreach de negocio
   · Descanso activo — caminar, estirar, agua
   · BLOQUE PROFUNDO #2 — Edición u outreach de negocio
   · Bloque flexible — edición o universidad
   · Descanso activo — caminar, estirar, agua
   · Ejercicio — 150 flexiones + 150 sentadillas
   · BLOQUE PROFUNDO #2 — Edición u outreach de negocio
   · Descanso real, sin culpa
   · CLASE — Ciencia de Datos
   · Bloque flexible — edición o universidad
   · Ejercicio
   · CLASE — Ciencia de Datos
   · Planificación — 3 MIT del día
   · BLOQUE PROFUNDO #1 — Práctica deliberada de edición
   · Cena, tiempo libre, rutina nocturna
   · Bloque flexible — edición o universidad
   · Rutina nocturna — sin pantallas, lectura, cierre de 5 min
   · Ventana única de redes sociales (20 min)
   · BLOQUE PROFUNDO #2 — Edición u outreach de negocio
   · Bloque de edición/negocio (más corto)
   · Rutina nocturna — sin pantallas, lectura, cierre de 5 min
   · Tiempo social/personal — sin estructura
   · Planificación — 3 MIT del día
   · Ducha + alistarse
   · Universidad — aula virtual, tareas, repaso
   · CLASE — Ciencia de Datos
   · Almuerzo en familia
   · BLOQUE PROFUNDO #2 — Edición u outreach de negocio
   · Libre + preparar el lunes
   · Bloque flexible — edición o universidad
   · Descanso activo — caminar, estirar, agua


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal =====


-- base de datos en "Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal": 37 filas; columnas: Inicio, Franja, Pilar, Protegido, Día, Flexible, Estado, Tipo, Bloque


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / BLOQUE PROFUNDO #1 — Práctica deliberada de edición =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / REVISIÓN SEMANAL + planificar la semana =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Break =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Ejercicio — 150 flexiones + 150 sentadillas =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Rutina nocturna + dormir =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Planificación — 3 MIT del día =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / BLOQUE PROFUNDO #2 — Edición u outreach de negocio =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Rutina nocturna — sin pantallas, lectura, cierre de 5 min =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Desayuno + tiempo con la abuela =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Desayuno con la abuela =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Descanso real, sin culpa =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / TIEMPO EXTENDIDO DE FAMILIA — sin trabajo =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Descanso activo — caminar, estirar, agua =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Libre + preparar el lunes =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Cena ligera + preparación para clase =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / IGLESIA CON LA ABUELA — no se negocia =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Prepararse para salir =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Almuerzo en familia =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Bloque flexible — edición o universidad =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Despertar + luz natural + agua =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Ducha + alistarse =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Dormir =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / CLASE — Ciencia de Datos =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Universidad — aula virtual, tareas, repaso =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Cena =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Cena, tiempo libre, rutina nocturna =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Libre/personal — nada obligatorio =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Tiempo social/personal — sin estructura =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Ventana única de redes sociales (20 min) =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Bloque flexible según lo que pida la semana =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Almuerzo familiar =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Libre — mandados, descanso =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Bloque de edición/negocio (más corto) =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Revisión rápida de la semana =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Desayuno familiar =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Ejercicio =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🗓️ Horario Semanal / Despertar + luz + agua =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario =====


-- base de datos en "Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario": 19 filas; columnas: Horas práctica deliberada, MIT 2 ✓, MIT 1 ✓, Fecha, Horas de sueño, Bloques profundos cumplidos, Entrenamiento, Día completo, Diario: agradecimiento, MIT 1, Diario: qué evité, Notas del día, MIT 3, Diario: hice bien, Energía al despertar (1-5), Minutos Instagram, MIT 3 ✓, Diario: libre, Hora despertar, 3 MIT cumplidas, Puntaje, Motivo si falló un MIT, MIT 2, Día


===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 1/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 2/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 3/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 4/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 5/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 6/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 7/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 8/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 9/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 10/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 11/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 12/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 13/9/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 14/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 15/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 22/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 23/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 24/09/2026 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / Scorecard Diario / 30/09/205 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🎬 Práctica Deliberada =====


-- base de datos en "Notion / MI SISTEMA OPERATIVO PERSONAL / 🎬 Práctica Deliberada": 1 filas; columnas: Qué salió bien, Para portafolio, Técnica practicada, Qué mejorar, Referencia original, Minutos invertidos, Estado, Fecha, Pieza


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🎬 Práctica Deliberada / (sin título) =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 💼 Pipeline de Clientes =====


-- base de datos en "Notion / MI SISTEMA OPERATIVO PERSONAL / 💼 Pipeline de Clientes": 1 filas; columnas: Etapa, Ingreso mensual estimado, Tipo de trabajo, Tarifa por pieza, Último contacto, Piezas al mes, Notas, Próxima acción, Cliente / Prospecto


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 💼 Pipeline de Clientes / Contacto de 10€/reel (cliente anterior) =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🧭 Revisión Semanal =====


-- base de datos en "Notion / MI SISTEMA OPERATIVO PERSONAL / 🧭 Revisión Semanal": 1 filas; columnas: Fecha, Qué funcionó, Fase, Horas práctica total, Qué elimino, Sensación general, Prioridad #1 próxima semana, Qué NO funcionó, Qué estoy evitando, € facturados, Semana


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🧭 Revisión Semanal / 1–13 sept (arranque del sistema) =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🎥 Pipeline de Producción de Video =====


-- base de datos en "Notion / MI SISTEMA OPERATIVO PERSONAL / 🎥 Pipeline de Producción de Video": 4 filas; columnas: Asignado a, Fecha de grabación, Link Drive (raw), Cliente / Proyecto, Prioridad, Comentarios de revisión, Link Drive (editado), Fecha límite, Estado, Video


===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🎥 Pipeline de Producción de Video / IMG_3601 a IMG_3643 (lote sin recortar) =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🎥 Pipeline de Producción de Video / Hecho — tanda 1 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🎥 Pipeline de Producción de Video / 0820.mp4 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🎥 Pipeline de Producción de Video / Hecho — tanda 2 =====



===== Notion / MI SISTEMA OPERATIVO PERSONAL / 🎯 Enfoque Mensual =====
> Cada mes, uno de los 4 pilares recibe atención extra — sin abandonar los otros tres. No es una secuencia fija de 6 meses con temas genéricos: el pilar en foco lo elegimos según lo que el Scorecard y el journaling muestren que más lo necesita.
# Mes actual
Pilar en foco: Cuerpo
Por qué este pilar ahora: los primeros 7 días del Scorecard (1-7 sept) mostraron que entrenamiento, bloques profundos e Instagram se caen juntos exactamente en los días con más carga familiar (4, 5 y 6 de sept). Cuerpo es el primer dominó que cae cuando el resto pesa, y es el más controlable. Además la meta de sueño estable (1 oct) ya está cerca.
## Preguntas guía del mes
- Los días que NO entrené, ¿qué estaba pasando antes? ¿fue un día de carga familiar/emocional?
- ¿Puedo entrenar aunque el día esté emocionalmente pesado, en versión corta, en vez de saltarlo del todo?
- ¿Mi hora de despertar varía mucho (6am-8am)? ¿eso afecta mi energía más que las horas de sueño en sí?
## Acciones concretas del mes
[ ] Entrenar los 7 días de la semana, aunque en los días difíciles sea una versión reducida (10-15 min) en vez de saltarlo
[ ] Fijar una sola hora de despertar y sostenerla, incluso fines de semana, hacia la meta del 1 de octubre
[ ] Si un día la carga emocional es alta, entrenar ANTES de que llegue el desgaste del día (idealmente en la mañana)
## Revisión semanal (domingo)
- ¿Cumplí al menos 85% de las acciones esta semana?
- Si no: ¿ajusto el enfoque o ajusto la meta? (Regla: no cambiar la meta, cambiar el enfoque)
# Pregunta diaria (ya integrada en rutina de mañana)
> ¿Esto que estoy haciendo me acerca o me aleja de la persona que quiero ser?
# Historial de meses anteriores
(mover aquí el bloque de "Mes actual" cuando cierre el mes, antes de definir el siguiente)