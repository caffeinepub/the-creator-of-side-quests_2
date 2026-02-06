import { useState, useEffect } from 'react';
import { useAddProduct, useUpdateProduct } from '../../hooks/admin/useAdminProducts';
import type { Product } from '../../backend';
import { ExternalBlob } from '../../backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { validateImageFile, fileToBytes } from '../../utils/images';
import { toast } from 'sonner';

interface AdminProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export default function AdminProductFormDialog({
  open,
  onOpenChange,
  product,
}: AdminProductFormDialogProps) {
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [inStock, setInStock] = useState(true);
  const [requiresQuote, setRequiresQuote] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice((Number(product.price) / 100).toFixed(2));
      setCategory(product.category || '');
      setInStock(product.inStock);
      setRequiresQuote(product.requiresQuote);
      setImagePreview(product.image.getDirectURL());
      setImageFile(null);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setInStock(true);
      setRequiresQuote(false);
      setImageFile(null);
      setImagePreview(null);
    }
    setUploadProgress(0);
  }, [product, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isEditing && !imageFile) {
      toast.error('Please select an image');
      return;
    }

    const priceInCents = Math.round(parseFloat(price) * 100);
    if (isNaN(priceInCents) || priceInCents < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      setIsUploading(true);
      let imageBlob: ExternalBlob;

      if (imageFile) {
        const bytes = await fileToBytes(imageFile);
        imageBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (product) {
        imageBlob = product.image;
      } else {
        throw new Error('No image available');
      }

      const productData: Product = {
        id: product?.id || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        description: description.trim(),
        price: BigInt(priceInCents),
        category: category.trim() || undefined,
        inStock,
        requiresQuote,
        image: imageBlob,
      };

      if (isEditing) {
        await updateProduct.mutateAsync(productData);
      } else {
        await addProduct.mutateAsync(productData);
      }

      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Failed to save product: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const isPending = addProduct.isPending || updateProduct.isPending || isUploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the product details.' : 'Create a new product for your shop.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description..."
                rows={4}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Vinyl Decals, 3D Prints"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Product Image *</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isPending}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 rounded-md border object-cover"
                  />
                </div>
              )}
              {isUploading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-muted-foreground">Uploading: {uploadProgress}%</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="inStock">In Stock</Label>
              <Switch id="inStock" checked={inStock} onCheckedChange={setInStock} disabled={isPending} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="requiresQuote">Requires Quote</Label>
              <Switch
                id="requiresQuote"
                checked={requiresQuote}
                onCheckedChange={setRequiresQuote}
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
