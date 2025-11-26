import { Dimensions, ScaledSize } from 'react-native';
import { useState, useEffect } from 'react';

// Base dimensions based on iPhone 11
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  // Scale based on width
  const scale = (size: number) => (dimensions.width / BASE_WIDTH) * size;
  
  // Scale based on height
  const verticalScale = (size: number) => (dimensions.height / BASE_HEIGHT) * size;
  
  // Moderate scale with factor
  const moderateScale = (size: number, factor: number = 0.5) => 
    size + (scale(size) - size) * factor;

  return {
    width: dimensions.width,
    height: dimensions.height,
    scale,
    verticalScale,
    moderateScale,
    isSmallDevice: dimensions.width < 375,
    isLargeDevice: dimensions.width > 768,
    isTablet: dimensions.width >= 768,
    isLandscape: dimensions.width > dimensions.height,
  };
};