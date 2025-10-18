import React, { useEffect } from "react";
import WorkTypeForm from "./WorkTypeForm";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useWorkTypeStore } from "@/stores/useWorkTypeStore";
import { TEXT } from "@/constants";

export default function WorkType() {
    //** Stores */
    const { getModal } = useModalStore();
    const {
        isLoading,
        workTypes,
        getWorkTypes,
        getWorkTypeById,
        deleteWorkType,
        resetWorkTypeById,
    } = useWorkTypeStore();

    //** Effects */
    useEffect(() => {
        getWorkTypes();
    }, [getWorkTypes]);

    //** Render */
    return (
        <div className="flex flex-col gap-8">
            <Button
                className="ml-auto"
                startContent={<PlusIcon className="w-4 h-4" />}
                onPress={() => {
                    getModal({
                        isOpen: true,
                        isDismissable: false,
                        modalHeader: TEXT.ADD_NEW_WORK_TYPE,
                        modalBody: <WorkTypeForm />,
                    });
                }}
            >
                {TEXT.ADD_NEW}
            </Button>

            {workTypes.map(workType => (
                <div key={workType.id} className="flex items-center justify-between gap-x-2">
                    <div className="flex-1 gap-y-2">
                        <div>{workType.name}</div>
                        <div className="text-xs text-gray-500">{workType.description}</div>
                    </div>

                    <Button
                        isIconOnly
                        size="sm"
                        startContent={<PencilSquareIcon className="w-4 h-4" />}
                        onPress={async () => {
                            await getWorkTypeById(workType.id);
                            getModal({
                                isOpen: true,
                                modalHeader: TEXT.UPDATE(`"${workType.name}"`),
                                modalBody: <WorkTypeForm />,
                                onClose: () => {
                                    resetWorkTypeById();
                                },
                            });
                        }}
                    />
                    <Button
                        isIconOnly
                        size="sm"
                        startContent={<TrashIcon className="w-4 h-4" />}
                        onPress={() => {
                            getModal({
                                isOpen: true,
                                modalHeader: TEXT.DELETE,
                                modalBody: (
                                    <ConfirmModal
                                        isDisabled={isLoading}
                                        onConfirm={async () => {
                                            await deleteWorkType(workType.id);
                                            getModal({ isOpen: false });
                                        }}
                                    />
                                ),
                            });
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
