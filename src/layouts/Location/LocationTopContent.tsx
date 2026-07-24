"use client";

import LocationForm from "./LocationForm";
import Button from "@/components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { TEXT } from "@/constants";

export default function LocationTopContent() {
    //** Stores */
    const { getModal } = useModalStore();

    //** Render */
    return (
        <div className="flex justify-between items-center">
            <div className="title">{TEXT.LOCATION}</div>
            <Button
                onPress={() =>
                    getModal({
                        isOpen: true,
                        size: "xl",
                        modalHeader: TEXT.ADD_LOCATION,
                        isDismissable: false,
                        modalBody: <LocationForm />,
                    })
                }
            >
                {TEXT.ADD_NEW}
                <PlusIcon className="w-5 ml-2" />
            </Button>
        </div>
    );
}
