import React from "react";
import Loading from "@/components/Loading";

export default function loading() {
    return (
        <div className="w-full h-full">
            <Loading className="[&>div]:w-32 [&>div]:h-32 " />
        </div>
    );
}
