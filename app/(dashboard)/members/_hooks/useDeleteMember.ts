import {useSWRConfig} from "swr";
import useSWRMutation from "swr/mutation";
import {deleteMember} from "@/app/(dashboard)/members/_api/deleteMember";
import {showError, showSuccess} from "@/admin-utils";
import {GetAllMembersResponse} from "@/app/(dashboard)/members/_types/member";
import { useState } from "react";

export const useDeleteMember = () => {
    const { mutate } = useSWRConfig();
    const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

    const { trigger, isMutating } = useSWRMutation(
        "delete-member",
        async (_, { arg }: { arg: { id: string } }) => {
            return await deleteMember(arg.id);
        },
        {
            onSuccess: () => {
                showSuccess("Member deleted successfully!");
                setDeletingMemberId(null);
            },
            onError: (error) => {
                mutate("all-members");
                showError({ message: error.message });
                setDeletingMemberId(null);
            }
        }
    );

    const deleteMemberById = async (id: string) => {
        setDeletingMemberId(id);
        await trigger({ id });
        await mutate(
            "all-members",
            (currentData: GetAllMembersResponse | undefined) => {
                if (!currentData?.users) return currentData;
                return {
                    ...currentData,
                    users: currentData.users.filter(member => member.id !== id)
                };
            },
            false
        );
    };

    return {
        deleteMemberById,
        isDeleting: isMutating,
        deletingMemberId
    };
};