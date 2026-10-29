import { FaBan, FaCircleCheck, FaMagnifyingGlass, FaTrash, FaUserShield } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import FilterSelect from "../../components/ui/FilterSelect"
import StatusFilter from "../../components/ui/StatusFilter"
import ActionButton, { EmptyRow, RowActions } from "../../components/ui/ActionButton"
import { confirmToast, promptToast } from "../../components/ui/toastActions"
import useListParams from "../../hooks/useListParams"
import useDebouncedValue from "../../hooks/useDebouncedValue"
import { roleSchema } from "../../validators"
import AddUserForm from "../../features/users/AddUserForm"
import { useBanUser, useChangeRole, useDeleteUser, useUnbanUser, useUsers } from "../../features/users/hooks"
import type { Role, User } from "../../types/models"

const PAGE_SIZE = 10

const ROLE_OPTIONS = [
    { value: "ADMIN", label: "Admins" },
    { value: "USER", label: "Students" },
]

const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "banned", label: "Banned" },
]

export default function Users() {
    const { page, get, update } = useListParams()
    const search = get("search")
    const role = get("role")
    const isBannedTab = get("status") === "banned"
    const debouncedSearch = useDebouncedValue(search.trim())

    const { data, isLoading } = useUsers({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        role: (role || undefined) as Role | undefined,
        status: isBannedTab ? "banned" : "active",
    })
    const users = data?.items ?? []

    const deleteUser = useDeleteUser()
    const banUser = useBanUser()
    const unbanUser = useUnbanUser()
    const changeRole = useChangeRole()

    const remove = async (user: User) => {
        const ok = await confirmToast({ title: `Remove ${user.name}?`, description: "Their account will be deleted.", confirmLabel: "Remove" })
        if (ok) deleteUser.mutate(user._id)
    }

    const ban = async (user: User) => {
        const ok = await confirmToast({ title: `Ban ${user.name}?`, description: "They will no longer be able to log in.", confirmLabel: "Ban" })
        if (ok) banUser.mutate({ id: user._id })
    }

    const unban = async (user: User) => {
        const ok = await confirmToast({ title: `Unban ${user.name}?`, description: "They will be able to log in again.", confirmLabel: "Unban", variant: "success" })
        if (ok) unbanUser.mutate({ id: user._id })
    }

    const editRole = async (user: User) => {
        const next = await promptToast({ title: `Change role of ${user.name}`, description: `Current role: ${user.role}. Type ADMIN or USER.`, placeholder: "ADMIN or USER", confirmLabel: "Save", schema: roleSchema, multiline: false })
        if (next) changeRole.mutate({ id: user._id, role: next as Role })
    }

    return (
        <>
            <AddUserForm />
            <DataTable title="Users" actions={
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <StatusFilter options={STATUS_OPTIONS} value={isBannedTab ? "banned" : "active"}
                        onChange={(value) => update({ status: value === "banned" ? value : "" })} />
                    <div className="input-group input-group-sm w-auto">
                        <span className="input-group-text bg-body"><FaMagnifyingGlass /></span>
                        <input type="search" className="form-control" value={search}
                            onChange={(e) => update({ search: e.target.value })}
                            placeholder="Name, username, email or phone" aria-label="Search users" />
                    </div>
                    <FilterSelect label="Filter by role" value={role} onChange={(value) => update({ role: value })}
                        options={ROLE_OPTIONS} allLabel="All roles" />
                </div>}>
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
                        {users.length ? users.map((user, index) => (
                            <tr key={user._id}>
                                <td className="text-body-secondary">{index + 1}</td>
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
                                        {isBannedTab ?
                                            <ActionButton variant="success" icon={<FaCircleCheck />} onClick={() => unban(user)}>Unban</ActionButton> :
                                            <ActionButton variant="danger" icon={<FaBan />} onClick={() => ban(user)}>Ban</ActionButton>}
                                        <ActionButton variant="danger" icon={<FaTrash />} onClick={() => remove(user)}>Remove</ActionButton>
                                    </RowActions>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={7}>{isLoading ? "Loading…" : search || role ? "No users match this filter." : isBannedTab ? "No banned users." : "No users yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination pagination={data?.pagination} />
        </>
    )
}