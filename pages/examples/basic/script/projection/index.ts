export {default as equirectangular } from "./equirectangular";
export {default as gans } from './gans';
export {default as gnomonic } from "./gnomonic";
export {default as halfplane } from "./halfplane";
export {default as hemi } from "./hemi";
export {default as klein } from "./klein";
export {default as orthographic } from "./orthographic";
export {default as poincare } from "./poincare";
export {default as stereographic } from "./stereographic";

export const enum projectionType {
  equirectangular = 'equirectangular',
  orthographic = 'orthographic',
  gnomonic = 'gnomonic',
  stereographic = 'stereographic',
  halfplane = 'halfplane',
  hemishere = 'hemisphere',
}