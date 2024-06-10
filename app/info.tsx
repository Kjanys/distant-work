import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import React from "react";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Информация</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.infoText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          Приложение для мониторинга сотрудников работающих удаленно и
          находящихся в отпуске
        </Text>

        <Text
          style={styles.crewText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          Приложение разработано Веревкиным К.А. и Федчуком А.А. Отдельная
          благодарность Бектимирову С.Р. © All rights нифига не reserved
        </Text>
      </View>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
    backgroundColor: Colors["dark"].background,
  },
  infoText: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    color: Colors["dark"].text,
  },
  crewText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginVertical: 30,
    color: Colors["dark"].text,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors["dark"].background,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors["dark"].text,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    backgroundColor: Colors["dark"].text,
  },
});
