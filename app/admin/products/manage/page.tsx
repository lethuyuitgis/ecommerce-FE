import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { serverProductsApi } from "@/lib/api/server"
import { setFeaturedAction, setFlashSaleAction } from "../actions"

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Đang bán",
  INACTIVE: "Tạm dừng",
  DRAFT: "Bản nháp",
}

export default async function AdminProductManagePage({
  searchParams,
}: {
  searchParams?: { error?: string; updated?: string }
}) {
  const response = await serverProductsApi.getAll(0, 100)
  const products = response.success && response.data ? response.data.content : []

  const errorMessage = searchParams?.error ? decodeURIComponent(searchParams.error) : null
  const updatedMessage =
    searchParams?.updated === "featured"
      ? "Đã cập nhật trạng thái nổi bật"
      : searchParams?.updated === "flash"
        ? "Đã cập nhật flash sale"
        : null

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <section>
            <h1 className="text-2xl font-bold text-foreground">Quản lý sản phẩm nổi bật & Flash Sale</h1>
            <p className="text-sm text-muted-foreground">
              Chỉ dành cho Admin / Seller. Cập nhật trực tiếp dữ liệu mock trên backend.
            </p>
            {updatedMessage && (
              <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                {updatedMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                {errorMessage}
              </div>
            )}
          </section>

          <section className="rounded-lg border bg-white">
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Sản phẩm</th>
                    <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                    <th className="px-4 py-3 text-left font-medium">Nổi bật</th>
                    <th className="px-4 py-3 text-left font-medium">Flash Sale</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products?.map((product: any) => (
                    <tr key={product.id} className="align-top">
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">#{product.id?.slice(0, 8)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-foreground">{STATUS_LABELS[product.status] || product.status}</p>
                        {product.price && (
                          <p className="text-xs text-muted-foreground">
                            Giá bán: {product.price.toLocaleString("vi-VN")}₫
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <form action={setFeaturedAction} className="space-y-2 rounded-md border px-3 py-2">
                          <input type="hidden" name="productId" value={product.id} />
                          <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <input
                              type="checkbox"
                              name="featured"
                              defaultChecked={product.isFeatured}
                              className="h-4 w-4"
                            />
                            Đặt làm nổi bật
                          </label>
                          <label className="text-xs text-muted-foreground">
                            Ưu tiên
                            <input
                              type="number"
                              name="priority"
                              defaultValue={product.featuredPriority ?? 0}
                              className="mt-1 w-full rounded border px-2 py-1 text-sm"
                            />
                          </label>
                          <button
                            type="submit"
                            className="w-full rounded bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
                          >
                            Cập nhật
                          </button>
                        </form>
                      </td>
                      <td className="px-4 py-4">
                        <form action={setFlashSaleAction} className="space-y-2 rounded-md border px-3 py-2">
                          <input type="hidden" name="productId" value={product.id} />
                          <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <input
                              type="checkbox"
                              name="flashEnabled"
                              defaultChecked={product.flashSaleEnabled}
                              className="h-4 w-4"
                            />
                            Bật Flash Sale
                          </label>
                          <label className="text-xs text-muted-foreground">
                            Giá Flash
                            <input
                              type="number"
                              name="flashPrice"
                              step="1000"
                              defaultValue={product.flashSalePrice ?? ""}
                              className="mt-1 w-full rounded border px-2 py-1 text-sm"
                            />
                          </label>
                          <label className="text-xs text-muted-foreground">
                            Bắt đầu
                            <input
                              type="datetime-local"
                              name="flashStart"
                              defaultValue={product.flashSaleStart ? new Date(product.flashSaleStart).toISOString().slice(0, 16) : ""}
                              className="mt-1 w-full rounded border px-2 py-1 text-sm"
                            />
                          </label>
                          <label className="text-xs text-muted-foreground">
                            Kết thúc
                            <input
                              type="datetime-local"
                              name="flashEnd"
                              defaultValue={product.flashSaleEnd ? new Date(product.flashSaleEnd).toISOString().slice(0, 16) : ""}
                              className="mt-1 w-full rounded border px-2 py-1 text-sm"
                            />
                          </label>
                          <label className="text-xs text-muted-foreground">
                            Tồn kho Flash Sale
                            <input
                              type="number"
                              name="flashStock"
                              defaultValue={product.flashSaleStock ?? ""}
                              className="mt-1 w-full rounded border px-2 py-1 text-sm"
                            />
                          </label>
                          <button
                            type="submit"
                            className="w-full rounded bg-secondary px-3 py-1.5 text-xs font-medium text-white hover:bg-secondary/90"
                          >
                            Lưu Flash Sale
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}


