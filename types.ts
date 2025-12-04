import { Vector3, Color } from 'three';

export enum AppState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  id: number;
  scatterPos: Vector3;
  treePos: Vector3;
  color: Color;
  scale: number;
  rotationSpeed: number;
  phaseOffset: number;
}
