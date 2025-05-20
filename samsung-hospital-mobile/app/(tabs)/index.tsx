import React, { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { View, Button, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WebViewMessageEvent } from 'react-native-webview';
import { WebView } from 'react-native-webview';
import { Image } from 'expo-image';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const COOKIE_KEY = 'samsung_cookie';
const LOGIN_URL = 'https://samsunghospital.com/m/smc/member/login.do';

const HomeScreen: FC = () => {
  const [showWebview, setShowWebview] = useState<boolean>(false);
  const [storedCookie, setStoredCookie] = useState<string>('');
  const webviewRef = useRef<WebView>(null);

  // Load saved cookie on mount
  useEffect(() => {
    AsyncStorage.getItem(COOKIE_KEY).then((value) => {
      if (value) {
        setStoredCookie(value);
      }
    });
  }, []);

  const onPressLogin = (): void => setShowWebview(true);
  const onPressClose = (): void => setShowWebview(false);

  // After login, save cookie for persistence
  const onMessage = (event: WebViewMessageEvent): void => {
    const cookieString = event.nativeEvent.data;
    // Save to AsyncStorage
    AsyncStorage.setItem(COOKIE_KEY, cookieString);
    setStoredCookie(cookieString);
    console.log('Saved cookie:', cookieString);
  };

  // Inject script to pass login cookie from WebView to RN
  const INJECTED_JS = `
    (function() {
      if (window.location.pathname === '/dashboard') {
        window.ReactNativeWebView.postMessage(document.cookie);
      }
    })(); true;
  `;

  return (
    <SafeAreaView style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/seoul-samsung-hospital.jpg')}
            style={styles.hospitalView}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">환영합니다!</ThemedText>
          <HelloWave />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">
            삼성서울병원 실비보험청구 비공식 앱
          </ThemedText>
          <ThemedText>
            {`Developed by 성원모, wonmor@gmail.com\n제작자는 이 앱으로 어떠한 수익도 창출하지 않으며, 삼성서울병원과는 무관합니다.\n\n이 앱은 삼성서울병원 홈페이지의 비공식 스크레이핑을 사용합니다.`}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.loginContainer}>
          <Button title="로그인" onPress={onPressLogin} />
        </ThemedView>
      </ParallaxScrollView>

      {/* Persistent WebView overlay to preserve session */}
      <View style={[styles.overlay, !showWebview && styles.hiddenOverlay]}>
        <View style={styles.modalBox}>
          <View style={styles.webviewHeader}>
            <Button title="닫기" onPress={onPressClose} />
          </View>

          <WebView
            ref={webviewRef}
            source={{ uri: LOGIN_URL }}
            style={styles.webview}
            javaScriptEnabled
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            injectedJavaScript={INJECTED_JS}
            injectedJavaScriptBeforeContentLoaded={
              storedCookie
                ? `(function(){ document.cookie = "${storedCookie}"; })(); true;`
                : undefined
            }
            onMessage={onMessage}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepContainer: { gap: 8, marginBottom: 16 },
  loginContainer: { marginVertical: 24, paddingHorizontal: 16 },
  hospitalView: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center',
  },
  hiddenOverlay: { display: 'none' },
  modalBox: { width: '90%', height: '80%', backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' },
  webviewHeader: { height: 56, justifyContent: 'center', paddingHorizontal: 16, backgroundColor: '#f5f5f5' },
  webview: { flex: 1 },
});
