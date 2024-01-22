import React, { Fragment } from "react";
import { Dialog as DialogUI, Transition } from "@headlessui/react";
import { useModalStore } from "@/stores/useModalStore";
import clsx from "clsx";

const Dialog = ({
    open,
    size = "md",
    children,
}: {
    open: boolean;
    size?: string;
    children: React.ReactNode;
}) => {
    //** Stores */
    const { openModal } = useModalStore();

    return (
        <Transition appear show={open} as={Fragment}>
            <DialogUI as="div" className="relative z-10" onClose={() => openModal(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogUI.Panel
                                className={clsx(
                                    "w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all",
                                    `max-w-${size}`,
                                )}
                            >
                                {children}
                            </DialogUI.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </DialogUI>
        </Transition>
    );
};

const Title = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <DialogUI.Title as="h3" className={className}>
            {children}
        </DialogUI.Title>
    );
};

const Content = ({ children }: { children: React.ReactNode }) => {
    return children;
};

const Action = ({ children }: { children: React.ReactNode }) => {
    return children;
};

Dialog.Title = Title;
Dialog.Content = Content;
Dialog.Action = Action;

export default Dialog;
