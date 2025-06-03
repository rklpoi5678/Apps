import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SummaryInputScreen } from './app/screens/SummaryInputScreen';
import { SummaryResultScreen } from './app/screens/SummaryResultScreen';
import { useSummaryStore } from './src/store/summary';

const Stack = createNativeStackNavigator();

export default function App() {
  const summaryResult = useSummaryStore((state) => state.summaryResult);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SummaryInput"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f8fafc',
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: '#0f172a',
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="SummaryInput"
          component={SummaryInputScreen}
          options={{
            title: '텍스트 입력',
          }}
        />
        <Stack.Screen
          name="SummaryResult"
          component={SummaryResultScreen}
          options={{
            title: '요약 결과',
            headerBackTitle: '뒤로',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SummaryInputScreen } from './app/screens/SummaryInputScreen';
import { SummaryResultScreen } from './app/screens/SummaryResultScreen';
import { useSummaryStore } from './src/store/summary';

const Stack = createNativeStackNavigator();

export default function App() {
  const summaryResult = useSummaryStore((state) => state.summaryResult);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SummaryInput"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f8fafc',
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: '#0f172a',
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="SummaryInput"
          component={SummaryInputScreen}
          options={{
            title: '텍스트 입력',
          }}
        />
        <Stack.Screen
          name="SummaryResult"
          component={SummaryResultScreen}
          options={{
            title: '요약 결과',
            headerBackTitle: '뒤로',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 