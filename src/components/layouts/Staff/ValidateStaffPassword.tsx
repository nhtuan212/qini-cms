"use client";

import React, { useState } from "react";
import TimeSheet from "../TimeSheet";
import PasswordInput from "@/components/PasswordInput";
import { StaffProps } from "@/stores/useStaffStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useModalStore } from "@/stores/useModalStore";
import { STATUS_CODE, TEXT } from "@/constants";
import { encryptPasswordRSA } from "@/utils";

type ValidateType = "detail" | "time-sheet";

export default function ValidateStaffPassword({
    staff,
    validateType,
}: {
    staff: StaffProps;
    validateType: ValidateType;
}) {
    //** Stores */
    const { getModal } = useModalStore();
    const { isValidatePasswordLoading, validateStaffPassword, getStaffById } = useStaffStore();

    //** States */
    const [passwordError, setPasswordError] = useState<string>("");

    //** Functions */
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        setPasswordError("");

        const value = (e.target as HTMLInputElement).value;

        if (value.length === 0) {
            return null;
        }

        if (e.key === "Enter") {
            const encryptedPassword = encryptPasswordRSA(value);

            await validateStaffPassword(staff.id, encryptedPassword).then(async res => {
                if (res.code !== STATUS_CODE.OK) {
                    setPasswordError(res.message || TEXT.INVALID_PASSWORD);
                    return;
                }

                switch (validateType) {
                    case "time-sheet":
                        return handleTimeSheet();
                    default:
                        break;
                }
            });
        }
    };

    const handleTimeSheet = async () => {
        await getStaffById(staff.id);

        await getModal({
            isOpen: true,
            isDismissable: false,
            size: "3xl",
            modalHeader: <h3 className="text-2xl font-bold text-gray-800">{staff.name}</h3>,
            modalBody: <TimeSheet />,
            modalFooter: <></>,
        });
    };

    //** Render */
    return (
        <PasswordInput
            onKeyDown={handleKeyDown}
            placeholder={TEXT.ENTER_PASSWORD}
            isInvalid={!!passwordError}
            errorMessage={passwordError}
            isDisabled={isValidatePasswordLoading}
        />
    );
}
