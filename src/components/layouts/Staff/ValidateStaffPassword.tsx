"use client";

import { useState } from "react";
import TimeSheet from "../TimeSheet";
import PasswordInput from "@/components/PasswordInput";
import Button from "@/components/Button";
import { useStaffStore } from "@/stores/useStaffStore";
import { useModalStore } from "@/stores/useModalStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useStaff } from "@/hooks";
import { STATUS_CODE, TEXT, ROLE } from "@/constants";
import { runWorker } from "@/workers";
import { StaffProps } from "@/types";

export default function ValidateStaffPassword() {
    //** States */
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    //** Stores */
    const { getModal } = useModalStore();
    const { profile } = useProfileStore();
    const { selectedStaff } = useStaffStore();

    //** Queries */
    const { validateStaffPassword, updateStaff, isValidation } = useStaff();

    if (!selectedStaff) return null;

    //** Functions */
    const handleValidate = async () => {
        setPasswordError("");
        const value = password;

        if (profile.role === ROLE.ADMIN) {
            return handleTimeSheet();
        }

        if (value.length === 0) {
            return null;
        }

        try {
            setIsLoading(true);

            const encryptedPassword = (await runWorker("encryptPassword", value)) as string;

            if (selectedStaff.isFirstLogin) {
                return updateStaff({
                    id: selectedStaff.id,
                    params: { isFirstLogin: false, password: encryptedPassword },
                }).then((res: StaffProps & { code?: number; message?: string }) => {
                    if (res.code && res.code !== STATUS_CODE.OK) {
                        setPasswordError(res.message || TEXT.INVALID_PASSWORD);
                        return;
                    }

                    return handleTimeSheet();
                });
            }

            validateStaffPassword({ id: selectedStaff.id, password: encryptedPassword }).then(
                (res: StaffProps & { code?: number; message?: string }) => {
                    if (res.code !== STATUS_CODE.OK) {
                        setPasswordError(res.message || TEXT.INVALID_PASSWORD);
                        return;
                    }

                    return handleTimeSheet();
                },
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleTimeSheet = () => {
        getModal({
            isOpen: true,
            isDismissable: false,
            size: "3xl",
            modalHeader: (
                <h3 className="sm:text-2xl text-lg font-bold text-gray-800">
                    {selectedStaff?.name}
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
                isDisabled={isLoading || isValidation}
                onValueChange={setPassword}
            />

            <Button isLoading={isLoading || isValidation} onPress={handleValidate}>
                {TEXT.SUBMIT}
            </Button>
        </>
    );
}
