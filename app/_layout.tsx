import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      {/* Login 추가 안해도, login.tsx 파일이 있으면 자동으로 라우트가 추가된다 위처럼 추가하는 경우는 커스터마이징 하고 싶을 때 사용한다 */}
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

/**
 * <Stack.Screen name="modal" options={{ presentation: "modal" }} />
 * modal: app/modal.tsx 또는 app/(tabs)/modal.tsx 등
 * modal이라는 이름의 라우트를 Stack에 등록합니다.
 * presentation: "modal":
 *
 * 이 화면은 모달(팝업) 형태로 표시됩니다.
 * iOS에서는 화면이 아래에서 위로 올라오는 애니메이션으로 나타납니다.
 */
