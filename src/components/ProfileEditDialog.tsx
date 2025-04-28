"use client";

import type React from "react";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Camera, Loader2, Bold, Italic, Underline } from "lucide-react";
import { toast } from "sonner";
import { Profile, updateProfile } from "@/app/actions/profile.action";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import { Toggle } from "@/components/ui/toggle";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
interface ProfileEditDialogProps {
  userProfile: Profile;
  className?: string;
}

export default function ProfileEditDialog({
  userProfile,
  className,
}: ProfileEditDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Profile>(userProfile);

  const editor = useEditor({
    extensions: [StarterKit, UnderlineExtension],
    content: formData?.bio || "",
    onUpdate: ({ editor }) => {
      setFormData((prev) => {
        if (!prev) return prev;
        return { ...prev, bio: editor.getHTML() };
      });
    },
  });

  if (!editor || !userProfile) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFormData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              avatarUrl: e.target!.result as string,
            };
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData) {
      toast.error("No profile data available");
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSubmit2 = new FormData();
      formDataToSubmit2.append("username", formData.username);
      formDataToSubmit2.append("tagName", formData.tagName);
      formDataToSubmit2.append("bio", formData.bio || "");
      formDataToSubmit2.append("imageUrl", formData.imageUrl || "");
      const result = await updateProfile(formDataToSubmit2);
      // 更新圖片
      const form = e.target as HTMLFormElement;
      const formDataToSubmit = new FormData(form);
      const avatarFile = formDataToSubmit.get("avatar") as File;

      if (avatarFile.size > 0) {
        const avatarResult = await upload(
          `avatar/${userProfile.id}/${avatarFile.name}`,
          avatarFile,
          {
            access: "public",
            handleUploadUrl: "/api/image",
            clientPayload: userProfile.id,
          }
        );
        if (avatarResult) {
          router.refresh();
        }
      }
      if (result) {
        toast.success("Profile updated successfully.");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[85dvh] overflow-y-auto max-lg:mt-10">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and how others see you on the
            platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {formData?.avatarUrl && (
                    <AvatarImage
                      className="object-cover"
                      src={formData.avatarUrl}
                      alt="Profile picture"
                    />
                  )}
                  <AvatarFallback>
                    {formData?.username
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Upload avatar</span>
                </label>
                <input
                  id="avatar-upload"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Click the camera icon to upload a new profile picture
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData?.username}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData?.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <div className="flex gap-2 mb-2">
                <Toggle
                  pressed={editor.isActive("bold")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleBold().run()
                  }
                  size="sm"
                >
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={editor.isActive("italic")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleItalic().run()
                  }
                  size="sm"
                >
                  <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={editor.isActive("underline")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleUnderline().run()
                  }
                  size="sm"
                >
                  <Underline className="h-4 w-4" />
                </Toggle>
              </div>
              <div className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <EditorContent
                  editor={editor}
                  className="prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
