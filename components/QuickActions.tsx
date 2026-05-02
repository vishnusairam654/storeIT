"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface QuickActionsProps {
    onUploadClick: () => void;
}

const QuickActions = ({ onUploadClick }: QuickActionsProps) => {
    const onDrop = useCallback(() => {
        onUploadClick();
    }, [onUploadClick]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
            {/* Upload Zone */}
            <div
                {...getRootProps()}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-6 transition-all ${isDragActive
                        ? "border-brand bg-brand/5"
                        : "border-light-300 bg-white hover:border-brand hover:bg-brand/5"
                    }`}
            >
                <input {...getInputProps()} />
                <div className="flex items-center gap-4">
                    <div className="flex-center size-14 rounded-2xl bg-brand/10 transition-transform group-hover:scale-110">
                        <Image
                            src="/assets/icons/upload.svg"
                            alt="Upload"
                            width={28}
                            height={28}
                            className="opacity-80"
                        />
                    </div>
                    <div>
                        <h3 className="h4 text-light-100">Upload Files</h3>
                        <p className="body-2 text-light-200">
                            {isDragActive ? "Drop files here..." : "Drag & drop or click to upload"}
                        </p>
                    </div>
                </div>
                <div className="absolute -right-6 -top-6 size-24 rounded-full bg-brand/5 transition-transform group-hover:scale-150" />
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4">
                <QuickActionButton
                    icon="📄"
                    title="Documents"
                    href="/documents"
                    color="bg-green/10"
                />
                <QuickActionButton
                    icon="🖼️"
                    title="Images"
                    href="/images"
                    color="bg-blue/10"
                />
                <QuickActionButton
                    icon="🎬"
                    title="Media"
                    href="/media"
                    color="bg-orange/10"
                />
                <QuickActionButton
                    icon="📦"
                    title="Others"
                    href="/others"
                    color="bg-pink/10"
                />
            </div>
        </div>
    );
};

interface QuickActionButtonProps {
    icon: string;
    title: string;
    href: string;
    color: string;
}

const QuickActionButton = ({ icon, title, href, color }: QuickActionButtonProps) => (
    <a
        href={href}
        className={`flex items-center gap-3 rounded-xl ${color} p-4 transition-all hover:scale-105 hover:shadow-elevation-1`}
    >
        <span className="text-2xl">{icon}</span>
        <span className="subtitle-2 text-light-100">{title}</span>
    </a>
);

export default QuickActions;
