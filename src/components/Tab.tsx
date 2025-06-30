import React from "react";
import { Tabs as TabsHeroUI, Tab as TabHeroUI, TabsProps } from "@heroui/react";

export const Tabs = ({ ...props }: TabsProps) => {
    return (
        <TabsHeroUI aria-label="Options" {...props}>
            {props.children}
        </TabsHeroUI>
    );
};

export const Tab = TabHeroUI;
