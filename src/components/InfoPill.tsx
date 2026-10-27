import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/constants/theme';

type Props = {
  label: string;
  /** Border and text color; defaults to the accent blue. */
  color?: string;
};

export function InfoPill({ label, color = colors.accent }: Props) {
  return (
    <View style={[styles.pill, { borderColor: color }]}>
      <Text style={[styles.text, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexShrink: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  text: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});
