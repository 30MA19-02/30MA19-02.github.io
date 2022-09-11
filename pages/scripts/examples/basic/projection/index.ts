import { default as equirectangular } from './equirectangular';
import { default as gans } from './gans';
import { default as gnomonic } from './gnomonic';
import { default as halfplane } from './halfplane';
import { default as hemi } from './hemi';
import { default as klein } from './klein';
import { default as orthographic } from './orthographic';
import { default as poincare } from './poincare';
import { default as stereographic } from './stereographic';
import type { Manifold, Point } from '@30ma19-02/noneuclid/build/main/lib';
import type { Vector3 } from 'three';

export const enum projectionType {
  equirectangular = 'equirectangular',
  orthographic = 'orthographic',
  gnomonic = 'gnomonic',
  stereographic = 'stereographic',
  halfplane = 'halfplane',
  hemishere = 'hemisphere',
}

export type projectFunction = (f: Manifold, p: Point) => Vector3;

export const projector: (projection: projectionType) => projectFunction = (projection) => {
  switch (projection as projectionType) {
    case projectionType.equirectangular: {
      return (f, p) => {
        const projection = equirectangular;
        // Remove border
        return projection(f, p);
      }
    }

    case projectionType.orthographic: {
      return (f, p) => {
        const projection = f.lambda >= 0 ? orthographic : klein;
        // Remove overlapping
        return projection(f, p);
      }
    }

    case projectionType.gnomonic: {
      return (f, p) => {
        const projection = f.lambda >= 0 ? gnomonic : gans;
        return projection(f, p);
      }
    }

    case projectionType.stereographic: {
      return (f, p) => {
        const projection = f.lambda >= 0 ? stereographic : poincare;
        // Remove infinite
        return projection(f, p)
      };
    }

    case projectionType.halfplane: {
      return (f, p) => {
        const projection = halfplane;
        // Autoreplce Euclidean
        return projection(f, p);
      }
    }

    case projectionType.hemishere: {
      return (f, p) => {
        const projection = hemi;
        return projection(f, p);
      }
    }

    default:
      throw new RangeError('Invalid projection type');
  }
}