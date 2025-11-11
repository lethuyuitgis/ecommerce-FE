"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "./button"
import { apiClientWithFile } from "@/lib/api/client"

interface RichTextEditorProps {
    value: string
    onChange: (html: string) => void
    placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const ref = useRef<HTMLDivElement | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (ref.current && ref.current.innerHTML !== value) {
            ref.current.innerHTML = value || ""
        }
    }, [value])

    const exec = (cmd: string, arg?: string) => {
        document.execCommand(cmd, false, arg)
        if (ref.current) {
            onChange(ref.current.innerHTML)
        }
    }

    const insertImage = () => {
        const url = window.prompt("Nhập URL ảnh:")
        if (url) exec("insertImage", url)
    }

    const handleChooseFile = () => {
        if (fileInputRef.current) fileInputRef.current.click()
    }

    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        // Limit image size to 2MB
        if (file.size > 2 * 1024 * 1024) {
            alert("Ảnh quá lớn (tối đa 2MB). Vui lòng chọn ảnh khác.")
            e.target.value = ""
            return
        }
        try {
            setUploading(true)
            const res = await apiClientWithFile<{ fileUrl: string }>('/upload/image', file, 'editor')
            if (res.success && (res.data as any)?.fileUrl) {
                exec("insertImage", (res.data as any).fileUrl)
            }
        } catch (err: any) {
            alert(err?.message || "Tải ảnh thất bại")
        } finally {
            setUploading(false)
            e.target.value = ""
        }
    }

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-2">
                <Button type="button" variant="outline" size="sm" onClick={() => exec("bold")} className="bg-transparent">Đậm</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => exec("italic")} className="bg-transparent">Nghiêng</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => exec("underline")} className="bg-transparent">Gạch chân</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => exec("insertUnorderedList")} className="bg-transparent">• Danh sách</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => exec("insertOrderedList")} className="bg-transparent">1. Danh sách</Button>
                <Button type="button" variant="outline" size="sm" onClick={insertImage} className="bg-transparent">Chèn ảnh URL</Button>
                <Button type="button" variant="outline" size="sm" onClick={handleChooseFile} className="bg-transparent" disabled={uploading}>
                    {uploading ? "Đang tải..." : "Tải ảnh lên"}
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadFile} />
            </div>
            <div
                ref={ref}
                contentEditable
                className="min-h-40 w-full rounded-md border p-3 text-sm focus:outline-none"
                onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
                data-placeholder={placeholder || ""}
                suppressContentEditableWarning
            />
        </div>
    )
}


