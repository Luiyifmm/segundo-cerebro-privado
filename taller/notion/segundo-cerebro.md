
# PÁGINA: AGENTIC INTELLIGENCE PLATFORM — Segundo Cerebro
> Proyecto estratégico de infraestructura personal de agentes de IA. Este espacio será el punto de partida oficial para diseñar, construir, documentar, evaluar y eventualmente convertir el sistema en productos o servicios.
### Norte estratégico
Construir una plataforma modular que integre agentes, modelos, herramientas, memoria, planificación, evaluación y automatización sin quedar atada a un único proveedor.
Principio rector: utilidad demostrable → sistema estable → workflows reproducibles → producto → negocio.
### Estado actual
Etapa: Arquitectura y diseño V1.
Prioridad inmediata: cerrar el Blueprint técnico antes de instalar componentes de forma definitiva.
Regla: ninguna herramienta entra en la arquitectura solo porque sea interesante. Debe justificar una capacidad concreta, ser evaluada y tener alternativa razonable cuando sea posible.
### Arquitectura conceptual
```
USUARIO
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
```
### Capacidades objetivo
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
### Principios no negociables
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
### Componentes candidatos
### Decisiones y advertencias
- El repositorio de Agentic OS usado como referencia visual no debe convertirse automáticamente en la base de un producto comercial; su licencia y restricciones deben respetarse.
- No adoptamos como regla fija realizar 20–40 preguntas antes de actuar. Adoptamos clarificación adaptativa según ambigüedad, riesgo y necesidad de información.
- OmniRoute es una capa de routing, no la inteligencia del sistema.
- Obsidian no será tratado como toda la memoria: se separarán conocimiento, episodios y estado operativo.
- La distribución “Omarship” mencionada en un informe externo no está suficientemente verificada; queda fuera de la V1 hasta comprobar origen, soporte y utilidad.
- Hostinger, Oracle y Google deben tratarse como opciones intercambiables de infraestructura, no como decisiones irreversibles.
### Roadmap macro
#### Fase 0 — Arquitectura
Definir capacidades, interfaces, seguridad, memoria, evaluación y criterios de aceptación.
#### Fase 1 — Infraestructura
VPS/Linux, usuario no root, firewall, acceso privado, backups, monitoreo y recuperación.
#### Fase 2 — Gateway
OmniRoute, autenticación, proveedores, routing, límites y fallback.
#### Fase 3 — Agentes
Hermes + OpenClaw, herramientas, MCP, permisos y primeras tareas.
#### Fase 4 — Memoria
Knowledge/Episodic/Operational Memory, Obsidian y almacenamiento de estado.
#### Fase 5 — Intelligence Layer
Clarificación, planificación, delegación, aprobación y evaluación.
#### Fase 6 — Mission Control
Interfaz propia para supervisar agentes, tareas, modelos, memoria, costos y eventos.
#### Fase 7 — Automatización
Jobs programados, workflows y ejecución recurrente con controles.
#### Fase 8 — Validación
Pruebas fin-a-fin, reinicios, fallos, seguridad, costos, latencia y calidad.
#### Fase 9 — Productización
Identificar workflows con valor económico, empaquetarlos y diseñar una primera oferta.
### Métricas
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
### Criterio de V1 terminada
La V1 no estará terminada por tener muchas herramientas instaladas. Estará terminada cuando podamos ejecutar una tarea real de principio a fin: recibir una solicitud, aclararla si es necesario, planificarla, ejecutar herramientas/agentes, usar un modelo apropiado, guardar memoria/estado, evaluar el resultado y presentar evidencia del proceso de forma segura.
### Próximos documentos
1. Blueprint técnico definitivo V1.
1. Arquitectura de infraestructura y red.
1. Sistema de memoria.
1. Política de agentes, herramientas y autonomía.
1. Sistema de evaluación y observabilidad.
1. Diseño de Mission Control.
1. Registro de decisiones.
1. Backlog y experimentos.
1. Investigación de oportunidades de producto.
- [subpágina] 01 — Arquitectura y sistema
- [subpágina] 02 — Infraestructura y seguridad
- [subpágina] 03 — Agentes y herramientas
- [subpágina] 04 — Modelos y routing
- [subpágina] 05 — Memoria y conocimiento
- [subpágina] 06 — Mission Control
- [subpágina] 07 — Experimentos y benchmarks
- [subpágina] 08 — Workflows y automatizaciones
- [subpágina] 09 — Producto y negocio
- [subpágina] 10 — Fuentes y vigilancia tecnológica
- [subpágina] 🎬 AI Content Agency — Proyecto V1

## PÁGINA: 01 — Arquitectura y sistema
Área dedicada a la arquitectura, componentes, interfaces entre capas y decisiones técnicas del Agentic Intelligence Platform.

## PÁGINA: 02 — Infraestructura y seguridad
VPS, red, firewall, VPN, secretos, backups, recuperación, observabilidad y hardening.

## PÁGINA: 03 — Agentes y herramientas
Hermes, OpenClaw, MCP, skills, permisos, roles, herramientas y patrones de delegación.

## PÁGINA: 04 — Modelos y routing
Proveedores, modelos, OmniRoute, routing, costos, límites, benchmarks y fallback.

## PÁGINA: 05 — Memoria y conocimiento
Knowledge Memory, Episodic Memory, Operational State, Obsidian, ingesta documental y recuperación de contexto.

## PÁGINA: 06 — Mission Control
Diseño y desarrollo de la interfaz propia: tareas, agentes, memoria, costos, eventos, aprobaciones y observabilidad.

## PÁGINA: 07 — Experimentos y benchmarks
Pruebas controladas, resultados, comparaciones agente/modelo, fallos y aprendizajes.

## PÁGINA: 08 — Workflows y automatizaciones
Casos de uso reales, workflows reproducibles, jobs y automatizaciones.

## PÁGINA: 09 — Producto y negocio
Oportunidades de producto, servicios, IaC, consultoría, validación de mercado y futura comercialización.

## PÁGINA: 10 — Fuentes y vigilancia tecnológica
Documentación oficial, repositorios, licencias, cambios de versiones y decisiones que requieran revisión periódica.

## PÁGINA: 🎬 AI Content Agency — Proyecto V1
### 📚 Biblioteca del proyecto — Research & Intelligence
> Centro de investigación: competencia, repositorios GitHub, arquitectura reciclable, decisiones de integración y fuentes. Los documentos siguientes son la base viva de inteligencia del proyecto.
- ‣
- ‣
- ‣
Regla: cada nueva herramienta se registra con qué hace → qué reciclamos → licencia → riesgos → decisión → enlace.
> Proyecto independiente del Agentic Intelligence Platform. No modifica ni reemplaza el sistema de infraestructura/agentes existente. Lo reutiliza como plataforma cuando una capacidad esté validada.
### 0. Veredicto de diseño
Objetivo: construir una agencia de producción de contenido audiovisual dirigida por IA que pueda recibir un objetivo creativo, analizar los materiales disponibles, planificar la edición, ejecutar la mayor parte del trabajo automáticamente, revisar el resultado y entregar un proyecto/exportación utilizable.
Criterio rector: minimizar intervención humana sin sacrificar calidad creativa ni control.
Regla de arquitectura: no construiremos siete chatbots independientes. Construiremos un Director/Orquestador que coordina especialistas y herramientas deterministas sobre un estado de proyecto común.
Regla de producto: CapCut Pro sigue siendo el editor cotidiano; DaVinci Resolve Free se incorpora como segundo motor cuando aporte una ventaja demostrable; FFmpeg y herramientas locales ejecutan el trabajo mecánico y reproducible.
Regla económica: V1 debe poder demostrarse sin comprar software, APIs o infraestructura adicional. Si una capacidad requiere dinero, primero se busca sustituto local/open-source o se convierte en experimento opcional.
### 1. Qué estamos construyendo realmente
No estamos construyendo "una IA que edita videos".
Estamos construyendo un sistema de producción audiovisual autónomo:
```
OBJETIVO DEL CREADOR
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
```
El sistema debe poder explicar qué hizo, por qué lo hizo, qué herramienta utilizó y qué queda pendiente.
### 2. Usuario objetivo de V1
Primero: nosotros mismos como creador/editor.
Esto evita construir para un cliente hipotético. Cada capacidad debe resolver un problema que aparezca en una producción real.
#### Tipo de contenido inicial
Short-form vertical de 30–90 segundos, especialmente contenido motivacional, narrativo, talking-head y montajes musicales.
Razón: permite probar rápidamente idea → selección de clips → limpieza → ritmo → subtítulos → música → revisión → exportación sin necesitar un sistema completo de largometraje.
### 3. Definición de éxito
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
#### Métricas principales
Nota: estos números son objetivos de ingeniería, no promesas de calidad artística. Se revisan después del primer benchmark real.
### 4. Arquitectura aprobada para V1
```
                 ┌──────────────────┐
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
```
#### Importante: agentes ≠ herramientas
Agente: decide, interpreta, planifica y evalúa.
Herramienta: ejecuta una operación concreta de forma determinista.
Ejemplos:
- Whisper transcribe; el agente decide qué texto conservar.
- FFmpeg corta/concatena; el agente decide los cortes.
- detector de silencios mide silencios; el agente decide si eliminarlos.
- DaVinci/CapCut ejecuta edición; el agente prepara instrucciones/artefactos.
Esto reduce al mínimo las alucinaciones del LLM en operaciones audiovisuales.
### 5. Agentes V1
#### A — Director
Responsabilidad: convertir el objetivo del creador en un plan ejecutable.
Entrada: objetivo, duración, plataforma, material, estilo y restricciones.
Salida: brief creativo + estructura + criterios de éxito + plan de trabajo.
No edita directamente.
#### B — Media Librarian
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
#### C — Editing Worker
Responsabilidad: producir el rough cut.
Capacidades iniciales:
- detectar tomas utilizables;
- eliminar silencios;
- detectar repeticiones/takes fallidos;
- ordenar clips;
- ajustar duración;
- sincronizar con música cuando corresponda.
#### D — Caption/Audio Worker
Responsabilidad:
- transcripción;
- subtítulos;
- limpieza de diálogo;
- normalización;
- mezcla básica;
- detección de problemas de audio.
#### E — Visual Worker
Responsabilidad inicial:
- reencuadre;
- consistencia visual;
- decisiones de color reproducibles;
- motion graphics sencillos.
Color y motion no necesitan ser agentes independientes en V1. Se convierten en agentes separados solo cuando exista una carga de trabajo o criterio de decisión que lo justifique.
#### F — QC Director
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
### 6. Editores: estrategia dual
#### CapCut Pro
Rol: editor cotidiano y destino de producción inicial.
Ventaja: ya forma parte del flujo real y no necesitamos aprender otro editor para demostrar valor.
#### DaVinci Resolve Free
Rol: segundo backend de edición y laboratorio de automatización.
La investigación actual muestra que existen proyectos MCP que ya separan un "director" de un servidor que controla Resolve, con herramientas tipadas, verificación de cambios, planificación, revisión y almacenamiento de ejecuciones. Esto encaja con nuestra arquitectura y reduce el incentivo a construir esa capa desde cero. urlDaVinci-MCPhttps://github.com/Iamkewl/Davinci-MCP
También existen implementaciones que apuntan a automatizar Resolve Free mediante archivos de intercambio y herramientas locales, dejando el procesamiento determinista fuera del LLM. urlUnofficial DaVinci MCPhttps://github.com/wassermanproductions/unofficial-davinci-mcp
#### Decisión
No elegimos un editor único todavía.
Construimos primero una capa editorial abstracta:
Project → Assets → Timeline → Cuts → Captions → Audio → Visual Decisions → Export
Después conectamos backends.
### 7. Backend determinista
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
### 8. Integración con la plataforma existente
Este proyecto no reemplaza el Agentic Intelligence Platform.
Lo utiliza como infraestructura superior cuando esté disponible:
```
AGENTIC INTELLIGENCE PLATFORM
             ↓
     Model Gateway / Memory / Policy / Observability
             ↓
      AI CONTENT AGENCY
             ↓
 Director → Workers → Tools → Editors
```
La plataforma existente conserva su papel generalista.
Esta agencia es el primer dominio vertical real donde probaremos si esa arquitectura produce valor.
Referencia arquitectónica existente: ‣.
### 9. Build vs Buy vs Integrate
Regla: si un proyecto open-source resuelve ≥70% de una capacidad y tiene licencia/arquitectura aceptables, primero se integra o bifurca; no se reescribe.
### 10. Flujo operativo V1
#### Paso 1 — Intake automático
El usuario entrega:
- objetivo;
- archivos;
- plataforma;
- duración aproximada;
- referencia opcional.
El sistema inspecciona automáticamente los archivos antes de preguntar.
#### Paso 2 — Clarificación adaptativa
El Director pregunta solo si existe una ambigüedad que pueda cambiar significativamente el resultado.
Ejemplo: si ya existen vídeos, música, formato y duración, no preguntar de nuevo qué material tiene.
#### Paso 3 — Plan creativo
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
#### Paso 4 — Indexación
El Librarian analiza y etiqueta los assets automáticamente.
#### Paso 5 — Rough cut
Editing Worker crea un primer montaje sin requerir que el usuario coloque manualmente cada clip.
#### Paso 6 — Especialización
Cleanup → Captions/Audio → Visual.
#### Paso 7 — Ensamblaje
Se genera un artefacto de timeline independiente del editor.
#### Paso 8 — QC
El sistema inspecciona el resultado.
#### Paso 9 — Auto-repair
Si el error es corregible y seguro, se corrige automáticamente.
Ejemplos:
- subtítulo desfasado;
- silencio excesivo;
- audio fuera de rango;
- clip faltante;
- duración fuera del límite.
#### Paso 10 — Human gate
Solo se solicita intervención humana cuando:
- existe una decisión estética subjetiva de alto impacto;
- faltan assets esenciales;
- el sistema no puede resolver una contradicción;
- se requiere una acción irreversible/publicación.
#### Paso 11 — Export
Se genera:
- vídeo final;
- proyecto editable cuando sea posible;
- subtítulos;
- manifest del proyecto;
- informe QC;
- registro de ejecución.
### 11. Artefactos estándar
Todo proyecto debe producir:
```
project.json
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
```
Estos artefactos son la verdadera independencia del sistema respecto al editor.
### 12. Human-in-the-loop mínimo
#### Automático por defecto
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
#### Revisión humana
- dirección creativa final cuando el criterio sea subjetivo;
- aprobación de publicación;
- acciones destructivas o externas.
Objetivo: el humano actúa como director, no como operador de timeline.
### 13. Roadmap ejecutable
#### Fase 1 — Prueba de realidad
1. Crear repositorio nuevo del proyecto.
1. Instalar/verificar FFmpeg.
1. Instalar/verificar Whisper/faster-whisper.
1. Crear estructura mínima de proyecto.
1. Procesar automáticamente una carpeta real de vídeos.
1. Generar transcripciones y metadatos.
1. Producir un primer rough cut sin usar todavía CapCut.
Gate: si no podemos automatizar un vídeo simple de principio a fin, no añadimos más agentes.
#### Fase 2 — Director + Librarian
1. Definir project.json.
1. Crear índice de assets.
1. Implementar brief creativo.
1. Implementar selección basada en criterios.
1. Registrar decisiones.
Gate: el sistema debe poder recibir una carpeta y explicar qué assets utilizaría y por qué.
#### Fase 3 — Pipeline editorial
1. Cleanup.
1. Captions.
1. Audio.
1. Timeline.
1. Export.
Gate: vídeo vertical completo generado con mínima intervención.
#### Fase 4 — QC + auto-repair
1. Crear rúbrica.
1. Añadir comprobaciones deterministas.
1. Añadir revisión visual.
1. Añadir auto-repair seguro.
1. Repetir hasta alcanzar los objetivos de V1.
Gate: el sistema debe detectar sus errores más importantes antes de pedir al humano que revise.
#### Fase 5 — DaVinci / CapCut adapters
1. Evaluar DaVinci MCP existente.
1. Probar generación/importación de timeline.
1. Investigar qué partes de CapCut pueden automatizarse sin depender de una API frágil.
1. Comparar resultados contra el backend FFmpeg.
Gate: cada editor debe justificar su existencia por calidad, velocidad o control.
#### Fase 6 — Director autónomo
1. Integrar Hermes.
1. Conectar herramientas mediante permisos.
1. Añadir planificación/reintentos.
1. Conectar memoria/observabilidad del Agentic Platform.
1. Reducir intervención humana mediante métricas reales.
Gate final: producción de un vídeo real con ≤3 intervenciones humanas normales y trazabilidad completa.
### 14. Lo que deliberadamente NO construiremos todavía
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
### 15. Criterios de revisión de cada componente
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
### 16. Benchmark fundador
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
### 17. Puerta de aprobación del proyecto
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
### 18. Primera misión
Misión #001 — producir automáticamente un Reel vertical de 30–60 s a partir de una carpeta de material bruto + una instrucción creativa.
Resultado esperado:
```
INPUT
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
```
No añadiremos la siguiente capacidad hasta que esta misión funcione de forma repetible.
### 19. Estado
Estado: Diseño V1 aprobado para comenzar implementación.
Siguiente acción única: ejecutar la Misión #001 con un conjunto pequeño de archivos reales y medir el punto de partida.
Regla de trabajo: una capacidad funcional por vez; cada capacidad debe probarse antes de añadir otra.
- [subpágina] 📚 Research & Intelligence — Competencia, repos y reciclaje
- [subpágina] 🧩 Proyectos Git — Inventario de reutilización
- [subpágina] ♻️ Qué reciclaremos — Decisiones de arquitectura

### PÁGINA: 📚 Research & Intelligence — Competencia, repos y reciclaje
### 🚨 NUEVO HALLAZGO — HIGGSFIELD OPEN SOURCE (17 SEP 2026)
Alta prioridad para investigación. La organización oficial verificada de Higgsfield en GitHub mantiene públicos su CLI, Skills, SDKs y otros componentes. El CLI está bajo MIT y expone generación audiovisual, workflows, análisis y ejecución desde terminal; el paquete oficial de Skills conecta ese stack con agentes como Claude Code, Codex y Cursor. urlHiggsfield GitHub oficialhttps://github.com/higgsfield-ai
Acción: auditar estos repositorios antes de construir capacidades equivalentes. El hallazgo refuerza nuestra arquitectura Director → Skills/Tools → motores → QC, y abre la posibilidad de usar Higgsfield como capa de generación mientras nuestro sistema mantiene la orquestación, memoria, reglas editoriales y control de calidad.
Nueva referencia: 🚨 Higgsfield Open Source — Hell Grind + Agentic Stack — página hija de este banco.
Repositorio de inteligencia del proyecto AI Content Agency. Aquí guardaremos investigación de competencia, proyectos open-source, enlaces, decisiones de integración y componentes que podamos reciclar en lugar de construir desde cero.
### Regla de investigación
No reinventar lo que ya existe. Si una solución open-source resuelve aproximadamente ≥70% de una capacidad, primero evaluamos integración, adaptación o fork según licencia, calidad, mantenimiento y compatibilidad.
### 1. Competencia y patrones que reciclamos
#### OpusClip
Qué hace: transforma material bruto, especialmente talking-head, en contenido publicable mediante selección, captions, B-roll, motion, música y SFX; además permite dirigir cambios en lenguaje natural.
Qué reciclamos:
- flujo raw footage → producción → revisión humana mínima;
- idea de un Director/AI Producer;
- explicación de decisiones del sistema;
- edición dirigida por intención, no por operaciones aisladas.
Qué NO copiamos: backend cerrado ni producto completo.
#### Higgsfield AI Video Editor
Qué hace: edición basada en texto/transcripción, eliminación de silencios/rellenos, B-roll, limpieza de audio, captions, estabilización, color y reframing.
Qué reciclamos:
- edición por intención;
- transcript como interfaz de edición;
- pipeline unificado en vez de muchas herramientas desconectadas;
- automatización de limpieza + captions + audio + reframing.
#### Reuters + CuttingRoom ShortCut
Patrón importante: edición y búsqueda mediante lenguaje natural, reglas editoriales definidas en lenguaje natural y combinación de contenido externo con assets propios.
Qué reciclamos:
- una Content Constitution / Editorial Rules;
- MCP como capa de conexión entre agente y herramientas;
- human-in-the-loop para decisiones editoriales relevantes;
- reglas verificables antes de exportar.
#### Conclusión competitiva
No competiremos creando "otro editor con IA". La oportunidad es una capa de producción/orquestación que coordine modelos, agentes, herramientas y editores existentes.
### 2. Open-source / GitHub a evaluar
#### Pireel
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
#### DaVinci-MCP
Repositorio: https://github.com/Iamkewl/Davinci-MCP
Rol potencial: automatización de DaVinci Resolve mediante MCP.
Reciclable:
- separación Director → Resolve tools;
- herramientas tipadas;
- verificación de cambios;
- planificación/revisión;
- almacenamiento de ejecuciones.
Decisión provisional: integrar/evaluar antes de construir una capa propia equivalente.
#### Unofficial DaVinci MCP
Repositorio: https://github.com/wassermanproductions/unofficial-davinci-mcp
Rol potencial: automatización de Resolve, incluyendo workflows compatibles con Resolve Free mediante archivos de intercambio.
Reciclable:
- separación entre decisiones y procesamiento determinista;
- FCPXML/LUT workflows;
- generación de artefactos reproducibles.
#### mcpCut
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
#### MakeMyClip
Repositorio: https://github.com/MakeMyClip/editor
Rol potencial: referencia para editor AI-native local.
Reciclable:
- catálogo pequeño de herramientas deterministas;
- FFmpeg como motor;
- logs de sesión;
- snapshots/undo;
- JSON reproducible;
- ejecución local.
#### CapCut MCP — capcut-ai-editor
Repositorio: https://github.com/mrbuslov/capcut-ai-editor
Rol potencial: experimento para conectar nuestro sistema con CapCut, nuestro editor cotidiano.
Reciclable:
- lectura de subtítulos generados por CapCut;
- eliminación de silencios/takes duplicados;
- generación/exportación de proyecto CapCut.
Riesgo: dependencia de estructuras/proyectos locales de CapCut que pueden cambiar. No convertirlo en el núcleo del sistema.
#### CapCut MCP
Repositorio: https://github.com/burnshall-ui/capcut-mcp
Rol potencial: inspección/manipulación de proyectos locales CapCut.
Reciclable:
- inspección de timeline;
- lectura de clips;
- manipulación estructurada de JSON local.
Decisión provisional: usar como adaptador experimental, sujeto a pruebas de estabilidad.
### 3. Arquitectura que extraemos de la competencia
```
CREATOR
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
```
#### Principio central
LLM decide → DSL/API validada → herramienta ejecuta → QC verifica.
El LLM no debe recibir acceso indiscriminado a comandos FFmpeg ni modificar directamente estados frágiles.
### 4. Content Constitution — versión inicial
```
content_rules:
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
```
Estas reglas son una base inicial; se convertirán en configuración editable por proyecto/cliente.
### 5. Build vs Integrate
### 6. Qué NO debemos construir todavía
- Otro editor de vídeo completo.
- Un agente permanente por cada tarea pequeña.
- Nuestro propio motor de transcripción.
- Nuestro propio motor de render.
- Una UI compleja antes de probar el motor.
- Integraciones irreversibles con un único editor.
- Automatización basada en estructuras privadas de CapCut como dependencia nuclear.
### 7. Primer benchmark real
Vertical slice:
folder of video → media analysis → transcription → silence detection → cut plan → clean video → QC
Si esto funciona con material real, añadimos Director y posteriormente adapters/editor automation.
### 8. Métricas para decidir si una integración se queda
Una herramienta/proyecto solo permanece si demuestra:
1. reduce trabajo humano;
1. mejora calidad o velocidad;
1. es reproducible;
1. tiene licencia aceptable;
1. está suficientemente mantenido;
1. no crea dependencia crítica innecesaria;
1. puede sustituirse sin rediseñar todo el sistema.
### 9. Fuentes y enlaces principales
- OpusClip: https://www.opus.pro/
- Higgsfield: https://higgsfield.ai/
- Pireel: https://github.com/pireel/pireel
- DaVinci-MCP: https://github.com/Iamkewl/Davinci-MCP
- Unofficial DaVinci MCP: https://github.com/wassermanproductions/unofficial-davinci-mcp
- mcpCut: https://github.com/musyta-labs/mcpcut
- MakeMyClip Editor: https://github.com/MakeMyClip/editor
- CapCut AI Editor MCP: https://github.com/mrbuslov/capcut-ai-editor
- CapCut MCP: https://github.com/burnshall-ui/capcut-mcp
### 10. Estado
Research V1 — consolidado.
Próximo uso de esta página: registrar cada nueva herramienta/proyecto descubierto con qué hace → qué reciclamos → licencia → riesgo → decisión.
- [subpágina] 🚨 Higgsfield Open Source — Hell Grind + Agentic Stack

#### PÁGINA: 🚨 Higgsfield Open Source — Hell Grind + Agentic Stack
### Hallazgo — 17 septiembre 2026
Higgsfield ha publicado una parte importante de su stack y, según la organización oficial verificada de GitHub, mantiene actualmente repositorios públicos como CLI, Skills, SDKs y tooling. La organización oficial es higgsfield-ai, verificada por GitHub y vinculada a higgsfield.ai. citeturn1search0
#### Lo más relevante para nuestro proyecto
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
#### Impacto en AI Content Agency
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
#### Decisión provisional
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
#### Repositorios oficiales prioritarios
- Higgsfield GitHub: https://github.com/higgsfield-ai
- CLI: https://github.com/higgsfield-ai/cli
- Skills: https://github.com/higgsfield-ai/skills
#### Insight estratégico
La oportunidad más interesante no es que Higgsfield haya publicado código.
Es que están exponiendo un patrón muy cercano a nuestra visión:
agentes + skills + herramientas de generación + workflows + automatización desde terminal.
Eso refuerza nuestra decisión de construir una capa de orquestación propia, en lugar de construir desde cero cada motor audiovisual.
#### ⚠️ Importante
Encontramos varios proyectos llamados “Open Higgsfield” en GitHub que no pertenecen a Higgsfield AI. Por ejemplo, joymadhu49/open-higgsfield se declara independiente y no afiliado a Higgsfield AI. No deben mezclarse con los repositorios oficiales. citeturn0search0
Regla: para referencias críticas, priorizar la organización oficial higgsfield-ai y documentación directamente atribuible a Higgsfield.

### PÁGINA: 🧩 Proyectos Git — Inventario de reutilización
Inventario vivo de proyectos GitHub que podemos usar, integrar, adaptar o tomar como referencia.
### Criterio de entrada
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
### Regla
Primero integrar. Después adaptar. Solo construir desde cero cuando exista una razón clara.

### PÁGINA: ♻️ Qué reciclaremos — Decisiones de arquitectura
### De la competencia
- Flujo de producción orientado a objetivo.
- Director/AI Producer.
- Edición mediante lenguaje natural/transcripción.
- Búsqueda y selección inteligente de assets.
- Reglas editoriales explícitas.
- QC + revisión humana solo donde aporte valor.
### De proyectos open-source
- MCP como capa de herramientas.
- Herramientas tipadas y validadas.
- Estado de proyecto/timeline estructurado.
- Operaciones versionadas y reversibles.
- Snapshots y logs.
- FFmpeg como motor determinista.
- Whisper/VAD para audio y transcripción.
- FCPXML/artefactos como puente cuando un editor no ofrece una API adecuada.
- Adaptadores separados por editor.
### De nuestra plataforma existente
- Hermes como agente reutilizable.
- OpenClaw cuando exista una capacidad concreta que justifique su incorporación.
- OmniRoute/adaptador como capa de routing de modelos.
- Memory, Policy, Observability y Mission Control del Agentic Intelligence Platform cuando estén validados.
### Lo que construiremos nosotros
1. Director/Orchestrator.
1. Content Constitution / Editorial Rules.
1. Media Intelligence e índice semántico.
1. Editing DSL/API abstracta.
1. QC y rúbrica de evaluación.
1. Integración de memoria de decisiones creativas.
1. Adapters únicamente donde la integración existente no sea suficiente.
### Principio de diseño
```
LLM / AGENT
    ↓ decide
EDITING DSL / TOOL API
    ↓ valida
DETERMINISTIC ENGINE
    ↓ ejecuta
ARTIFACT
    ↓
QC
```
El valor propio estará en orquestar, decidir, evaluar y aprender, no en reescribir herramientas audiovisuales maduras.
### Regla de descarte
Si una pieza no reduce trabajo humano, no mejora calidad/velocidad o añade complejidad sin retorno medible, queda fuera de V1.