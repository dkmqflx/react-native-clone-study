import { Ionicons } from "@expo/vector-icons";
import { type BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  PressableProps,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AnimatedTabBarButton = ({
  children,
  onPress,
  style,
  ...restProps
}: BottomTabBarButtonProps) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  //  React Native의 애니메이션 시스템에서 사용하는 값 객체입니다. 여기서 1은 초기값(스케일 1, 즉 원래 크기)을 의미합니다.

  /**
   * 더 복잡한 애니메이션을 구현하고 싶다면
   * https://docs.expo.dev/versions/latest/sdk/reanimated/
   * https://docs.expo.dev/versions/latest/sdk/lottie/
   */
  const handlePressOut = () => {
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 1.2,
        useNativeDriver: true,
        speed: 200,
      }),
      Animated.spring(scaleValue, {
        toValue: 1, // 애니메이션이 도달할 최종 값입니다.
        useNativeDriver: true, // 애니메이션을 JS 스레드가 아닌 네이티브 드라이버에서 실행하도록 하여 성능을 높입니다.
        speed: 200,
        // friction: 4, // 스프링(Spring) 애니메이션의 마찰력(저항)을 조절합니다. 값이 클수록 애니메이션이 더 빨리 멈추고, 작을수록 더 오래 흔들립니다(즉, 덜 탄력적임).
      }),
    ]).start();
  };

  return (
    <Pressable
      {...(restProps as PressableProps)} // 타입 에러 때문에 처리
      onPress={onPress}
      onPressOut={handlePressOut}
      style={[
        { flex: 1, justifyContent: "center", alignItems: "center" },
        style,
      ]}
      // Disable Android ripple effect
      android_ripple={{ borderless: false, radius: 0 }}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default function TabLayout() {
  const router = useRouter();

  const isLoggedIn = false; // false로 두면 add, activity, username 탭을 클릭 했을 때 모달이 뜬다
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const toLoginPage = () => {
    setIsLoginModalOpen(false);
    router.push("/login");
  };

  return (
    <>
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
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
            <Pressable onPress={toLoginPage}>
              <Text>Login Modal</Text>
            </Pressable>

            <TouchableOpacity onPress={closeLoginModal}>
              <Ionicons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
