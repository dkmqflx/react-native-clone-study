import NotFound from "@/app/+not-found";
import { usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();

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
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
        <TouchableOpacity onPress={() => router.replace(`/activity/mentions`)}>
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
            style={{ color: pathname === "/activity/quotes" ? "red" : "black" }}
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
        <TouchableOpacity onPress={() => router.replace(`/activity/verified`)}>
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
  );
}
