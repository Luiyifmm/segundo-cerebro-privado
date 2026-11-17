import { Composition } from "remotion";
import { CapaSuelta, VersionCompleta } from "./Alternativas";
import { CLIENTE-A_FRAMES, ClienteA1, ClienteA2, ClienteA3, ClienteA4, ClienteA5 } from "./ClienteA";
import { Abundancia } from "./Abundancia";
import { Cadenas, Escuela, EscuelaB, LineaAzul } from "./ClienteA2";
import { CadenasCollage, EscuelaCollage } from "./ClienteACollage";
import { ClienteAEscuelaJulian, ClienteALibreJulian } from "./ClienteAJulian";
import { ClienteAIntroLista, ClienteALista, ClienteATitulo } from "./ClienteALista";
import { Cta } from "./Cta";
import { ClienteEAzucar, ClienteECierre, ClienteEPortada, ClienteEPortada2, ClienteEPortada3, ClienteEPortadaCalcula, ClienteEPortadaColumnas, ClienteEPortadaColumnas2, ClienteEPortadaLista, ClienteEResumen, ClienteESeguirReel, ClienteESuscribirse, ZonaIdeal } from "./ClienteE";
import { Marca } from "./Marca";
import { ClienteNCtaPregunta, ClienteNPortada, ClienteNPortadaGente } from "./ClienteN";
import { ClienteEAndorra } from "./ClienteEAndorra";
import { Ranking } from "./Ranking";
import { HistoriaIG } from "./HistoriaIG";
import { ClienteECarbos } from "./ClienteECarbos";
import { ClienteERombos } from "./ClienteERombos";
import { ClienteEClave } from "./ClienteEClave";
import { ClienteEMisterio } from "./ClienteEMisterio";
import { ClienteEBloquea } from "./ClienteEBloquea";
import { XRoja } from "./XRoja";
import { ClienteECalendario } from "./ClienteECalendario";
import { ClienteEGanchoTitulo, ClienteEGanchoEscena, ClienteEGanchoAzul } from "./ClienteEGancho";
import { ClienteEReelsFeed } from "./ClienteEReelsFeed";
import { ClienteECarrusel3D } from "./ClienteECarrusel3D";
import { ClienteERomboSigue } from "./ClienteERomboSigue";
import { ClienteEChatIntro } from "./ClienteEChatIntro";
import { ClienteESubeEmoji } from "./ClienteESubeEmoji";
import { ClienteNReloj } from "./ClienteNReloj";
import { Showreel } from "./Showreel";
import { Titulo } from "./Titulo";
import { Trial, framesDe } from "./Trials";
import { Trial6118, framesDe6118 } from "./Trials6118";
import { VtrialReticula } from "./VtrialReticula";
import { ClienteECalcula } from "./ClienteECalcula";
import { ClienteETriste } from "./ClienteETriste";
import { ClienteEContador } from "./ClienteEContador";
import { ClienteECalculaLista } from "./ClienteECalculaLista";
import { ClienteECalculaLista2 } from "./ClienteECalculaLista2";
import { ClienteESiQuieres } from "./ClienteESiQuieres";
import { ClienteERankingCat } from "./ClienteERankingCat";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Titulo"
        component={Titulo}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ texto: "MOTION GRAPHICS", subtexto: "hecho con Claude + Remotion" }}
      />
      <Composition id="Showreel" component={Showreel} durationInFrames={330} fps={30} width={1080} height={1920} />
      <Composition id="VtrialReticula" component={VtrialReticula} durationInFrames={785} fps={30} width={1080} height={1920} defaultProps={{ video: "clientea/original-editado.mp4", partes: [["¿Cuál", true], [" es tu ", false], ["mujer", true], ["?", false]] }} />
      {[21, 22, 23, 24, 25].map((n) => (
        <Composition key={"v" + n} id={`Vtrial${n}`} component={Trial6118} durationInFrames={framesDe6118(n)} fps={30} width={1080} height={1920} defaultProps={{ n }} />
      ))}
      {[ClienteA1, ClienteA2, ClienteA3, ClienteA4, ClienteA5].map((C, i) => (
        <Composition key={i} id={`ClienteA${i + 1}`} component={C} durationInFrames={CLIENTE-A_FRAMES} fps={30} width={1080} height={1920} />
      ))}
      <Composition id="AbundanciaA" component={Abundancia} durationInFrames={132} fps={30} width={1080} height={1920} defaultProps={{ parte: "a" }} />
      <Composition id="AbundanciaB" component={Abundancia} durationInFrames={114} fps={30} width={1080} height={1920} defaultProps={{ parte: "b" }} />
      <Composition id="CtaSeguir" component={Cta} durationInFrames={78} fps={30} width={1080} height={1920} defaultProps={{ usuario: "cliente_a_handle", nombre: "ClienteA Business | Marca Personal", pulsa: 1.7, y: 250 }} />
      {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
        <Composition key={"t" + n} id={`Trial${n}`} component={Trial} durationInFrames={framesDe(n)} fps={30} width={1080} height={1920} defaultProps={{ n }} />
      ))}
      <Composition id="ClienteEResumen" component={ClienteEResumen} durationInFrames={117} fps={30} width={1080} height={1920} defaultProps={{ items: [{ e: "💪", t: 2.2, x: 205, y: 560, txt: "fibra" }, { e: "🍗", t: 2.6, x: 870, y: 560, txt: "proteína" }, { e: "🏋️", t: 3.2, x: 540, y: 300, txt: "gran volumen" }] }} />
      <Composition id="ClienteEAzucar" component={ClienteEAzucar} durationInFrames={81} fps={30} width={1080} height={1920} defaultProps={{ emoji: "🍬", texto: "no alimenta", tEmoji: 0.4, tFlecha: 1.2, tTexto: 1.6 }} />
      <Composition id="ClienteNGuardar" component={ClienteECierre} durationInFrames={80} fps={30} width={1080} height={1920} defaultProps={{ tGuardar: 0.35, tCompartir: 0, tSeguir: 0, cuenta: "", y: 470, soloGuardar: true, color: "#D3261C", x: 840 }} />
      <Composition id="ClienteNChecklist" component={ClienteEMisterio} durationInFrames={140} fps={30} width={1080} height={1920} defaultProps={{ iconos: ["clientee-yt/iconos/guia.png"], t: 0.1, paso: 0, y: 560, lado: 280, color: "#FF3B30", rgb: "211,38,28", x: 230 }} />
      <Composition id="ClienteNGuardarCorto" component={ClienteECierre} durationInFrames={54} fps={30} width={1080} height={1920} defaultProps={{ tGuardar: 0.35, tCompartir: 0, tSeguir: 0, cuenta: "", y: 470, soloGuardar: true, color: "#D3261C", x: 860 }} />
      <Composition id="ClienteNPerfil" component={ClienteEBloquea} durationInFrames={61} fps={30} width={1080} height={1920} defaultProps={{ foto: "clienten/perfil/avatar.png", usuario: "cliente_handle", nombre: "ClienteN Pardo | Pérdida de grasa & Fitness", datos: [["14", "publicaciones"], ["207", "seguidores"], ["58", "seguidos"]], t: 0.05, tX: 99, y: 300, rojo: "#D3261C", conX: false, escala: 0.9 }} />
      <Composition id="ClienteECierreSeguir" component={ClienteECierre} durationInFrames={105} fps={30} width={1080} height={1920} defaultProps={{ tGuardar: 0, tCompartir: 0, tSeguir: 0.2, cuenta: "cliente_e_handle", y: 250, soloSeguir: true }} />
      <Composition id="ClienteECierre" component={ClienteECierre} durationInFrames={109} fps={30} width={1080} height={1920} defaultProps={{ tGuardar: 0.2, tCompartir: 0.65, tSeguir: 1.35, cuenta: "cliente_e_handle", y: 250 }} />
      <Composition id="ClienteEPortada" component={ClienteEPortada} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ l1: "Alimentos que te", grande: "quitan", l3: "el hambre" }} />
      <Composition id="ClienteEPortadaLista" component={ClienteEPortadaLista} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ persona: "", comidas: [], l1: "", grande: "", l3: "" }} />
      <Composition id="ClienteEPortadaCalcula" component={ClienteEPortadaCalcula} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ persona: "clientee/portada-calcula-persona.png", l1: "", grande: "", ops: [] }} />
      <Composition id="ClienteEPortada3" component={ClienteEPortada3} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ foto: "clientee/portada-grasa-musculo-c.jpg", l1: "Pierde grasa", grande: "sin perder", l3: "músculo", tam: 178 }} />
      <Composition id="ClienteESuscribirse" component={ClienteESuscribirse} durationInFrames={220} fps={50} width={1920} height={1080} />
      <Composition id="ClienteESeguirReel" component={ClienteESeguirReel} durationInFrames={132} fps={30} width={1080} height={1920} defaultProps={{ nombre: "cliente_e_handle", usuario: "@cliente_e_handle", subs: "Tips para perder grasa", avatar: "clientee/avatar-clientee.png", acento: "#FF5800", boton: "Seguir", hecho: "Siguiendo", icono: "check" }} />
      <Composition id="ClienteEAndorra" component={ClienteEAndorra} durationInFrames={400} fps={50} width={1920} height={1080} />
      <Composition id="ClienteESubeEmoji" component={ClienteESubeEmoji} durationInFrames={48} fps={30} width={1080} height={1920} defaultProps={{ img: "clientee/carbos/caramelo.png", t: 0.03, tFuera: 1.3, x: 470, y: 1330, tam: 300, color: "#1CFF4A" }} />
      <Composition id="ClienteEChatIntro" component={ClienteEChatIntro} durationInFrames={173} fps={30} width={1080} height={1920} defaultProps={{ lineas: [{ img: "clientee/kfc/chica.png", texto: "“¿Vamos al KFC después de entrenar??”", t: 0.15 }, { img: "clientee/kfc/chico.png", texto: "“Mejor ven a casa y te lo hago”", t: 2.05 }], y: 470, tam: 47 }} />
      <Composition id="ClienteNCtaPregunta" component={ClienteNCtaPregunta} durationInFrames={92} fps={30} width={1080} height={1920} defaultProps={{ arriba: "Y TÚ", roja: "¿Cuántas calorías", blanca: "comes al día?", pastilla: "Déjamelo en comentarios" }} />
      <Composition id="ClienteNPortadaGente" component={ClienteNPortadaGente} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ fotos: [], fina: "", roja: "", blanca: "" }} />
      <Composition id="ClienteERomboSigue" component={ClienteERomboSigue} durationInFrames={82} fps={30} width={1080} height={1920} defaultProps={{ x0: 500, x1: 212, y: 1040, subida: 295, tSube: 0.22, tDesde: 0.317, tHasta: 0.451, lado: 220 }} />
      <Composition id="ClienteEClave3" component={ClienteEClave} durationInFrames={159} fps={30} width={1080} height={1920} defaultProps={{ fondo: "CLAVE 3", num: "3", antes: "Mantener la", clave: "calma", t: 0.215, tFrase: 0.785, tFuera: 2.5, tiempos: [1.71, 2.19, 2.4], frase: false, y: 1490, color: "#FFF900" }} />
      <Composition id="ClienteEClave1" component={ClienteEClave} durationInFrames={82} fps={30} width={1080} height={1920} defaultProps={{ fondo: "CLAVE 1", num: "1", antes: "Dominar la", clave: "naturaleza humana", t: 0.12, tFrase: 0.68, tFuera: 2.4, tiempos: [0.66, 1.26, 1.95, 2.2], frase: false, y: 1490, color: "#FFF900", kFrase: 0.8 }} />
      <Composition id="ClienteECarrusel3D" component={ClienteECarrusel3D} durationInFrames={165} fps={30} width={1080} height={1920} defaultProps={{ reels: [{ src: "clientee-yt/stock/r4.mp4", desde: 27.5 }, { src: "clientee-yt/stock/r2.mp4", desde: 12 }, { src: "clientee-yt/stock/r1.mp4", desde: 3 }, { src: "clientee-yt/stock/r3.mp4", desde: 2 }], giros: [1.25, 2.2, 3.15, 4.1], dur: 0.4, fin: 5.5, oscuro: 0, ancho: 380, centroY: 1300 }} />
      <Composition id="ClienteEReelsFeed" component={ClienteEReelsFeed} durationInFrames={165} fps={30} width={1080} height={1920} defaultProps={{ t0: 0.25, paso: 1.3, fin: 5.5, oscuro: 0.55, reels: [{ src: "clientee-yt/stock/m24305.mp4", usuario: "coach.fitpro", texto: "Mi primer cliente del mes 💪", desde: 2 }, { src: "clientee-yt/stock/m23719.mp4", usuario: "entrena.conmigo", texto: "¡POR FIN! 🎉🎉", noti: "Pago recibido · 49 €", desde: 1 }, { src: "clientee-yt/stock/m47462.mp4", usuario: "trainer.online", texto: "Nuevo alumno hoy 🙌", desde: 1 }, { src: "clientee-yt/stock/m33031.mp4", usuario: "fit.coach", texto: "Otro cliente más 🥹", noti: "Pago recibido · 39 €", desde: 2 }] }} />
      <Composition id="ClienteEGanchoTitulo" component={ClienteEGanchoTitulo} durationInFrames={53} fps={30} width={1080} height={1920} defaultProps={{ rojo: "#FF0000", arriba: "3 HABILIDADES", abajo: "10/10", tAbajo: 1.15, y: 300 }} />
      <Composition id="ClienteEGanchoEscena" component={ClienteEGanchoEscena} durationInFrames={38} fps={30} width={1080} height={1920} defaultProps={{ texto: "10/10", rojo: "#FF0000" }} />
      <Composition id="ClienteEGanchoAzul" component={ClienteEGanchoAzul} durationInFrames={43} fps={30} width={1080} height={1920} defaultProps={{ palabras: [["de un hombre", 0], ["altamente", 0.06], ["peligroso", 0.85]] }} />
      <Composition id="ClienteECalendario" component={ClienteECalendario} durationInFrames={96} fps={30} width={1080} height={1920} defaultProps={{ meses: [{ nombre: "OCTUBRE", primero: 3, dias: 31, finde: 17 }, { nombre: "NOVIEMBRE", primero: 6, dias: 30, finde: 14 }, { nombre: "DICIEMBRE", primero: 1, dias: 31, finde: 19 }], tMarca1: 0.40, tPasa: 1.10, tMarca2: 1.65, y: 255, color: "#FF5800", escala: 0.7 }} />
      <Composition id="ClienteEPerfilEecofit" component={ClienteEBloquea} durationInFrames={68} fps={30} width={1080} height={1920} defaultProps={{ foto: "clientee/perfil/avatar-cliente_handle.png", usuario: "cliente_e_handle", nombre: "ClienteE Pardo | transformaciones físicas y Pérdida de grasa", datos: [["11", "publicaciones"], ["207", "seguidores"], ["64", "seguidos"]], t: 0.05, tX: 99, y: 300, rojo: "#FF5800", conX: false, escala: 0.9 }} />
      <Composition id="ClienteEPerfilEecofitLargo" component={ClienteEBloquea} durationInFrames={80} fps={30} width={1080} height={1920} defaultProps={{ foto: "clientee/perfil/avatar-cliente_handle.png", usuario: "cliente_e_handle", nombre: "ClienteE Pardo | transformaciones físicas y Pérdida de grasa", datos: [["11", "publicaciones"], ["207", "seguidores"], ["64", "seguidos"]], t: 0.05, tX: 99, y: 300, rojo: "#FF5800", conX: false, escala: 0.9 }} />
      <Composition id="XRoja" component={XRoja} durationInFrames={20} fps={30} width={1080} height={1920} defaultProps={{ color: "#D3261C", tam: 560, x: 540, y: 1060, grosor: 46 }} />
      <Composition id="ClienteEMentorSeguir" component={ClienteEBloquea} durationInFrames={90} fps={30} width={1080} height={1920} defaultProps={{ foto: "clientee-yt/perfil/avatar.png", usuario: "cliente_e2_handle", nombre: "ClienteE Rodriguez | Mentor de Entrenadores Online", datos: [["686", "publicaciones"], ["62,2 mil", "seguidores"], ["3844", "seguidos"]], t: 0.05, tX: 99, y: 300, rojo: "#FF0000", conX: false, escala: 0.9, tSeguir: 1.7 }} />
      <Composition id="ClienteEBloquea" component={ClienteEBloquea} durationInFrames={63} fps={30} width={1080} height={1920} defaultProps={{ foto: "clientee-yt/perfil/avatar.png", usuario: "cliente_e2_handle", nombre: "ClienteE Rodriguez | Mentor de Entrenadores Online", datos: [["686", "publicaciones"], ["62,2 mil", "seguidores"], ["3844", "seguidos"]], t: 0.1, tX: 1.04, y: 520, rojo: "#FF0000" }} />
      <Composition id="ClienteEMisterio" component={ClienteEMisterio} durationInFrames={66} fps={30} width={1080} height={1920} defaultProps={{ iconos: ["clientee-yt/iconos/guia.png", "clientee-yt/iconos/dinero.png", "clientee-yt/iconos/brazo.png"], t: 0.25, paso: 0.22, y: 560, lado: 230, color: "#FFF900" }} />
      <Composition id="ClienteEClave" component={ClienteEClave} durationInFrames={129} fps={30} width={1080} height={1920} defaultProps={{ fondo: "CLAVE 2", num: "2", antes: "Aprender a", clave: "leer a la gente", t: 0.13, tFrase: 0.95, tFuera: 1.9, tiempos: [0.76, 1.14, 1.27, 1.41, 1.49, 1.72], frase: false, y: 1490, color: "#FFF900" }} />
      <Composition id="ClienteERombos" component={ClienteERombos} durationInFrames={131} fps={30} width={1080} height={1920} defaultProps={{ nums: ["1", "2", "3"], t: 0.84, paso: 0.2, tFuera: 3.85, y: 470, lado: 212, color: "#FFF900" }} />
      <Composition id="ClienteERankingCat" component={ClienteERankingCat} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{ cats: [] } as any} calculateMetadata={({ props }: any) => ({ durationInFrames: Math.round((props.dur ?? 10) * 30) })} />
      <Composition id="ClienteESiQuieres" component={ClienteESiQuieres} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{ filas: [], tIn: 0.1, tOut: 30 } as any} calculateMetadata={({ props }: any) => ({ durationInFrames: Math.round((props.dur ?? 10) * 30) })} />
      <Composition id="ClienteECalculaLista2" component={ClienteECalculaLista2} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{ items: [], ops: [], tarjetas: [] } as any} calculateMetadata={({ props }: any) => ({ durationInFrames: Math.round((props.dur ?? 10) * 30) })} />
      <Composition id="ClienteECalculaLista" component={ClienteECalculaLista} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{ ops: [] } as any} calculateMetadata={({ props }: any) => ({ durationInFrames: Math.round((props.dur ?? 10) * 30) })} />
      <Composition id="ClienteEContador" component={ClienteEContador} durationInFrames={132} fps={30} width={1080} height={1920} />
      <Composition id="ClienteETriste" component={ClienteETriste} durationInFrames={62} fps={30} width={1080} height={1920} />
      <Composition id="ClienteECalcula" component={ClienteECalcula} durationInFrames={90} fps={30} width={1080} height={1920} defaultProps={{ piezas: [{ txt: "PESO", t: 0.2 }, { txt: "×", t: 0.6, tipo: "op" }, { txt: "30–35", t: 1.0 }, { txt: "=", t: 1.6, tipo: "op", fila: 1 }, { txt: "KCAL/DÍA", t: 1.9, tipo: "res", fila: 1 }], y: 250, tam: 96, dur: 3 } as any} calculateMetadata={({ props }: any) => ({ durationInFrames: Math.round((props.dur ?? 3) * 30) })} />
      <Composition id="ClienteECarbos" component={ClienteECarbos} durationInFrames={80} fps={30} width={1080} height={1920} defaultProps={{ items: [{ img: "clientee/carbos/baguette.png", nombre: "Pan", t: 0.13 }, { img: "clientee/carbos/pasta.png", nombre: "Pasta", t: 0.75 }, { img: "clientee/carbos/maiz.png", nombre: "Maíz", t: 1.45 }], y: 1330, tam: 230, tFuera: 2.25, glow: "rgba(255,226,190,1)" }} />
      <Composition id="HistoriaIG" component={HistoriaIG} durationInFrames={179} fps={30} width={860} height={1360} defaultProps={{ usuario: "valeria.vip", tiempo: "2 h", avatar: "clientea/avatar-historia.png", barras: 3, actual: 1, radio: 36, verificado: false }} />
      <Composition id="Ranking" component={Ranking} durationInFrames={3600} fps={30} width={1080} height={1920} defaultProps={{ items: [], titulo: "MEJORES DESAYUNOS", subtitulo: "PARA PERDER GRASA" }} />
      <Composition id="ClienteNReloj" component={ClienteNReloj} durationInFrames={80} fps={30} width={1080} height={1920} />
      <Composition id="ClienteEPortadaColumnas2" component={ClienteEPortadaColumnas2} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ fotos: [], l1: "", grande: "", l3: "" }} />
      <Composition id="ClienteEPortadaColumnas" component={ClienteEPortadaColumnas} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ fotos: [{ src: "clientee/cardio-escalera.png", x: 44, zoom: 1, etiqueta: "ESCALERA" }, { src: "clientee/cardio-cinta.png", x: 50, zoom: 1.1, etiqueta: "CINTA" }, { src: "clientee/cardio-eliptica.png", x: 52, zoom: 1, etiqueta: "ELÍPTICA" }], l1: "Estás haciendo", grande: "MAL", l3: "tu cardio", tam: 300 }} />
      <Composition id="ClienteEPortada2" component={ClienteEPortada2} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="ZonaIdeal" component={ZonaIdeal} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ x1: 556, x2: 946, y1: 1114, y2: 1296, texto: "ZONA IDEAL" }} />
      <Composition id="Escuela" component={Escuela} durationInFrames={104} fps={30} width={1080} height={1920} />
      <Composition id="EscuelaB" component={EscuelaB} durationInFrames={101} fps={30} width={1080} height={1920} />
      <Composition id="LineaAzul" component={LineaAzul} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="Cadenas" component={Cadenas} durationInFrames={111} fps={30} width={1080} height={1920} defaultProps={{ rompe: 1.45 }} />
      <Composition id="ClienteAEscuelaJulian" component={ClienteAEscuelaJulian} durationInFrames={101} fps={30} width={1080} height={1920} />
      <Composition id="ClienteALibreJulian" component={ClienteALibreJulian} durationInFrames={228} fps={30} width={1080} height={1920} />
      <Composition id="ClienteALista" component={ClienteALista} durationInFrames={450} fps={30} width={1080} height={1920} defaultProps={{ etiquetas: ["La manipuladora", "La orgullosa", "La inmadura", "La irrespetuosa", "La interesada"], paso: 5, color: "blanco" as const }} />
      <Composition id="ClienteAIntroLista" component={ClienteAIntroLista} durationInFrames={450} fps={30} width={1080} height={1920} defaultProps={{ titulo: "5 Mujeres Mediocres", etiquetas: ["La manipuladora", "La orgullosa", "La inmadura", "La irrespetuosa", "La interesada"], color: "negro" as const, y: 380, salto: 125 }} />
      <Composition id="ClienteATitulo" component={ClienteATitulo} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{ titulo: "5 Mujeres Mediocres" }} />
      <Composition id="EscuelaCollage" component={EscuelaCollage} durationInFrames={101} fps={30} width={1080} height={1920} />
      <Composition id="CadenasCollage" component={CadenasCollage} durationInFrames={106} fps={30} width={1080} height={1920} defaultProps={{ rompe: 1.45 }} />
      <Composition id="ClienteNPortada" component={ClienteNPortada} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ foto: "clienten/portada-pasos.jpg", linea: "mi reacción a tus", palabra: "PASOS", cola: "diarios", y: 225, tam: 335, estilo: "mixto", persona: "clienten/portada-pasos-persona.png" }} />
      <Composition id="Marca" component={Marca} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ c: "clientea", e: 1, zonas: false }} />
      <Composition id="Capa" component={CapaSuelta} durationInFrames={CLIENTE-A_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ v: 1, id: "" }} />
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((v) => (
        <Composition key={v} id={`Version${v}`} component={VersionCompleta} durationInFrames={CLIENTE-A_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ v }} />
      ))}
    </>
  );
};
