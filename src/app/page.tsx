import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ROUTE } from "@/config/routes";

export default async function Home() {
    const session = await getServerSession();

    if (!session) {
        redirect(ROUTE.LOGIN);
    }

    redirect(ROUTE.REPORT);
}
