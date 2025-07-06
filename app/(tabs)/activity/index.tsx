import NotFound from "@/app/+not-found";
import { AuthContext } from "@/app/_layout";
import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useContext(AuthContext);

  const isLoggedIn = !!user;

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const insets = useSafeAreaInsets();

  if (
    ![
      "/activity",
      "/activity/follows",
      "/activity/replies",
      "/activity/mentions",
      "/activity/quotes",
      "/activity/reposts",
      "/activity/verified",
    ].includes(pathname)
  ) {
    return <NotFound />;
  }

  /**
   * router.push vs router.navigate vs router.replace
   * router.push: 히스토리를 쌓는다
   * router.navigate: 히스토리를 중복해서 쌓지 않는다, 즉, 여러번 클릭해도 히스토리가 중복되지 않고 한번만 히스토리가 쌓인다
   * 즉, push를 사용하는 경우 /activity 를 두번 클릭하고, /activity/follows 를 클릭하면, 히스토리는 /activity, /activity/follows 가 각각 두개씩 쌓인다
   * 하지만, navigate를 사용하는 경우 /activity 를 두번 클릭하고, /activity/follows 를 두번 클릭하면, 히스토리는 /activity,   /activity/follows 한개씩만 쌓인다
   * router.replace: 히스토리를 쌓지 않고 현재 페이지를 대체한다
   */

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
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
      </View>

      <View style={styles.tabBar}>
        <View>
          <TouchableOpacity onPress={() => router.replace(`/activity`)}>
            <Text style={{ color: pathname === "/activity" ? "red" : "black" }}>
              All
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity onPress={() => router.replace(`/activity/follows`)}>
            <Text
              style={{
                color: pathname === "/activity/follows" ? "red" : "black",
              }}
            >
              Follows
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity onPress={() => router.replace(`/activity/replies`)}>
            <Text
              style={{
                color: pathname === "/activity/replies" ? "red" : "black",
              }}
            >
              Replies
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => router.replace(`/activity/mentions`)}
          >
            <Text
              style={{
                color: pathname === "/activity/mentions" ? "red" : "black",
              }}
            >
              Mentions
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity onPress={() => router.replace(`/activity/quotes`)}>
            <Text
              style={{
                color: pathname === "/activity/quotes" ? "red" : "black",
              }}
            >
              Quotes
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity onPress={() => router.replace(`/activity/reposts`)}>
            <Text
              style={{
                color: pathname === "/activity/reposts" ? "red" : "black",
              }}
            >
              Reposts
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => router.replace(`/activity/verified`)}
          >
            <Text
              style={{
                color: pathname === "/activity/verified" ? "red" : "black",
              }}
            >
              Verified
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
  },
  menuButton: {
    position: "absolute",
    left: 20,
    top: 10,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
