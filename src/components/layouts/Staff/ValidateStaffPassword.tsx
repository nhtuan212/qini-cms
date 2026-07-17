"use client";

import TimeSheet from "../TimeSheet";
import Button from "@/components/Button";
import { useStaffStore } from "@/stores/useStaffStore";
import { useModalStore } from "@/stores/useModalStore";
import { TEXT } from "@/constants";

export default function ValidateStaffPassword() {
    //** Stores */
    const { getModal } = useModalStore();
    const { selectedStaff } = useStaffStore();

    if (!selectedStaff) return null;

    //** Functions */
    // TODO(auth): Cổng mật khẩu theo ca đã bị vô hiệu hoá tạm thời.
    // BE đã bỏ POST /staff/:id/validate-password và chuyển auth sang luồng
    // login per-employee (createPasswordToken → /login/create-password).
    // Khi triển khai luồng login mới, thay nút này bằng xác thực người dùng
    // thật thay vì mở thẳng bảng chấm công.
    const handleValidate = () => {
        return handleTimeSheet();
    };

    const handleTimeSheet = () => {
        getModal({
            isOpen: true,
            isDismissable: false,
            size: "3xl",
            modalHeader: (
                <h3 className="sm:text-2xl text-lg font-bold text-gray-800">
                    {selectedStaff?.name}
                </h3>
            ),
            modalBody: <TimeSheet />,
        });
    };

    //** Render */
    return <Button onPress={handleValidate}>{TEXT.SUBMIT}</Button>;
}
