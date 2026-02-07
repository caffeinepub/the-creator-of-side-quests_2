import { useState } from 'react';
import type { PortfolioItem } from '../../backend';
import { useUpdatePortfolioItem } from '../../hooks/admin/useAdminPortfolio';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Edit } from 'lucide-react';

interface AdminPortfolioTableProps {
  items: PortfolioItem[];
}

export default function AdminPortfolioTable({ items }: AdminPortfolioTableProps) {
  const updatePortfolioItem = useUpdatePortfolioItem();

  const [editItem, setEditItem] = useState<PortfolioItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const handleEditOpen = (item: PortfolioItem) => {
    setEditItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditCategory(item.category || '');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    const updatedItem: PortfolioItem = {
      ...editItem,
      title: editTitle.trim(),
      description: editDescription.trim(),
      category: editCategory || undefined,
    };

    await updatePortfolioItem.mutateAsync(updatedItem);
    setEditItem(null);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Thumbnail</TableHead>
              <TableHead className="min-w-[120px]">Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Description</TableHead>
              <TableHead className="w-16 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No portfolio items yet. Upload your first item to get started.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={item.image.getDirectURL()}
                      alt={item.title}
                      className="h-12 w-12 rounded-md border object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="min-w-0 break-words">{item.title}</div>
                    {item.category && (
                      <div className="mt-1 md:hidden">
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.category ? (
                      <Badge variant="outline">{item.category}</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden max-w-md lg:table-cell">
                    <p className="line-clamp-2 text-sm">{item.description}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditOpen(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Portfolio Item</DialogTitle>
              <DialogDescription>Update the portfolio item metadata.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select a category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="What I have created for the community">
                      What I have created for the community
                    </SelectItem>
                    <SelectItem value="Custom Projects">Custom Projects</SelectItem>
                    <SelectItem value="Vinyl Decals">Vinyl Decals</SelectItem>
                    <SelectItem value="3D Prints">3D Prints</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditItem(null)}
                disabled={updatePortfolioItem.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updatePortfolioItem.isPending}>
                {updatePortfolioItem.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
