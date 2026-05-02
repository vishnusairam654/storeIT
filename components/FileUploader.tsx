"use client";

import React, { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { createFileDocument } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { ID, Permission, Role } from "appwrite";
import { storage } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
  hideButton?: boolean;
}

const FileUploader = ({ accountId, className, hideButton = false }: Props) => {
  const path = usePathname();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  // Get button color based on current path
  const getButtonColor = () => {
    if (path.includes("documents")) return "!bg-blue hover:!bg-blue/80";
    if (path.includes("images")) return "!bg-green hover:!bg-green/80";
    if (path.includes("media")) return "!bg-pink hover:!bg-pink/80";
    if (path.includes("others")) return "!bg-orange hover:!bg-orange/80";
    return "!bg-[#0755BD] hover:!bg-[#0755BD]/80"; // Default for dashboard
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const { validFiles, oversizedFiles } = acceptedFiles.reduce(
        (acc, file) => {
          if (file.size > MAX_FILE_SIZE) {
            acc.oversizedFiles.push(file);
          } else {
            acc.validFiles.push(file);
          }
          return acc;
        },
        { validFiles: [] as File[], oversizedFiles: [] as File[] },
      );

      oversizedFiles.forEach((file) => {
        toast({
          description: (
            <p className="body-2 text-white">
              <span className="font-semibold">{file.name}</span> is too large.
              Max file size is 250MB.
            </p>
          ),
          className: "error-toast",
        });
      });

      setFiles((prevFiles) => [...prevFiles, ...validFiles]);

      const uploadPromises = validFiles.map(async (file) => {
        try {
          // Appwrite Cloud client-side uploads restrict permission roles to
          // `any` or `guests`. Use `any` for client uploads. For stricter
          // per-user ACLs, perform uploads server-side with an admin key.
          const permissions = [
            Permission.read(Role.any()),
            Permission.write(Role.any()),
          ];

          const uploadedFile = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            file,
            permissions
          );

          const fileDocument = await createFileDocument({
            bucketFileId: uploadedFile.$id,
            path,
          });

          if (fileDocument) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name),
            );
          }
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> failed to
                upload.
              </p>
            ),
            className: "error-toast",
          });
        }
      });

      await Promise.allSettled(uploadPromises);
    },
    [accountId, path, toast],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string,
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className={cn("cursor-pointer", className)}>
      <input {...getInputProps()} />

      {!hideButton ? (
        // Original button for sidebar/header
        <Button type="button" className={cn("uploader-button group transition-all hover:scale-105 hover:shadow-lg active:scale-95", getButtonColor(), className)}>
          <Image
            src="/assets/icons/upload.svg"
            alt="upload"
            width={24}
            height={24}
            className="transition-transform group-hover:-translate-y-0.5"
          />{" "}
          <p>Upload</p>
        </Button>
      ) : (
        // Drop zone for modal
        <div className="flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-surface-container-highest bg-surface-container p-12 transition-all hover:border-brand hover:bg-surface-container-high">
          <div className="flex-center size-20 rounded-full bg-brand/10 mb-4">
            <Image
              src="/assets/icons/upload.svg"
              alt="upload"
              width={40}
              height={40}
              className="brightness-0 invert opacity-80"
            />
          </div>
          <h3 className="h4 text-on-surface mb-2">Drop files here or click to browse</h3>
          <p className="body-2 text-on-surface-variant mb-4">
            Support for single or bulk upload. Maximum file size: 50MB
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="caption px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant">
              Documents
            </span>
            <span className="caption px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant">
              Images
            </span>
            <span className="caption px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant">
              Videos
            </span>
            <span className="caption px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant">
              Audio
            </span>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <ul className="uploader-preview-list mt-6">
          <h4 className="h4 text-on-surface mb-4">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                      style={{ height: "auto" }}
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
