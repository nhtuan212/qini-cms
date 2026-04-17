import { Key, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TargetTotal from "./TargetTotal";
import Button from "@/components/Button";
import DateRangePicker from "@/components/DateRangePicker";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { DateValue, RangeValue } from "@heroui/react";
import { getDateTime, formatDate, camelCaseQueryString } from "@/utils";
import { ROLE, ROUTE, TEXT } from "@/constants";
import { parseDate } from "@internationalized/date";
import { TargetProps } from "@/types";
import { ProfileProps } from "@/stores/useProfileStore";

export default function TargetFilter({
    targets,
    profile,
    setTargetFilterTab,
}: {
    targets: TargetProps[];
    profile: ProfileProps;
    setTargetFilterTab: (key: Key) => void;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    //** States */
    const [dateValue, setDateValue] = useState<RangeValue<DateValue> | null>(null);

    //** Functions */
    const handleFilterTargets = async () => {
        if (!dateValue) return null;

        router.push(
            camelCaseQueryString({
                startDate: dateValue.start.toString(),
                endDate: dateValue.end.toString(),
            }),
        );
    };

    //** Effects */
    useEffect(() => {
        if (searchParams.get("startDate") && searchParams.get("endDate")) {
            return setDateValue({
                start: parseDate(formatDate(searchParams.get("startDate"), "YYYY-MM-DD")),
                end: parseDate(formatDate(searchParams.get("endDate"), "YYYY-MM-DD")),
            });
        }

        setDateValue({
            start: getDateTime().firstDayOfMonth,
            end: getDateTime().lastDayOfMonth,
        });
    }, [searchParams]);

    //** Render */
    return (
        <div className="space-y-6">
            {profile.role === ROLE.ADMIN && (
                <TargetTotal targets={targets} setTargetFilterTab={setTargetFilterTab} />
            )}

            <div className="flex-1 flex justify-between items-center flex-wrap gap-4">
                <DateRangePicker
                    label={TEXT.DATE_PICKER}
                    className="flex-1 w-fit"
                    value={dateValue}
                    onChange={(newValue: RangeValue<DateValue> | null) => {
                        if (!newValue) return;

                        setDateValue({
                            start: newValue.start,
                            end: newValue.end,
                        });
                    }}
                    onKeyUp={e => {
                        if (e.key === "Enter") {
                            handleFilterTargets();
                        }
                    }}
                />

                {searchParams.get("start_date") && searchParams.get("end_date") && (
                    <Button
                        isIconOnly
                        variant="light"
                        color="default"
                        onPress={() => router.push(ROUTE.TARGET)}
                        startContent={<XMarkIcon className="w-4 h-4" />}
                    />
                )}

                <Button onPress={() => handleFilterTargets()}>{TEXT.SUBMIT}</Button>
            </div>
        </div>
    );
}
