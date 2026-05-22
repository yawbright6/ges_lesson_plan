import { router } from 'expo-router';

export function goBackOrReplace(fallback: Parameters<typeof router.replace>[0] = '/(tabs)/library') {
  const canGoBack = typeof router.canGoBack === 'function' ? router.canGoBack() : false;
  if (canGoBack) {
    router.back();
    return;
  }
  router.replace(fallback);
}
