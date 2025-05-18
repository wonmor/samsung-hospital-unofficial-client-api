import React, { useState, useRef } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Image } from 'expo-image';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [showWebview, setShowWebview] = useState(false);
  const webviewRef = useRef<WebView>(null);

  const onPressLogin = () => setShowWebview(true);
  const onPressClose = () => setShowWebview(false);

  const INJECTED_JS = `
    if (window.location.pathname === '/dashboard') {
      window.ReactNativeWebView.postMessage(document.cookie);
    }
    true;
  `;

  const onMessage = (event: any) => {
    const cookieString: string = event.nativeEvent.data;
    console.log('받은 쿠키:', cookieString);
    // axios/fetch 스크레이핑 로직 여기에 추가
    // 세션 유지: WebView를 언마운트하지 않으므로 로그인 상태 지속
  };

  return (
    <>
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

      {/* Keep the WebView mounted but hide it */}
      <View style={[styles.overlay, !showWebview && styles.hiddenOverlay]}>
        <View style={styles.webviewHeader}>
          <Button title="닫기" onPress={onPressClose} />
        </View>

        {/* Keep WebView mounted and toggle visibility */}
        <WebView
          ref={webviewRef}
          source={{ uri: 'https://samsunghospital.com/m/smc/member/login.do' }}
          style={[styles.webview, !showWebview && { display: 'none' }]}  // Hide WebView
          javaScriptEnabled
          injectedJavaScript={INJECTED_JS}
          onMessage={onMessage}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  loginContainer: {
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  hospitalView: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  hiddenOverlay: {
    display: 'none', // Hide the overlay without unmounting it
  },
  webviewHeader: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});
