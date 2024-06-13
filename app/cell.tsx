import { changeEventFetch, deleteEventFetch } from "../api/api";
import Colors from "../constants/Colors";
import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import {
  Button,
  CalendarRange,
  Card,
  CheckBox,
  Datepicker,
  Input,
  List,
  ListItem,
  Modal,
  RangeDatepicker,
} from "@ui-kitten/components";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import {
  EventDescriptionTypes,
  EventTypes,
  IEvent,
  IEventVisual,
} from "../types/event";
import { Context } from "./_layout";
import { formatDateService, localeDateService } from "../constants/date-config";

export default function ModalScreen() {
  const context = useContext(Context);
  const [visible, setVisible] = useState(false);
  const [itemToChange, setItemToChange] = useState<IEventVisual>();
  const [title, setTitle] = useState("");
  const [vacation, setVacation] = useState(false);
  const [dateStart, setDateStart] = useState(new Date());
  const [range, setRange] = useState<CalendarRange<Date>>(
    {} as CalendarRange<Date>
  );

  async function deleteEvent(item: IEventVisual) {
    const id = await deleteEventFetch(item);
    const newEvents = [...context.events].filter((item) => item.id !== id);
    const newCellEvents = [...context.cellEvents].filter(
      (item) => item.id !== id
    );
    context.setEvents(newEvents);
    context.setCellEvents(newCellEvents);
  }

  async function changeEvent(item: IEventVisual) {
    const changedEvent: IEvent = {
      id: item.id,
      type: vacation ? EventTypes.VACATION : EventTypes.DISTANT,
      title: title,
      start: vacation ? range.startDate! : dateStart,
      end: vacation ? range.endDate! : dateStart,
    };
    const event = await changeEventFetch(changedEvent);
    const newEvent: IEventVisual = {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
      description:
        event.type === EventTypes.DISTANT
          ? EventDescriptionTypes.DISTANT
          : EventDescriptionTypes.VACATION,
    };
    const filtredEvents: IEventVisual[] = [...context.events].filter(
      (item) => item.id !== newEvent.id
    );
    if (
      newEvent.type === EventTypes.VACATION &&
      context.cellDate!.getDate() >= newEvent.start.getDate() &&
      context.cellDate!.getDate() <= newEvent.end.getDate()
    ) {
      const newCellEvents = [...context.cellEvents].filter(
        (item) => item.id !== newEvent.id
      );
      context.setCellEvents([...newCellEvents, newEvent]);
    } else if (
      newEvent.type === EventTypes.DISTANT &&
      context.cellDate!.getDate() === newEvent.start.getDate()
    ) {
      const newCellEvents = [...context.cellEvents].filter(
        (item) => item.id !== newEvent.id
      );
      context.setCellEvents([...newCellEvents, newEvent]);
    } else {
      const newCellEvents = [...context.cellEvents].filter(
        (item) => item.id !== newEvent.id
      );
      context.setCellEvents(newCellEvents);
    }
    filtredEvents.push(newEvent);
    context.setEvents(filtredEvents);
    setVisible(false);
  }

  function openModal(item: IEventVisual) {
    setItemToChange(item);
    setVisible(true);
    setTitle(item.title);
    setDateStart(item.start);
    setVacation(item.type === EventTypes.VACATION ? true : false);
    setRange({ startDate: item.start, endDate: item.end });
  }

  const renderItemAccessory = (
    item: IEventVisual,
    listProps: any
  ): React.ReactElement => (
    <View {...listProps} style={styles.btns}>
      <Button style={styles.btn} size="small">
        <AntDesign
          name="sync"
          size={24}
          color="black"
          onPress={() => openModal(item)}
        />
      </Button>
      <Button style={styles.btn} size="small">
        <AntDesign
          name="delete"
          size={24}
          color="black"
          onPress={() => deleteEvent(item)}
        />
      </Button>
    </View>
  );

  const renderItem = ({
    item,
  }: {
    item: IEventVisual;
    index: number;
  }): React.ReactElement => (
    <ListItem
      style={styles.listItem}
      title={(evaProps) => (
        <Text {...evaProps} style={styles.itemTitle}>
          {item.title}
        </Text>
      )}
      description={(evaProps) => (
        <Text {...evaProps} style={styles.itemDescription}>
          {item.description}
        </Text>
      )}
      accessoryLeft={
        item.description === EventDescriptionTypes.DISTANT ? (
          <FontAwesome6 name="person-shelter" size={24} color="white" />
        ) : (
          <FontAwesome name="plane" size={24} color="white" />
        )
      }
      accessoryRight={(listProps) => renderItemAccessory(item, listProps)}
    />
  );

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
      <Text style={styles.title}>
        События на{" "}
        {context.cellDate ? context.cellDate.toLocaleDateString() : ""}
      </Text>
      <List
        style={styles.list}
        data={context.cellEvents}
        renderItem={renderItem}
      />
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card style={styles.card} disabled={true}>
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
            onPress={() => changeEvent(itemToChange!)}
          >
            Подтвердить
          </Button>
        </Card>
      </Modal>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
  formElement: {
    width: 250,
    marginTop: 10,
    backgroundColor: Colors["dark"].background,
  },
  card: {
    backgroundColor: Colors["dark"].background,
  },
  textInput: {
    marginTop: 10,
    width: 250,
  },
  formText: {
    fontSize: 20,
    color: Colors["dark"].text,
    marginTop: 10,
    textAlign: "center",
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors["dark"].background,
  },
  btns: {
    backgroundColor: Colors["dark"].background,
    flexDirection: "row",
    height: "20%",
  },
  btn: {
    marginLeft: 10,
  },
  list: {
    backgroundColor: Colors["dark"].background,
    width: "90%",
  },
  listItem: {
    backgroundColor: Colors["dark"].background,
    borderBottomColor: Colors["dark"].text,
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors["dark"].text,
  },
  itemTitle: {
    fontSize: 15,
    marginLeft: 5,
    color: Colors["dark"].text,
  },
  itemDescription: {
    fontSize: 13,
    marginLeft: 5,
    color: "#cccccc",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    backgroundColor: Colors["dark"].text,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  formBtn: {
    marginTop: 20,
  },
});
