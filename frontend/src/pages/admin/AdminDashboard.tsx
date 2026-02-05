import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminDashboard = () => {
  const qc = useQueryClient();
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: api.listCategories });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { data: selectedCategory } = useQuery({
    queryKey: ["category", selectedCategoryId],
    queryFn: () => api.getCategory(String(selectedCategoryId)),
    enabled: !!selectedCategoryId,
  });
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  // Edit states
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingSub, setEditingSub] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Derive selectedSub from selectedCategory
  const selectedSub = useMemo(() => {
    if (!selectedCategory || !selectedSubId) return null;
    return selectedCategory.subCategories?.find((s: any) => s.id === selectedSubId || s._id === selectedSubId);
  }, [selectedCategory, selectedSubId]);

  // Mutations
  const createCategory = useMutation({
    mutationFn: (payload: FormData) => api.createCategory(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");
    },
    onError: (err) => toast.error(err.message),
  });
  const updateCategory = useMutation({
    mutationFn: (payload: { id: string; formData: FormData }) => api.updateCategory(payload.id, payload.formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategory(null);
      toast.success("Category updated");
    },
    onError: (err) => toast.error(err.message),
  });
  const deleteCategory = useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setSelectedCategoryId(null);
      toast.success("Category deleted");
    },
    onError: (err) => toast.error(err.message),
  });

  const createSubCategory = useMutation({
    mutationFn: (payload: { categoryId: string; formData: FormData }) =>
      api.createSubCategory(payload.categoryId, payload.formData),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["category", vars.categoryId] });
      toast.success("Subcategory created");
    },
    onError: (err) => toast.error(err.message),
  });
  const updateSubCategory = useMutation({
    mutationFn: (payload: { id: string; categoryId: string; formData: FormData }) =>
      api.updateSubCategory(payload.id, payload.formData),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["category", vars.categoryId] });
      setEditingSub(null);
      toast.success("Subcategory updated");
    },
    onError: (err) => toast.error(err.message),
  });
  const deleteSubCategory = useMutation({
    mutationFn: (payload: { id: string; categoryId: string }) => api.deleteSubCategory(payload.id),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["category", vars.categoryId] });
      if (selectedSubId === vars.id) setSelectedSubId(null);
      toast.success("Subcategory deleted");
    },
    onError: (err) => toast.error(err.message),
  });

  const createItem = useMutation({
    mutationFn: (payload: {
      categoryId: string;
      subCategoryId: string;
      formData: FormData;
    }) => api.createItem(payload.categoryId, payload.subCategoryId, payload.formData),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["category", vars.categoryId] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Item created");
    },
    onError: (err) => toast.error(err.message),
  });
  const updateItem = useMutation({
    mutationFn: (payload: { id: string; categoryId: string; formData: FormData }) =>
      api.updateItem(payload.id, payload.formData),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["category", vars.categoryId] });
      setEditingItem(null);
      toast.success("Item updated");
    },
    onError: (err) => toast.error(err.message),
  });
  const deleteItem = useMutation({
    mutationFn: (payload: { id: string; categoryId: string }) => api.deleteItem(payload.id),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["category", vars.categoryId] });
      toast.success("Item deleted");
    },
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    if (categories.length && !selectedCategoryId) setSelectedCategoryId(categories[0].id || categories[0]._id);
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    if (selectedCategory?.subCategories?.length && !selectedSubId) {
      setSelectedSubId(selectedCategory.subCategories[0].id || selectedCategory.subCategories[0]._id);
    }
  }, [selectedCategory, selectedSubId]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => { localStorage.removeItem("token"); location.href = "/admin/login"; }}>
            Logout
          </Button>
        </div>

        {/* Categories Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-medium">Image 1: Categories</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((c: any) => (
              <div key={c.id || c._id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm text-muted-foreground">{c.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm mr-2">{c.itemCount} items</div>
                    <Button variant="ghost" size="icon" onClick={() => setEditingCategory(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                      if (confirm("Are you sure? This will delete all subcategories and items in this category.")) {
                        deleteCategory.mutate(c.id || c._id);
                      }
                    }} disabled={deleteCategory.isPending}>
                      {deleteCategory.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form
            className="grid grid-cols-1 gap-2 sm:grid-cols-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData();
              formData.append("name", (form.elements.namedItem("name") as HTMLInputElement).value);
              formData.append("description", (form.elements.namedItem("description") as HTMLInputElement).value);
              formData.append("isVeg", (form.elements.namedItem("isVeg") as HTMLSelectElement).value);
              const fileInput = form.elements.namedItem("image") as HTMLInputElement;
              if (fileInput.files && fileInput.files[0]) {
                formData.append("image", fileInput.files[0]);
              }
              createCategory.mutate(formData);
              form.reset();
            }}
          >
            <Input name="name" placeholder="Name" required />
            <Input name="description" placeholder="Description" />
            <select name="isVeg" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="true">Veg</option>
              <option value="false">Non-Veg</option>
            </select>
            <Input name="image" type="file" accept="image/*" />
            <Button type="submit">Add Category</Button>
          </form>
        </section>

        {/* Subcategories Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-medium">Image 2: Subcategories (Varieties)</h2>

          <div className="flex items-center gap-2">
            <span className="text-sm">Category:</span>
            <select
              className="border rounded px-2 py-1 bg-card"
              value={selectedCategoryId || ""}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setSelectedSubId(null);
              }}
            >
              {categories.map((c: any) => (
                <option key={c.id || c._id} value={c.id || c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedCategory.subCategories.map((sc: any) => (
                  <div
                    key={sc.id || sc._id}
                    className={`rounded-xl border p-4 cursor-pointer ${selectedSubId === (sc.id || sc._id) ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedSubId(sc.id || sc._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{sc.name}</div>
                        <div className="text-sm text-muted-foreground">{sc.description}</div>
                        <div className="text-sm mt-2">{sc.itemCount} varieties</div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setEditingSub(sc); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this subcategory?")) {
                            deleteSubCategory.mutate({ id: sc.id || sc._id, categoryId: selectedCategoryId! });
                          }
                        }} disabled={deleteSubCategory.isPending}>
                          {deleteSubCategory.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form
                className="grid grid-cols-1 gap-2 sm:grid-cols-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!selectedCategoryId) return;
                  const form = e.currentTarget;
                  const formData = new FormData();
                  formData.append("name", (form.elements.namedItem("name") as HTMLInputElement).value);
                  formData.append("description", (form.elements.namedItem("description") as HTMLInputElement).value);
                  formData.append("isVeg", (form.elements.namedItem("isVeg") as HTMLSelectElement).value);
                  const fileInput = form.elements.namedItem("image") as HTMLInputElement;
                  if (fileInput.files && fileInput.files[0]) {
                    formData.append("image", fileInput.files[0]);
                  }
                  createSubCategory.mutate({ categoryId: selectedCategoryId, formData });
                  form.reset();
                }}
              >
                <Input name="name" placeholder="Name" required />
                <Input name="description" placeholder="Description" />
                <select name="isVeg" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="true">Veg</option>
                  <option value="false">Non-Veg</option>
                </select>
                <Input name="image" type="file" accept="image/*" />
                <Button type="submit" disabled={createSubCategory.isPending}>
                  {createSubCategory.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : "Add Subcategory"}
                </Button>
              </form>
            </>
          )}
        </section>

        {/* Items Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-medium">Image 3: Items</h2>

          {selectedSub && (
            <>
              <div className="rounded-xl border p-4 bg-muted/20">
                <div className="font-semibold">{selectedSub.name}</div>
                <div className="text-sm text-muted-foreground">{selectedSub.description}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedSub.items?.map((i: any) => (
                  <div key={i.id || i._id} className="rounded-xl border p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{i.name}</div>
                        <div className="text-sm text-muted-foreground">{i.description}</div>
                        <div className="text-sm mt-2 font-medium">₹{i.amount}</div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditingItem(i)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                          if (confirm("Delete this item?")) {
                            deleteItem.mutate({ id: i.id || i._id, categoryId: selectedCategoryId! });
                          }
                        }} disabled={deleteItem.isPending}>
                          {deleteItem.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form
                className="grid grid-cols-1 gap-2 sm:grid-cols-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!selectedSubId || !selectedCategoryId) return;
                  const form = e.currentTarget;
                  const formData = new FormData();
                  formData.append("name", (form.elements.namedItem("name") as HTMLInputElement).value);
                  formData.append("description", (form.elements.namedItem("description") as HTMLInputElement).value);
                  formData.append("amount", (form.elements.namedItem("amount") as HTMLInputElement).value);
                  formData.append("isVeg", (form.elements.namedItem("isVeg") as HTMLSelectElement).value);
                  const fileInput = form.elements.namedItem("image") as HTMLInputElement;
                  if (fileInput.files && fileInput.files[0]) {
                    formData.append("image", fileInput.files[0]);
                  }
                  createItem.mutate({ categoryId: selectedCategoryId, subCategoryId: selectedSubId, formData });
                  form.reset();
                }}
              >
                <Input name="name" placeholder="Name" required />
                <Input name="description" placeholder="Description" />
                <Input name="amount" placeholder="Amount" required />
                <select name="isVeg" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="true">Veg</option>
                  <option value="false">Non-Veg</option>
                </select>
                <Input name="image" type="file" accept="image/*" />
                <Button type="submit">Add Item</Button>
              </form>
            </>
          )}
        </section>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details and image.</DialogDescription>
          </DialogHeader>
          <form
            key={editingCategory?.id || editingCategory?._id}
            onSubmit={(e) => {
              e.preventDefault();
              if (!editingCategory) return;
              const form = e.currentTarget;
              const formData = new FormData();
              formData.append("name", (form.elements.namedItem("name") as HTMLInputElement).value);
              formData.append("description", (form.elements.namedItem("description") as HTMLInputElement).value);
              formData.append("isVeg", (form.elements.namedItem("isVeg") as HTMLSelectElement).value);
              const fileInput = form.elements.namedItem("image") as HTMLInputElement;
              if (fileInput.files && fileInput.files[0]) {
                formData.append("image", fileInput.files[0]);
              }
              updateCategory.mutate({ id: editingCategory.id || editingCategory._id, formData });
            }}
            className="space-y-4"
          >
            <Input name="name" placeholder="Name" defaultValue={editingCategory?.name} required />
            <Input name="description" placeholder="Description" defaultValue={editingCategory?.description} />
            <select name="isVeg" defaultValue={editingCategory?.isVeg?.toString() ?? "true"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="true">Veg</option>
              <option value="false">Non-Veg</option>
            </select>
            <div>
              <label className="text-sm text-muted-foreground">Current Image: {editingCategory?.imageUrl ? "Set" : "None"}</label>
              <Input name="image" type="file" accept="image/*" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateCategory.isPending}>
                {updateCategory.isPending ? "Updating..." : "Update Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit SubCategory Dialog */}
      <Dialog open={!!editingSub} onOpenChange={(open) => !open && setEditingSub(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription>Update subcategory details.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!editingSub || !selectedCategoryId) return;
              const form = e.currentTarget;
              const formData = new FormData();
              formData.append("name", (form.elements.namedItem("name") as HTMLInputElement).value);
              formData.append("description", (form.elements.namedItem("description") as HTMLInputElement).value);
              formData.append("isVeg", (form.elements.namedItem("isVeg") as HTMLSelectElement).value);
              const fileInput = form.elements.namedItem("image") as HTMLInputElement;
              if (fileInput.files && fileInput.files[0]) {
                formData.append("image", fileInput.files[0]);
              }
              updateSubCategory.mutate({ id: editingSub.id || editingSub._id, categoryId: selectedCategoryId, formData });
            }}
            className="space-y-4"
          >
            <Input name="name" placeholder="Name" defaultValue={editingSub?.name} required />
            <Input name="description" placeholder="Description" defaultValue={editingSub?.description} />
            <select name="isVeg" defaultValue={editingSub?.isVeg?.toString() ?? "true"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="true">Veg</option>
              <option value="false">Non-Veg</option>
            </select>
            <div>
              <label className="text-sm text-muted-foreground">Current Image: {editingSub?.imageUrl ? "Set" : "None"}</label>
              <Input name="image" type="file" accept="image/*" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateSubCategory.isPending}>
                {updateSubCategory.isPending ? "Updating..." : "Update Subcategory"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update item details.</DialogDescription>
          </DialogHeader>
          <form
            key={editingItem?.id || editingItem?._id}
            onSubmit={(e) => {
              e.preventDefault();
              if (!editingItem || !selectedCategoryId) return;
              const form = e.currentTarget;
              const formData = new FormData();
              formData.append("name", (form.elements.namedItem("name") as HTMLInputElement).value);
              formData.append("description", (form.elements.namedItem("description") as HTMLInputElement).value);
              formData.append("amount", (form.elements.namedItem("amount") as HTMLInputElement).value);
              formData.append("isVeg", (form.elements.namedItem("isVeg") as HTMLSelectElement).value);
              const fileInput = form.elements.namedItem("image") as HTMLInputElement;
              if (fileInput.files && fileInput.files[0]) {
                formData.append("image", fileInput.files[0]);
              }
              updateItem.mutate({ id: editingItem.id || editingItem._id, categoryId: selectedCategoryId, formData });
            }}
            className="space-y-4"
          >
            <Input name="name" placeholder="Name" defaultValue={editingItem?.name} required />
            <Input name="description" placeholder="Description" defaultValue={editingItem?.description} />
            <Input name="amount" placeholder="Amount" defaultValue={editingItem?.amount} required />
            <select name="isVeg" defaultValue={editingItem?.isVeg?.toString() ?? "true"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="true">Veg</option>
              <option value="false">Non-Veg</option>
            </select>
            <div>
              <label className="text-sm text-muted-foreground">Current Image: {editingItem?.imageUrl ? "Set" : "None"}</label>
              <Input name="image" type="file" accept="image/*" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateItem.isPending}>
                {updateItem.isPending ? "Updating..." : "Update Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
