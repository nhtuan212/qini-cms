"use client";

import React, { useState } from "react";
import TimeSheet from "../TimeSheet";
import PasswordInput from "@/components/PasswordInput";
import { StaffProps } from "@/stores/useStaffStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useModalStore } from "@/stores/useModalStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { STATUS_CODE, TEXT, ROLE } from "@/constants";
import { encryptPasswordRSA } from "@/utils";

export default function ValidateStaffPassword({ staff }: { staff: StaffProps }) {
    //** Stores */
    const { getModal } = useModalStore();
    const { profile } = useProfileStore();
    const { isValidatePasswordLoading, validateStaffPassword, getStaffById, updateStaff } =
        useStaffStore();

    //** States */
    const [passwordError, setPasswordError] = useState<string>("");

    //** Functions */
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        setPasswordError("");

        if (profile.role === ROLE.ADMIN) {
            return handleTimeSheet();
        }

        const value = (e.target as HTMLInputElement).value;

        if (value.length === 0) {
            return null;
        }

        if (e.key === "Enter") {
            const encryptedPassword = encryptPasswordRSA(value);

            if (staff.isFirstLogin) {
                return updateStaff({
                    id: staff.id,
                    bodyParams: { isFirstLogin: false, password: encryptedPassword },
                }).then(res => {
                    if (res.code && res.code !== STATUS_CODE.OK) {
                        setPasswordError(res.message || TEXT.INVALID_PASSWORD);
                        return;
                    }

                    return handleTimeSheet();
                });
            }

            validateStaffPassword(staff.id, encryptedPassword).then(async res => {
                if (!res.isValid || res.code !== STATUS_CODE.OK) {
                    setPasswordError(res.message || TEXT.INVALID_PASSWORD);
                    return;
                }

                return handleTimeSheet();
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
