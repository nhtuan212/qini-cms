import { TargetProps, TargetShiftProps } from "@/types";
import TargetShiftItem from "./TargetShiftItem";

export default function TargetShifts({ target }: { target: TargetProps }) {
    return (
        <div className="relative grid sm:grid-cols-2 gap-4">
            {target.targetShifts.map((targetShift: TargetShiftProps) => (
                <TargetShiftItem
                    key={targetShift.id}
                    targetAt={target.targetAt}
                    targetShift={targetShift}
                />
            ))}
        </div>
    );
}
