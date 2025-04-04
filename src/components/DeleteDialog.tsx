import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { DialogClose } from "@/components/ui/dialog";
import { useState } from "react";

interface DeleteDialogProps {
  onDelete: () => void;
  isDelete: boolean;
  children?: React.ReactNode;
}

export default function DeleteDialog({
  onDelete,
  isDelete,
  children,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      {createPortal(
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md" showClose={false}>
            <DialogHeader>
              <DialogTitle>Delete Post</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this post?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="utils" className="border">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="alert"
                  onClick={onDelete}
                  disabled={isDelete}
                >
                  Yes
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>,
        document.body
      )}
    </>
  );
}
