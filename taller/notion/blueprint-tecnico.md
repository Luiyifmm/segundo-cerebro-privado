

########## raíces: 10


===== Notion / Blueprint técnico V1 — Especificación de implementación profunda =====
# 1. Arquitectura
```USUARIO → MISSION CONTROL → INTELLIGENCE/POLICY
                              ├─ clarification
                              ├─ planning
                              ├─ delegation
                              ├─ approval
                              └─ evaluation
                                      ↓
                               AGENT RUNTIME
                              ├─ Hermes
                              ├─ OpenClaw
                              └─ futuros agentes
                                      ↓
                    ┌─────────────────┴─────────────────┐
                    ↓                                   ↓
               TOOL LAYER                         MODEL GATEWAY
            MCP / APIs / Files                  OmniRoute (candidato)
            Browser / Code                            ↓
                                             proveedores/modelos
                    └─────────────────┬─────────────────┘
                                      ↓
                           MEMORY & OPERATIONAL STATE
                     Knowledge / Episodic / Operational
PC local: desarrollo, UI inicial, repositorio y Obsidian. VPS: servicios persistentes, agentes/automatizaciones, gateway, estado y logs. La distribución exacta depende de D-007/D-008.
# 2. Protocolos
HTTP/JSON para comandos síncronos. Eventos persistidos para ejecución y observabilidad. No introducir una cola dedicada en V1 salvo que la concurrencia lo justifique.
Mensaje de tarea:
```{"task_id":"task_...","objective":"...","constraints":[],"requested_output":{"format":"markdown"},"autonomy_level":0,"created_at":"ISO-8601"}
Evento:
```{"event_id":"evt_...","task_id":"task_...","run_id":"run_...","type":"tool.call.completed","timestamp":"ISO-8601","source":"agent.hermes","payload":{}}
UI→API es síncrono; ejecución larga es asíncrona conceptualmente y se observa por estado/eventos; llamadas a modelos/herramientas pueden ser síncronas.
# 3. Componentes
Control: Mission Control propio, API, task registry, approval inbox. Ganancia: soberanía; riesgo: sobreinvertir en UI.
Intelligence: clarification, planner, delegator, policy engine, evaluator. V1: módulos simples; LLM solo donde aporte valor.
Agents: Hermes, OpenClaw y un adaptador interno de capacidades/estado. Ganancia: reutilizar runtimes; riesgo: cambios de API/licencia y duplicación.
Tools: MCP, APIs directas, workspace aislado, browser solo cuando sea necesario.
Memory: Obsidian para Knowledge; DB para Operational State; registro de episodios; artefactos.
Gateway: OmniRoute como candidato, detrás de un adaptador interno.
Infra: Linux VPS, PC local, Git, firewall/VPN, backups.
# 4. Interfaces
POST /tasks → recibe objetivo, restricciones y autonomía; devuelve task_id y estado.
GET /tasks/{id} → estado, plan, último evento, resultado y artefactos.
Planner → recibe tarea refinada + contexto; devuelve pasos, dependencias, agente, herramientas y riesgo.
Agent → recibe TaskExecutionContext; devuelve resultado, eventos, artefactos y métricas.
Tool → recibe herramienta + argumentos validados; devuelve resultado + error/latencia.
Memory → write(type,content,metadata), query(query,filters), promote(candidate_id).
Model → recibe contexto + parámetros + política; devuelve respuesta + modelo/proveedor + usage/latencia/error.
# 5. Datos
Operational State: Task, Run, Step, Agent, Tool, Approval, Artifact, ModelInvocation, Schedule.
Episodic Memory: Episode, Observation, Decision, Action, Outcome, Error, Lesson/Candidate Memory.
IDs mínimos: task_id, run_id, step_id, event_id. Todas las trazas deben reconstruirse por task/run.
# 6. Seguridad
Infra: usuario no root, SSH con clave, firewall mínimo, administración privada/VPN cuando se defina D-008, actualizaciones controladas, backups y restauración probada.
Secretos: nunca Git/prompts persistentes/logs; .env.example sin valores; variables de entorno inicialmente; rotación documentada.
Agentes: allowlist de herramientas, workspace separado, mínimo privilegio.
Red: no exponer runtimes directamente a Internet.
Datos: política explícita para decidir qué puede salir a proveedores externos.
# 7. Agentes
Perfil mínimo:
```id: research-agent
runtime: hermes
purpose: investigacion_y_sintesis
allowed_tools: [web_search, filesystem_read, filesystem_write_workspace]
forbidden_tools: [shell_admin, payments, external_publish]
max_autonomy: 1
model_policy: research-default
Hermes: agente general inicial. OpenClaw: automatización/integraciones donde aporte ventaja. Un agente nuevo requiere benchmark que justifique su existencia.
# 8. Memoria
Knowledge: ingesta → limpieza → clasificación → Markdown/Obsidian → enlaces → revisión → consolidación.
Episodic: al cerrar cada Run guardar objetivo, plan, acciones, resultados, errores, decisiones y lecciones candidatas.
Operational: tareas/jobs/agentes/artefactos en almacenamiento transaccional, no Markdown.
Promoción de episodios a conocimiento: propuesta/revisión primero; promoción totalmente automática queda fuera de V1.
# 9. Routing
Routing V1 visible y basado en política: compatibilidad → disponibilidad → política de privacidad → costo → latencia → calidad histórica.
Perfiles: cheap_fast, research, code, vision, private.
No entrenar todavía un router ML; primero acumular datos.
```candidatos → filtrar incompatibles/no autorizados → ordenar por perfil → costo/latencia como desempate → registrar decisión
# 10. Evaluación
Medir: correctitud, completitud, restricciones/formato, evidencia cuando aplique, errores de herramientas, latencia, costo, intervención humana y repetibilidad.
Reglas deterministas primero; LLM-as-judge solo donde aporte valor y con rúbrica versionada. Benchmark fundacional con revisión humana completa inicialmente.
Alertas: sobrecosto, herramienta fuera de allowlist, fallos repetidos, baja puntuación, aumento de autonomía, pérdida de memoria/contexto o comportamiento inesperado.
# 11. Observabilidad
Evento mínimo:
```{"event_id":"evt_...","task_id":"task_...","run_id":"run_...","timestamp":"ISO-8601","event_type":"model.call.completed","agent":"hermes","model":"model-name","provider":"provider","tool":null,"status":"success","duration_ms":4200,"cost_usd":0,"input_tokens":null,"output_tokens":null,"error_code":null,"evaluation":null,"metadata":{}}
UTC, sin secretos, correlación por task/run. Retención inicial simple; ampliar cuando exista volumen real.
# 12. Infraestructura
D-007 sigue abierto. Requisitos: Linux estable, CPU/arquitectura compatible, RAM suficiente, almacenamiento persistente, snapshots/backups o equivalente, firewall, SSH, restauración/migración, costo previsible y bajo lock-in.
Opciones: Oracle Always Free (costo potencialmente cero, límites/capacidad); Google Cloud (créditos/ecosistema, complejidad y expiración); VPS pago como Hostinger (previsibilidad/snapshots según plan, costo recurrente). Criterio: menor costo sostenible que ejecute V1 de forma estable.
D-008: preferencia provisional por VPN privada + firewall. Alternativas: SSH tunneling o HTTPS público autenticado. Revisar solo si una necesidad real lo exige.
D-009: SQLite si single-node y baja concurrencia; PostgreSQL si aparece concurrencia real/múltiples escritores; JSON/embebido solo para prototipos muy pequeños por riesgo de consistencia.
# 13. Mission Control
V1: Dashboard, detalle de Task, vista de agentes, approvals, logs y referencias de memoria. Controles: crear/cancelar/aprobar/rechazar/reintentar seguro/ver trazas/abrir artefactos.
V2: editor visual de workflows, routing visual, métricas históricas, comparación agente-modelo, skills avanzadas, multiusuario/RBAC y marketplace.
La UI no contiene la lógica crítica.
# 14. Workflows
Fundacional: investigación → análisis → informe.
Primer workflow de valor: Research Brief reproducible.
Entrada: pregunta + audiencia + formato + fecha de corte.
Salida: resumen, hallazgos, evidencia, incertidumbres, recomendaciones, Markdown y registro de ejecución.
Flujo: input → clarification → plan → research → evidence → analysis → draft → evaluation → memory/episode → final.
Siguientes candidatos: auditoría/diagnóstico de repositorio; pipeline documental de ingestión → clasificación → síntesis.
# 15. Pruebas
T1 happy path; T2 clarification; T3 tool policy; T4 approval; T5 restart/recovery; T6 secret leak scan; T7 model fallback; T8 memory persistence; T9 reconstruct execution from task/run; T10 cost limit.
Definition of Done: T1–T10 pasan, resultado evaluable, cero secretos expuestos, reinicio recuperable y evidencia reproducible.
# 16. Productización
Diferenciadores potenciales: Policy Layer, clarificación adaptativa, routing basado en evidencia, dataset de evaluación, workflows, skills, portabilidad, Mission Control, memoria/consolidación y observabilidad/costos.
No productizar aún: colección de herramientas, prompts aislados o dependencia de free tiers.
Ruta: laboratorio → benchmark → workflow repetible → ROI → blueprint reproducible → producto/servicio.
# Registro de decisiones derivadas
D-007 VPS — Decisión: pendiente. Razón: comparar requisitos/costo/capacidad actuales. Alternativas: Oracle/Google/VPS pago. Riesgo: elegir por precio. Revisión: benchmark de V1 + comparación actualizada.
D-008 Red — Decisión: preferencia provisional VPN + firewall. Razón: mínima superficie pública. Alternativas: SSH tunnel/HTTPS. Riesgo: pieza adicional. Revisión: necesidad pública o fricción demostrada.
D-009 Estado — Decisión: provisional SQLite para single-node. Razón: mínima complejidad. Alternativas: PostgreSQL/JSON. Riesgo: concurrencia limitada. Revisión: múltiples escritores o carga real.
D-010 Benchmark — Decisión: Research Brief. Razón: ejercita casi todas las capas sin acciones irreversibles. Riesgo: no cubre transacciones. Revisión: añadir automatización después de estabilizar V1.
D-011 Repo — Decisión: responsabilidades, no proveedores.
```agentic-platform/
├─ apps/mission-control/
├─ services/{policy,planner,evaluator,api}/
├─ agents/  workflows/  tools/  memory/
├─ infra/  tests/  docs/  scripts/
Razón: sustitución/comprensión. Riesgo: carpetas prematuras. Revisión: cuando el código real revele mejores fronteras.
D-012 Secretos — Decisión: fuera de repo/prompts; .env inicialmente; secret manager cuando escala. Razón: simplicidad segura. Riesgo: manejo manual. Revisión: múltiples entornos/usuarios, rotación frecuente o auditoría centralizada.
Principio de implementación: la especificación puede ser grande; la implementación debe ser pequeña. Orden: D-007/D-008 → infraestructura → D-009 → gateway → agente → workflow → memoria/observabilidad → evaluación → Mission Control → hardening → más workflows.
# Decisiones y diseño posteriores — cierre de D-007 y ejecución V1
## D-007 — VPS: cerrado
Decisión
Usar Oracle Cloud Always Free con OCI Ampere A1 ARM64 como infraestructura primaria de V1. Objetivo de instancia: 2 OCPU + 12 GB RAM, dentro del límite Always Free documentado para A1. La plataforma admite Ubuntu 24.04 aarch64 y Oracle documenta A1 como plataforma ARM de propósito general. La cuenta debe permanecer dentro de los recursos Always Free; no se autoriza consumo de pago en V1. citeturn0search0turn0search5turn2search11
Razón
Es la opción que mejor satisface simultáneamente el criterio de menor costo sostenible y los requisitos técnicos: 0 USD recurrentes dentro de los límites, 12 GB de RAM frente al 1 GB de la VM e2-micro gratuita de Google, almacenamiento de bloques Always Free y arquitectura Linux persistente. Google queda descartado para V1 porque su recurso gratuito de Compute Engine es demasiado pequeño para alojar con holgura gateway + runtime + estado + observabilidad. Un VPS pago aporta mayor previsibilidad, pero introduce un costo recurrente que no es necesario para validar V1. citeturn0search5turn0search1turn0search2
Alternativas consideradas
- Google Cloud e2-micro: excelente ecosistema y $300 iniciales, pero 1 e2-micro + 30 GB de disco + 1 GB de salida mensual no ofrece margen suficiente para el stack persistente. citeturn0search3turn0search8
- Hostinger KVM 2: 2 vCPU, 8 GB RAM y 100 GB NVMe, backups semanales y snapshots; es la alternativa operativa de respaldo si Oracle no ofrece capacidad. Actualmente publica precio promocional y renovación superior, por lo que no cumple el criterio de costo cero sostenible. citeturn0search2turn0search9
- Otros VPS: no se incorporan todavía; añadir proveedores sin una necesidad demostrada aumenta complejidad y dispersa la portabilidad.
Riesgo
1. Capacity: Oracle puede devolver out of host capacity para A1 en una región. Es un riesgo real documentado por Oracle. citeturn0search5
1. ARM64: alguna dependencia futura podría tener binario o imagen exclusivamente x86_64.
1. Free Tier drift: límites y disponibilidad del Always Free pueden cambiar.
1. Proveedor único: la operación V1 dependerá temporalmente de OCI.
Condición que la haría revisarse
- No poder provisionar A1 en la región elegida tras 2 intentos razonables en 24 h o si la capacidad resulta inestable durante la prueba inicial → activar Hostinger KVM 2 como fallback.
- Una dependencia crítica de V1 demuestra incompatibilidad ARM64 sin alternativa mantenible → reevaluar x86_64.
- El stack excede de forma sostenida los límites Always Free → migrar a VPS pago.
- Oracle introduce un cambio que elimina la sostenibilidad económica o la restauración requerida.
## Efecto en cascada sobre D-008 y D-009
D-008 queda concretado, no reemplazado: V1 usará VPN privada + firewall, sin publicar Mission Control, APIs internas, SQLite ni gateways de agentes en Internet. La capa de red de OCI se restringirá mediante reglas de ingreso mínimas; Oracle recomienda reglas de origen específico y también recomienda Network Security Groups frente a depender únicamente de Security Lists. citeturn2search1turn2search6
Para V1 se adopta Tailscale como VPN de acceso administrativo porque permite conectar PC↔VPS sin abrir los servicios internos públicamente y ofrece plan Personal gratuito para uso individual. Su uso gratuito debe considerarse apropiado para laboratorio personal, no como garantía de una futura operación comercial. citeturn1search0
D-009 queda cerrado: SQLite para Operational State en V1. Razón: un único nodo, un único escritor lógico y baja concurrencia esperada. La interfaz de persistencia será propia para poder migrar a PostgreSQL sin cambiar los contratos superiores. PostgreSQL se activa cuando aparezcan múltiples escritores/concurrencia real o necesidad de operación multi-nodo.
# Etapa 1 — Infraestructura V1
## Topología de despliegue
```PC Windows
  ├─ Git / desarrollo
  ├─ Mission Control (desarrollo/local inicialmente)
  ├─ Obsidian / Knowledge Memory
  └─ Tailscale client
          │
          │ VPN privada
          ▼
OCI Ampere A1 — Ubuntu 24.04 aarch64
  ├─ systemd
  ├─ agentic-platform
  │   ├─ API
  │   ├─ policy/planner/evaluator
  │   ├─ Hermes
  │   └─ workflows
  ├─ OmniRoute (localhost)
  ├─ SQLite + backups
  ├─ logs/events
  └─ Tailscale
Principio: solo el mínimo necesario escucha en interfaces de red. Gateway, SQLite y runtime permanecen en loopback/private network. La administración entra por VPN/SSH. OCI Security List/NSG y firewall del host forman defensa en profundidad. citeturn2search7turn2search8
## Provisionamiento de referencia
1. Crear VCN y subnet mínima.
1. Crear VM VM.Standard.A1.Flex con 2 OCPU / 12 GB RAM.
1. Ubuntu 24.04 aarch64.
1. Disco de sistema y, si hace falta, un volumen separado para datos.
1. SSH únicamente con clave.
1. Registrar el nodo en Tailscale.
1. Instalar firewall local.
1. Crear usuario de servicio no-root.
1. Configurar actualizaciones de seguridad.
1. Crear estructura de /opt/agentic-platform, /var/lib/agentic-platform y /var/log/agentic-platform.
## Bootstrap de host
```sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ca-certificates jq unzip sqlite3 ufw fail2ban

sudo adduser --system --group --home /opt/agentic-platform agentic
sudo mkdir -p /opt/agentic-platform /var/lib/agentic-platform /var/log/agentic-platform
sudo chown -R agentic:agentic /opt/agentic-platform /var/lib/agentic-platform /var/log/agentic-platform

sudo ufw default deny incoming
sudo ufw default allow outgoing
# SSH solo debe quedar abierto según la política de acceso elegida.
sudo ufw allow 22/tcp
sudo ufw enable
La regla de SSH pública es solo de bootstrap si se necesita; una vez validado el acceso por VPN debe eliminarse o restringirse a la fuente autorizada. Oracle recomienda no dejar reglas de ingreso abiertas a 0.0.0.0/0 cuando no sean necesarias. citeturn2search6
## Backup V1
- Backup lógico periódico de SQLite.
- Copia cifrada de backup fuera del directorio activo.
- Mantener al menos una copia independiente del disco de la VM.
- Probar restauración, no solo creación del backup.
- No confiar exclusivamente en snapshots: un snapshot sirve como checkpoint operativo; el backup lógico es el mecanismo portable.
## Definition of Done — infraestructura
- VM A1 provisionada y estable.
- uname -m confirma aarch64.
- 2 OCPU / 12 GB configurados dentro de Always Free.
- SSH por clave funcionando.
- Acceso administrativo por VPN funcionando.
- Ningún servicio interno expuesto públicamente.
- Firewall activo.
- Usuario de servicio no-root funcionando.
- Git clone/pull y ejecución de un proceso simple funcionando.
- Backup SQLite creado y restaurado en una ubicación temporal.
- Reinicio de VM no destruye estado.
- docker no es requisito de V1: se evita añadir una capa si systemd basta.
# D-013 — Perfil de despliegue V1
Decisión: Ubuntu 24.04 aarch64 + systemd + procesos/servicios nativos, sin Kubernetes y sin Docker como requisito base.
Razón: reduce superficie de fallo y consumo de RAM en una VM pequeña; Ubuntu aarch64 está disponible oficialmente para OCI. Hermes mantiene Linux/ARM64 como plataforma Tier 1. citeturn2search11turn1search10
Alternativas consideradas: Docker Compose; Kubernetes; otra distribución Linux.
Riesgo: instalaciones menos encapsuladas y mayor trabajo manual de actualización.
Condición que la haría revisarse: más de un nodo, necesidad real de aislamiento de servicios, despliegues frecuentes que justifiquen contenedores o incompatibilidad de una dependencia con instalación nativa.
# Etapa 2 — D-009 / Operational State
## Modelo SQLite inicial
Tablas mínimas:
```tasks
runs
steps
agents
approvals
artifacts
model_invocations
schedules
workflow_events
Reglas:
- Un archivo SQLite principal por entorno.
- WAL activado.
- Foreign keys activadas.
- Migraciones versionadas en Git.
- Ningún servicio escribe directamente en tablas de otro módulo; acceso mediante repository/service layer.
- Eventos append-only dentro de workflow_events.
Configuración inicial:
```PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
PRAGMA busy_timeout = 5000;
tasks representa intención; runs representa una ejecución; steps representa unidades ejecutables. Un task puede tener varios runs, lo que permite retry/reproducibilidad sin sobrescribir historia.
Definition of Done:
- Crear task.
- Crear run asociado.
- Crear/actualizar steps.
- Registrar evento.
- Reiniciar proceso y recuperar task/run.
- Exportar DB y restaurarla en otra ruta.
- Dos procesos simultáneos no corrompen estado.
# Etapa 3 — Model Gateway
## D-014 — Gateway V1
Decisión: adoptar OmniRoute como gateway inicial, pero aislarlo detrás de un adaptador interno ModelGateway. El resto de la plataforma nunca llama a proveedores directamente.
Razón: satisface el requisito de endpoint OpenAI-compatible, routing/fallback y observabilidad, y reduce lock-in en los agentes. Su licencia publicada es MIT. citeturn1search9
Alternativas consideradas: llamadas directas desde Hermes; gateway propio mínimo; otro gateway.
Riesgo: proyecto externo sujeto a cambios y proveedores externos siguen siendo dependencias; el gateway no convierte modelos de pago en gratuitos.
Condición que la haría revisarse: incompatibilidad ARM, inestabilidad que afecte el benchmark, o que su routing impida aplicar las políticas propias. En ese caso, activar adaptador directo como fallback técnico sin cambiar los contratos internos.
## Contrato interno
```{
  "model_profile": "research",
  "messages": [],
  "constraints": {
    "max_cost_usd": 0.05,
    "max_latency_ms": 60000,
    "privacy": "standard"
  },
  "task_id": "task_..."
}
Respuesta normalizada:
```{
  "text": "...",
  "provider": "...",
  "model": "...",
  "input_tokens": 0,
  "output_tokens": 0,
  "cost_usd": 0,
  "duration_ms": 0,
  "request_id": "..."
}
## Instalación conceptual
Validar primero el método oficial/actual de OmniRoute para ARM64. El servicio debe escuchar en 127.0.0.1, no en 0.0.0.0, y quedar gestionado por systemd. La configuración de proveedores y API keys vive fuera de Git.
Definition of Done:
- /v1 responde localmente.
- Una llamada de prueba llega a un proveedor/modelo autorizado.
- Se registra provider/model/latencia/costo/resultado.
- Fallback funciona con un segundo candidato.
- Un agente puede usar el gateway sin conocer las credenciales del proveedor.
- Ninguna clave aparece en logs.
# Etapa 4 — Agente
## Hermes como runtime inicial
No instalar OpenClaw todavía por simetría. Hermes es el primer runtime porque ya cubre el caso general y mantiene soporte Linux/ARM64 Tier 1. La documentación actual recomienda conseguir primero una conversación limpia antes de añadir gateway, cron, skills o routing adicional. citeturn1search10turn1search7
Bootstrap de referencia:
```sudo -u agentic bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes
El runtime se encapsula con un perfil de agente propio:
```id: research-agent
runtime: hermes
purpose: research_and_synthesis
allowed_tools:
  - web_search
  - filesystem_read_workspace
  - filesystem_write_workspace
forbidden_tools:
  - shell_admin
  - payments
  - external_publish
max_autonomy: 1
model_policy: research
Definition of Done:
- Hermes completa una conversación normal.
- Hermes puede invocar el gateway.
- Herramientas permitidas funcionan.
- Herramientas prohibidas son rechazadas por la Policy Layer, no solo por prompt.
- El workspace del agente está aislado.
- Una ejecución genera task_id/run_id trazables.
# Etapa 5 — Primer workflow
## Research Brief reproducible
Entrada:
```{
  "question": "...",
  "audience": "...",
  "format": "markdown",
  "cutoff_date": "YYYY-MM-DD",
  "autonomy_level": 1
}
Pipeline:
```POST /tasks
  ↓
clarification
  ↓
plan
  ↓
research
  ↓
evidence registry
  ↓
analysis
  ↓
draft
  ↓
evaluation
  ↓
episode + artifacts
  ↓
final
El workflow debe poder ejecutarse dos veces con la misma entrada y dejar dos runs comparables. El resultado no se considera válido si no se puede reconstruir qué modelo, herramientas, fuentes y decisiones produjeron el documento.
Definition of Done:
- Produce Markdown.
- Incluye fuentes/evidencia cuando corresponda.
- Registra incertidumbres.
- Registra task/run/steps/model calls.
- Respeta autonomía y allowlist.
- Puede reintentarse sin destruir la ejecución anterior.
- Evaluador produce score y razones.
# Etapa 6 — Memoria + observabilidad
## Memoria
V1 separa claramente:
1. Operational: SQLite.
1. Episodic: registro de cada run y sus decisiones/acciones/resultados.
1. Knowledge: Markdown/Obsidian mantenido fuera de la DB transaccional.
Al finalizar un run:
```run closed
→ summarize objective/plan/actions/outcome/errors
→ create lesson candidates
→ attach artifact references
→ optionally propose knowledge promotion
→ human review before durable promotion
No guardar automáticamente todo el contexto bruto en Knowledge Memory.
## Observabilidad
Eventos mínimos:
```{
  "event_id":"evt_...",
  "task_id":"task_...",
  "run_id":"run_...",
  "step_id":"step_...",
  "event_type":"model.call.completed",
  "timestamp":"2026-09-12T00:00:00Z",
  "source":"agent.hermes",
  "status":"success",
  "duration_ms":4200,
  "provider":"...",
  "model":"...",
  "cost_usd":0,
  "error_code":null,
  "metadata":{}
}
Nunca registrar prompts completos si contienen secretos o datos que no sean necesarios para depuración. Registrar hashes/referencias cuando el cuerpo completo no sea necesario.
Definition of Done:
- Una ejecución completa puede reconstruirse desde logs + SQLite.
- Cada model/tool call tiene correlación.
- Latencia y costo son medibles.
- Errores tienen código y etapa.
- No hay secretos en eventos.
# Etapa 7 — Evaluación
Primero determinista:
- formato correcto;
- campos obligatorios;
- fuentes presentes;
- restricciones cumplidas;
- herramientas permitidas;
- coste dentro de límite;
- ejecución reconstruible.
Después, cuando el benchmark lo justifique, añadir evaluación semántica con rúbrica versionada.
Intervención humana obligatoria si:
- autonomía > 1;
- acción externa irreversible;
- score por debajo del umbral;
- evidencia insuficiente;
- proveedor/modelo inesperado;
- coste sobre límite;
- herramienta fuera de política.
Definition of Done:
- T1–T10 del Blueprint pasan.
- El benchmark tiene casos de éxito y fallo.
- Los criterios de aprobación son reproducibles.
# Etapa 8 — Mission Control V1
Implementar solo cuando el workflow CLI/API ya funcione.
V1:
```Dashboard
├─ Tasks
├─ Task detail
│  ├─ status
│  ├─ plan
│  ├─ steps
│  ├─ trace
│  └─ artifacts
├─ Approvals
├─ Agents
└─ Logs
La UI consume la API; no ejecuta directamente agentes ni contiene políticas críticas.
Definition of Done:
- Crear task desde UI.
- Ver estado.
- Ver trazabilidad.
- Aprobar/rechazar acciones.
- Cancelar ejecución.
- Abrir artefacto.
- Reintentar solo operaciones declaradas como seguras.
# Etapa 9 — Hardening
Antes de ampliar workflows:
- probar restauración real;
- revisar permisos de filesystem;
- revisar allowlists;
- escanear secretos;
- probar caída del gateway;
- probar caída/reinicio del agente;
- probar pérdida temporal de red;
- revisar límites de costo;
- revisar exposición pública con escaneo de puertos;
- documentar migración OCI → VPS alternativo.
No añadir complejidad de alta disponibilidad mientras el sistema siga siendo single-node.
Definition of Done:
- T1–T10 pasan después del hardening.
- Se puede reconstruir la instalación desde Git + documentación + backups.
- Se puede migrar el estado sin depender de una IP o proveedor concreto.
# Etapa 10 — Siguientes workflows
Orden recomendado:
1. Repository Audit: inspección → diagnóstico → evidencia → recomendaciones.
1. Document Pipeline: ingestión → extracción → clasificación → síntesis.
1. Automatización reversible: tareas con side effects controlados y aprobación.
OpenClaw entra solo si uno de estos workflows demuestra una capacidad que Hermes no cubre de forma suficientemente simple. El criterio no es tener dos agentes; es demostrar una ventaja medible.
# Resumen ejecutivo de implementación
```D-007 Oracle A1 Free ──┐
D-008 VPN + firewall ──┼→ infraestructura
D-009 SQLite ──────────┘
          ↓
      OmniRoute
          ↓
       Hermes
          ↓
 Research Brief
          ↓
 Memory + Observability
          ↓
      Evaluation
          ↓
   Mission Control
          ↓
      Hardening
          ↓
  Workflows adicionales
Regla de avance: no pasar de una etapa hasta que su Definition of Done esté demostrablemente cumplida. La siguiente inversión de tiempo debe ser infraestructura + estado operativo; no UI ni nuevos agentes.


