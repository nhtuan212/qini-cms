import React from "react";
import Button from "@/components/Button";
import { useModalStore } from "@/stores/useModalStore";
import { debounce } from "@/utils";
import { TEXT } from "@/constants";

function ConfirmModal({
    onConfirm,
    content,
}: {
    onConfirm: () => Promise<any>;
    content?: React.ReactNode;
}) {
    //** Stores */
    const { getModal } = useModalStore();

    //** Render */
    return (
        <div className="flex flex-col gap-4">
            {content || TEXT.CONFIRM_DELETE}

            <div className="flex justify-end gap-2">
                <Button
                    color="default"
                    variant="bordered"
                    onPress={() => {
                        getModal({
                            isOpen: false,
                        });
                    }}
                >
                    {TEXT.CANCEL}
                </Button>

                <Button type="button" color="danger" onPress={debounce(onConfirm)}>
                    {TEXT.SUBMIT}
                </Button>
            </div>
        </div>
    );
}

export default ConfirmModal;
