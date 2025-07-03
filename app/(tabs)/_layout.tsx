import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  const isLoggedIn = true; // false로 두면 add, activity, username 탭을 클릭 했을 때 모달이 뜬다
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  /**
   * 탭 네비게이션에서는 히스토리가 아무리 많이 쌓여있어도 뒤로가기를 하면 무조건 홈으로 이동한다
   * Tabs 컴포넌트에서 backBehavior 속성을 설정하면 이 동작을 변경할 수 있다
   * 기본값은 initialRoute이며, 이 경우 히스토리가 쌓여있어도 뒤로가기를 하면 첫 번째 페이지로 이동한다
   * history로 설정하면 히스토리가 쌓여있으면 뒤로가기를 하면 마지막 페이지로 이동한다
   */
  return (
    <>
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="home"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="search"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="add"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              if (isLoggedIn) {
                router.navigate("/modal");
              } else {
                openLoginModal();
              }
            },
          }}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="add"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="activity"
          listeners={{
            tabPress: (e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                openLoginModal();
              }
            },
          }}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="heart-outline"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="[username]"
          listeners={{
            tabPress: (e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                openLoginModal();
              }
            },
          }}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="person-outline"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />

        {/*
         * 탭 바에는 안 보이지만 URL로는 접근 가능한 숨겨진 라우트를 만드는 코드입니다.
         * 예를 들어, 홈 탭에서 게시글 1을 클릭하면, 탭 바에는 안 보이지만 URL로는 접근 가능한 숨겨진 라우트를 만드는 코드입니다.
         * (post)라는 별도의 라우트를 만든 이유는 [username] 탭과 게시글을 보여주는 페이지를 구분하기 위함입니다.
         */}
        <Tabs.Screen
          name="(post)/[username]/post/[postID]"
          options={{
            href: null, // 이 부분 때문에 하단 탭 바에 표시되지 않습니다.
          }}
        />
      </Tabs>

      {/* 로그아웃 상태일 때만 보이는 모달 */}
      <Modal
        visible={isLoginModalOpen}
        transparent={true}
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <Text>Login Modal</Text>
            <TouchableOpacity onPress={closeLoginModal}>
              <Ionicons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
