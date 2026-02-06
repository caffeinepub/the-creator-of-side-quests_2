import { useState } from 'react';
import { useAddPortfolioItem } from '../../hooks/admin/useAdminPortfolio';
import { ExternalBlob } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { validateMediaFile, fileToBytes } from '../../utils/images';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

export default function AdminPortfolioUploader() {
  const addPortfolioItem = useAddPortfolioItem();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateMediaFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setMediaFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !mediaFile) {
      toast.error('Please fill in all required fields and select a media file');
      return;
    }

    try {
      setIsUploading(true);
      const bytes = await fileToBytes(mediaFile);
      const mediaBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const portfolioItem = {
        id: `portfolio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        description: description.trim(),
        category: category || undefined,
        image: mediaBlob,
      };

      await addPortfolioItem.mutateAsync(portfolioItem);

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setMediaFile(null);
      setMediaPreview(null);
      setUploadProgress(0);
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = addPortfolioItem.isPending || isUploading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Portfolio Item</CardTitle>
        <CardDescription>Add a new image or video to your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
              disabled={isPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              rows={3}
              required
              disabled={isPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={isPending}>
              <SelectTrigger id="category">
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
            <Label htmlFor="media">Media File (Image or Video) *</Label>
            <Input
              id="media"
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              disabled={isPending}
              required
            />
            {mediaPreview && (
              <div className="mt-2">
                {mediaFile?.type.startsWith('video/') ? (
                  <video src={mediaPreview} controls className="h-48 w-full rounded-md border object-cover" />
                ) : (
                  <img
                    src={mediaPreview}
                    alt="Preview"
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

          <Button type="submit" disabled={isPending} className="w-full gap-2">
            <Upload className="h-4 w-4" />
            {isPending ? 'Uploading...' : 'Upload Portfolio Item'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
