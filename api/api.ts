import {
  EventDescriptionTypes,
  EventTypes,
  IEvent,
  IEventVisual,
} from "../types/event";
import moment from "moment";

export async function getEventsFetch(date: Date): Promise<IEventVisual[]> {
  const start = moment(date).startOf("month").format("YYYY-MM-DDThh:mm:ss");
  const end = moment(date).endOf("month").format("YYYY-MM-DDThh:mm:ss");
  const url = `https://distant.extserv.ru/Events?start=${start}&end=${end}`;
  const response = fetch(url);
  const newEvents: IEventVisual[] = [];
  await response
    .then((res) => res.json())
    .then((json) => {
      const events = JSON.parse(JSON.stringify(json)) as IEvent[];
      for (const event of events) {
        newEvents.push({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          description:
            event.type === EventTypes.DISTANT
              ? EventDescriptionTypes.DISTANT
              : EventDescriptionTypes.VACATION,
        });
      }
    });
  return newEvents;
}

export async function postNewEventFetch(
  newEvent: IEvent
): Promise<IEventVisual> {
  let pushedEvent: IEventVisual = {} as IEventVisual;
  const url = "https://distant.extserv.ru/Events";
  await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newEvent),
  })
    .then((res) => res.json())
    .then((json) => {
      const event = JSON.parse(JSON.stringify(json)) as IEvent;
      const newEvent: IEventVisual = {
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        description:
          event.type === EventTypes.DISTANT
            ? EventDescriptionTypes.DISTANT
            : EventDescriptionTypes.VACATION,
      };
      pushedEvent = newEvent;
    });
  return pushedEvent;
}

export async function deleteEventFetch(item: IEventVisual): Promise<number> {
  let deletedId: number = 0;
  const url = `https://distant.extserv.ru/Events/${item.id}`;
  await fetch(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((json) => {
      const id = JSON.parse(JSON.stringify(json)) as number;
      deletedId = id;
    });
  return deletedId;
}

export async function changeEventFetch(newEvent: IEvent): Promise<IEvent> {
  let changedEvent: IEvent = {} as IEvent;
  const url = `https://distant.extserv.ru/Events/${newEvent.id}`;
  await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newEvent),
  })
    .then((res) => res.json())
    .then((json) => {
      const event = JSON.parse(JSON.stringify(json)) as IEvent;
      changedEvent = event;
    });
  return changedEvent;
}
