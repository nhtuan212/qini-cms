"use client";

import LocationForm from "./LocationForm";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useLocation } from "@/hooks";
import { TEXT } from "@/constants";
import { LocationProps } from "@/types";

export default function LocationActions({ location }: { location: LocationProps }) {
    //** Stores */
    const { getModal } = useModalStore();

    //** Queries */
    const { deleteLocation } = useLocation();

    //** Functions */
    const handleUpdateLocation = () => {
        getModal({
            isOpen: true,
            size: "xl",
            modalHeader: TEXT.UPDATE_LOCATION,
            isDismissable: false,
            modalBody: <LocationForm location={location} />,
        });
    };

    const handleDeleteLocation = () => {
        getModal({
            isOpen: true,
            modalHeader: TEXT.SUBMIT,
            modalBody: (
                <ConfirmModal
                    content={TEXT.CONFIRM_DELETE}
                    onConfirm={async () => {
                        await deleteLocation(location.id);
                        getModal({ isOpen: false });
                    }}
                />
            ),
        });
    };

    //** Render */
    return (
        <div className="flex items-center justify-end">
            <Button
                isIconOnly
                size="sm"
                variant="light"
                color="warning"
                aria-label={TEXT.EDIT}
                title={TEXT.EDIT}
                onPress={handleUpdateLocation}
            >
                <PencilSquareIcon className="w-5 h-5" />
            </Button>

            <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                aria-label={TEXT.DELETE}
                title={TEXT.DELETE}
                onPress={handleDeleteLocation}
            >
                <TrashIcon className="w-5 h-5" />
            </Button>
        </div>
    );
}
