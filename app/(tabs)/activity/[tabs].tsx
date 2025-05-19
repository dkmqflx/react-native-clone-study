export { default } from "./";

/**
 * /activity/[tabs]로 들어와도 실제로는 /activity/index.tsx의 내용을 보여줍니다.
 * 여러 경로에서 같은 화면을 보여주고 싶을 때 사용합니다.
 * 예를 들어,
 * /activity (정적 경로)
 * /activity/like, /activity/comment (동적 경로)
 * 이 모든 경로에서 동일한 컴포넌트/화면을 보여주고 싶을 때
 * [tabs].tsx에서 index.tsx를 재사용하는 방식입니다.
 */
