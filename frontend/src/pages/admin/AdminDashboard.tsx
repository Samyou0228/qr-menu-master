import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  // Derive selectedSub from selectedCategory
  const selectedSub = useMemo(() => {
    if (!selectedCategory || !selectedSubId) return null;
    return selectedCategory.subCategories?.find((s: any) => s.id === selectedSubId || s._id === selectedSubId);
  }, [selectedCategory, selectedSubId]);

  const createCategory = useMutation({
    mutationFn: (payload: { name: string; description?: string; imageUrl?: string }) => api.createCategory(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
  const createSubCategory = useMutation({
    mutationFn: (payload: { categoryId: string; name: string; description?: string; imageUrl?: string }) =>
      api.createSubCategory(payload.categoryId, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["category", vars.categoryId] });
    },
  });
  const createItem = useMutation({
    mutationFn: (payload: {
      categoryId: string;
      subCategoryId: string;
      name: string;
      description?: string;
      amount: number;
      imageUrl?: string;
      isVeg?: boolean;
      isPopular?: boolean;
    }) => api.createItem(payload.categoryId, payload.subCategoryId, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["category", vars.categoryId] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
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
                  <div className="text-sm">{c.itemCount} items</div>
                </div>
              </div>
            ))}
          </div>

          <form
            className="grid grid-cols-1 gap-2 sm:grid-cols-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const name = (form.elements.namedItem("name") as HTMLInputElement).value;
              const description = (form.elements.namedItem("description") as HTMLInputElement).value;
              const imageUrl = (form.elements.namedItem("imageUrl") as HTMLInputElement).value;
              createCategory.mutate({ name, description, imageUrl });
              form.reset();
            }}
          >
            <Input name="name" placeholder="Name" />
            <Input name="description" placeholder="Description" />
            <Input name="imageUrl" placeholder="Image URL" />
            <Button type="submit">Add Category</Button>
          </form>
        </section>

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
                    <div className="font-semibold">{sc.name}</div>
                    <div className="text-sm text-muted-foreground">{sc.description}</div>
                    <div className="text-sm mt-2">{sc.itemCount} varieties</div>
                  </div>
                ))}
              </div>

              <form
                className="grid grid-cols-1 gap-2 sm:grid-cols-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!selectedCategoryId) return;
                  const form = e.currentTarget;
                  const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                  const description = (form.elements.namedItem("description") as HTMLInputElement).value;
                  const imageUrl = (form.elements.namedItem("imageUrl") as HTMLInputElement).value;
                  createSubCategory.mutate({ categoryId: selectedCategoryId, name, description, imageUrl });
                  form.reset();
                }}
              >
                <Input name="name" placeholder="Name" />
                <Input name="description" placeholder="Description" />
                <Input name="imageUrl" placeholder="Image URL" />
                <Button type="submit">Add Subcategory</Button>
              </form>
            </>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Image 3: Items</h2>

          {selectedSub && (
            <>
              <div className="rounded-xl border p-4">
                <div className="font-semibold">{selectedSub.name}</div>
                <div className="text-sm text-muted-foreground">{selectedSub.description}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedSub.items?.map((i: any) => (
                  <div key={i.id || i._id} className="rounded-xl border p-4">
                    <div className="font-semibold">{i.name}</div>
                    <div className="text-sm text-muted-foreground">{i.description}</div>
                    <div className="text-sm mt-2">₹{i.amount}</div>
                  </div>
                ))}
              </div>

              <form
                className="grid grid-cols-1 gap-2 sm:grid-cols-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!selectedSubId || !selectedCategoryId) return;
                  const form = e.currentTarget;
                  const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                  const description = (form.elements.namedItem("description") as HTMLInputElement).value;
                  const amount = Number((form.elements.namedItem("amount") as HTMLInputElement).value);
                  const imageUrl = (form.elements.namedItem("imageUrl") as HTMLInputElement).value;
                  createItem.mutate({ categoryId: selectedCategoryId, subCategoryId: selectedSubId, name, description, amount, imageUrl });
                  form.reset();
                }}
              >
                <Input name="name" placeholder="Name" />
                <Input name="description" placeholder="Description" />
                <Input name="amount" placeholder="Amount" />
                <Input name="imageUrl" placeholder="Image URL" />
                <Button type="submit">Add Item</Button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
