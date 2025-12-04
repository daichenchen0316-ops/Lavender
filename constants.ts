import { Color } from 'three';

// Visual Configuration
export const CONFIG = {
  PARTICLE_COUNT: 6000,
  ORNAMENT_COUNT: 120,
  ORNAMENT_RED_COUNT: 150,
  SCATTER_RADIUS: 18,
  TREE_HEIGHT: 13,
  TREE_BASE_RADIUS: 5.5,
  TRANSITION_SPEED: 0.8, // Smoothing factor
  COLORS: {
    EMERALD_DARK: new Color('#002A18'),
    EMERALD_LIGHT: new Color('#006B3C'),
    GOLD_METALLIC: new Color('#FFD700'),
    GOLD_ROSE: new Color('#E6BE8A'),
    RED_RUBY: new Color('#8B0000'),
    RED_BRIGHT: new Color('#D90429'),
    BG_GRADIENT_START: '#000000', // Changed to pure black
    BG_GRADIENT_END: '#000000',   // Changed to pure black
  }
};