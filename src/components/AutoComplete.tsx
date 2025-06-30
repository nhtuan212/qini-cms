"use client";

import React from "react";
import {
    Autocomplete as AutocompleteHeroUI,
    AutocompleteItem as AutocompleteItemHeroUI,
    AutocompleteProps,
} from "@heroui/react";
import { twMerge } from "tailwind-merge";

const Autocomplete = React.forwardRef(
    ({ ...props }: AutocompleteProps, ref: React.Ref<HTMLInputElement>) => {
        return (
            <AutocompleteHeroUI
                ref={ref}
                variant={props.variant || "bordered"}
                size={props.size || "sm"}
                radius={props.radius || "sm"}
                {...props}
                inputProps={{
                    classNames: {
                        label: twMerge(
                            props.isRequired &&
                                "font-bold after:content-[var(--required-text)] after:bg-red-500 after:rounded-sm after:px-1 after:py-[0.125rem] after:text-xs after:text-white after:font-light",
                        ),
                    },
                }}
            >
                {props.children}
            </AutocompleteHeroUI>
        );
    },
);

const AutocompleteItem = AutocompleteItemHeroUI;

export { Autocomplete, AutocompleteItem };
