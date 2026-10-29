import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type Category = {
  /** Preset id, or the custom topic itself. */
  id: string;
  /** Shown to players, e.g. on the question tag. */
  label: string;
  /** What the AI is asked to write about. */
  topic: string;
  icon: IconName;
};

export const PRESET_CATEGORIES: Category[] = [
  { id: 'mixed', label: 'Mixed sports', topic: 'a mix of many different sports', icon: 'trophy' },
  { id: 'football', label: 'Football', topic: 'football (soccer)', icon: 'football' },
  { id: 'basketball', label: 'Basketball', topic: 'basketball', icon: 'basketball' },
  { id: 'tennis', label: 'Tennis', topic: 'tennis', icon: 'tennisball' },
  { id: 'f1', label: 'Formula 1', topic: 'Formula 1 motor racing', icon: 'car-sport' },
  { id: 'olympics', label: 'Olympics', topic: 'the Olympic Games', icon: 'medal' },
];

export const DEFAULT_CATEGORY = PRESET_CATEGORIES[0];
export const MAX_TOPIC_LENGTH = 40;
// Letters (any language), digits, spaces and light punctuation. Keeps custom topics
// short and plain, so they can't smuggle instructions into the AI prompt.
const TOPIC_PATTERN = /^[\p{L}\p{N} &'.,()-]+$/u;

/** A cleaned-up custom topic, or null if it's empty, too long or has odd characters. */
export function normalizeTopic(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const topic = value.trim().replace(/\s+/g, ' ');
  if (!topic || topic.length > MAX_TOPIC_LENGTH || !TOPIC_PATTERN.test(topic)) return null;
  return topic;
}

/** Reads the `category` route param: a preset id, or a custom topic typed by the players. */
export function categoryFromParam(value: unknown): Category {
  const preset = PRESET_CATEGORIES.find((c) => c.id === value);
  if (preset) return preset;
  const custom = normalizeTopic(value);
  return custom ? { id: custom, label: custom, topic: custom, icon: 'sparkles' } : DEFAULT_CATEGORY;
}
