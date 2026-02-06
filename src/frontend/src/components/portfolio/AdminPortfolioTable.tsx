import { useState } from 'react';
import type { PortfolioItem } from '../../backend';
import { useDeletePortfolioItem, useUpdatePortfolioItem } from '../../hooks/admin/useAdminPortfolio';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
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
import { Edit, Trash2 } from 'lucide-react';

interface AdminPortfolioTableProps {
  items: PortfolioItem[];
}

export default function AdminPortfolioTable({ items }: AdminPortfolioTableProps) {
  const deletePortfolioItem = useDeletePortfolioItem();
  const updatePortfolioItem = useUpdatePortfolioItem();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<PortfolioItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const handleDelete = async () => {
    if (deleteId) {
      await deletePortfolioItem.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    {item.category ? (
                      <Badge variant="outline">{item.category}</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2 text-sm">{item.description}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditOpen(item)}
                        disabled={deletePortfolioItem.isPending}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(item.id)}
                        disabled={deletePortfolioItem.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Portfolio Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this portfolio item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePortfolioItem.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deletePortfolioItem.isPending}>
              {deletePortfolioItem.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
