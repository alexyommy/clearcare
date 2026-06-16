import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import { useAuth } from '../hooks/useStore';
import { AuthStackParamList, MainTabParamList, RootStackParamList } from '../types';
import { Colors, FontSizes, TouchTarget } from '../utils/theme';

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PatientDashboardScreen from '../screens/PatientDashboardScreen';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

// ─── Stack navigators ─────────────────────────────────────────────────────────
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// ─── Tab icon helper ──────────────────────────────────────────────────────────
function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: TouchTarget.minSize, minHeight: TouchTarget.minSize }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={{ fontSize: 10, color: focused ? Colors.primary : Colors.grey400, fontWeight: focused ? '700' : '400' }}>
        {label}
      </Text>
    </View>
  );
}

// ─── Auth flow ────────────────────────────────────────────────────────────────
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="RoleSelection" component={RoleSelectionScreen} />
    </AuthStack.Navigator>
  );
}

// ─── Main tabs ────────────────────────────────────────────────────────────────
function MainTabs({ role }: { role: 'caregiver' | 'patient' }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.grey200,
          height: 70,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={role === 'patient' ? PatientDashboardScreen : DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} />,
          tabBarAccessibilityLabel: 'Dashboard tab',
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskListScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="✅" label="Tasks" focused={focused} />,
          tabBarAccessibilityLabel: 'Tasks tab',
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📅" label="Calendar" focused={focused} />,
          tabBarAccessibilityLabel: 'Calendar tab',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} />,
          tabBarAccessibilityLabel: 'Profile tab',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" label="Settings" focused={focused} />,
          tabBarAccessibilityLabel: 'Settings tab',
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Root navigator (auth-gated) ──────────────────────────────────────────────
function RootNavigator() {
  const { user } = useAuth();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <RootStack.Screen name="Main">
            {() => <MainTabs role={user.role} />}
          </RootStack.Screen>
          <RootStack.Screen
            name="TaskDetail"
            component={TaskDetailScreen}
            options={{ presentation: 'card', headerShown: false }}
          />
          <RootStack.Screen
            name="PatientDashboard"
            component={PatientDashboardScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </RootStack.Navigator>
  );
}

// ─── App Navigator (exported) ─────────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
