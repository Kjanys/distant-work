import { IEventVisual } from "@/types/event";
import * as eva from "@eva-design/eva";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { ApplicationProvider } from "@ui-kitten/components";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { createContext, useEffect, useState } from "react";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "tabs",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      router.navigate("/tabs/calendar");
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

type ContextProps = {
  events: IEventVisual[];
  setEvents: React.Dispatch<React.SetStateAction<IEventVisual[]>>;
  cellEvents: IEventVisual[];
  setCellEvents: React.Dispatch<React.SetStateAction<IEventVisual[]>>;
  cellDate: Date | undefined;
  setCellDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

export const Context = createContext({} as ContextProps);

function RootLayoutNav() {
  const [events, setEvents] = useState<IEventVisual[]>([]);
  const [cellEvents, setCellEvents] = useState<IEventVisual[]>([]);
  const [cellDate, setCellDate] = useState<Date>();

  return (
    <Context.Provider
      value={{
        events: events,
        setEvents: setEvents,
        cellEvents: cellEvents,
        setCellEvents: setCellEvents,
        cellDate: cellDate,
        setCellDate: setCellDate,
      }}
    >
      <ApplicationProvider {...eva} theme={eva.light}>
        <ThemeProvider value={DarkTheme}>
          <Stack initialRouteName="/tabs/calendar">
            <Stack.Screen
              name="tabs"
              options={{ headerShown: false, title: "Главная" }}
            />
            <Stack.Screen
              name="info"
              options={{ presentation: "modal", title: "Иформация" }}
            />
            <Stack.Screen
              name="cell"
              options={{ presentation: "modal", title: "События" }}
            />
          </Stack>
        </ThemeProvider>
      </ApplicationProvider>
    </Context.Provider>
  );
}
