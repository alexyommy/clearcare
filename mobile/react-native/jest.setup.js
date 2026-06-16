// Silence noisy RN warnings during tests
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock @react-navigation/native so screens can be tested in isolation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
  };
});
