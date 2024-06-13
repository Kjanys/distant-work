import { useClientOnlyValue } from "../../components/useClientOnlyValue";
import Colors from "../../constants/Colors";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function TabLayout() {
  function genHeaderRight() {
    return (
      <View style={styles.icons}>
        <Link href="../info" asChild>
          <Pressable>
            {({ pressed }) => (
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors["dark"].text}
                style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["dark"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Календарь",
          tabBarIcon: ({ color }) => (
            <AntDesign name="calendar" size={24} color={color} />
          ),
          headerRight: () => genHeaderRight(),
        }}
      />
      <Tabs.Screen
        name="distant"
        options={{
          title: "Взять удаленку",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={24}
              color={color}
            />
          ),
          headerRight: () => genHeaderRight(),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icons: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
});
