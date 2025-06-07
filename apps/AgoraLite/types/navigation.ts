import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  '(tabs)': NavigatorScreenParams<TabParamList>;
  'create-debate-modal': undefined;
};

export type TabParamList = {
  home: undefined;
  feed: undefined;
  'profile-page': undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
