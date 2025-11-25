'use client'

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react"
import { categoriesApi, Category } from "@/lib/api/categories"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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

interface CategoriesClientProps {
    initialCategories: Category[]
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories)
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false)
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [openCreate, setOpenCreate] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [editing, setEditing] = useState<Category | null>(null)
    const [editName, setEditName] = useState("")
    const [editSlug, setEditSlug] = useState("")
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
    const [search, setSearch] = useState("")

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const resp = await categoriesApi.getAll()
            if (resp.success && resp.data) {
                setCategories(resp.data)
            }
        } catch (e) {
            toast.error("Tải danh mục thất bại")
        } finally {
            setLoading(false)
        }
    }

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return categories
        return categories.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.slug.toLowerCase().includes(q)
        )
    }, [categories, search])

    const resetForm = () => {
        setName("")
        setSlug("")
    }

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error("Tên danh mục không được bỏ trống")
            return
        }
        try {
            setCreating(true)
            const payload: Partial<Category> = {
                name: name.trim(),
                slug: (slug || name).trim().toLowerCase().replace(/\s+/g, "-"),
                isActive: true,
            }
            const resp = await categoriesApi.create(payload)
            if (resp.success && resp.data) {
                toast.success("Tạo danh mục thành công")
                resetForm()
                setOpenCreate(false)
                fetchCategories()
            } else {
                toast.error("Tạo danh mục thất bại")
            }
        } catch (e: any) {
            toast.error(e?.message || "Tạo danh mục thất bại")
        } finally {
            setCreating(false)
        }
    }

    const handleToggleActive = async (category: Category) => {
        try {
            const resp = await categoriesApi.toggleActive(category.id, !category.isActive)
            if (resp.success && resp.data) {
                setCategories(prev => prev.map(c => c.id === category.id ? resp.data! : c))
            }
        } catch {
            toast.error("Cập nhật trạng thái thất bại")
        }
    }

    const handleEdit = async (category: Category) => {
        const newName = editName
        const newSlug = editSlug
        try {
            const resp = await categoriesApi.update(category.id, {
                name: newName.trim(),
                slug: newSlug.trim(),
            })
            if (resp.success && resp.data) {
                toast.success("Cập nhật danh mục thành công")
                setCategories(prev => prev.map(c => c.id === category.id ? resp.data! : c))
                setOpenEdit(false)
            }
        } catch {
            toast.error("Cập nhật danh mục thất bại")
        }
    }

    const handleDelete = async (category: Category) => {
        try {
            const resp = await categoriesApi.delete(category.id)
            if (resp.success) {
                toast.success("Đã xóa danh mục")
                setCategories(prev => prev.filter(c => c.id !== category.id))
            }
        } catch {
            toast.error("Xóa danh mục thất bại")
        }
    }

    return (
        <>
            <header className="border-b bg-card">
                <div className="flex items-center justify-between p-6">
                    <div>
                        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
                        <p className="text-muted-foreground">Tạo, sửa, bật/tắt và xóa danh mục</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={fetchCategories} disabled={loading}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Làm mới
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-6 space-y-6">
                <div className="flex">
                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Thêm danh mục
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Thêm danh mục</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-3">
                                <Input
                                    placeholder="Tên danh mục"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Input
                                    placeholder="Slug (tùy chọn)"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => { resetForm(); setOpenCreate(false) }}>
                                    Hủy
                                </Button>
                                <Button className="gap-2" onClick={handleCreate} disabled={creating}>
                                    <Plus className="w-4 h-4" />
                                    Tạo
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Danh sách danh mục</CardTitle>
                            <Input
                                placeholder="Tìm theo tên hoặc slug..."
                                className="w-64"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="w-40 text-right">Hành động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                Đang tải...
                                            </TableCell>
                                        </TableRow>
                                    ) : filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                Không có danh mục
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filtered.map((c) => (
                                            <TableRow key={c.id}>
                                                <TableCell className="font-medium">{c.name}</TableCell>
                                                <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                                                <TableCell>
                                                    {c.isActive ? (
                                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Đang bật</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Đang tắt</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => handleToggleActive(c)}>
                                                            {c.isActive ? "Tắt" : "Bật"}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditing(c)
                                                                setEditName(c.name)
                                                                setEditSlug(c.slug)
                                                                setOpenEdit(true)
                                                            }}
                                                        >
                                                            <Pencil className="w-4 h-4 mr-1" />
                                                            Sửa
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive"
                                                            onClick={() => setDeleteTarget(c)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Edit dialog */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sửa danh mục</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-3">
                        <Input placeholder="Tên danh mục" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        <Input placeholder="Slug" value={editSlug} onChange={(e) => setEditSlug(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenEdit(false)}>Hủy</Button>
                        {editing && (
                            <Button onClick={() => handleEdit(editing)}>Lưu</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete confirm */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Danh mục "{deleteTarget?.name}" sẽ bị xóa vĩnh viễn.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant="outline">Hủy</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                className="text-destructive"
                                onClick={async () => {
                                    if (deleteTarget) {
                                        const target = deleteTarget
                                        setDeleteTarget(null)
                                        await handleDelete(target)
                                    }
                                }}
                            >
                                Xóa
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

