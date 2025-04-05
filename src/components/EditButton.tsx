"use client";

import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Pencil, Trash2 } from "lucide-react";
import DeleteDialog from "@/components/DeleteDialog";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { deletePost } from "@/app/actions/post.action";

interface EditButtonPros {
  postId: string;
}
export default function EditButton({ postId }: EditButtonPros) {
  const handleDelete = async () => {
    try {
      await deletePost(postId);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute right-0 top-0 cursor-pointer hover:bg-gray-200 rounded-full">
        <EllipsisIcon className="size-5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="[&_div]:hover:bg-gray-100 [&_div]:hover:cursor-pointer ">
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
