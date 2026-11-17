import {useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {loadFont as anton} from '@remotion/google-fonts/Anton';
import {loadFont as serif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as inter} from '@remotion/google-fonts/Inter';
import {loadFont as montserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as poppins} from '@remotion/google-fonts/Poppins';
import {loadFont as bebas} from '@remotion/google-fonts/BebasNeue';
import {loadFont as oswald} from '@remotion/google-fonts/Oswald';
import {loadFont as playfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as archivo} from '@remotion/google-fonts/ArchivoBlack';

/**
 * Las fuentes del editor y del render: las de Google y las pro del pack de Amin (public/fuentes, copiadas por
 * sala_libreria.py). Solo se carga la que se usa. Este archivo está copiado igual en el motor.
 */
export type Fuente = {id: string; nombre: string; grupo: 'Clásicas' | 'Google' | 'Pack pro'; peso: number; cargar: () => string};

const google = (f: () => {fontFamily: string}) => () => f().fontFamily;
// respaldo: si el archivo no está (SF Pro no puede ir al repo: licencia de Apple), se carga esa fuente de Google y se usa en su lugar
const pro = (id: string, archivo: string, respaldo?: () => string) => () => {
  const familia = `pro-${id}`;
  if (typeof document !== 'undefined' && ![...document.fonts].some((x) => x.family === familia)) {
    const h = delayRender(`Fuente ${id}`);
    const ff = new FontFace(familia, `url('${staticFile(`fuentes/${archivo}`)}')`);
    document.fonts.add(ff);
    ff.load().then(() => continueRender(h), () => { respaldo?.(); continueRender(h); });
  }
  return respaldo ? `${familia}, Inter, sans-serif` : familia;
};

export const FUENTES: Fuente[] = [
  {id: 'serif', nombre: 'Instrument Serif', grupo: 'Clásicas', peso: 400, cargar: google(() => serif('normal', {weights: ['400']}))},
  {id: 'sans', nombre: 'Inter Negrita', grupo: 'Clásicas', peso: 800, cargar: google(() => inter('normal', {weights: ['600', '800']}))},
  {id: 'anton', nombre: 'Anton', grupo: 'Clásicas', peso: 400, cargar: google(() => anton())},
  {id: 'montserrat', nombre: 'Montserrat Black', grupo: 'Google', peso: 900, cargar: google(() => montserrat('normal', {weights: ['900']}))},
  {id: 'poppins', nombre: 'Poppins', grupo: 'Google', peso: 800, cargar: google(() => poppins('normal', {weights: ['800']}))},
  {id: 'bebas', nombre: 'Bebas Neue', grupo: 'Google', peso: 400, cargar: google(() => bebas())},
  {id: 'oswald', nombre: 'Oswald', grupo: 'Google', peso: 700, cargar: google(() => oswald('normal', {weights: ['700']}))},
  {id: 'playfair', nombre: 'Playfair Display', grupo: 'Google', peso: 700, cargar: google(() => playfair('italic', {weights: ['700']}))},
  {id: 'archivo', nombre: 'Archivo Black', grupo: 'Google', peso: 400, cargar: google(() => archivo())},
  {id: 'sequel', nombre: 'Sequel Sans Heavy', grupo: 'Pack pro', peso: 400, cargar: pro('sequel', 'sequel.otf')},
  {id: 'sequel-bold', nombre: 'Sequel Sans Bold', grupo: 'Pack pro', peso: 400, cargar: pro('sequel-bold', 'sequel-bold.ttf')},
  {id: 'bernstein', nombre: 'Bernstein Heavy', grupo: 'Pack pro', peso: 400, cargar: pro('bernstein', 'bernstein.ttf')},
  {id: 'akira', nombre: 'Akira Expanded', grupo: 'Pack pro', peso: 400, cargar: pro('akira', 'akira.otf')},
  {id: 'komet', nombre: 'Komet Black', grupo: 'Pack pro', peso: 400, cargar: pro('komet', 'komet.otf')},
  {id: 'nyght', nombre: 'Nyght Serif', grupo: 'Pack pro', peso: 400, cargar: pro('nyght', 'nyght.ttf')},
  {id: 'nyght-italic', nombre: 'Nyght Serif Italic', grupo: 'Pack pro', peso: 400, cargar: pro('nyght-italic', 'nyght-italic.ttf')},
  {id: 'garamond', nombre: 'Apple Garamond', grupo: 'Pack pro', peso: 400, cargar: pro('garamond', 'garamond.ttf')},
  {id: 'balboa', nombre: 'Balboa Condensed', grupo: 'Pack pro', peso: 400, cargar: pro('balboa', 'balboa.otf')},
  {id: 'sfpro-black', nombre: 'SF Pro Black Italic', grupo: 'Pack pro', peso: 400, cargar: pro('sfpro-black', 'sfpro-black.otf')},
  {id: 'sfpro-bold', nombre: 'SF Pro Display Bold', grupo: 'Pack pro', peso: 400, cargar: pro('sfpro-bold', 'sfpro-bold.otf', () => inter('normal', {weights: ['700']}).fontFamily)},
  {id: 'sfpro-medium', nombre: 'SF Pro Display Medium', grupo: 'Pack pro', peso: 400, cargar: pro('sfpro-medium', 'sfpro-medium.otf', () => inter('normal', {weights: ['500']}).fontFamily)},
  {id: 'montserrat-black', nombre: 'Montserrat Black Italic', grupo: 'Pack pro', peso: 400, cargar: pro('montserrat-black', 'montserrat-black.ttf')},
  {id: 'halagar', nombre: 'Halagar', grupo: 'Pack pro', peso: 400, cargar: pro('halagar', 'halagar.otf')},
  {id: 'signpainter', nombre: 'SignPainter', grupo: 'Pack pro', peso: 400, cargar: pro('signpainter', 'signpainter.ttf')},
  {id: 'impact', nombre: 'Impact', grupo: 'Pack pro', peso: 400, cargar: pro('impact', 'impact.ttf')},
];

const cache = new Map<string, string>();
/** La familia CSS de una fuente (la carga la primera vez; el render espera a que esté). */
export function familia(id: string | undefined, porDefecto: string): {fontFamily: string; fontWeight: number} {
  const f = FUENTES.find((x) => x.id === id) ?? FUENTES.find((x) => x.id === porDefecto)!;
  if (!cache.has(f.id)) cache.set(f.id, f.cargar());
  return {fontFamily: cache.get(f.id)!, fontWeight: f.peso};
}
export function useFuente(id: string | undefined, porDefecto: string) {
  useState(() => familia(id, porDefecto));
  return familia(id, porDefecto);
}
