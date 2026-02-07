import { useState } from 'react';
import type { PortfolioItem, PortfolioMedia } from '../../backend';
import { useUpdatePortfolioItem, useDeletePortfolioItem } from '../../hooks/admin/useAdminPortfolio';
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
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Edit, Trash2, Upload } from 'lucide-react';
import { validateMediaFile, fileToBytes } from '../../utils/images';
import { toast } from 'sonner';

interface AdminPortfolioTableProps {
  items: PortfolioItem[];
}

export default function AdminPortfolioTable({ items }: AdminPortfolioTableProps) {
  const updatePortfolioItem = useUpdatePortfolioItem();
  const deletePortfolioItem = useDeletePortfolioItem();

  const [editItem, setEditItem] = useState<PortfolioItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [replaceMediaFile, setReplaceMediaFile] = useState<File | null>(null);
  const [replaceMediaPreview, setReplaceMediaPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const handleEditOpen = (item: PortfolioItem) => {
    setEditItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditCategory(item.category || '');
    setReplaceMediaFile(null);
    setReplaceMediaPreview(null);
    setUploadProgress(0);
  };

  const handleReplaceMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateMediaFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      e.target.value = '';
      return;
    }

    setReplaceMediaFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setReplaceMediaPreview(reader.result as string);
    };
    reader.onerror = () => {
      toast.error('Failed to read file preview');
      setReplaceMediaFile(null);
      setReplaceMediaPreview(null);
    };
    reader.readAsDataURL(file);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);

      let media: PortfolioMedia = editItem.media;

      if (replaceMediaFile) {
        const bytes = await fileToBytes(replaceMediaFile);
        setUploadProgress(50);

        const isVideo = replaceMediaFile.type.startsWith('video/');
        media = isVideo
          ? { __kind__: 'video', video: bytes }
          : { __kind__: 'image', image: bytes };
      }

      setUploadProgress(75);

      const updatedItem: PortfolioItem = {
        ...editItem,
        title: editTitle.trim(),
        description: editDescription.trim(),
        category: editCategory || undefined,
        media,
      };

      await updatePortfolioItem.mutateAsync(updatedItem);
      setUploadProgress(100);
      setEditItem(null);
      setReplaceMediaFile(null);
      setReplaceMediaPreview(null);
      setUploadProgress(0);
    } catch (error: any) {
      const message = error.message || 'Update failed';
      toast.error(message);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItemId) return;

    try {
      await deletePortfolioItem.mutateAsync(deleteItemId);
      setDeleteItemId(null);
    } catch (error: any) {
      const message = error.message || 'Delete failed';
      toast.error(message);
    }
  };

  const getMediaUrl = (media: PortfolioMedia): string => {
    if (media.__kind__ === 'image') {
      const blob = new Blob([media.image as Uint8Array<ArrayBuffer>], { type: 'image/jpeg' });
      return URL.createObjectURL(blob);
    } else {
      const blob = new Blob([media.video as Uint8Array<ArrayBuffer>], { type: 'video/mp4' });
      return URL.createObjectURL(blob);
    }
  };

  const isVideo = (media: PortfolioMedia): boolean => {
    return media.__kind__ === 'video';
  };

  const isPending = updatePortfolioItem.isPending || isUploading;

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
              <TableHead className="w-24 text-right">Actions</TableHead>
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
              items.map((item) => {
                const mediaUrl = getMediaUrl(item.media);
                const itemIsVideo = isVideo(item.media);

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {itemIsVideo ? (
                        <video
                          src={mediaUrl}
                          className="h-12 w-12 rounded-md border object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={item.title}
                          className="h-12 w-12 rounded-md border object-cover"
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="min-w-0 break-words">{item.title}</div>
                      {item.category && (
                        <div className="mt-1 md:hidden">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
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
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditOpen(item)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteItemId(item.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Portfolio Item</DialogTitle>
              <DialogDescription>Update the portfolio item metadata and optionally replace the media.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={editCategory} onValueChange={setEditCategory} disabled={isPending}>
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

              <div className="grid gap-2">
                <Label htmlFor="replace-media">Replace Media (Optional)</Label>
                <Input
                  id="replace-media"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleReplaceMediaChange}
                  disabled={isPending}
                />
                {replaceMediaPreview && (
                  <div className="mt-2">
                    {replaceMediaFile?.type.startsWith('video/') ? (
                      <video src={replaceMediaPreview} controls className="h-48 w-full rounded-md border object-cover" />
                    ) : (
                      <img
                        src={replaceMediaPreview}
                        alt="Preview"
                        className="h-48 w-full rounded-md border object-cover"
                      />
                    )}
                  </div>
                )}
                {!replaceMediaPreview && editItem && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Current media:</p>
                    {isVideo(editItem.media) ? (
                      <video
                        src={getMediaUrl(editItem.media)}
                        controls
                        className="h-48 w-full rounded-md border object-cover"
                      />
                    ) : (
                      <img
                        src={getMediaUrl(editItem.media)}
                        alt={editItem.title}
                        className="h-48 w-full rounded-md border object-cover"
                      />
                    )}
                  </div>
                )}
                {isUploading && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} />
                    <p className="text-sm text-muted-foreground">Uploading: {uploadProgress}%</p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditItem(null)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                {replaceMediaFile && <Upload className="h-4 w-4" />}
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItemId} onOpenChange={(open) => !open && setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Portfolio Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this portfolio item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePortfolioItem.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deletePortfolioItem.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePortfolioItem.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
