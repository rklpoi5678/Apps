const { getDefaultConfig } = require('expo/metro-config');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);

const sentryConfig = getSentryExpoConfig(__dirname);

let config = sentryConfig; //Sentry 설정이 적용된 config를 시작점으로 사용한다.

// 모노레포 관련 설정 추가
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');


// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];
// 이 설정은 모노레포에서 중요한 역할을 한다.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
