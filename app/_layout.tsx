import { Stack } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// AsyncStorage: 간단한 문자열/JSON 데이터를 로컬(디바이스)에 비암호화 상태로 저장하는 라이브러리
//   - 사용 예: 로그인 상태, 앱 설정 등 민감하지 않은 데이터 저장
//   - 비밀번호, 토큰 등 민감한 정보 저장에는 부적합(암호화 X)
//
// SecureStore: 민감한 데이터를 안전하게 암호화하여 저장하는 Expo 라이브러리
//   - 사용 예: 액세스 토큰, 비밀번호 등 보안이 필요한 정보 저장
//   - 내부적으로 OS의 보안 저장소(Keychain/Keystore 등)를 사용하여 암호화 저장

interface User {
  id: string;
  name: string;
  profileImageUrl: string;
  description: string;
}

// 실제 서비스에서는 zustand 등 상태관리 라이브러리를 사용하는 것이 좋다
export const AuthContext = createContext<{
  user: User | null;
  login?: () => Promise<any>;
  logout?: () => Promise<any>;
}>({
  user: null,
});

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    console.log("login");

    return fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        username: "test",
        password: "1234",
      }),
    })
      .then((res) => {
        console.log("res", res, res.status);

        // 400, 404, 500 등 에러 응답이어도 여기서 에러가 throw되지 않음
        // res.ok === false, res.status === 400 등으로 직접 체크해야 함
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

  // 앱이 처음 실행될 때 AsyncStorage에서 "user" 정보를 불러옴
  useEffect(() => {
    AsyncStorage.getItem("user").then((user) => {
      // user 정보가 있으면 파싱해서 상태에 저장, 없으면 null로 설정
      setUser(user ? JSON.parse(user) : null);
    });
    // TODO: 추후 access token 유효성 검증 로직 추가한다
    // 예를들어, 한달만에 로그인을 한다고 했을 때, accessToken은 AsyncStorage에 저장되어 있더라도
    // 토큰이 만료되어 로그인을 해야하는 경우가 있을 수 있기 때문
  }, []);

  return (
    <AuthContext value={{ user, login, logout }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        {/* Login 추가 안해도, login.tsx 파일이 있으면 자동으로 라우트가 추가된다 위처럼 추가하는 경우는 커스터마이징 하고 싶을 때 사용한다 */}
      </Stack>
    </AuthContext>
  );
}

/**
 *
 * 1. <SLot/>
 *
 * Stack
 * 네이티브 네비게이션 스택(즉, 화면 전환 애니메이션, 헤더 등)을 제공합니다.
 * Stack.Screen으로 각 화면을 정의하고, 각 화면마다 헤더가 자동으로 붙습니다.
 * 루트에 Stack을 두면, 그 하위의 모든 화면이 스택 네비게이션의 일부가 되어, 각 화면마다 헤더가 중복될 수 있습니다.
 *
 * Slot
 * 현재 라우트에 해당하는 컴포넌트를 "그 자리에" 렌더링합니다.
 * 네비게이션 UI(헤더, 탭 등)를 추가하지 않습니다.
 * 즉, 부모에서 이미 헤더나 탭을 렌더링하고 있다면, 자식에서 또 헤더가 중복되지 않습니다.
 *
 *
 * 2. Stack screenOptions={{ headerShown: false }}
 * 루트에서 헤더를 숨김 → 하위에서만 헤더/탭이 보임 → 중복 방지
 */

/**
 * <Stack.Screen name="modal" options={{ presentation: "modal" }} />
 * modal: app/modal.tsx 또는 app/(tabs)/modal.tsx 등
 * modal이라는 이름의 라우트를 Stack에 등록합니다.
 * presentation: "modal":
 *
 * 이 화면은 모달(팝업) 형태로 표시됩니다.
 * iOS에서는 화면이 아래에서 위로 올라오는 애니메이션으로 나타납니다.
 */
