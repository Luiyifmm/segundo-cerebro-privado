import { Composition } from "remotion";
import { EricGuia, EricBuscador } from "./EricGuiaCta";
import { CapaSuelta, VersionCompleta } from "./Alternativas";
import { AMIN_FRAMES, Amin1, Amin2, Amin3, Amin4, Amin5 } from "./Amin";
import { Abundancia } from "./Abundancia";
import { Cadenas, Escuela, EscuelaB, LineaAzul } from "./Amin2";
import { CadenasCollage, EscuelaCollage } from "./AminCollage";
import { AminEscuelaJulian, AminLibreJulian } from "./AminJulian";
import { AminIntroLista, AminLista, AminTitulo } from "./AminLista";
import { Cta } from "./Cta";
import { EricAzucar, EricCierre, EricPortada, EricPortada2, EricPortada3, EricPortadaCalcula, EricPortadaColumnas, EricPortadaColumnas2, EricPortadaLista, EricResumen, EricSeguirReel, EricSuscribirse, ZonaIdeal } from "./Eric";
import { Marca } from "./Marca";
import { NataliaCtaPregunta, NataliaPortada, NataliaPortadaGente } from "./Natalia";
import { EricAndorra } from "./EricAndorra";
import { Ranking } from "./Ranking";
import { AminRankingNegocios } from "./AminRankingNegocios";
import { HistoriaIG } from "./HistoriaIG";
import { EricCarbos } from "./EricCarbos";
import { EricRombos } from "./EricRombos";
import { EricClave } from "./EricClave";
import { EricMisterio } from "./EricMisterio";
import { EricBloquea } from "./EricBloquea";
import { XRoja } from "./XRoja";
import { EricCalendario } from "./EricCalendario";
import { EricGanchoTitulo, EricGanchoEscena, EricGanchoAzul } from "./EricGancho";
import { EricReelsFeed } from "./EricReelsFeed";
import { EricCarrusel3D } from "./EricCarrusel3D";
import { EricRomboSigue } from "./EricRomboSigue";
import { EricChatIntro } from "./EricChatIntro";
import { EricSubeEmoji } from "./EricSubeEmoji";
import { NataliaReloj } from "./NataliaReloj";
import { Showreel } from "./Showreel";
import { Titulo } from "./Titulo";
import { Trial, framesDe } from "./Trials";
import { Trial6118, framesDe6118 } from "./Trials6118";
import { VtrialReticula } from "./VtrialReticula";
import { EricCalcula } from "./EricCalcula";
import { EricTriste } from "./EricTriste";
import { EmausFuera } from "./EmausFuera";
import { EricContador } from "./EricContador";
import { EricCalculaLista } from "./EricCalculaLista";
import { EricCalculaLista2 } from "./EricCalculaLista2";
import { EricSiQuieres } from "./EricSiQuieres";
import { EricRankingCat } from "./EricRankingCat";

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
      <Composition id="EricGuia" component={EricGuia} durationInFrames={200} fps={50} width={1080} height={1920} defaultProps={{ dur: 4 }} />
      <Composition id="EricBuscador" component={EricBuscador} durationInFrames={150} fps={50} width={1080} height={1920} defaultProps={{ palabra: "FIT", tEscribe: 0.88 }} />
      <Composition id="Showreel" component={Showreel} durationInFrames={330} fps={30} width={1080} height={1920} />
      <Composition id="VtrialReticula" component={VtrialReticula} durationInFrames={785} fps={30} width={1080} height={1920} defaultProps={{ video: "amin/original-editado.mp4", partes: [["¿Cuál", true], [" es tu ", false], ["mujer", true], ["?", false]] }} />
      {[21, 22, 23, 24, 25].map((n) => (
        <Composition key={"v" + n} id={`Vtrial${n}`} component={Trial6118} durationInFrames={framesDe6118(n)} fps={30} width={1080} height={1920} defaultProps={{ n }} />
      ))}
      {[Amin1, Amin2, Amin3, Amin4, Amin5].map((C, i) => (
        <Composition key={i} id={`Amin${i + 1}`} component={C} durationInFrames={AMIN_FRAMES} fps={30} width={1080} height={1920} />
      ))}
      <Composition id="AbundanciaA" component={Abundancia} durationInFrames={132} fps={30} width={1080} height={1920} defaultProps={{ parte: "a" }} />
      <Composition id="AbundanciaB" component={Abundancia} durationInFrames={114} fps={30} width={1080} height={1920} defaultProps={{ parte: "b" }} />
      <Composition id="CtaSeguir" component={Cta} durationInFrames={78} fps={30} width={1080} height={1920} defaultProps={{ usuario: "aminbusinesss", nombre: "Amin Business | Marca Personal", pulsa: 1.7, y: 250 }} />
      {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
        <Composition key={"t" + n} id={`Trial${n}`} component={Trial} durationInFrames={framesDe(n)} fps={30} width={1080} height={1920} defaultProps={{ n }} />
      ))}
      <Composition id="EricResumen" component={EricResumen} durationInFrames={117} fps={30} width={1080} height={1920} defaultProps={{ items: [{ e: "💪", t: 2.2, x: 205, y: 560, txt: "fibra" }, { e: "🍗", t: 2.6, x: 870, y: 560, txt: "proteína" }, { e: "🏋️", t: 3.2, x: 540, y: 300, txt: "gran volumen" }] }} />
      <Composition id="EricAzucar" component={EricAzucar} durationInFrames={81} fps={30} width={1080} height={1920} defaultProps={{ emoji: "🍬", texto: "no alimenta", tEmoji: 0.4, tFlecha: 1.2, tTexto: 1.6 }} />
      <Composition id="NataliaGuardar" component={EricCierre} durationInFrames={80} fps={30} width={1080} height={1920} defaultProps={{ tGuardar: 0.35, tCompartir: 0, tSeguir: 0, cuenta: "", y: 470, soloGuardar: true, color: "#D3261C", x: 840 }} />
      <Composition id="NataliaChecklist" component={EricMisterio} durationInFrames={140} fps={30} width={1080} height={1920} defaultProps={{ iconos: ["eric-yt/iconos/guia.png"], t: 0.1, paso: 0, y: 560, lado: 280, color: "#FF3B30", rgb: "211,38,28", x: 230 }} />
      <Composition id="NataliaGuardarCorto" component={EricCierre} durationInFrames={54} fps={30} width={1080} height={1920} defaultProps={{ tGuardar: 0.35, tCompartir: 0, tSeguir: 0, cuenta: "", y: 470, soloGuardar: true, color: "#D3261C", x: 860 }} />
      <Composition id="NataliaPerfil" component={EricBloquea} durationInFrames={61} fps={30} width={1080} height={1920} defaultProps={{ foto: "natalia/perfil/avatar.png", usuario: "natalia.eecofit", nombre: "Natalia Pardo | Pérdida de grasa & Fitness", datos: [["14", "publicaciones"], ["207", "seguidores"], ["58", "seguidos"]], t: 0.05, tX: 99, y: 300, rojo: "#D3261C", conX: false, escala: 0.9 }} />
      <Composition id="EricCierreSeguir" component={EricCierre} durationInFrames={105} fps={30} width={1080} height={1920} defaultProps={{ tGuardar: 0, tCompartir: 0, tSeguir: 0.2, cuenta: "erick.eecofit", y: 250, soloSeguir: true }} />
      <Composition id="EricCierre" component={EricCierre} durationInFrames={109} fps={30} width={1080} height={1920} defaultProps={{ tGuardar: 0.2, tCompartir: 0.65, tSeguir: 1.35, cuenta: "erick.eecofit", y: 250 }} />
      <Composition id="EricPortada" component={EricPortada} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ l1: "Alimentos que te", grande: "quitan", l3: "el hambre" }} />
      <Composition id="EricPortadaLista" component={EricPortadaLista} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ persona: "", comidas: [], l1: "", grande: "", l3: "" }} />
      <Composition id="EricPortadaCalcula" component={EricPortadaCalcula} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ persona: "eric/portada-calcula-persona.png", l1: "", grande: "", ops: [] }} />
      <Composition id="EricPortada3" component={EricPortada3} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ foto: "eric/portada-grasa-musculo-c.jpg", l1: "Pierde grasa", grande: "sin perder", l3: "músculo", tam: 178 }} />
      <Composition id="EricSuscribirse" component={EricSuscribirse} durationInFrames={220} fps={50} width={1920} height={1080} />
      <Composition id="EricSeguirReel" component={EricSeguirReel} durationInFrames={132} fps={30} width={1080} height={1920} defaultProps={{ nombre: "erick.eecofit", usuario: "@erick.eecofit", subs: "Tips para perder grasa", avatar: "eric/avatar-erick.png", acento: "#FF5800", boton: "Seguir", hecho: "Siguiendo", icono: "check" }} />
      <Composition id="EricAndorra" component={EricAndorra} durationInFrames={400} fps={50} width={1920} height={1080} />
      <Composition id="EricSubeEmoji" component={EricSubeEmoji} durationInFrames={48} fps={30} width={1080} height={1920} defaultProps={{ img: "eric/carbos/caramelo.png", t: 0.03, tFuera: 1.3, x: 470, y: 1330, tam: 300, color: "#1CFF4A" }} />
      <Composition id="EricChatIntro" component={EricChatIntro} durationInFrames={173} fps={30} width={1080} height={1920} defaultProps={{ lineas: [{ img: "eric/kfc/chica.png", texto: "“¿Vamos al KFC después de entrenar??”", t: 0.15 }, { img: "eric/kfc/chico.png", texto: "“Mejor ven a casa y te lo hago”", t: 2.05 }], y: 470, tam: 47 }} />
      <Composition id="NataliaCtaPregunta" component={NataliaCtaPregunta} durationInFrames={92} fps={30} width={1080} height={1920} defaultProps={{ arriba: "Y TÚ", roja: "¿Cuántas calorías", blanca: "comes al día?", pastilla: "Déjamelo en comentarios" }} />
      <Composition id="NataliaPortadaGente" component={NataliaPortadaGente} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ fotos: [], fina: "", roja: "", blanca: "" }} />
      <Composition id="EricRomboSigue" component={EricRomboSigue} durationInFrames={82} fps={30} width={1080} height={1920} defaultProps={{ x0: 500, x1: 212, y: 1040, subida: 295, tSube: 0.22, tDesde: 0.317, tHasta: 0.451, lado: 220 }} />
      <Composition id="EricClave3" component={EricClave} durationInFrames={159} fps={30} width={1080} height={1920} defaultProps={{ fondo: "CLAVE 3", num: "3", antes: "Mantener la", clave: "calma", t: 0.215, tFrase: 0.785, tFuera: 2.5, tiempos: [1.71, 2.19, 2.4], frase: false, y: 1490, color: "#FFF900" }} />
      <Composition id="EricClave1" component={EricClave} durationInFrames={82} fps={30} width={1080} height={1920} defaultProps={{ fondo: "CLAVE 1", num: "1", antes: "Dominar la", clave: "naturaleza humana", t: 0.12, tFrase: 0.68, tFuera: 2.4, tiempos: [0.66, 1.26, 1.95, 2.2], frase: false, y: 1490, color: "#FFF900", kFrase: 0.8 }} />
      <Composition id="EricCarrusel3D" component={EricCarrusel3D} durationInFrames={165} fps={30} width={1080} height={1920} defaultProps={{ reels: [{ src: "eric-yt/stock/r4.mp4", desde: 27.5 }, { src: "eric-yt/stock/r2.mp4", desde: 12 }, { src: "eric-yt/stock/r1.mp4", desde: 3 }, { src: "eric-yt/stock/r3.mp4", desde: 2 }], giros: [1.25, 2.2, 3.15, 4.1], dur: 0.4, fin: 5.5, oscuro: 0, ancho: 380, centroY: 1300 }} />
      <Composition id="EricReelsFeed" component={EricReelsFeed} durationInFrames={165} fps={30} width={1080} height={1920} defaultProps={{ t0: 0.25, paso: 1.3, fin: 5.5, oscuro: 0.55, reels: [{ src: "eric-yt/stock/m24305.mp4", usuario: "coach.fitpro", texto: "Mi primer cliente del mes 💪", desde: 2 }, { src: "eric-yt/stock/m23719.mp4", usuario: "entrena.conmigo", texto: "¡POR FIN! 🎉🎉", noti: "Pago recibido · 49 €", desde: 1 }, { src: "eric-yt/stock/m47462.mp4", usuario: "trainer.online", texto: "Nuevo alumno hoy 🙌", desde: 1 }, { src: "eric-yt/stock/m33031.mp4", usuario: "fit.coach", texto: "Otro cliente más 🥹", noti: "Pago recibido · 39 €", desde: 2 }] }} />
      <Composition id="EricGanchoTitulo" component={EricGanchoTitulo} durationInFrames={53} fps={30} width={1080} height={1920} defaultProps={{ rojo: "#FF0000", arriba: "3 HABILIDADES", abajo: "10/10", tAbajo: 1.15, y: 300 }} />
      <Composition id="EricGanchoEscena" component={EricGanchoEscena} durationInFrames={38} fps={30} width={1080} height={1920} defaultProps={{ texto: "10/10", rojo: "#FF0000" }} />
      <Composition id="EricGanchoAzul" component={EricGanchoAzul} durationInFrames={43} fps={30} width={1080} height={1920} defaultProps={{ palabras: [["de un hombre", 0], ["altamente", 0.06], ["peligroso", 0.85]] }} />
      <Composition id="EricCalendario" component={EricCalendario} durationInFrames={96} fps={30} width={1080} height={1920} defaultProps={{ meses: [{ nombre: "OCTUBRE", primero: 3, dias: 31, finde: 17 }, { nombre: "NOVIEMBRE", primero: 6, dias: 30, finde: 14 }, { nombre: "DICIEMBRE", primero: 1, dias: 31, finde: 19 }], tMarca1: 0.40, tPasa: 1.10, tMarca2: 1.65, y: 255, color: "#FF5800", escala: 0.7 }} />
      <Composition id="EricPerfilEecofit" component={EricBloquea} durationInFrames={68} fps={30} width={1080} height={1920} defaultProps={{ foto: "eric/perfil/avatar-eecofit.png", usuario: "erick.eecofit", nombre: "Erick Pardo | transformaciones físicas y Pérdida de grasa", datos: [["11", "publicaciones"], ["207", "seguidores"], ["64", "seguidos"]], t: 0.05, tX: 99, y: 300, rojo: "#FF5800", conX: false, escala: 0.9 }} />
      <Composition id="EricPerfilEecofitLargo" component={EricBloquea} durationInFrames={80} fps={30} width={1080} height={1920} defaultProps={{ foto: "eric/perfil/avatar-eecofit.png", usuario: "erick.eecofit", nombre: "Erick Pardo | transformaciones físicas y Pérdida de grasa", datos: [["11", "publicaciones"], ["207", "seguidores"], ["64", "seguidos"]], t: 0.05, tX: 99, y: 300, rojo: "#FF5800", conX: false, escala: 0.9 }} />
      <Composition id="XRoja" component={XRoja} durationInFrames={20} fps={30} width={1080} height={1920} defaultProps={{ color: "#D3261C", tam: 560, x: 540, y: 1060, grosor: 46 }} />
      <Composition id="EricMentorSeguir" component={EricBloquea} durationInFrames={90} fps={30} width={1080} height={1920} defaultProps={{ foto: "eric-yt/perfil/avatar.png", usuario: "ericmentorfitness", nombre: "Eric Rodriguez | Mentor de Entrenadores Online", datos: [["686", "publicaciones"], ["62,2 mil", "seguidores"], ["3844", "seguidos"]], t: 0.05, tX: 99, y: 300, rojo: "#FF0000", conX: false, escala: 0.9, tSeguir: 1.7 }} />
      <Composition id="EricBloquea" component={EricBloquea} durationInFrames={63} fps={30} width={1080} height={1920} defaultProps={{ foto: "eric-yt/perfil/avatar.png", usuario: "ericmentorfitness", nombre: "Eric Rodriguez | Mentor de Entrenadores Online", datos: [["686", "publicaciones"], ["62,2 mil", "seguidores"], ["3844", "seguidos"]], t: 0.1, tX: 1.04, y: 520, rojo: "#FF0000" }} />
      <Composition id="EricMisterio" component={EricMisterio} durationInFrames={66} fps={30} width={1080} height={1920} defaultProps={{ iconos: ["eric-yt/iconos/guia.png", "eric-yt/iconos/dinero.png", "eric-yt/iconos/brazo.png"], t: 0.25, paso: 0.22, y: 560, lado: 230, color: "#FFF900" }} />
      <Composition id="EricClave" component={EricClave} durationInFrames={129} fps={30} width={1080} height={1920} defaultProps={{ fondo: "CLAVE 2", num: "2", antes: "Aprender a", clave: "leer a la gente", t: 0.13, tFrase: 0.95, tFuera: 1.9, tiempos: [0.76, 1.14, 1.27, 1.41, 1.49, 1.72], frase: false, y: 1490, color: "#FFF900" }} />
      <Composition id="EricRombos" component={EricRombos} durationInFrames={131} fps={30} width={1080} height={1920} defaultProps={{ nums: ["1", "2", "3"], t: 0.84, paso: 0.2, tFuera: 3.85, y: 470, lado: 212, color: "#FFF900" }} />
      <Composition id="EricRankingCat" component={EricRankingCat} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{ cats: [] } as any} calculateMetadata={({ props }: any) => ({ durationInFrames: Math.round((props.dur ?? 10) * 30) })} />
      <Composition id="EricSiQuieres" component={EricSiQuieres} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{ filas: [], tIn: 0.1, tOut: 30 } as any} calculateMetadata={({ props }: any) => ({ durationInFrames: Math.round((props.dur ?? 10) * 30) })} />
      <Composition id="EricCalculaLista2" component={EricCalculaLista2} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{ items: [], ops: [], tarjetas: [] } as any} calculateMetadata={({ props }: any) => ({ durationInFrames: Math.round((props.dur ?? 10) * 30) })} />
      <Composition id="EricCalculaLista" component={EricCalculaLista} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{ ops: [] } as any} calculateMetadata={({ props }: any) => ({ durationInFrames: Math.round((props.dur ?? 10) * 30) })} />
      <Composition id="EricContador" component={EricContador} durationInFrames={132} fps={30} width={1080} height={1920} />
      <Composition id="EmausFuera" component={EmausFuera} durationInFrames={576} fps={30} width={1080} height={1920} />
      <Composition id="EricTriste" component={EricTriste} durationInFrames={62} fps={30} width={1080} height={1920} />
      <Composition id="EricCalcula" component={EricCalcula} durationInFrames={90} fps={30} width={1080} height={1920} defaultProps={{ piezas: [{ txt: "PESO", t: 0.2 }, { txt: "×", t: 0.6, tipo: "op" }, { txt: "30–35", t: 1.0 }, { txt: "=", t: 1.6, tipo: "op", fila: 1 }, { txt: "KCAL/DÍA", t: 1.9, tipo: "res", fila: 1 }], y: 250, tam: 96, dur: 3 } as any} calculateMetadata={({ props }: any) => ({ durationInFrames: Math.round((props.dur ?? 3) * 30) })} />
      <Composition id="EricCarbos" component={EricCarbos} durationInFrames={80} fps={30} width={1080} height={1920} defaultProps={{ items: [{ img: "eric/carbos/baguette.png", nombre: "Pan", t: 0.13 }, { img: "eric/carbos/pasta.png", nombre: "Pasta", t: 0.75 }, { img: "eric/carbos/maiz.png", nombre: "Maíz", t: 1.45 }], y: 1330, tam: 230, tFuera: 2.25, glow: "rgba(255,226,190,1)" }} />
      <Composition id="HistoriaIG" component={HistoriaIG} durationInFrames={179} fps={30} width={860} height={1360} defaultProps={{ usuario: "valeria.vip", tiempo: "2 h", avatar: "amin/avatar-historia.png", barras: 3, actual: 1, radio: 36, verificado: false }} />
      <Composition id="Ranking" component={Ranking} durationInFrames={3600} fps={30} width={1080} height={1920} defaultProps={{ items: [], titulo: "MEJORES DESAYUNOS", subtitulo: "PARA PERDER GRASA" }} />
      <Composition id="NataliaReloj" component={NataliaReloj} durationInFrames={80} fps={30} width={1080} height={1920} />
      <Composition id="EricPortadaColumnas2" component={EricPortadaColumnas2} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ fotos: [], l1: "", grande: "", l3: "" }} />
      <Composition id="EricPortadaColumnas" component={EricPortadaColumnas} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ fotos: [{ src: "eric/cardio-escalera.png", x: 44, zoom: 1, etiqueta: "ESCALERA" }, { src: "eric/cardio-cinta.png", x: 50, zoom: 1.1, etiqueta: "CINTA" }, { src: "eric/cardio-eliptica.png", x: 52, zoom: 1, etiqueta: "ELÍPTICA" }], l1: "Estás haciendo", grande: "MAL", l3: "tu cardio", tam: 300 }} />
      <Composition id="EricPortada2" component={EricPortada2} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="ZonaIdeal" component={ZonaIdeal} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ x1: 556, x2: 946, y1: 1114, y2: 1296, texto: "ZONA IDEAL" }} />
      <Composition id="Escuela" component={Escuela} durationInFrames={104} fps={30} width={1080} height={1920} />
      <Composition id="EscuelaB" component={EscuelaB} durationInFrames={101} fps={30} width={1080} height={1920} />
      <Composition id="LineaAzul" component={LineaAzul} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="Cadenas" component={Cadenas} durationInFrames={111} fps={30} width={1080} height={1920} defaultProps={{ rompe: 1.45 }} />
      <Composition id="AminEscuelaJulian" component={AminEscuelaJulian} durationInFrames={101} fps={30} width={1080} height={1920} />
      <Composition id="AminLibreJulian" component={AminLibreJulian} durationInFrames={228} fps={30} width={1080} height={1920} />
      <Composition id="AminLista" component={AminLista} durationInFrames={450} fps={30} width={1080} height={1920} defaultProps={{ etiquetas: ["La manipuladora", "La orgullosa", "La inmadura", "La irrespetuosa", "La interesada"], paso: 5, color: "blanco" as const }} />
      <Composition id="AminIntroLista" component={AminIntroLista} durationInFrames={450} fps={30} width={1080} height={1920} defaultProps={{ titulo: "5 Mujeres Mediocres", etiquetas: ["La manipuladora", "La orgullosa", "La inmadura", "La irrespetuosa", "La interesada"], color: "negro" as const, y: 380, salto: 125 }} />
      <Composition id="AminTitulo" component={AminTitulo} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{ titulo: "5 Mujeres Mediocres" }} />
      <Composition id="EscuelaCollage" component={EscuelaCollage} durationInFrames={101} fps={30} width={1080} height={1920} />
      <Composition id="CadenasCollage" component={CadenasCollage} durationInFrames={106} fps={30} width={1080} height={1920} defaultProps={{ rompe: 1.45 }} />
      <Composition id="NataliaPortada" component={NataliaPortada} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ foto: "natalia/portada-pasos.jpg", linea: "mi reacción a tus", palabra: "PASOS", cola: "diarios", y: 225, tam: 335, estilo: "mixto", persona: "natalia/portada-pasos-persona.png" }} />
      <Composition id="Marca" component={Marca} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{ c: "amin", e: 1, zonas: false }} />
      <Composition id="Capa" component={CapaSuelta} durationInFrames={AMIN_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ v: 1, id: "" }} />
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((v) => (
        <Composition key={v} id={`Version${v}`} component={VersionCompleta} durationInFrames={AMIN_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ v }} />
      ))}
      <Composition id="AminRankingNegocios" component={AminRankingNegocios as any} durationInFrames={1403} fps={29.97} width={1080} height={1920} defaultProps={{ negocios: [], tFin: 46.6, titulo1: "10 NEGOCIOS", titulo2: "DEL PEOR AL MEJOR", tColumna: 1.23, tTitulo: 3.0 } as any} calculateMetadata={({ props }: any) => ({ durationInFrames: Math.ceil((props.tFin ?? 46.6) * 29.97) + 2 })} />
    </>
  );
};
