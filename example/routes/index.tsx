import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Screen1 from '../screen1';
import Screen2 from '../screen2';

const Stack = createStackNavigator();
const AppNavigation: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Screen1"
        component={Screen1}
        initialParams={{ routeMode: 'normal' }}
      />
      <Stack.Screen name="Screen2" component={Screen2} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
