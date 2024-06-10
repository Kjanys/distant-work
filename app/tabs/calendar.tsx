import { getEventsFetch } from "@/api/api";
import Colors from "@/constants/Colors";
import "dayjs/locale/ru";
import { router } from "expo-router";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar, ThemeInterface } from "react-native-big-calendar";
import {
  EventDescriptionTypes,
  EventTypes,
  IEventVisual,
} from "../../types/event";
import { Context } from "../_layout";
import { darkTheme } from "./theme-config";

export default function CalendarTab() {
  const date = new Date();
  const [monthName, setMonthName] = useState<string>(getMonth(date));
  const [events, setEvents] = useState<IEventVisual[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(date);
  const [loading, setLoading] = useState<boolean>(false);
  const context = useContext(Context);

  // автообновление раз в 15 секунд
  useEffect(() => {
    const timer = setInterval(() => {
      if (loading) return;
      setLoading(true);
      getRefreshEvents(currentDate);
    }, 15000);
    return () => clearInterval(timer);
  });

  useEffect(() => {
    const calendarEvents: IEventVisual[] = [];
    for (const event of context.events) {
      calendarEvents.push({
        ...event,
        title:
          event.type === EventTypes.VACATION
            ? `${event.title} ✈`
            : `${event.title} 🏠`,
      });
    }
    setEvents(calendarEvents);
  }, [context.events]);

  useEffect(() => {
    getRefreshEvents(date);
  }, []);

  function getRefreshEvents(date: Date) {
    setCurrentDate(date);
    setMonthName(getMonth(date));
    getEvents(date);
  }

  const getEvents = async (date: Date) => {
    context.setEvents(await getEventsFetch(date));
    setLoading(false);
  };

  function getMonth(date: Date) {
    return date.toLocaleString("default", { month: "long" });
  }

  function openCellInfo(date: Date) {
    const targetEvents = context.events.filter(
      (item) =>
        (date >= item.start && date <= item.end) ||
        date.getDay() === item.start.getDay()
    );
    const cellEvents: IEventVisual[] = [];
    for (const item of targetEvents) {
      cellEvents.push({
        ...item,
        description:
          item.type === EventTypes.DISTANT
            ? EventDescriptionTypes.DISTANT
            : EventDescriptionTypes.VACATION,
      });
    }
    context.setCellEvents(cellEvents);
    context.setCellDate(date);
    router.navigate("/cell");
  }

  const calendar = useMemo(
    () => (
      <Calendar
        events={events}
        height={600}
        mode="month"
        locale="ru"
        weekStartsOn={1}
        theme={darkTheme as unknown as ThemeInterface}
        onPressCell={(date: Date) => openCellInfo(date)}
        onSwipeEnd={(date: Date) => getRefreshEvents(date)}
        maxVisibleEventCount={25}
        eventMinHeightForMonthView={28}
      />
    ),
    [events]
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Расписание на {monthName}</Text>
      </View>
      {calendar}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 20,
    backgroundColor: Colors["dark"].background,
  },
  titleContainer: {
    alignItems: "center",
    backgroundColor: Colors["dark"].background,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors["dark"].text,
  },
});
