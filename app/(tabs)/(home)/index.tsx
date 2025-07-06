import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../../_layout";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const insets = useSafeAreaInsets();
  console.log("insets", insets); // 어느 정도의 간격을 띄워야 하는지를 알 수 있다

  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  /**
   * SafeAreaView 컴포넌트를 사용하면
   * 상단과의 간격을 자동으로 조정해준다.
   * 다만, 해당 컴포넌트가 작동되지 않는 휴대폰이 있는데 이 때 useSafeAreaInsets를 사용할 수 있다
   */

  /**
   * 디바이스의 너비와 높이를 알 수 있다 -> DP
   */
  const { width, height } = Dimensions.get("window");
  console.log("width", width);
  console.log("height", height);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <BlurView style={styles.header} intensity={70}>
        {isLoggedIn && (
          <Pressable
            style={styles.menuButton}
            onPress={() => {
              setIsSideMenuOpen(true);
            }}
          >
            <Ionicons name="menu" size={24} color="black" />
          </Pressable>
        )}

        <SideMenu
          isVisible={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
        />

        <Image
          source={require("../../../assets/images/react-logo.png")}
          style={styles.headerLogo}
        />

        {!isLoggedIn && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              console.log("loginButton onPress");
              router.navigate(`/login`);
            }}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
        )}
      </BlurView>

      {isLoggedIn && (
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
      )}

      <View>
        <TouchableOpacity onPress={() => router.push(`/@zerocho/post/1`)}>
          <Text>게시글1</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/@zerocho/post/2`)}>
          <Text>게시글2</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/@zerocho/post/3`)}>
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
  header: {
    alignItems: "center",
  },
  headerLogo: {
    width: 42, // px이 아니라 DP, DIP라고 불리는 단위
    height: 42,
  },
  loginButton: {
    position: "absolute",
    right: 20,
    top: 0,
    backgroundColor: "black",
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  loginButtonText: {
    color: "white",
  },
  menuButton: {
    position: "absolute",
    left: 20,
    top: 10,
  },
});

/**
 * 엑스포 sdk와 호환되는 버전으로 설치해야하는 경우 expo로 설치
 * 엑스포 공식지원 라이브러리는 전부다 expo로 한다
 * ex. expo install expo-blur
 */
