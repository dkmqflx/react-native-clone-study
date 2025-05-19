import { Text, View } from "react-native";

export default function Post() {
  return (
    <View>
      <Text>게시글 상세 페이지입니다.</Text>
    </View>
  );
}

/**
 * [username]에 post를 두지 않고
 * (post) 경로로 별도로 설정한 이유는
 * post에 접근 했을 때 하단의 [username]이 highlight 되는 것을 막기 위함
 *
 * 만약 /[username]/post/[postID] 경로가
 * [username] 폴더(즉, 프로필 탭 내부)에 있으면,
 * 사용자가 포스트 상세 페이지(/johndoe/post/123)에 들어갔을 때
 * 탭 바에서 [username](프로필) 탭이 계속 활성화(하이라이트)됩니다.
 * 이건 UX적으로 "아직 프로필 탭에 있다"고 오해하게 만들 수 있습니다.
 *
 * 따라서 (post) Route Group을 만들어 -> app/(tabs)/(post)/[username]/post/[postID].tsx 이렇게 해서
 * 포스트 상세 페이지에 접근해도 탭 바에서 [username]이 highlight 되지 않도록 합니다.
 */
