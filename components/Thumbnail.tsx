import React from "react";
import Image from "next/image";
import { cn, getFileIcon } from "@/lib/utils";

interface Props {
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}

export const Thumbnail = ({
  type,
  extension,
  url = "",
  imageClassName,
  className,
}: Props) => {
  const isImage = type === "image" && extension !== "svg";

  const getThumbnailStyle = (type: string) => {
    switch (type) {
      case "image":
        return "bg-gradient-to-br from-blue/10 to-blue/5";
      case "document":
        return "bg-gradient-to-br from-green/10 to-green/5";
      case "video":
        return "bg-gradient-to-br from-orange/10 to-orange/5";
      case "audio":
        return "bg-gradient-to-br from-pink/10 to-pink/5";
      default:
        return "bg-gradient-to-br from-brand/10 to-brand/5";
    }
  };

  return (
    <figure className={cn("thumbnail", getThumbnailStyle(type), className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "thumbnail-image",
        )}
      />
    </figure>
  );
};
export default Thumbnail;
