import { FaBan, FaTrash, FaUserShield } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/useListParams"
import ActionButton, { EmptyRow, RowActions } from "../../components/ui/ActionButton"
import { confirmToast, promptToast } from "../../components/ui/toastActions"
import { roleSchema } from "../../validators"
import AddUserForm from "../../features/users/AddUserForm"
import { useBanUser, useChangeRole, useDeleteUser, useUsers } from "../../features/users/hooks"
import type { Role, User } from "../../types/models"

export default function Users() {
        const { data: users = [] } = useUsers()
    const deleteUser = useDeleteUser()
    const banUser = useBanUser()
    const changeRole = useChangeRole()


    const { page, pageCount, start, pageItems: paginatedData } = usePagination(users)

    const remove = async (user: User) => {
        const ok = await confirmToast({ title: `Remove ${user.name}?`, description: "Their account will be deleted.", confirmLabel: "Remove" })
        if (ok) deleteUser.mutate(user._id)
    }

    const ban = async (user: User) => {
        const ok = await confirmToast({ title: `Ban ${user.name}?`, description: "They will no longer be able to log in.", confirmLabel: "Ban" })
        if (ok) banUser.mutate({ id: user._id })
    }

    const editRole = async (user: User) => {
        const role = await promptToast({ title: `Change role of ${user.name}`, description: `Current role: ${user.role}. Type ADMIN or USER.`, placeholder: "ADMIN or USER", confirmLabel: "Save", schema: roleSchema, multiline: false })
        if (role) changeRole.mutate({ id: user._id, role: role as Role })
    }

    return (
        <>
            <AddUserForm />
            <DataTable title="Users">
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th className="text-body-secondary">#</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length ? paginatedData.map((user, index) => (
                            <tr key={user._id}>
                                <td className="text-body-secondary">{start + index + 1}</td>
                                <td className="fw-medium text-body-emphasis">{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.phone}</td>
                                <td>
                                    <span className={`badge rounded-pill ${user.role === "ADMIN" ? "text-bg-primary" : "bg-secondary-subtle text-secondary-emphasis"}`}>{user.role}</span>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <RowActions>
                                        <ActionButton icon={<FaUserShield />} onClick={() => editRole(user)}>Role</ActionButton>
                                        <ActionButton variant="danger" icon={<FaBan />} onClick={() => ban(user)}>Ban</ActionButton>
                                        <ActionButton variant="danger" icon={<FaTrash />} onClick={() => remove(user)}>Remove</ActionButton>
                                    </RowActions>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={7}>No users yet.</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
