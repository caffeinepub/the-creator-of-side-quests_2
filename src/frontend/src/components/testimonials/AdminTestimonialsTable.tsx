import type { Testimonial } from '../../backend';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';
import MossyStarRating from './MossyStarRating';

interface AdminTestimonialsTableProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
}

export default function AdminTestimonialsTable({ testimonials, onEdit }: AdminTestimonialsTableProps) {
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[100px]">Author</TableHead>
            <TableHead className="w-32">Rating</TableHead>
            <TableHead className="hidden md:table-cell">Content</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="w-16 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No testimonials yet.
              </TableCell>
            </TableRow>
          ) : (
            testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium">
                  <div className="min-w-0 break-words">{testimonial.author}</div>
                  <div className="mt-1 text-xs text-muted-foreground sm:hidden">
                    {formatDate(testimonial.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <MossyStarRating rating={Number(testimonial.rating)} readonly size="sm" />
                </TableCell>
                <TableCell className="hidden max-w-md md:table-cell">
                  <p className="line-clamp-2 text-sm">{testimonial.content}</p>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {formatDate(testimonial.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(testimonial)}
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
  );
}
