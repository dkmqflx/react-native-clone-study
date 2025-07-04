import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();

  const insets = useSafeAreaInsets();
  console.log("insets", insets); // 어느 정도의 간격을 띄워야 하는지를 알 수 있다

  /**
   * SafeAreaView 컴포넌트를 사용하면
   * 상단과의 간격을 자동으로 조정해준다.
   * 다만, 해당 컴포넌트가 작동되지 않는 휴대폰이 있는데 이 때 useSafeAreaInsets를 사용할 수 있다
   */

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.tabContainer}>
        <View style={styles.tab}>
          <TouchableOpacity onPress={() => router.navigate(`/`)}>
            <Text style={{ color: pathname === "/" ? "red" : "black" }}>
              For you
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tab}>
          <TouchableOpacity onPress={() => router.navigate(`/following`)}>
            <Text style={{ color: pathname === "/" ? "black" : "red" }}>
              Following
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push(`/@expotest/post/1`)}>
          <Text>게시글1</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push(`/@expotest/post/2`)}>
          <Text>게시글2</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push(`/@expotest/post/3`)}>
          <Text>게시글3</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * inline style 대신 StyleSheet을 사용하는 이유:
 * StyleSheet.create로 정의된 스타일은 앱이 로드될 때 또는 컴포넌트가 처음 마운트될 때 한 번만 파싱되고 최적화되어 네이티브 UI 레이어(브릿지)로 전송됩니다.
 * 내부적으로 캐싱되며, 이후 렌더링 사이클에서는 이 캐시된 스타일의 ID만 참조하게 됩니다.
 * 이는 런타임에 불필요한 계산이나 브릿지 통신을 줄여 앱의 성능을 향상시킵니다.
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
});
