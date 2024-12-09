import { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date";

//** Types */
export type ErrorMessageProps = string | React.ReactNode;
export type IconProps = {
    className?: string;
};
export type DateProps = ZonedDateTime | CalendarDate | CalendarDateTime | undefined | null;

//** Enums */
export enum ModalActionProps {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
}
