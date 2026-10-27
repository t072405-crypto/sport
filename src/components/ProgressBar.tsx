import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/constants/theme';

type Props = {
  /** 0 to 1 */
  progress: number;
};

export function ProgressBar({ progress }: Props) {
  const pct = Math.min(1, Math.max(0, progress)) * 100;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
});
