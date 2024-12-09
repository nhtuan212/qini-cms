import React from "react";
import Button from "@/components/Button";
import { useModalStore } from "@/stores/useModalStore";
import { TEXT } from "@/constants/text";
import { debounce } from "@/utils";

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
            {content}

            <div className="flex justify-end gap-2">
                <Button
                    color="default"
                    variant="bordered"
                    onClick={() => {
                        getModal({
                            isOpen: false,
                        });
                    }}
                >
                    {TEXT.CANCEL}
                </Button>

                <Button type="button" color="danger" onClick={debounce(onConfirm)}>
                    {TEXT.submit}
                </Button>
            </div>
        </div>
    );
}

export default ConfirmModal;
