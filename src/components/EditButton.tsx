"use client";

import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Pencil, Trash2 } from "lucide-react";
import DeleteDialog from "@/components/DeleteDialog";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { deleteComment } from "@/app/actions/comment.action";
import { cn } from "@/lib/utils";
interface EditButtonPros {
  commentId: string;
  className?: string;
}
export default function EditButton({ commentId, className }: EditButtonPros) {
  const handleDelete = async () => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "absolute right-0 top-0 cursor-pointer hover:bg-gray-200 rounded-full",
          className
        )}
      >
        <EllipsisIcon className="size-5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="[&_div]:hover:bg-gray-100 [&_div]:hover:cursor-pointer "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DropdownMenuItem>
          Edit <Pencil />
        </DropdownMenuItem>

        <DeleteDialog onDelete={handleDelete}>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            Delete <Trash2 />
          </DropdownMenuItem>
        </DeleteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
