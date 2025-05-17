import { useEffect, useState } from 'react';
import { loadFonts } from '@/utils/loadFonts';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadAppFonts = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Fallback: establecer como cargado incluso si hay error
        setFontsLoaded(true);
      }
    };

    loadAppFonts();
  }, []);

  return fontsLoaded;
};