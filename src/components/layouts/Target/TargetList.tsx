import React from "react";
import Loading from "@/components/Loading";
import { TargetProps, useTargetStore } from "@/stores/useTargetStore";
import TargetItem from "./TargetItem";

export default function TargetList({ targets }: { targets: TargetProps[] }) {
    //** Stores */
    const { isLoading } = useTargetStore();

    //** Render */
    if (isLoading) return <Loading />;

    return (
        <div className="flex flex-col gap-y-4">
            {targets.map(target => (
                <TargetItem key={target.id} target={target} />
            ))}
        </div>
    );
}
