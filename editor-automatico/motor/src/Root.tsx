import React from 'react';
import {Composition, CalculateMetadataFunction} from 'remotion';
import {Reel, Edl, EDL_VACIA} from './Reel';
import {Marco} from './Marco';
import {Muestra, Montaje} from './Muestra';

const metaMuestra: CalculateMetadataFunction<Montaje> = ({props}) => ({
  durationInFrames: Math.ceil((props.duracion || 1) * (props.fps || 30)),
  fps: props.fps || 30,
});

const meta: CalculateMetadataFunction<Edl> = ({props}) => ({
  durationInFrames: Math.ceil((props.duracion || 1) * (props.fps || 30)),
  fps: props.fps || 30,
});

export const Root: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} defaultProps={EDL_VACIA} calculateMetadata={meta}
      durationInFrames={30} fps={30} width={1080} height={1920} />
    {/* Prueba del estilo de @marcoosaid (30-10) */}
    <Composition id="Marco" component={Marco} durationInFrames={297} fps={30} width={1080} height={1920} />
    {/* Sistema de edición adaptado de Luis (30-10): props = montaje.json de herramientas/edicion/sistema */}
    <Composition id="Muestra" component={Muestra} calculateMetadata={metaMuestra} defaultProps={{} as Montaje}
      durationInFrames={30} fps={30} width={1080} height={1920} />
  </>
);
