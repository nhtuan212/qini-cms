import React from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { TEXT } from "@/constants";
import { formatDate } from "@/utils";
import { ArrowRightStartOnRectangleIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function CheckIn() {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="flex flex-col items-center justify-center gap-y-2 bg-success-50 p-6 border-2 border-success-200">
                    <ClockIcon className="w-8 h-8" />

                    <h3 className="font-semibold text-gray-800 mb-2">Giờ vào</h3>

                    <Button color="success" size="lg" className="w-full">
                        Check In
                    </Button>
                </Card>
                <Card className="flex flex-col items-center justify-center gap-y-2 bg-red-50 p-6 border-2 border-red-200 rounded-lg">
                    <ArrowRightStartOnRectangleIcon className="w-8 h-8" />

                    <h3 className="font-semibold text-gray-800 mb-2">Giờ ra</h3>

                    <Button color="danger" size="lg" className="w-full">
                        Check Out
                    </Button>
                </Card>
            </div>

            {/* Today's Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Tóm tắt hôm nay</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600">Giờ vào:</span>
                        <span className="ml-2 font-medium">08:30 AM</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Giờ ra:</span>
                        <span className="ml-2 font-medium">--:--</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Tổng giờ:</span>
                        <span className="ml-2 font-medium">0h 0m</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Trạng thái:</span>
                        <span className="ml-2 font-medium text-green-600">Đang làm việc</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
