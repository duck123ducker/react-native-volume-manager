import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppNavigation from './routes';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';

const App: React.FC = () => {
  return (
    <RootSiblingParent>
      <SafeAreaProvider>
        <NavigationContainer>
          <SafeAreaView style={styles.container}>
            <AppNavigation />

          </SafeAreaView>
        </NavigationContainer>
      </SafeAreaProvider>
    </RootSiblingParent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
