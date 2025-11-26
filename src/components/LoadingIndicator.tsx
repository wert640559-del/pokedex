import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  text?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  size = 'large', 
  text = 'Loading Pokémon...' 
}) => {
  const { moderateScale } = useResponsive();

  const styles = createStyles(moderateScale);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#FF6B6B" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const createStyles = (moderateScale: (size: number, factor?: number) => number) => 
  StyleSheet.create({
    container: {
      padding: moderateScale(20),
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      marginTop: moderateScale(12),
      fontSize: moderateScale(16),
      color: '#666',
      textAlign: 'center',
    },
  });