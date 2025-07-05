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
  Modal as RNModal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

/*
 * expo-image-picker: 사용자가 사진/비디오를 선택하거나 카메라로 촬영할 수 있게 해주는 라이브러리
 *   - launchImageLibraryAsync: 갤러리(사진첩)에서 사진/비디오 선택
 *   - launchCameraAsync: 카메라로 사진/비디오 촬영
 *   - 주로 '선택' 또는 '촬영' 기능에 사용
 *
 * expo-media-library: 기기 내의 사진/비디오 등 미디어 파일을 저장·관리하는 라이브러리
 *   - saveToLibraryAsync: 파일을 기기의 갤러리에 저장
 *   - getAssetsAsync: 기기 내 미디어 파일 목록 조회
 *   - 주로 '저장', '조회', '관리' 기능에 사용
 *
 * 예시: 사용자가 사진을 찍어서 앱에 올리고, 그 사진을 기기 갤러리에도 저장하고 싶을 때
 *   → expo-image-picker로 촬영 → expo-media-library로 저장
 */

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

  // 마지막 thread(입력란)에 텍스트가 있거나 이미지를 첨부한 경우에만 "Add to thread" 버튼 활성화
  const canAddThread =
    (threads.at(-1)?.text.trim().length ?? 0) > 0 ||
    (threads.at(-1)?.imageUris.length ?? 0) > 0;

  // 모든 thread 중 하나라도 텍스트가 있거나 이미지를 첨부한 경우에만 "Post" 버튼 활성화
  const canPost = threads.every(
    (thread) => thread.text.trim().length > 0 || thread.imageUris.length > 0
  );

  // 스레드 삭제
  const removeThread = (id: string) => {
    setThreads((prevThreads) =>
      prevThreads.filter((thread) => thread.id !== id)
    );
  };

  // 사용자가 갤러리에서 이미지를 선택하여 해당 thread에 추가하는 함수
  const pickImage = async (id: string) => {
    // 미디어 라이브러리(사진첩) 접근 권한 요청
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    // 권한이 거부된 경우 알림 표시 및 설정으로 이동 옵션 제공
    if (status !== "granted") {
      Alert.alert(
        "Photos permission not granted", // 알림 제목
        "Please grant photos permission to use this feature", // 알림 메시지
        [
          { text: "Open settings", onPress: () => Linking.openSettings() }, // 설정 열기 버튼
          {
            text: "Cancel", // 취소 버튼
          },
        ]
      );
      return;
    }

    // 이미지(또는 비디오) 선택 창 열기
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "livePhotos", "videos"], // 선택 가능한 미디어 타입
      allowsMultipleSelection: true, // 다중 선택 허용
      selectionLimit: 5, // 최대 5개까지 선택 가능
    });
    console.log("image result", result);

    // 사용자가 이미지를 선택한 경우, 즉, 취소 버튼을 누르지 않은 경우
    if (!result.canceled) {
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === id
            ? {
                ...thread,
                // 선택한 이미지들의 uri를 기존 imageUris 배열에 추가
                imageUris: thread.imageUris.concat(
                  result.assets?.map((asset) => asset.uri) ?? []
                ),
              }
            : thread
        )
      );
    }
  };

  /**
   * 사용자가 카메라로 사진(또는 비디오)을 촬영해서
   * 해당 thread의 imageUris 배열에 추가하는 함수입니다.
   */
  const takePhoto = async (id: string) => {
    // 1. 카메라 접근 권한 요청
    let { status } = await ImagePicker.requestCameraPermissionsAsync();

    // 2. 권한이 거부된 경우, 알림을 띄우고 설정으로 이동할 수 있게 함
    if (status !== "granted") {
      Alert.alert(
        "Camera permission not granted", // 알림 제목
        "Please grant camera permission to use this feature", // 알림 메시지
        [
          { text: "Open settings", onPress: () => Linking.openSettings() }, // 설정 열기
          { text: "Cancel" }, // 취소
        ]
      );
      return;
    }

    // 3. 카메라 촬영 창 열기 (사진/비디오, 여러 장 허용, 최대 5개)
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "livePhotos", "videos"], // 촬영 가능한 미디어 타입
      allowsMultipleSelection: true, // 여러 장 촬영 허용
      selectionLimit: 5, // 최대 5개까지 촬영 가능
    });
    console.log("camera result", result);

    // 4. 촬영 결과를 갤러리에 저장하기 위해 MediaLibrary 권한 요청
    // MediaLibrary를 사용하지 않고 촬영만 하면 이미지가 갤러리에 저장되지 않는다.
    status = (await MediaLibrary.requestPermissionsAsync()).status;
    if (status === "granted" && result.assets?.[0].uri) {
      MediaLibrary.saveToLibraryAsync(result.assets[0].uri); // 첫 번째 촬영 결과를 갤러리에 저장
    }

    // 5. 사용자가 촬영을 완료한 경우(취소하지 않은 경우), thread에 이미지 uri 추가
    if (!result.canceled) {
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === id
            ? {
                ...thread,
                // 촬영한 이미지들의 uri를 기존 imageUris 배열에 추가
                imageUris: thread.imageUris.concat(
                  result.assets?.map((asset) => asset.uri) ?? []
                ),
              }
            : thread
        )
      );
    }
  };

  const removeImageFromThread = (id: string, uriToRemove: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              imageUris: thread.imageUris.filter((uri) => uri !== uriToRemove),
            }
          : thread
      )
    );
  };

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
        /**
         * https://docs.expo.dev/versions/latest/sdk/picker/
         * 스레드 앱 보면 하단에 드롭다운 나오는데, 이 때 사용할 수 있는 라이브러리
         * 하지만 커스터마이징이 불가능해서 시스템 UI를 써야한다
         * 커스터마이징하고 싶으면 modal로 구현하면 된다 -> RNModal
         */
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

      {/* 커스텀 드롭다운을 위한 모달(RNModal) 구현 */}
      <RNModal
        transparent={true}
        visible={isDropdownVisible}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        {/* 모달 바깥 영역을 누르면 닫히도록 Pressable로 감쌈 */}
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsDropdownVisible(false)}
        >
          {/* 드롭다운 옵션 컨테이너 */}
          <View
            style={[styles.dropdownContainer, { bottom: insets.bottom + 30 }]}
          >
            {/* 드롭다운 옵션 목록 렌더링 */}
            {replyOptions.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.dropdownOption,
                  option === replyOption && styles.selectedOption,
                ]}
                onPress={() => {
                  setReplyOption(option); // 옵션 선택 시 상태 변경
                  setIsDropdownVisible(false); // 모달 닫기
                }}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    option === replyOption && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </RNModal>

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
