import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Thread {
  id: string;
  text: string;
  hashtag?: string;
  location?: [number, number];
  imageUris: string[];
}

export function ListFooter({
  canAddThread,
  addThread,
}: {
  canAddThread: boolean;
  addThread: () => void;
}) {
  return (
    <View style={styles.listFooter}>
      <View style={styles.listFooterAvatar}>
        <Image
          // source={require("../assets/images/avatar.png")}
          style={styles.avatarSmall}
        />
      </View>
      <View>
        <Pressable onPress={addThread} style={styles.input}>
          <Text style={{ color: canAddThread ? "#999" : "#aaa" }}>
            Add to thread
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function Modal() {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([
    { id: Date.now().toString(), text: "", imageUris: [] },
  ]);
  const insets = useSafeAreaInsets();
  const [replyOption, setReplyOption] = useState("Anyone");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const replyOptions = ["Anyone", "Profiles you follow", "Mentioned only"];

  const handleCancel = () => {};

  const handlePost = () => {};

  // 스레드 텍스트 업데이트
  const updateThreadText = (id: string, text: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id ? { ...thread, text } : thread
      )
    );
  };

  const canAddThread = (threads.at(-1)?.text.trim().length ?? 0) > 0; // 마지막 스레드의 텍스트가 비어있지 않은지 확인

  const canPost = threads.every((thread) => thread.text.trim().length > 0); // 모든 스레드의 텍스트가 비어있지 않은지 확인

  const addImageToThread = (id: string, uri: string) => {};

  const addLocationToThread = (id: string, location: [number, number]) => {};

  // 스레드 삭제
  const removeThread = (id: string) => {
    setThreads((prevThreads) =>
      prevThreads.filter((thread) => thread.id !== id)
    );
  };

  const pickImage = async (id: string) => {};

  const takePhoto = async (id: string) => {};

  const removeImageFromThread = (id: string, uriToRemove: string) => {};

  // 사용자의 현재 위치를 받아와 해당 thread에 위치 정보를 저장하는 함수
  const getMyLocation = async (id: string) => {
    // 위치 권한 요청 (foreground)
    let { status } = await Location.requestForegroundPermissionsAsync();
    // https://docs.expo.dev/versions/latest/sdk/location/#configurable-properties
    // requestBackgroundPermissionsAsync 권한 요청을 하려면 더 많은 설정을해주어야 한다.

    console.log("getMyLocation", status);
    // 권한이 거부된 경우 사용자에게 알림 표시 및 설정으로 이동 옵션 제공
    if (status !== "granted") {
      Alert.alert(
        "Location permission not granted", // 알림 제목
        "Please grant location permission to use this feature", // 알림 메시지
        [
          {
            text: "Open settings", // 설정 열기 버튼
            onPress: () => {
              Linking.openSettings(); // 앱 설정 화면으로 이동
            },
          },
          {
            text: "Cancel", // 취소 버튼
          },
        ]
      );
      return;
    }

    // 권한을 받은 경우
    // 현재 위치 정보 가져오기
    const location = await Location.getCurrentPositionAsync({});

    // 해당 thread의 location 필드에 위도, 경도 저장
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              location: [location.coords.latitude, location.coords.longitude],
            }
          : thread
      )
    );
  };

  /**
   * https://docs.expo.dev/versions/latest/sdk/location/#locationwatchpositionasyncoptions-callback-errorhandler
   * watchPositionAsync - 위치 변경 시 실시간으로 위치 정보를 받아오는 함수
   * 다만, 앱을 끄거나 백그라운드로 가버리면 그 권한을 잃어버릴 수 있기 때문에 백그라운드 권한은 따로 얻어야 한다
   * ex.requestBackgroundPermissionsAsync
   *
   * https://docs.expo.dev/versions/latest/sdk/location/#locationstartgeofencingasynctaskname-regions
   * startGeofencingAsync - 지역 추적 기능을 사용하여 특정 지역에 들어가거나 나가면 알림을 받을 수 있는 함수
   *
   * https://docs.expo.dev/versions/latest/sdk/location/#locationwatchheadingasynccallback-errorhandler
   * watchHeadingAsync - 방향 변경 시 실시간으로 방향 정보를 받아오는 함수
   *
   * https://docs.expo.dev/versions/latest/sdk/location/#locationgeocodeasyncaddress
   * geocodeAsync - 주소를 입력하면 위도, 경도 정보를 받아오는 함수
   *
   * https://docs.expo.dev/versions/latest/sdk/location/#locationreversegeocodeasynccallback-errorhandler
   * reverseGeocodeAsync - 위도, 경도 정보를 입력하면 주소 정보를 받아오는 함수
   *
   */

  const renderThreadItem = ({
    item,
    index,
  }: {
    item: Thread;
    index: number;
  }) => (
    <View style={styles.threadContainer}>
      <View style={styles.avatarContainer}>
        <Image
          // source={require("../assets/images/avatar.png")}
          style={styles.avatar}
        />
        <View style={styles.threadLine} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.username}>zerohch0</Text>
          {index > 0 && (
            <TouchableOpacity
              onPress={() => removeThread(item.id)}
              style={styles.removeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-outline" size={20} color="#8e8e93" />
            </TouchableOpacity>
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder={"What's new?"}
          placeholderTextColor="#999"
          value={item.text}
          onChangeText={(text) => updateThreadText(item.id, text)}
          multiline
        />

        {item.imageUris && item.imageUris.length > 0 && (
          <FlatList
            data={item.imageUris}
            renderItem={({ item: uri, index: imgIndex }) => (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  onPress={() =>
                    !isPosting && removeImageFromThread(item.id, uri)
                  }
                  style={styles.removeImageButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color="rgba(0,0,0,0.7)"
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(uri, imgIndex) =>
              `${item.id}-img-${imgIndex}-${uri}`
            } // react의 key 속성과 비슷한 역할
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageFlatList}
          />
        )}

        {item.location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              {item.location[0]}, {item.location[1]}
            </Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <Pressable
            style={styles.actionButton}
            onPress={() => !isPosting && pickImage(item.id)}
          >
            <Ionicons name="image-outline" size={24} color="#777" />
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => !isPosting && takePhoto(item.id)}
          >
            <Ionicons name="camera-outline" size={24} color="#777" />
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => {
              getMyLocation(item.id);
            }}
          >
            <FontAwesome name="map-marker" size={24} color="#777" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={handleCancel} disabled={isPosting}>
          <Text style={[styles.cancel, isPosting && styles.disabledText]}>
            Cancel
          </Text>
        </Pressable>
        <Text style={styles.title}>New thread</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* FlatList - React Native에서 제공하는 컴포넌트로, 많은 양의 스크롤 가능한 리스트 데이터를 효율적으로 렌더링할 때 사용 */}
      <FlatList
        data={threads}
        keyExtractor={(item) => item.id}
        renderItem={renderThreadItem}
        // 리스트 하단에 추가 버튼 컴포넌트 추가
        ListFooterComponent={
          <ListFooter
            canAddThread={canAddThread}
            addThread={() => {
              if (canAddThread) {
                setThreads((prevThreads) => [
                  ...prevThreads,
                  { id: Date.now().toString(), text: "", imageUris: [] },
                ]);
              }
            }}
          />
        }
        style={styles.list}
        contentContainerStyle={{ backgroundColor: "#ddd" }}
        keyboardShouldPersistTaps="handled"
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <Pressable onPress={() => setIsDropdownVisible(true)}>
          <Text style={styles.footerText}>{replyOption} can reply & quote</Text>
        </Pressable>
        <Pressable
          style={[styles.postButton, !canPost && styles.postButtonDisabled]}
          disabled={!canPost}
          onPress={handlePost}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  headerRightPlaceholder: {
    width: 60,
  },
  cancel: {
    color: "#000",
    fontSize: 16,
  },
  disabledText: {
    color: "#ccc",
  },
  title: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    flex: 1,
    backgroundColor: "#eee",
  },
  threadContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  avatarContainer: {
    alignItems: "center",
    marginRight: 12,
    paddingTop: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#555",
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#555",
  },
  threadLine: {
    width: 1.5,
    flexGrow: 1,
    backgroundColor: "#aaa",
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 6,
  },
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  username: {
    fontWeight: "600",
    fontSize: 15,
    color: "#000",
  },
  input: {
    fontSize: 15,
    color: "#000",
    paddingTop: 4,
    paddingBottom: 8,
    minHeight: 24,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginRight: 15,
  },
  imageFlatList: {
    marginTop: 12,
    marginBottom: 4,
  },
  imagePreviewContainer: {
    position: "relative",
    marginRight: 8,
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    color: "#8e8e93",
    fontSize: 14,
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: "#000",
    borderRadius: 18,
  },
  postButtonDisabled: {
    backgroundColor: "#ccc",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: "hidden",
    marginBottom: 5,
  },
  dropdownOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5e5",
  },
  selectedOption: {},
  dropdownOptionText: {
    fontSize: 16,
    color: "#000",
  },
  selectedOptionText: {
    fontWeight: "600",
    color: "#007AFF",
  },
  removeButton: {
    padding: 4,
    marginRight: -4,
    marginLeft: 8,
  },
  listFooter: {
    paddingLeft: 26,
    paddingTop: 10,
    flexDirection: "row",
  },
  listFooterAvatar: {
    marginRight: 20,
    paddingTop: 2,
  },
  locationContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#8e8e93",
  },
});
