import { usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();

  console.log("pathname", pathname);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View>
        <TouchableOpacity onPress={() => router.navigate(`/`)}>
          <Text style={{ color: pathname === "/" ? "red" : "black" }}>
            For you
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.navigate(`/following`)}>
          <Text style={{ color: pathname === "/" ? "black" : "red" }}>
            Following
          </Text>
        </TouchableOpacity>
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
