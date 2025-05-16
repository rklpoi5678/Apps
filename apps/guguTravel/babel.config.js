module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }], // Expo 기본 + JSX 변환
      'nativewind/babel',                                       // ← 반드시 presets 섹션
    ],
    plugins: [
      'expo-router/babel',          // 라우터 동적 import 지원
      'react-native-reanimated/plugin',
      ['module-resolver', {
        root: ['.'],
        alias: {
          '@': '.',
        },
      }],
    ],
  };
};
