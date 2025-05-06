"use client";

import { useEffect, useRef, useState, DependencyList } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  PixelCrop,
  type Crop,
} from "react-image-crop";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScanSearch, ArrowLeft, Camera } from "lucide-react";
import canvasPreview from "@/lib/canvasPreview";
import { cn } from "@/lib/utils";
import { useGetDbUserId } from "@/hooks/useGetDbUser";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}
export default function ImageCropper() {
  const router = useRouter();
  const { data: userId } = useGetDbUserId();
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onSelectFile = (
    e: React.ChangeEvent<HTMLInputElement> | { dataTransfer: DataTransfer }
  ) => {
    let files: FileList | null = null;
    if ("dataTransfer" in e) {
      files = e.dataTransfer.files;
    } else if (e.target.files && e.target.files.length > 0) {
      files = e.target.files;
    }
    if (files && files.length > 0) {
      if (!files[0].type.startsWith("image/")) {
        setIsDragging(false);
        return;
      }
    }

    if (files && files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setIsDragging(false);
      });
      reader.readAsDataURL(files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 16 / 9));
  };
  const reset = () => {
    setImgSrc("");
    setCrop(undefined);
    setCompletedCrop(undefined);
    setStep(1);
  };

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }
    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    const fileName = "profile.png";
    const file = new File([blob], fileName, { type: "image/png" });
    await uploadToVercelBlob(file);
  }

  async function uploadToVercelBlob(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);
    const result = await upload(`profile/${userId}/profile.png`, file, {
      access: "public",
      handleUploadUrl: "/api/image",
      clientPayload: userId,
    });

    if (!result) throw new Error("Upload failed");
    setIsUploading(false);
    router.refresh();
    return result;
  }

  // Debounce the canvas preview to avoid lag
  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop]
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
        className="absolute top-2 right-2 hover:scale-110 transition-all duration-300 cursor-pointer"
      >
        <ScanSearch className="h-5 w-5" />
      </AlertDialogTrigger>
      <AlertDialogContent
        className="sm:max-w-[550px] gap-0
        overflow-y-auto max-h-[90%]"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-center">
            <Button
              data-step={step}
              variant="outline"
              size="icon"
              onClick={() => setStep(1)}
              className="data-[step=1]:hidden "
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-center flex-1">Edit Image</span>
          </AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div
            className={cn(
              "border-2 border-dashed border-gray-300 rounded-md p-4 min-h-[280px] flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors relative",
              isDragging && "border-blue-400 animate-pulse",
              imgSrc && "hidden"
            )}
            onDrop={(e) => {
              e.preventDefault();
              onSelectFile(e);
            }}
            onDragOver={(e) => {
              setIsDragging(true);
              e.preventDefault();
            }}
            onDragLeave={(e) => {
              setIsDragging(false);
              e.preventDefault();
            }}
          >
            <Label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <span className=" text-gray-500">
                Click or drag image here to upload
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onSelectFile}
                className="hidden"
              />
            </Label>
          </div>
          {
            <div data-step={step} className="data-[step=2]:hidden relative">
              {!!imgSrc && (
                <>
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    minHeight={100}
                    className="w-full"
                  >
                    <Image
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      className="object-cover "
                      onLoad={onImageLoad}
                      width={1000}
                      height={1000}
                    />
                  </ReactCrop>
                  <Label>
                    <Camera className="size-9 absolute top-2 right-2 bg-gray-300/50 rounded-full p-1.5 stroke-white hover:size-10 hover:bg-gray-300/60 transition-all duration-300 cursor-pointer" />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={onSelectFile}
                      className="hidden"
                    />
                  </Label>
                </>
              )}
            </div>
          }

          {
            <div className={cn(step === 2 && !!completedCrop ? "" : "hidden")}>
              <div
                className={cn(
                  "w-full h-full object-contain border !border-black",
                  isDragging && "border-blue-400 animate-pulse"
                )}
                onDrop={(e) => {
                  e.preventDefault();
                  reset();
                  onSelectFile(e);
                }}
                onDragOver={(e) => {
                  setIsDragging(true);
                  e.preventDefault();
                }}
                onDragLeave={(e) => {
                  setIsDragging(false);
                  e.preventDefault();
                }}
              >
                <canvas
                  ref={previewCanvasRef}
                  className="w-full h-full object-contain border !border-black"
                />
              </div>
            </div>
          }
        </div>
        <AlertDialogFooter>
          {!!completedCrop && (
            <Button
              disabled={isUploading}
              onClick={() => {
                if (step === 1) {
                  setStep(2);
                } else {
                  onDownloadCropClick();
                }
              }}
            >
              {isUploading ? "Uploading..." : step === 1 ? "Apply" : "Upload"}
            </Button>
          )}
          <AlertDialogCancel
            onClickCapture={() => {
              reset();
            }}
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps: DependencyList
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
}
