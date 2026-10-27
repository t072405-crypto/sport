import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

type Props = {
  children: ReactNode;
};

export function ScreenBackground({ children }: Props) {
  return (
    <LinearGradient colors={[colors.backgroundTop, colors.backgroundBottom]} style={styles.fill}>
      <SafeAreaView style={styles.fill}>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Keeps a phone-like column on tablets and desktop browsers.
const MAX_CONTENT_WIDTH = 560;

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flex: 1, width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' },
});
