import React from "react";
import Login from "@/components/layouts/Login";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page() {
    const session = await getServerSession();

    if (session) {
        redirect("/");
    }

    return <Login />;
}
