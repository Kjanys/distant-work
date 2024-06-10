export type IEvent = {
  id?: number;
  type: EventTypes;
  title: string;
  start: Date;
  end: Date;
};
export type IEventVisual = {
  description: EventDescriptionTypes;
} & IEvent;

export enum EventTypes {
  DISTANT = "distant",
  VACATION = "vacation",
}

export enum EventDescriptionTypes {
  DISTANT = "Удаленка",
  VACATION = "Отпуск",
}
