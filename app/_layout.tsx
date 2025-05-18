import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
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
