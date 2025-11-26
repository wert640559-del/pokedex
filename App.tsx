import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';

const App: React.FC = () => {
  const colorScheme = useColorScheme();

  return (
    <>
          <StatusBar 
            barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
            backgroundColor="transparent"
            translucent={false}
          />      
          <AppNavigator />
    </>
  );
};

export default App;