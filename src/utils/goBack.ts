import { router, type Href } from 'expo-router';

/**
 * Goes back one screen, or to `fallback` when there is nothing to go back to
 * (e.g. the page was opened directly by its URL or after a browser reload).
 * A plain router.back() would warn "GO_BACK was not handled by any navigator".
 */
export function goBack(fallback: Href) {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
}
