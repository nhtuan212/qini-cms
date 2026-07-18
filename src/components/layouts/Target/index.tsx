import { Key, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import TargetList from "./TargetList";
import TargetFilter from "./TargetFilter";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useProfileStore } from "@/stores/useProfileStore";
import { useTarget } from "@/hooks";
import { getDateTime } from "@/utils";
import { REVENUE_STATUS, TEXT } from "@/constants";

export default function Target() {
    const searchParams = useSearchParams();

    //** States */
    const [targetFilterTab, setTargetFilterTab] = useState<Key>(REVENUE_STATUS.ALL);

    //** Stores */
    const { profile } = useProfileStore();

    //** Queries */
    const { isLoading, targets } = useTarget({
        startDate: searchParams.get("startDate") || getDateTime().firstDayOfMonth,
        endDate: searchParams.get("endDate") || getDateTime().lastDayOfMonth,
    });

    //** Variables */
    const currentTargets = useMemo(() => {
        if (targetFilterTab === REVENUE_STATUS.UN_COLLECTED) {
            return targets.filter(tg =>
                tg.targetShifts.some(shift => shift.isTarget && !shift.isCollectMoney),
            );
        }

        return targets;
    }, [targets, targetFilterTab]);

    //** Render */
    return (
        <div className="flex flex-col gap-y-4 rounded-xl">
            <h2 className="flex items-center gap-x-2 py-4">
                <CalendarIcon className="w-6 h-6" />
                {TEXT.LIST_TARGET}
            </h2>

            <TargetFilter
                targets={targets}
                profile={profile}
                setTargetFilterTab={setTargetFilterTab}
            />

            <TargetList isLoading={isLoading} targets={currentTargets} />
        </div>
    );
}
