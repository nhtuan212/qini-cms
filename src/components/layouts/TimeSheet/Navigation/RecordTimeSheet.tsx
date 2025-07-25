import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { Select, SelectItem } from "@/components/Select";
import {
    ArrowRightEndOnRectangleIcon,
    ArrowRightStartOnRectangleIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { TargetProps, useTargetStore } from "@/stores/useTargetStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useShiftStore, ShiftProps } from "@/stores/useShiftsStore";
import { ROLE, TEXT } from "@/constants";
import { formatDate, getCurrentLocation, isEmpty, verifyLocation } from "@/utils";

export default function RecordTimeSheet() {
    //** Stores */
    const { profile } = useProfileStore();
    const { targets } = useTargetStore();
    const { staffById } = useStaffStore();
    const { shifts } = useShiftStore();

    //** States */
    const [error, setError] = useState("");
    const [selectedShift, setSelectedShift] = useState<string | null>(null);
    const [shiftError, setShiftError] = useState<string | null>(null);
    const {
        isLoading,
        timeSheetByStaffId,
        getTimeSheetByStaffId,
        recordTimeSheet,
        deleteTimeSheet,
    } = useTimeSheetStore();
    const { createTarget } = useTargetStore();

    //** Functions */
    const handleRecordTimeSheet = async () => {
        setError("");

        if (!selectedShift) {
            setShiftError(TEXT.IS_REQUIRED);
            return;
        }

        // Validate location
        const { lat, lng } = await getCurrentLocation();
        const locationVerification = verifyLocation(lat, lng);

        if (!locationVerification.isValid && profile?.role !== ROLE.ADMIN) {
            setError(locationVerification.message);
            return;
        }

        let targetShiftId = null;
        const todayTarget = targets.find(target => {
            return (
                formatDate(target.targetAt, "YYYY-MM-DD") === formatDate(new Date(), "YYYY-MM-DD")
            );
        });

        if (!todayTarget) {
            const target = await createTarget({
                name: TEXT.TARGET,
                targetAt: formatDate(new Date(), "YYYY-MM-DD"),
            });

            targetShiftId = target.targetShifts.find(
                (shift: TargetProps["targetShift"]) => shift.shiftId === selectedShift,
            )?.id;
        } else {
            const targetShift = todayTarget.targetShifts.find(
                (shift: TargetProps["targetShift"]) => shift.shiftId === selectedShift,
            );

            targetShiftId = targetShift ? targetShift.id : null;
        }

        if (!targetShiftId) {
            setError(TEXT.ERROR);
            return;
        }

        await recordTimeSheet({
            staffId: staffById.id,
            shiftId: selectedShift,
            targetShiftId,
        })
            .then(res => res)
            .catch(error => {
                console.error({ error });
                setError(TEXT.ERROR);
            });
    };

    //** Effects */
    useEffect(() => {
        getTimeSheetByStaffId(staffById.id, {
            startDate: formatDate(new Date(), "YYYY-MM-DD"),
        });
    }, [getTimeSheetByStaffId, staffById.id]);

    //** Render */
    return (
        <div className="sm:space-y-6 space-y-2">
            {/* Current Status */}
            <div className="text-center sm:space-y-2">
                <h2 className="sm:text-2xl text-lg font-bold text-gray-800">
                    {TEXT.CHECK_IN_TODAY}
                </h2>
                <p className="sm:text-base text-sm text-gray-600">
                    {formatDate(new Date(), "dddd, DD MMMM, YYYY", "vi")}
                </p>
            </div>

            {/* Check In/Out Group */}
            <Card className="flex flex-col items-center justify-center sm:gap-y-4 gap-y-2 bg-success-50 sm:p-4 p-2 border-2 border-success-200">
                <Select
                    label={TEXT.WORK_SHIFT_SELECT}
                    color="primary"
                    isInvalid={!!shiftError}
                    errorMessage={shiftError}
                    classNames={{
                        trigger: "bg-white border-primary-300",
                    }}
                    onChange={e => {
                        setError("");
                        setShiftError("");
                        setSelectedShift(e.target.value);
                    }}
                >
                    {shifts.map((shift: ShiftProps) => (
                        <SelectItem key={shift.id}>{shift.name}</SelectItem>
                    ))}
                </Select>

                <div className="w-full flex gap-x-2">
                    <Button
                        className="w-full sm:h-12 h-10 sm:p-4 p-2"
                        color="success"
                        size="lg"
                        isLoading={isLoading}
                        startContent={<ArrowRightEndOnRectangleIcon className="w-5 h-5" />}
                        isDisabled={
                            !!timeSheetByStaffId.data.find(item => item.shiftId === selectedShift)
                                ?.checkIn
                        }
                        onPress={handleRecordTimeSheet}
                    >
                        {TEXT.CHECK_IN}
                    </Button>

                    <Button
                        className="w-full sm:h-12 h-10 sm:p-4 p-2"
                        color="danger"
                        size="lg"
                        isLoading={isLoading}
                        endContent={<ArrowRightStartOnRectangleIcon className="w-5 h-5" />}
                        isDisabled={
                            !!timeSheetByStaffId.data.find(item => item.shiftId === selectedShift)
                                ?.checkOut ||
                            !timeSheetByStaffId.data.find(item => item.shiftId === selectedShift)
                                ?.checkIn
                        }
                        onPress={handleRecordTimeSheet}
                    >
                        {TEXT.CHECK_OUT}
                    </Button>
                </div>

                {error && <span className="text-red-500">{error}</span>}
            </Card>

            {/* Today's Summary */}
            <Card className="bg-primary-50 sm:p-4 p-2 border border-primary-200">
                <h4 className="font-semibold text-gray-800 mb-3">{TEXT.TODAY_SUMMARY}</h4>
                {!isEmpty(timeSheetByStaffId) &&
                    timeSheetByStaffId.data.map((item, index) => (
                        <div key={index}>
                            <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-1 items-center gap-2 text-sm">
                                <div>
                                    <span className="text-gray-600">{`${TEXT.WORK_SHIFT}:`}</span>
                                    <span className="ml-2 font-medium">{item.shiftName}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">{`${TEXT.CHECK_IN}:`}</span>
                                    <span className="ml-2 font-medium">{item.checkIn}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">{`${TEXT.CHECK_OUT}:`}</span>
                                    <span className="ml-2 font-medium">{item.checkOut}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <span className="text-gray-600">{`${TEXT.WORKING_HOURS}:`}</span>
                                        <span className="ml-2 font-medium">
                                            {item.workingHours || "0"}
                                        </span>
                                    </div>
                                    {profile?.role === ROLE.ADMIN && (
                                        <div className="ml-auto">
                                            <Button
                                                size="sm"
                                                variant="light"
                                                color="default"
                                                isIconOnly
                                                onPress={() => deleteTimeSheet(item.id)}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </Card>
        </div>
    );
}
