import { StyleSheet } from "react-native";

import { postNewEventFetch } from "../../api/api";
import { View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import {
  Button,
  CalendarRange,
  CheckBox,
  Datepicker,
  Input,
  RangeDatepicker,
} from "@ui-kitten/components";
import React, { useContext, useState } from "react";
import { Text } from "react-native";
import { EventTypes, IEvent } from "../../types/event";
import { Context } from "../_layout";
import {
  formatDateService,
  localeDateService,
} from "../../constants/date-config";
import { router } from "expo-router";

enum ButtonTitle {
  accept = "Подтвердить",
  loadding = "Подтверждение...",
}

export default function DistantTab() {
  const [title, setTitle] = useState("");
  const [btnTitle, setBtnTitle] = useState<ButtonTitle>(ButtonTitle.accept);
  const [vacation, setVacation] = useState(false);
  const [dateStart, setDateStart] = useState(new Date());
  const [range, setRange] = useState<CalendarRange<Date>>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const context = useContext(Context);

  async function sendNewEvent() {
    const newEvent: IEvent = {
      type: vacation ? EventTypes.VACATION : EventTypes.DISTANT,
      title: title,
      start: vacation ? range.startDate! : dateStart,
      end: vacation ? range.endDate! : dateStart,
    };
    setBtnTitle(ButtonTitle.loadding);
    const pushedEvent = await postNewEventFetch(newEvent);
    context.setEvents([...context.events, pushedEvent]);
    setBtnTitle(ButtonTitle.accept);
    router.navigate("/tabs/calendar");
  }

  function genDatePart(vacation: boolean) {
    if (vacation) {
      return (
        <View style={styles.formElement}>
          <Text style={styles.formText}>Промежуток отпуска</Text>
          <RangeDatepicker
            style={styles.formElement}
            range={range}
            dateService={localeDateService}
            onSelect={(nextRange) => setRange(nextRange)}
            {...formatDateService}
          />
        </View>
      );
    }

    return (
      <View style={styles.formElement}>
        <Text style={styles.formText}>Взять удаленку на</Text>
        <Datepicker
          style={styles.formElement}
          date={dateStart}
          dateService={localeDateService}
          onSelect={(nextDate) => setDateStart(nextDate)}
          {...formatDateService}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добавить</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text style={styles.formText}>Имя</Text>
      <Input
        style={styles.textInput}
        placeholder="Введите имя"
        value={title}
        onChangeText={(nextValue) => setTitle(nextValue)}
      />
      {genDatePart(vacation)}
      <CheckBox
        style={styles.checkBox}
        checked={vacation}
        onChange={(nextChecked) => setVacation(nextChecked)}
      >
        {(evaProps) => (
          <Text {...evaProps} style={styles.checkBoxTitle}>
            Отпуск
          </Text>
        )}
      </CheckBox>
      <Button
        style={styles.formBtn}
        onPress={() => sendNewEvent()}
        disabled={btnTitle === ButtonTitle.loadding}
      >
        {btnTitle}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
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
  formText: {
    fontSize: 20,
    color: Colors["dark"].text,
    marginTop: 10,
    textAlign: "center",
  },
  formElement: {
    width: 250,
    marginTop: 10,
    backgroundColor: Colors["dark"].background,
  },
  textInput: {
    marginTop: 10,
    width: 250,
  },
  formBtn: {
    marginTop: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: 250,
    backgroundColor: Colors["dark"].text,
  },
  checkBox: {
    marginTop: 20,
    color: Colors["dark"].text,
  },
  checkBoxTitle: {
    fontSize: 17,
    marginLeft: 10,
    color: Colors["dark"].text,
  },
});
