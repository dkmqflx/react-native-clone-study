import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert, Animated, StyleSheet, View } from "react-native";

// NOTE
// 기존 코드의 useEffect 안의 AsyncStorage.getItem("user") 로직 때문에 잠깐 동안이지만 로그아웃 화면이 보이게 된다
// 이를 감출 수 있는 것이 스플래시 스크린
// 스플래시 스크린은 앱이 시작될 때 보이는 초기 화면을 의미한다
// 이를 사용하면 앱이 시작될 때 로그아웃 화면이 보이지 않게 할 수 있다

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export interface User {
  id: string;
  name: string;
  profileImageUrl: string;
  description: string;
  link?: string;
  showInstagramBadge?: boolean;
  isPrivate?: boolean;
}

export const AuthContext = createContext<{
  user: User | null;
  login?: () => Promise<any>;
  logout?: () => Promise<any>;
  updateUser?: (user: User) => void;
}>({
  user: null,
});

function AnimatedAppLoader({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isSplashReady, setSplashReady] = useState(false);

  // 2. 이미지가 로딩이 되었는지 판단한다
  useEffect(() => {
    async function prepare() {
      await Asset.loadAsync(image); // 로컬이미지를 불러온다
      setSplashReady(true);
    }

    prepare();
  }, [image]);

  const login = () => {
    console.log("login");
    return fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        username: "zerocho",
        password: "1234",
      }),
    })
      .then((res) => {
        console.log("res", res, res.status);
        if (res.status >= 400) {
          return Alert.alert("Error", "Invalid credentials");
        }
        return res.json();
      })
      .then((data) => {
        console.log("data", data);
        setUser(data.user);
        return Promise.all([
          SecureStore.setItemAsync("accessToken", data.accessToken),
          SecureStore.setItemAsync("refreshToken", data.refreshToken),
          AsyncStorage.setItem("user", JSON.stringify(data.user)),
        ]);
      })
      .catch(console.error);
  };

  const logout = () => {
    setUser(null);
    return Promise.all([
      SecureStore.deleteItemAsync("accessToken"),
      SecureStore.deleteItemAsync("refreshToken"),
      AsyncStorage.removeItem("user"),
    ]);
  };

  const updateUser = (user: User | null) => {
    setUser(user);
    if (user) {
      AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      AsyncStorage.removeItem("user");
    }
  };

  // 1. 스플래시 이미지가 로딩이 되지 않았다면 아무것도 보여주지 않는다
  if (!isSplashReady) {
    return null;
  }

  return (
    <AuthContext value={{ user, login, logout, updateUser }}>
      <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>
    </AuthContext>
  );
}

// =====================
// 네이티브 SplashScreen과 커스텀 AnimatedSplashScreen의 동작 구조
//
// 1. 앱 실행 시 Expo 네이티브 SplashScreen(기본 스플래시)이 먼저 보임
// 2. 이미지 로드 및 초기화(onImageLoaded) 완료 시 SplashScreen.hideAsync()로 네이티브 SplashScreen을 닫음
// 3. setAppReady(true)로 앱 내부 상태가 준비됨 → 메인 화면(children) 렌더링 시작
// 4. 동시에 AnimatedSplashScreen의 커스텀 애니메이션(페이드아웃 등)이 실행됨
// 5. 애니메이션이 끝나면(isSplashAnimationComplete) 커스텀 스플래시도 사라지고 메인 화면만 남음
//
// 이렇게 두 단계로 나누어 UX를 부드럽게 만듦
// =====================

// 3. 스플래시 스크린
// 앱이 시작될 때 보이는 초기 화면을 의미한다
// 이를 사용하면 앱이 시작될 때 로그아웃 화면이 보이지 않게 할 수 있다
function AnimatedSplashScreen({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
  const animation = useRef(new Animated.Value(1)).current;
  const { updateUser } = useContext(AuthContext);

  useEffect(() => {
    // 앱이 준비(로딩 완료)되면 커스텀 스플래시 애니메이션(페이드아웃 등) 시작
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0, // 애니메이션 값을 0으로 변화시킴 (예: 투명도, 위치 등)
        duration: 2000, // 애니메이션 지속 시간: 2초
        useNativeDriver: true, // 네이티브 드라이버 사용(성능 최적화)
      }).start(() => setAnimationComplete(true)); // 애니메이션이 끝나면 상태를 완료로 변경
    }
  }, [isAppReady]);

  // 앱 초기화 시 호출되는 비동기 함수
  const onImageLoaded = async () => {
    try {
      // 1. AsyncStorage에서 'user' 키로 저장된 사용자 정보를 불러옴
      //    - 값이 있으면 JSON 파싱 후 updateUser로 상태 업데이트
      //    - 값이 없으면 null로 상태 초기화
      await Promise.all([
        AsyncStorage.getItem("user").then((user) => {
          updateUser?.(user ? JSON.parse(user) : null);
        }),
      ]);
      // 2. Expo 네이티브 SplashScreen(앱 껍데기 스플래시)을 닫음
      // 수동으로 닫는 이유는 앱 초기화 시 네이티브 SplashScreen이 보이지 않게 하기 위함
      await SplashScreen.hideAsync();
    } catch (e) {
      // 3. 에러 발생 시 콘솔에 에러 로그 출력
      console.error(e);
    } finally {
      // 4. 앱이 준비되었음을 상태로 표시 (이때부터 메인 화면(children) 렌더링)
      setAppReady(true);
    }
  };

  // animation 값(0~1)에 따라 이미지의 회전 각도를 0도~360도로 변환하는 애니메이션 값
  // 스플래시 이미지가 페이드아웃될 때 동시에 1회전(360도)하는 효과를 줌
  const rotateValue = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={{ flex: 1 }}>
      {/* 5. 앱이 준비되었다면 자식 컴포넌트를 보여준다 */}
      {isAppReady && children}

      {/* 4. 앱이 준비되지 않았다면 스플래시 스크린을 보여준다 */}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              ...StyleSheet.absoluteFillObject, // 화면을 채우는 속성
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                Constants.expoConfig?.splash?.backgroundColor || "#ffffff",
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            source={image}
            style={{
              // 스플래시 이미지의 리사이즈 모드를 expo config에서 가져오고, 없으면 'contain'을 기본값으로 사용
              resizeMode: Constants.expoConfig?.splash?.resizeMode || "contain",
              // 스플래시 이미지의 너비를 expo config에서 가져오고, 없으면 200을 기본값으로 사용
              width: Constants.expoConfig?.splash?.imageWidth || 200,
              transform: [{ scale: animation }, { rotate: rotateValue }],
            }}
            // 이미지가 완전히 로드된 후 호출되는 이벤트 핸들러
            // 스플래시 이미지가 다 로드되어야만 onImageLoaded가 실행되어 앱 초기화가 시작됨
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AnimatedAppLoader image={require("../assets/images/react-logo.png")}>
      <StatusBar style="auto" animated hidden={false} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </AnimatedAppLoader>
  );
}
