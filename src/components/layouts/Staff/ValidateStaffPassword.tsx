"use client";

import React, { useState } from "react";
import TimeSheet from "../TimeSheet";
import PasswordInput from "@/components/PasswordInput";
import Button from "@/components/Button";
import { useStaffStore } from "@/stores/useStaffStore";
import { useModalStore } from "@/stores/useModalStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useStaff } from "@/hooks";
import { STATUS_CODE, TEXT, ROLE } from "@/constants";
import { encryptPasswordRSA } from "@/utils";

export default function ValidateStaffPassword() {
    //** States */
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");

    //** Stores */
    const { getModal } = useModalStore();
    const { profile } = useProfileStore();
    const { isValidatePasswordLoading, validateStaffPassword, selectedStaff } = useStaffStore();

    //** Queries */
    const { updateStaff } = useStaff();

    //** Functions */
    const handleKeyDown = async () => {
        setPasswordError("");
        const value = password;

        if (profile.role === ROLE.ADMIN) {
            return handleTimeSheet();
        }

        if (value.length === 0) {
            return null;
        }

        const encryptedPassword = encryptPasswordRSA(value);

        if (selectedStaff.isFirstLogin) {
            return updateStaff({
                id: selectedStaff.id,
                params: { isFirstLogin: false, password: encryptedPassword },
            }).then(res => {
                if (res.code && res.code !== STATUS_CODE.OK) {
                    setPasswordError(res.message || TEXT.INVALID_PASSWORD);
                    return;
                }

                return handleTimeSheet();
            });
        }

        validateStaffPassword(selectedStaff.id, encryptedPassword).then(async res => {
            if (!res.isValid || res.code !== STATUS_CODE.OK) {
                setPasswordError(res.message || TEXT.INVALID_PASSWORD);
                return;
            }

            return handleTimeSheet();
        });
    };

    const handleTimeSheet = () => {
        getModal({
            isOpen: true,
            isDismissable: false,
            size: "3xl",
            modalHeader: (
                <h3 className="sm:text-2xl text-lg font-bold text-gray-800">
                    {selectedStaff.name}
                </h3>
            ),
            modalBody: <TimeSheet />,
        });
    };

    //** Render */
    return (
        <>
            <PasswordInput
                placeholder={
                    selectedStaff.isFirstLogin ? TEXT.ENTER_NEW_PASSWORD : TEXT.ENTER_PASSWORD
                }
                isInvalid={!!passwordError}
                errorMessage={passwordError}
                isDisabled={isValidatePasswordLoading}
                onValueChange={setPassword}
            />

            <Button isLoading={isValidatePasswordLoading} onPress={handleKeyDown}>
                {TEXT.SUBMIT}
            </Button>
        </>
    );
}
