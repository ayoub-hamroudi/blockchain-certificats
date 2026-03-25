"use client"

import { useEffect, useState } from "react"
import { apiFetch, getStoredToken } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Search,
  Plus,
  Users,
  GraduationCap,
  BookOpen,
  Loader2,
  CheckCircle2,
  MoreHorizontal,
  Eye,
  Pencil,
  UserX,
  UserCheck,
  Mail,
  Wallet,
  Calendar,
  ExternalLink,
} from "lucide-react"

type AddUserState = "idle" | "loading" | "success"
type UserStatus = "active" | "inactive"

type UserFormData = {
  name: string
  address: string
  email: string
}

type ApiUser = {
  id: string
  name: string
  email?: string
  address?: string
  walletAddress?: string
  addedAt: string
  createdAt?: string
  updatedAt?: string
  role: "teacher" | "student"
  status: UserStatus
}

interface ExtendedUser {
  id: string
  address: string
  name: string
  email?: string
  addedAt: string
  status: UserStatus
  role: "teacher" | "student"
}

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge
      variant={status === "active" ? "default" : "secondary"}
      className={
        status === "active"
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
      }
    >
      {status === "active" ? (
        <>
          <UserCheck className="mr-1 h-3 w-3" />
          Active
        </>
      ) : (
        <>
          <UserX className="mr-1 h-3 w-3" />
          Inactive
        </>
      )}
    </Badge>
  )
}

function AddUserDialog({
  open,
  onOpenChange,
  type,
  formData,
  setFormData,
  onSubmit,
  addUserState,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "teacher" | "student"
  formData: UserFormData
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>
  onSubmit: (e: React.FormEvent) => void
  addUserState: AddUserState
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add {type === "teacher" ? "Teacher" : "Student"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New {type === "teacher" ? "Teacher" : "Student"}</DialogTitle>
          <DialogDescription>
            Enter the details to register a new {type}.
          </DialogDescription>
        </DialogHeader>

        {addUserState === "success" ? (
          <Alert className="border-emerald-500/20 bg-emerald-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-700">
              {type === "teacher" ? "Teacher" : "Student"} Added Successfully
            </AlertTitle>
            <AlertDescription className="text-emerald-600">
              The new {type} has been saved successfully.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor={`${type}-name`}>Full Name</Label>
              <Input
                id={`${type}-name`}
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${type}-email`}>Email</Label>
              <Input
                id={`${type}-email`}
                type="email"
                placeholder="john.doe@university.edu"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${type}-address`}>Wallet Address</Label>
              <Input
                id={`${type}-address`}
                placeholder="0x..."
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={addUserState === "loading"}>
              {addUserState === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                `Add ${type === "teacher" ? "Teacher" : "Student"}`
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function UserTable({
  users,
  type,
  onViewDetails,
  onEditUser,
  onDeactivateUser,
}: {
  users: ExtendedUser[]
  type: "teacher" | "student"
  onViewDetails: (user: ExtendedUser) => void
  onEditUser: (user: ExtendedUser) => void
  onDeactivateUser: (user: ExtendedUser) => void
}) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Wallet Address</TableHead>
            <TableHead className="hidden sm:table-cell">Date Added</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No {type}s found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                <TableCell className="font-mono text-sm">
                  {user.address.slice(0, 10)}...{user.address.slice(-6)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">{user.addedAt}</TableCell>
                <TableCell>
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => onEditUser(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onDeactivateUser(user)}
                        className={user.status === "active" ? "text-destructive" : "text-emerald-600"}
                      >
                        {user.status === "active" ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default function UserManagementPage() {
  const [teacherSearch, setTeacherSearch] = useState("")
  const [studentSearch, setStudentSearch] = useState("")
  const [teacherStatusFilter, setTeacherStatusFilter] = useState<"all" | UserStatus>("all")
  const [studentStatusFilter, setStudentStatusFilter] = useState<"all" | UserStatus>("all")
  const [addUserState, setAddUserState] = useState<AddUserState>("idle")
  const [addTeacherOpen, setAddTeacherOpen] = useState(false)
  const [addStudentOpen, setAddStudentOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")

  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", email: "" })

  const [teachers, setTeachers] = useState<ExtendedUser[]>([])
  const [students, setStudents] = useState<ExtendedUser[]>([])

  const [newTeacher, setNewTeacher] = useState<UserFormData>({
    name: "",
    address: "",
    email: "",
  })

  const [newStudent, setNewStudent] = useState<UserFormData>({
    name: "",
    address: "",
    email: "",
  })

  function mapApiUser(user: ApiUser): ExtendedUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address || user.walletAddress || "",
      addedAt: user.addedAt,
      status: user.status,
      role: user.role,
    }
  }

  async function loadUsers() {
    try {
      setLoading(true)
      setPageError("")

      const token = getStoredToken()
      if (!token) throw new Error("Authentication token not found")

      const [teachersResponse, studentsResponse] = await Promise.all([
        apiFetch("/api/users/teachers", { method: "GET" }, token),
        apiFetch("/api/users/students", { method: "GET" }, token),
      ])

      setTeachers((teachersResponse.data || []).map(mapApiUser))
      setStudents((studentsResponse.data || []).map(mapApiUser))
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      teacher.address.toLowerCase().includes(teacherSearch.toLowerCase())

    const matchesStatus =
      teacherStatusFilter === "all" || teacher.status === teacherStatusFilter

    return matchesSearch && matchesStatus
  })

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.address.toLowerCase().includes(studentSearch.toLowerCase())

    const matchesStatus =
      studentStatusFilter === "all" || student.status === studentStatusFilter

    return matchesSearch && matchesStatus
  })

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setAddUserState("loading")

      const token = getStoredToken()
      if (!token) throw new Error("Authentication token not found")

      const response = await apiFetch(
        "/api/users/teacher",
        {
          method: "POST",
          body: JSON.stringify({
            name: newTeacher.name,
            email: newTeacher.email,
            walletAddress: newTeacher.address,
          }),
        },
        token
      )

      setTeachers((prev) => [mapApiUser(response.data), ...prev])
      setAddUserState("success")

      setTimeout(() => {
        setAddTeacherOpen(false)
        setAddUserState("idle")
        setNewTeacher({ name: "", address: "", email: "" })
      }, 1000)
    } catch (error) {
      setAddUserState("idle")
      alert(error instanceof Error ? error.message : "Failed to add teacher")
    }
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setAddUserState("loading")

      const token = getStoredToken()
      if (!token) throw new Error("Authentication token not found")

      const response = await apiFetch(
        "/api/users/student",
        {
          method: "POST",
          body: JSON.stringify({
            name: newStudent.name,
            email: newStudent.email,
            walletAddress: newStudent.address,
          }),
        },
        token
      )

      setStudents((prev) => [mapApiUser(response.data), ...prev])
      setAddUserState("success")

      setTimeout(() => {
        setAddStudentOpen(false)
        setAddUserState("idle")
        setNewStudent({ name: "", address: "", email: "" })
      }, 1000)
    } catch (error) {
      setAddUserState("idle")
      alert(error instanceof Error ? error.message : "Failed to add student")
    }
  }

  const handleViewDetails = (user: ExtendedUser) => {
    setSelectedUser(user)
    setDetailsOpen(true)
  }

  const handleEditUser = (user: ExtendedUser) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name,
      email: user.email || "",
    })
    setEditOpen(true)
  }

  const handleDeactivateUser = (user: ExtendedUser) => {
    setSelectedUser(user)
    setDeactivateOpen(true)
  }

  const handleSaveEdit = async () => {
    try {
      if (!selectedUser) return

      const token = getStoredToken()
      if (!token) throw new Error("Authentication token not found")

      const response = await apiFetch(
        `/api/users/${selectedUser.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            name: editForm.name,
            email: editForm.email,
          }),
        },
        token
      )

      const updatedUser = mapApiUser(response.data)

      if (updatedUser.role === "teacher") {
        setTeachers((prev) =>
          prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        )
      } else {
        setStudents((prev) =>
          prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        )
      }

      setEditOpen(false)
      setSelectedUser(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update user")
    }
  }

  const handleConfirmDeactivate = async () => {
    try {
      if (!selectedUser) return

      const token = getStoredToken()
      if (!token) throw new Error("Authentication token not found")

      const nextStatus: UserStatus =
        selectedUser.status === "active" ? "inactive" : "active"

      const response = await apiFetch(
        `/api/users/${selectedUser.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: nextStatus,
          }),
        },
        token
      )

      const updatedUser = mapApiUser(response.data)

      if (updatedUser.role === "teacher") {
        setTeachers((prev) =>
          prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        )
      } else {
        setStudents((prev) =>
          prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        )
      }

      setDeactivateOpen(false)
      setSelectedUser(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update status")
    }
  }

  return (
    <div className="space-y-6">
      {pageError && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{pageError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>User Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage teachers and students registered in the system
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading users...
            </div>
          ) : (
            <Tabs defaultValue="teachers" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="teachers" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Teachers ({teachers.length})
                </TabsTrigger>

                <TabsTrigger value="students" className="gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Students ({students.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="teachers" className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1 sm:max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search teachers..."
                        value={teacherSearch}
                        onChange={(e) => setTeacherSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    <Select
                      value={teacherStatusFilter}
                      onValueChange={(value) => setTeacherStatusFilter(value as "all" | UserStatus)}
                    >
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <AddUserDialog
                    open={addTeacherOpen}
                    onOpenChange={setAddTeacherOpen}
                    type="teacher"
                    formData={newTeacher}
                    setFormData={setNewTeacher}
                    onSubmit={handleAddTeacher}
                    addUserState={addUserState}
                  />
                </div>

                <UserTable
                  users={filteredTeachers}
                  type="teacher"
                  onViewDetails={handleViewDetails}
                  onEditUser={handleEditUser}
                  onDeactivateUser={handleDeactivateUser}
                />
              </TabsContent>

              <TabsContent value="students" className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1 sm:max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    <Select
                      value={studentStatusFilter}
                      onValueChange={(value) => setStudentStatusFilter(value as "all" | UserStatus)}
                    >
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <AddUserDialog
                    open={addStudentOpen}
                    onOpenChange={setAddStudentOpen}
                    type="student"
                    formData={newStudent}
                    setFormData={setNewStudent}
                    onSubmit={handleAddStudent}
                    addUserState={addUserState}
                  />
                </div>

                <UserTable
                  users={filteredStudents}
                  type="student"
                  onViewDetails={handleViewDetails}
                  onEditUser={handleEditUser}
                  onDeactivateUser={handleDeactivateUser}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
            <SheetDescription>
              View complete information for this user.
            </SheetDescription>
          </SheetHeader>

          {selectedUser && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {selectedUser.role === "teacher" ? (
                    <BookOpen className="h-8 w-8 text-primary" />
                  ) : (
                    <GraduationCap className="h-8 w-8 text-primary" />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {selectedUser.role}
                    </Badge>
                    <StatusBadge status={selectedUser.status} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <Wallet className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Wallet Address</p>
                    <p className="break-all font-mono text-sm">{selectedUser.address}</p>
                    <a
                      href={`https://etherscan.io/address/${selectedUser.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      View on Etherscan
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date Added</p>
                    <p className="font-medium">{selectedUser.addedAt}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setDetailsOpen(false)
                    handleEditUser(selectedUser)
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  variant={selectedUser.status === "active" ? "destructive" : "default"}
                  className="flex-1"
                  onClick={() => {
                    setDetailsOpen(false)
                    handleDeactivateUser(selectedUser)
                  }}
                >
                  {selectedUser.status === "active" ? (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the information for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSaveEdit()
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Wallet Address</Label>
              <Input value={selectedUser?.address || ""} disabled className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground">
                Wallet address cannot be changed after registration.
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === "active" ? "Deactivate" : "Activate"} User
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.status === "active"
                ? `Are you sure you want to deactivate ${selectedUser?.name}? They will no longer be able to access the system.`
                : `Are you sure you want to activate ${selectedUser?.name}? They will regain access to the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeactivate}
              className={
                selectedUser?.status === "active"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {selectedUser?.status === "active" ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}