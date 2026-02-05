import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface SearchMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchMenu = ({ open, onOpenChange }: SearchMenuProps) => {
  const navigate = useNavigate();
  const { data: menu = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: api.listCategories,
    enabled: open,
  });

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search categories, items..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {/* Categories */}
        <CommandGroup heading="Categories">
          {menu.map((category: any) => (
             <CommandItem 
               key={category._id || category.id} 
               value={category.name}
               onSelect={() => handleSelect(`/menu/${category._id || category.id}`)}
             >
               {category.name}
             </CommandItem>
          ))}
        </CommandGroup>

        {/* SubCategories */}
        <CommandGroup heading="Sub Categories">
           {menu.flatMap((cat: any) => 
             (cat.subCategories || []).map((sub: any) => ({...sub, catId: cat._id || cat.id}))
           ).map((sub: any) => (
             <CommandItem 
               key={sub._id || sub.id}
               value={sub.name}
               onSelect={() => handleSelect(`/menu/${sub.catId}/${sub._id || sub.id}`)}
             >
                {sub.name}
             </CommandItem>
           ))}
        </CommandGroup>

        {/* Items */}
        <CommandGroup heading="Items">
           {menu.flatMap((cat: any) => 
             [
               ...(cat.items || []).map((item: any) => ({...item, catId: cat._id || cat.id, subId: null})),
               ...(cat.subCategories || []).flatMap((sub: any) => 
                 (sub.items || []).map((item: any) => ({...item, catId: cat._id || cat.id, subId: sub._id || sub.id}))
               )
             ]
           ).map((item: any) => (
             <CommandItem 
               key={item._id || item.id}
               value={`${item.name} ${item.description || ''}`}
               onSelect={() => {
                  if (item.subId) {
                    navigate(`/menu/${item.catId}/${item.subId}`);
                  } else {
                    navigate(`/menu/${item.catId}`);
                  }
                  onOpenChange(false);
               }}
             >
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
                  )}
                </div>
             </CommandItem>
           ))}
        </CommandGroup>

      </CommandList>
    </CommandDialog>
  );
}
