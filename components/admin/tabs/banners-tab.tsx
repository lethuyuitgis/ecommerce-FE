"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Plus, Trash2, Pencil } from "lucide-react"
import { bannersApi, type Banner } from "@/lib/api/banners"
import { toast } from "sonner"

const POSITIONS = ["HOME_MAIN", "HOME_TOP", "HOME_MIDDLE", "HOME_BOTTOM", "CATEGORY_TOP"]

const empty: Omit<Banner, "id"> = {
  title: "",
  imageUrl: "",
  linkUrl: "",
  position: "HOME_MAIN",
  displayOrder: 0,
  isActive: true,
}

export function BannersTab() {
  const [position, setPosition] = useState("HOME_MAIN")
  const [items, setItems] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [form, setForm] = useState<Omit<Banner, "id">>(empty)
  const [saving, setSaving] = useState(false)

  const load = async (pos: string) => {
    setLoading(true)
    try {
      const list = await bannersApi.list(pos)
      setItems(list)
    } catch (e: any) {
      toast.error(e.message || "Không tải được banner")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(position)
  }, [position])

  const resetForm = () => {
    setEditing(null)
    setForm({ ...empty, position })
  }

  const handleSave = async () => {
    if (!form.title || !form.imageUrl) {
      toast.error("Tiêu đề và Image URL là bắt buộc")
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await bannersApi.update(editing.id, form)
        toast.success("Đã cập nhật")
      } else {
        await bannersApi.create(form)
        toast.success("Đã tạo banner")
      }
      resetForm()
      load(position)
    } catch (e: any) {
      toast.error(e.message || "Lưu thất bại")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (b: Banner) => {
    setEditing(b)
    setForm({
      title: b.title,
      imageUrl: b.imageUrl,
      linkUrl: b.linkUrl,
      position: b.position,
      displayOrder: b.displayOrder,
      isActive: b.isActive,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Xoá banner này?")) return
    try {
      await bannersApi.remove(id)
      toast.success("Đã xoá")
      load(position)
    } catch (e: any) {
      toast.error(e.message || "Xoá thất bại")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Sửa banner" : "Thêm banner mới"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div>
            <Label>Tiêu đề</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>
          <div>
            <Label>Link URL</Label>
            <Input
              value={form.linkUrl ?? ""}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
            />
          </div>
          <div>
            <Label>Vị trí</Label>
            <Select
              value={form.position ?? "HOME_MAIN"}
              onValueChange={(v) => setForm({ ...form, position: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Thứ tự hiển thị</Label>
            <Input
              type="number"
              value={form.displayOrder ?? 0}
              onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Switch
              checked={form.isActive ?? true}
              onCheckedChange={(v) => setForm({ ...form, isActive: v })}
            />
            <Label className="cursor-pointer">Đang hoạt động</Label>
          </div>
          <div className="md:col-span-2 flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              {editing ? "Cập nhật" : "Thêm"}
            </Button>
            {editing && (
              <Button variant="outline" onClick={resetForm}>
                Huỷ
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh sách banner</CardTitle>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POSITIONS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải...
            </div>
          ) : items.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Chưa có banner nào ở vị trí này.
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((b) => (
                <div key={b.id} className="flex items-center gap-3 rounded border p-2">
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="h-16 w-28 rounded object-cover bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{b.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{b.linkUrl}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.position} · #{b.displayOrder} · {b.isActive ? "ACTIVE" : "INACTIVE"}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(b)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(b.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
