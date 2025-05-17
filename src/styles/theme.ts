// src/styles/theme.ts
import { colors } from '@/styles/colors';

// Interfaces para el tipado del tema
interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

interface BorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  round: number;
}

interface FontSizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  display: number;
}

interface FontWeights {
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
}

interface FontFamily {
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
}

interface Typography {
  fontSizes: FontSizes;
  fontWeights: FontWeights;
  fontFamily: FontFamily;
}

interface ShadowProps {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

interface Shadows {
  small: ShadowProps;
  medium: ShadowProps;
  large: ShadowProps;
}

export interface Theme {
  colors: typeof colors;
  spacing: Spacing;
  borderRadius: BorderRadius;
  typography: Typography;
  shadows: Shadows;
}

// Definición del tema con tipado completo
export const theme: Theme = {
  colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 5,
    md: 10,
    lg: 15,
    xl: 20,
    xxl: 30,
    round: 999,
  },
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      display: 48,
    },
    fontWeights: {
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semiBold: 'System',
      bold: 'System',
    },
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

// Utilidades para acceder al tema de forma más sencilla
export const { spacing, borderRadius, typography, shadows } = theme;
export const { fontSizes, fontWeights, fontFamily } = typography;