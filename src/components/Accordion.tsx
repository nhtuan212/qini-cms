import React from "react";
import { AccordionItem as AccordionItemNextUI, Accordion as AccordionNextUI } from "@heroui/react";
import { AccordionProps } from "@heroui/react";

const Accordion = ({ ...props }: AccordionProps) => {
    return <AccordionNextUI {...props}>{props.children}</AccordionNextUI>;
};

const AccordionItem = AccordionItemNextUI;

export { Accordion, AccordionItem };
