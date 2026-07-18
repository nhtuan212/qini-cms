import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import Profile from "./Profile";
import NavMenu from "../NavMenu";
import TimeSheet from "../TimeSheet";
import Logo from "@/components/Icons/Logo";
import Switch from "@/components/Switch";
import Button from "@/components/Button";
import { Drawer, DrawerHeader, DrawerBody } from "@/components/Drawer";
import { Navbar as NavbarNextUI, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { useMenuStore } from "@/stores/useMenuStore";
import { useModalStore } from "@/stores/useModalStore";
import { Bars3Icon, ClockIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { ROUTE, TEXT } from "@/constants";

export default function Header() {
    //** Store */
    const { isMenuOpen, setIsMenuOpen } = useMenuStore();
    const { getModal } = useModalStore();
    const { theme, setTheme } = useTheme();

    //** States */
    const [themeMode, setThemeMode] = useState<string | undefined>("");

    //** Functions */
    const onModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(event.target.checked ? "light" : "dark");
    };

    const openTimeSheet = () => {
        getModal({
            isOpen: true,
            size: "2xl",
            modalHeader: TEXT.TIME_SHEET,
            modalBody: <TimeSheet />,
        });
    };

    //** Effects */
    useEffect(() => {
        setThemeMode(theme);
    }, [theme, setThemeMode]);

    return (
        <>
            <NavbarNextUI
                classNames={{
                    wrapper: "container max-w-[auto]",
                }}
            >
                <NavbarContent>
                    <Button
                        isIconOnly
                        variant="light"
                        color="default"
                        aria-label="Open menu"
                        className="lg:hidden"
                        onPress={() => setIsMenuOpen(true)}
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </Button>
                    <NavbarBrand>
                        <Link href={ROUTE.HOME} className="flex items-center ml-2 lg:ml-0">
                            <Logo className="w-16 h-16" />
                            <span className="ml-2">{process.env.NEXT_PUBLIC_SITE_NAME}</span>
                        </Link>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button
                            color="primary"
                            variant="flat"
                            size="sm"
                            startContent={<ClockIcon className="w-5 h-5" />}
                            onPress={openTimeSheet}
                        >
                            <span className="hidden sm:inline">{TEXT.TIME_SHEET}</span>
                        </Button>
                    </NavbarItem>
                    <NavbarItem hidden>
                        <Switch
                            defaultSelected
                            isSelected={themeMode === "light"}
                            color="success"
                            startContent={<SunIcon />}
                            endContent={<MoonIcon />}
                            onChange={event => onModeChange(event)}
                        />
                    </NavbarItem>
                    <NavbarItem>
                        <Profile />
                    </NavbarItem>
                </NavbarContent>
            </NavbarNextUI>

            {/* Overlay drawer for < lg screens */}
            <Drawer
                placement="left"
                size="xs"
                className="lg:hidden"
                isOpen={isMenuOpen}
                onOpenChange={setIsMenuOpen}
            >
                <DrawerHeader>
                    <Link
                        href={ROUTE.HOME}
                        className="flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Logo className="w-12 h-12" />
                        <span className="ml-2">{process.env.NEXT_PUBLIC_SITE_NAME}</span>
                    </Link>
                </DrawerHeader>
                <DrawerBody>
                    <NavMenu onNavigate={() => setIsMenuOpen(false)} />
                </DrawerBody>
            </Drawer>
        </>
    );
}
