import { create } from "zustand";
import { AlertProps } from "@/components/Alert";

interface UseAlertProps extends Omit<AlertProps, "children"> {
    className?: string;
    alertContent: React.ReactNode;
}

type AlertState = {
    alert: UseAlertProps;
};

type AlertAction = {
    getAlert: ({ ...props }: Partial<UseAlertProps>) => void;
};

const initialState: AlertState = {
    alert: {
        isOpen: false,
        type: "info",
        title: "",
        alertContent: "",
        duration: 2000,
        onClose: () => {},
    },
};

export const useAlertStore = create<AlertState & AlertAction>()(set => ({
    ...initialState,

    getAlert: ({ ...props }) =>
        set(state => ({
            alert: {
                ...state.alert,
                ...props,
            },
        })),
}));
