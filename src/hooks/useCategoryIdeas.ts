import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchCategorySuggestions } from '@/api/categories';

/** AI-suggested categories: loads on mount, `refresh` asks for new ones. */
export function useCategoryIdeas() {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Ignores responses from an older request or after unmount.
  const requestId = useRef(0);

  // Only sets state after the network call, so it is safe to run from an effect.
  const load = useCallback(async (id: number) => {
    try {
      const next = await fetchCategorySuggestions();
      if (id !== requestId.current) return;
      setIdeas(next);
      setError(null);
    } catch (e) {
      if (id !== requestId.current) return;
      setError(e instanceof Error ? e.message : 'Could not load ideas.');
    }
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    load(++requestId.current);
  }, [load]);

  useEffect(() => {
    const counter = requestId;
    load(++counter.current);
    return () => {
      counter.current++;
    };
  }, [load]);

  return { ideas, loading, error, refresh };
}
