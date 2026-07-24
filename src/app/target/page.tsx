import { auth } from "@/auth";
import { ROLE } from "@/constants";
import Target from "@/layouts/Target";
import TimeSheet from "@/layouts/TimeSheet";

export default async function TargetPage() {
    const session = await auth();
    const { role, isTarget } = session?.user ?? {};

    if (role === ROLE.STAFF && !isTarget) return <TimeSheet />;

    return <Target />;
}
