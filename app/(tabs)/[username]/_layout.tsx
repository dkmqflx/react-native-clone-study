import { Slot } from "expo-router";

export default Slot;

/**
 * expo-router에서 각 디렉토리의 _layout.tsx는 그 디렉토리 하위 라우트의 레이아웃(즉, 네비게이션 구조)를 정의합니다.
 *
 * 1. [username]/_layout.tsx가 없으면:
 * expo-router는 [username] 폴더 안의 모든 파일(index.tsx, replies.tsx, reposts.tsx)을 각각 하나의 탭(Tab Bar의 항목)으로 자동 인식합니다.
 * 그래서 아래 탭 바에
 * [username]
 * [username]/replies
 * [username]/reposts
 * 이렇게 세 개가 각각 탭으로 표시됩니다.
 *
 * 2. [username]/_layout.tsx가 있으면:
 * _layout.tsx가 있으면, 그 하위의 모든 페이지는 _layout.tsx가 반환하는 컴포넌트(예: <Slot />, <Stack />, <Tabs /> 등) 안에 렌더링됩니다.
 * 폴더가 하나의 탭만 차지하고, 그 안에서만 내부 페이지 이동
 */
