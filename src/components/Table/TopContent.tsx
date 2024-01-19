import React from "react";
import Input from "../Input";
import Button from "../Button";
import {
    MagnifyingGlassIcon,
    PlusIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { usePaginationStore } from "@/stores/usePaginationStore";
import { useTableStore } from "@/stores/useTableStore";
import { TEXT } from "@/constants/text";
import { useDialogStore } from "@/stores/useDialogStore";

export default function TopContent() {
    //** Stores */
    const { filterValue, storeFilterValue } = useTableStore();
    const { storeCurrentPage } = usePaginationStore();
    const { openDialog } = useDialogStore();

    //** Functions */
    const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        storeFilterValue(event.target.value);
        storeCurrentPage(1);
    };

    return (
        <div className="flex flex-col gap-4 mb-5">
            <div className="flex justify-between gap-3 items-end">
                <Input
                    className="w-full sm:max-w-[44%]"
                    placeholder={TEXT.ENTER_SEARCH}
                    startContent={<MagnifyingGlassIcon className="w-5 mr-2" />}
                    endContent={
                        filterValue && (
                            <XMarkIcon
                                className="w-5 cursor-pointer"
                                onClick={() => storeFilterValue("")}
                            />
                        )
                    }
                    onChange={onSearchChange}
                    value={filterValue}
                />
                <div className="flex gap-3">
                    <Button onClick={() => openDialog(true)}>
                        {TEXT.ADD_NEW}
                        <PlusIcon className="w-5 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
