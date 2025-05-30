import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { TEXT } from "@/constants";
import { formatDate, validateUserIP } from "@/utils";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { useStaffStore } from "@/stores/useStaffStore";

export default function TimeSheetRecord() {
    //** Stores */
    const { staffById } = useStaffStore();

    //** States */
    const [error, setError] = useState("");

    //** Variables */
    const { timeSheetByStaffId, recordTimeSheet, getTimeSheet, cleanUpTimeSheet } =
        useTimeSheetStore();

    //** Functions */
    const handleRecordTimeSheet = async () => {
        setError("");

        // Validate IP address using common utility
        const ipValidation = await validateUserIP();

        if (!ipValidation.isValid) {
            setError(ipValidation.error || "IP validation failed");
            return;
        }

        await recordTimeSheet({ staffId: staffById.id })
            .then(res => res)
            .catch(() => {
                setError(TEXT.ERROR);
            });
    };

    //** Effects */
    useEffect(() => {
        const currentDate = new Date().toISOString().split("T")[0];

        getTimeSheet({ staffId: staffById.id, date: currentDate });

        return () => {
            cleanUpTimeSheet();
        };
    }, [getTimeSheet, cleanUpTimeSheet, staffById.id]);

    //** Render */
    return (
        <div className="space-y-6">
            {/* Current Status */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">{TEXT.CHECK_IN_TODAY}</h2>
                <p className="text-gray-600">
                    {formatDate(new Date(), "dddd, DD MMMM, YYYY", "vi")}
                </p>
            </div>

            {/* Check In/Out Buttons */}
            <Card className="flex flex-col items-center justify-center gap-y-2 bg-success-50 p-6 border-2 border-success-200">
                <ClockIcon className="w-8 h-8" />

                <h3 className="font-semibold text-gray-800 mb-2">{TEXT.TIME_SHEET}</h3>

                <Button
                    color="success"
                    size="lg"
                    className="w-full"
                    onPress={handleRecordTimeSheet}
                >
                    {`${TEXT.CHECK_IN} / ${TEXT.CHECK_OUT}`}
                </Button>

                {error && <span className="text-red-500">{error}</span>}
            </Card>

            {/* Today's Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Tóm tắt hôm nay</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600">Giờ vào:</span>
                        <span className="ml-2 font-medium">{timeSheetByStaffId.checkIn}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Giờ ra:</span>
                        <span className="ml-2 font-medium">{timeSheetByStaffId.checkOut}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Tổng giờ:</span>
                        <span className="ml-2 font-medium">{timeSheetByStaffId.workingHours}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
