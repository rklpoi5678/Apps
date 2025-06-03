import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { useTheme, Text, List, Switch } from 'react-native-paper';

export default function SettingsTab() {
  const theme = useTheme();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <View className="p-4">
        <List.Section>
          <List.Subheader style={{ color: theme.colors.onBackground }}>
            일반 설정
          </List.Subheader>
          
          <List.Item
            title="다크 모드"
            description="어두운 테마를 사용합니다"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color={theme.colors.primary}
              />
            )}
          />
          
          <List.Item
            title="알림"
            description="요약 완료 시 알림을 받습니다"
            left={props => <List.Icon {...props} icon="bell-outline" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                color={theme.colors.primary}
              />
            )}
          />
        </List.Section>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onBackground }}>
            앱 정보
          </List.Subheader>
          
          <List.Item
            title="버전"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information-outline" />}
          />
          
          <List.Item
            title="개발자"
            description="Summarist Team"
            left={props => <List.Icon {...props} icon="code-tags" />}
          />
        </List.Section>
      </View>
    </SafeAreaView>
  );
} 