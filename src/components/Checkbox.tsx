"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/16/solid";

export default function Checkbox({
    checked = false,
    onChange,
}: {
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    //** States */
    const [selected, setSelected] = useState(checked);

    //** Styles */
    const checkBoxClassName = clsx(
        selected && "before:bg-primary before:border-primary",
        "before:rounded-[calc(theme(borderRadius.medium)*0.6)] after:rounded-[calc(theme(borderRadius.medium)*0.6)] before:transition-colors group-data-[pressed=true]:scale-95 transition-transform after:transition-transform-opacity after:!ease-linear after:!duration-200 motion-reduce:transition-none",
        "relative inline-flex items-center justify-center flex-shrink-0 overflow-hidden before:content-[''] before:absolute before:inset-0 before:border-solid before:border-2 before:box-border before:border-default after:content-[''] after:absolute after:inset-0 after:scale-50 after:opacity-0 after:origin-center group-data-[selected=true]:after:scale-100 group-data-[selected=true]:after:opacity-100 group-data-[hover=true]:before:bg-default-100 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background after:bg-primary after:text-primary-foreground text-primary-foreground w-5 h-5 mr-2 rounded-[calc(theme(borderRadius.medium)*0.6)]",
    );

    //** Functions */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(event.target.checked);

        typeof onChange === "function" && onChange(event);
    };

    //** Effects */
    useEffect(() => {
        setSelected(checked);
    }, [checked]);

    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="form-checkbox text-indigo-600 hidden"
                checked={selected}
                onChange={event => handleChange(event)}
            />
            <p className={checkBoxClassName}>
                {selected && <CheckIcon className="relative w-4 text-white" />}
            </p>
        </label>
    );
}
