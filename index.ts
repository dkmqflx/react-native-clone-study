import "expo-router/entry";
/**
 * 이 코드는 Next.js 스타일의 라우팅을 React Native(Expo)에서 사용할 수 있게 해주는 expo-router의 진입점(entry point)을 import하는 코드입니다.
 * expo-router/entry를 import하면, Expo 앱이 실행될 때 라우터가 자동으로 초기화되어,
 * app/ 폴더 내의 파일 및 폴더 구조를 기반으로 화면(페이지) 라우팅이 동작하게 됩니다.
 * 별도의 컴포넌트나 함수 export 없이, 앱의 루트 엔트리 파일(app/index.ts 또는 app/index.js)에서 이 한 줄만 있으면 됩니다.
 */

import { createServer, Response, Server } from "miragejs";

// 타입스크립트 에러 없애기 위해 선언
declare global {
  interface Window {
    server: Server;
  }
}

// DEV모드일 때만 실행하도록 하는 변수
// https://miragejs.com/quickstarts/react-native/development/
if (__DEV__) {
  if (window.server) {
    window.server.shutdown();
  }

  window.server = createServer({
    routes() {
      this.post("/login", (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);

        if (username === "test" && password === "1234") {
          return {
            accessToken: "access-token",
            refreshToken: "refresh-token",

            user: {
              id: "testid",
              name: "test name",
              description: "test description",
              profileImageUrl:
                "https://avatars.githubusercontent.com/u/885857?v=4",
            },
          };
        } else {
          return new Response(401, {}, { message: "Invalid credentials" });
        }
      });
    },
  });
}
