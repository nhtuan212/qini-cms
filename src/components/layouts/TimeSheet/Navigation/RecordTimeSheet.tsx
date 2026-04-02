import { useEffect, useMemo, useState } from "react";
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
import { useShift, useTarget } from "@/hooks";
import {
    calculateWorkingHours,
    formatDate,
    formatTime,
    getCurrentLocation,
    isEmpty,
    isShiftActive,
    verifyLocation,
} from "@/utils";
import { ROLE, TEXT } from "@/constants";
import { StaffProps } from "@/types";

export default function RecordTimeSheet({ staff }: { staff: StaffProps }) {
    //** Stores */
    const { profile } = useProfileStore();

    //** Queries */
    const { createTarget, targets } = useTarget();
    const { shifts } = useShift();

    //** States */
    const [error, setError] = useState("");
    const [selectedShift, setSelectedShift] = useState<string | null>(null);
    const [shiftError, setShiftError] = useState<string | null>(null);
    const {
        isLoading,
        timeSheetByStaffId,
        getTimeSheetByStaffId,
        createTimeSheet,
        updateTimeSheet,
        deleteTimeSheet,
    } = useTimeSheetStore();

    //** Variables */
    const todayStr = formatDate(new Date(), "YYYY-MM-DD");

    const todayTarget = useMemo(() => {
        return targets.find(target => {
            return formatDate(target.targetAt, "YYYY-MM-DD") === todayStr;
        });
    }, [targets, todayStr]);

    // Get disabledKeys for HeroUI Select component - disable inactive shifts and incompatible target shifts
    const disabledKeys = useMemo(() => {
        const disabledShiftIds = shifts
            .filter(shift => {
                // Disable if shift is not active
                if (!isShiftActive(shift)) {
                    return true;
                }

                // If staff has isTarget: false, only allow shifts with isTarget: false
                if (staff.isTarget === false) {
                    return shift.isTarget !== false;
                }

                // If staff has isTarget: true, allow all shifts
                return false;
            })
            .map(shift => shift.id);
        return disabledShiftIds;
    }, [shifts, staff.isTarget]);

    //** Functions */
    const handleRecordTimeSheet = async (type: "checkIn" | "checkOut") => {
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

        // Check today target
        let target = todayTarget;

        if (!target) {
            target = await createTarget({
                name: TEXT.TARGET,
                targetAt: todayStr,
            });
        }

        const targetShiftId = target.targetShifts.find(
            shift => shift.shiftId === selectedShift,
        )?.id;

        if (!targetShiftId) {
            setError(TEXT.ERROR);
            return;
        }

        if (type === "checkOut") {
            const currentTimeSheet = timeSheetByStaffId.data.find(
                item => item.shiftId === selectedShift && !item.checkOut,
            );

            if (!currentTimeSheet) {
                setError(TEXT.ERROR);
                return;
            }

            return updateTimeSheet({
                id: currentTimeSheet.id,
                bodyParams: {
                    checkOut: formatTime(),
                    workingHours: calculateWorkingHours(currentTimeSheet.checkIn, formatTime()),
                },
            });
        }

        return createTimeSheet({
            staffId: staff.id,
            shiftId: selectedShift,
            targetShiftId,
        });
    };

    //** Effects */
    useEffect(() => {
        getTimeSheetByStaffId(staff.id, {
            startDate: formatDate(new Date(), "YYYY-MM-DD"),
        });
    }, [getTimeSheetByStaffId, staff.id]);

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
                    disabledKeys={disabledKeys}
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
                    {shifts.map(shift => (
                        <SelectItem key={shift.id}>
                            {`${shift.name} ${shift.startTime && shift.endTime && `(${shift.startTime} - ${shift.endTime})`}`}
                        </SelectItem>
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
                            !!timeSheetByStaffId.data.find(
                                item => item.shiftId === selectedShift && !item.checkOut,
                            )?.checkIn
                        }
                        onPress={() => handleRecordTimeSheet("checkIn")}
                    >
                        {TEXT.CHECK_IN}
                    </Button>

                    <Button
                        className="w-full sm:h-12 h-10 sm:p-4 p-2"
                        color="danger"
                        size="lg"
                        isLoading={isLoading}
                        endContent={<ArrowRightStartOnRectangleIcon className="w-5 h-5" />}
                        onPress={() => handleRecordTimeSheet("checkOut")}
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
