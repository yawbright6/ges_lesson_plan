import 'react-native-gesture-handler';
import { Stack, router } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { PreviewHeader } from '@/components/PreviewChrome';
import { ToastProvider } from '@/components/ToastProvider';
import { reportClientError } from '@/lib/logger';
import { brandIdentity, colors, radii, spacing, ThemeProvider } from '@/theme/colors';

const APP_NAME = brandIdentity.name;
const APP_DESCRIPTION = brandIdentity.description;
const APP_TAGLINE = brandIdentity.tagline;
const THEME_COLOR = brandIdentity.themeColor;
const APP_URL = 'https://geslessonplanner.netlify.app/';
const OG_IMAGE = `${APP_URL}og-image.png`;
const compactHeaderOptions = {
  headerStyle: { backgroundColor: colors.primaryDark },
  headerTintColor: colors.textOnPrimary,
  headerTitleAlign: 'center' as const,
  headerTitleStyle: { fontSize: 14, fontWeight: '600' as const },
  headerBackVisible: false,
  headerBackTitleVisible: false,
  headerLeft: () => <RootBackButton />,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.bg },
};

function compactToolOptions(title: string) {
  return {
    title,
    header: () => <PreviewHeader title={title} onBack={goBackFromTool} />,
    contentStyle: { backgroundColor: colors.bg },
  };
}

export default function RootLayout() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleError = (event: ErrorEvent) => {
      reportClientError('client_unhandled_error', event.error ?? event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportClientError('client_unhandled_rejection', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <Head>
              <title>{APP_NAME}</title>
              <meta name="description" content={APP_DESCRIPTION} />
              <meta name="theme-color" content={THEME_COLOR} />
              <meta name="application-name" content={APP_NAME} />
              <meta name="apple-mobile-web-app-title" content={APP_NAME} />
              <meta name="mobile-web-app-capable" content="yes" />
              <meta name="apple-mobile-web-app-capable" content="yes" />
              <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
              <meta property="og:type" content="website" />
              <meta property="og:site_name" content={APP_NAME} />
              <meta property="og:title" content={`${APP_NAME} - ${APP_TAGLINE}`} />
              <meta property="og:description" content={APP_DESCRIPTION} />
              <meta property="og:url" content={APP_URL} />
              <meta property="og:image" content={OG_IMAGE} />
              <meta property="og:image:width" content="1200" />
              <meta property="og:image:height" content="630" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content={APP_NAME} />
              <meta name="twitter:description" content={APP_DESCRIPTION} />
              <meta name="twitter:image" content={OG_IMAGE} />
              <link rel="icon" type="image/png" href="/favicon.png" />
              <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
              <link rel="manifest" href="/site.webmanifest" />
            </Head>
            <StatusBar style="light" />
            <Stack
              screenOptions={compactHeaderOptions}
            >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="landingpage" options={{ headerShown: false }} />
            <Stack.Screen
              name="tools/lesson-plan"
              options={compactToolOptions('Lesson Plan Tool')}
            />
            <Stack.Screen
              name="tools/scheme"
              options={compactToolOptions('Scheme Tool')}
            />
            <Stack.Screen
              name="tools/scheme-builder"
              options={compactToolOptions('Scheme Builder')}
            />
            <Stack.Screen
              name="tools/teaching-notes"
              options={compactToolOptions('Teaching Notes')}
            />
            <Stack.Screen
              name="tools/test-item-compiler"
              options={compactToolOptions('Test Item Compiler')}
            />
            <Stack.Screen
              name="teaching-note/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="lesson/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="lesson/edit/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="lesson/week"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="lesson/week/edit"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="test-paper/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="test-paper/edit/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="scheme/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="admin" options={{ title: 'Admin' }} />
            <Stack.Screen name="onboarding" options={{ title: 'Teacher Setup', headerShown: false }} />
            </Stack>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootBackButton() {
  if (!router.canGoBack()) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      onPress={() => router.back()}
      hitSlop={6}
      style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
    >
      <Ionicons name="arrow-back" size={16} color={colors.textOnPrimary} />
    </Pressable>
  );
}

function goBackFromTool() {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace('/(tabs)/tools');
}

const styles = StyleSheet.create({
  backButton: {
    width: 30,
    height: 30,
    borderRadius: radii.pill,
    marginLeft: spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  backButtonPressed: { opacity: 0.7 },
});

