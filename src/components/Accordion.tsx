import React from "react";
import { AccordionItem as AccordionItemNextUI, Accordion as AccordionNextUI } from "@heroui/react";
import { AccordionProps } from "@heroui/react";

export default function Accordion({ ...props }: AccordionProps) {
    return <AccordionNextUI {...props}>{props.children}</AccordionNextUI>;
}

export const AccordionItem = AccordionItemNextUI;
