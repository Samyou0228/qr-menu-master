/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Pencil, 
  Trash, 
  Loader2, 
  Home, 
  Plus, 
  Search, 
  LayoutGrid, 
  List,
  ChevronRight,
  Settings,
  LogOut,
  UtensilsCrossed
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminDashboard = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: api.listCategories });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { data: selectedCategory } = useQuery({
    queryKey: ["category", selectedCategoryId],
    queryFn: () => api.getCategory(String(selectedCategoryId)),
    enabled: !!selectedCategoryId,
  });
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit states
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingSub, setEditingSub] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Dialog states
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);

  // Derive selectedSub from selectedCategory
  const selectedSub = useMemo(() => {
    if (!selectedCategory || !selectedSubId) return null;
    return selectedCategory.subCategories?.find((s: any) => s.id === selectedSubId || s._id === selectedSubId);
  }, [selectedCategory, selectedSubId]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter((c: any) => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Mutations
  const createCategory = useMutation({
    mutationFn: (payload: FormData) => api.createCategory(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
      setIsCategoryDialogOpen(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateCategory = useMutation({
    mutationFn: (payload: { id: string; formData: FormData }) => api.updateCategory(payload.id, payload.formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategory(null);
      setIsCategoryDialogOpen(false);
      toast.success("Category updated successfully");
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
      setIsSubDialogOpen(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateSubCategory = useMutation({
    mutationFn: (payload: { id: string; categoryId: string; formData: FormData }) =>
      api.updateSubCategory(payload.id, payload.formData),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["category", vars.categoryId] });
      setEditingSub(null);
      setIsSubDialogOpen(false);
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
    mutationFn: (payload: { categoryId: string; subCategoryId?: string; formData: FormData }) =>
      api.createItem(payload.categoryId, payload.subCategoryId, payload.formData),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["category", vars.categoryId] });
      toast.success("Item created");
      setIsItemDialogOpen(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateItem = useMutation({
    mutationFn: (payload: { id: string; categoryId: string; formData: FormData }) =>
      api.updateItem(payload.id, payload.formData),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["category", vars.categoryId] });
      setEditingItem(null);
      setIsItemDialogOpen(false);
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

  // Form Handlers
  const handleCategorySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id || editingCategory._id, formData });
    } else {
      createCategory.mutate(formData);
    }
  };

  const handleSubSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCategoryId) return;
    const formData = new FormData(e.currentTarget);
    if (editingSub) {
      updateSubCategory.mutate({ id: editingSub.id || editingSub._id, categoryId: selectedCategoryId, formData });
    } else {
      createSubCategory.mutate({ categoryId: selectedCategoryId, formData });
    }
  };

  const handleItemSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCategoryId) return;
    const formData = new FormData(e.currentTarget);
    
    // Fix boolean fields for Item
    const isSpicyChecked = (e.currentTarget.elements.namedItem('isSpicy') as HTMLInputElement)?.checked;
    const isPopularChecked = (e.currentTarget.elements.namedItem('isPopular') as HTMLInputElement)?.checked;

    formData.set('isSpicy', String(isSpicyChecked));
    formData.set('isPopular', String(isPopularChecked));

    if (editingItem) {
      updateItem.mutate({ id: editingItem.id || editingItem._id, categoryId: selectedCategoryId, formData });
    } else {
      createItem.mutate({ categoryId: selectedCategoryId, subCategoryId: selectedSubId || undefined, formData });
    }
  };

  const openCategoryDialog = (category?: any) => {
    setEditingCategory(category || null);
    setIsCategoryDialogOpen(true);
  };

  const openSubDialog = (sub?: any) => {
    setEditingSub(sub || null);
    setIsSubDialogOpen(true);
  };

  const openItemDialog = (item?: any) => {
    setEditingItem(item || null);
    setIsItemDialogOpen(true);
  };

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row overflow-hidden">
       {/* Background Image with Overlay */}
       <div 
         className="absolute inset-0 z-0"
         style={{
           backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
         }}
       >
         <div className="absolute inset-0 bg-background/95 backdrop-blur-[1px]" />
       </div>

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white/80 backdrop-blur-md border-r border-white/20 h-auto md:h-screen sticky top-0 z-10 flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/20 flex items-center gap-2">
          <div className="w-8 h-8 gradient-warm rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">Admin Portal</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Button variant="ghost" className="w-full justify-start gap-2 bg-primary/10 text-primary font-medium hover:bg-primary/20 hover:text-primary transition-colors">
            <LayoutGrid className="w-4 h-4" />
            Menu Management
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-white/50 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </nav>

        <div className="p-4 border-t border-white/20">
          <Button variant="outline" className="w-full justify-start gap-2 text-muted-foreground bg-white/50 border-white/40 hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20" onClick={() => navigate("/")}>
            <LogOut className="w-4 h-4" />
            Exit to Menu
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground drop-shadow-sm">Menu Overview</h1>
              <p className="text-muted-foreground font-medium">Manage your categories, subcategories, and items</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search categories..." 
                  className="pl-9 bg-white/80 backdrop-blur-sm border-white/40 focus:bg-white transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => openCategoryDialog()} className="gradient-warm shadow-md hover:shadow-lg transition-all text-white font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>

          {/* Breadcrumb / Navigation */}
          {selectedCategoryId && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <button onClick={() => { setSelectedCategoryId(null); setSelectedSubId(null); }} className="hover:text-primary transition-colors">Categories</button>
              <ChevronRight className="w-4 h-4" />
              <span className={selectedSubId ? "hover:text-primary cursor-pointer transition-colors" : "font-medium text-foreground"} onClick={() => setSelectedSubId(null)}>
                {selectedCategory?.name}
              </span>
              {selectedSub && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="font-medium text-foreground">{selectedSub.name}</span>
                </>
              )}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!selectedCategoryId ? (
              // Categories Grid
              <motion.div 
                key="categories-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredCategories.map((category: any, idx: number) => (
                  <motion.div
                    key={category.id || category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="group bg-white/80 backdrop-blur-md hover:shadow-elevated transition-all duration-300 border-white/40 overflow-hidden cursor-pointer" onClick={() => setSelectedCategoryId(category.id || category._id)}>
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src={category.imageUrl || category.image_url || category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0" onClick={(e) => e.stopPropagation()}>
                          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white" onClick={() => openCategoryDialog(category)}>
                            <Pencil className="w-3.5 h-3.5 text-foreground" />
                          </Button>
                          <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={() => deleteCategory.mutate(category.id || category._id)}>
                            <Trash className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between items-center text-foreground">
                          {category.name}
                          <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
                            {category.subCategories?.length || 0} Sub
                          </span>
                        </CardTitle>
                        <CardDescription className="line-clamp-1 text-muted-foreground/80">{category.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
                {filteredCategories.length === 0 && (
                  <div className="col-span-full text-center py-20 text-muted-foreground">
                    <p>No categories found. Create one to get started.</p>
                  </div>
                )}
              </motion.div>
            ) : !selectedSubId ? (
              // Subcategories & Items List
              <motion.div
                key="category-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center bg-card p-6 rounded-xl border border-border/50 shadow-sm">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCategory?.name}</h2>
                    <p className="text-muted-foreground">{selectedCategory?.description}</p>
                  </div>
                  <div className="flex gap-2">
                    {/* <Button variant="outline" onClick={() => openSubDialog()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Subcategory
                    </Button> */}
                    <Button onClick={() => openItemDialog()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6">
                  {/* {selectedCategory?.subCategories?.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <List className="w-4 h-4 text-primary" />
                        Subcategories
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedCategory.subCategories.map((sub: any) => (
                          <Card key={sub.id || sub._id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedSubId(sub.id || sub._id)}>
                            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                                  <img src={sub.imageUrl || sub.image_url || sub.image} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <CardTitle className="text-base">{sub.name}</CardTitle>
                                  <CardDescription className="text-xs">{sub.items?.length || 0} items</CardDescription>
                                </div>
                              </div>
                              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openSubDialog(sub)}>
                                  <Pencil className="w-3 h-3" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteSubCategory.mutate({ id: sub.id || sub._id, categoryId: selectedCategoryId })}>
                                  <Trash className="w-3 h-3" />
                                </Button>
                              </div>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )} */}

                  {selectedCategory?.items?.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4 text-primary" />
                        Items
                      </h3>
                      <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                        <div className="divide-y divide-border/50">
                          {selectedCategory.items.map((item: any) => (
                            <div key={item.id || item._id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                  <img src={item.imageUrl || item.image_url || item.image} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">₹{item.price}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => openItemDialog(item)}>Edit</Button>
                                <Button size="sm" variant="destructive" onClick={() => deleteItem.mutate({ id: item.id || item._id, categoryId: selectedCategoryId })}>Delete</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              // Subcategory Items
              <motion.div
                key="subcategory-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center bg-card p-6 rounded-xl border border-border/50 shadow-sm">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedSub?.name}</h2>
                    <p className="text-muted-foreground">{selectedSub?.description}</p>
                  </div>
                  <Button onClick={() => openItemDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                  <div className="divide-y divide-border/50">
                    {selectedSub?.items?.map((item: any) => (
                      <div key={item.id || item._id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                            <img src={item.imageUrl || item.image_url || item.image} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">₹{item.price}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openItemDialog(item)}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteItem.mutate({ id: item.id || item._id, categoryId: selectedCategoryId })}>Delete</Button>
                        </div>
                      </div>
                    ))}
                    {(!selectedSub?.items || selectedSub.items.length === 0) && (
                      <div className="p-8 text-center text-muted-foreground">
                        No items in this subcategory.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Dialogs */}
      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update category details below." : "Create a new category for your menu."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input name="name" defaultValue={editingCategory?.name} required placeholder="e.g. Starters" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input name="description" defaultValue={editingCategory?.description} placeholder="Short description" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>
              <Input type="file" name="image" accept="image/*" required={!editingCategory} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input type="radio" name="isVeg" value="true" defaultChecked={editingCategory?.isVeg !== false} id="catVeg" />
                  <label htmlFor="catVeg" className="text-sm">Vegetarian</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="isVeg" value="false" defaultChecked={editingCategory?.isVeg === false} id="catNonVeg" />
                  <label htmlFor="catNonVeg" className="text-sm">Non-Vegetarian</label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createCategory.isPending || updateCategory.isPending}>
                {(createCategory.isPending || updateCategory.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* SubCategory Dialog */}
      <Dialog open={isSubDialogOpen} onOpenChange={setIsSubDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingSub ? "Edit Subcategory" : "New Subcategory"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input name="name" defaultValue={editingSub?.name} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input name="description" defaultValue={editingSub?.description} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>
              <Input type="file" name="image" accept="image/*" required={!editingSub} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSubDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createSubCategory.isPending || updateSubCategory.isPending}>
                {(createSubCategory.isPending || updateSubCategory.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "New Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update item details below." : "Create a new item for your menu."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleItemSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input name="name" defaultValue={editingItem?.name} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input name="description" defaultValue={editingItem?.description} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (₹)</label>
                <Input name="price" type="number" defaultValue={editingItem?.price} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image</label>
                <Input type="file" name="image" accept="image/*" required={!editingItem} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Dietary Preference</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="isVeg" value="true" defaultChecked={editingItem?.isVeg !== false} id="itemVeg" />
                    <label htmlFor="itemVeg" className="text-sm">Vegetarian</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="isVeg" value="false" defaultChecked={editingItem?.isVeg === false} id="itemNonVeg" />
                    <label htmlFor="itemNonVeg" className="text-sm">Non-Vegetarian</label>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isSpicy" defaultChecked={editingItem?.isSpicy ?? false} id="itemSpicy" />
                <label htmlFor="itemSpicy" className="text-sm">Spicy</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isPopular" defaultChecked={editingItem?.isPopular ?? false} id="itemPopular" />
                <label htmlFor="itemPopular" className="text-sm">Popular</label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsItemDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createItem.isPending || updateItem.isPending}>
                {(createItem.isPending || updateItem.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;