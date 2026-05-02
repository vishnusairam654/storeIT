"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Download, X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Models } from "node-appwrite";
import { cn, constructDownloadUrl } from "@/lib/utils";

interface FileViewerProps {
    file: Models.Document;
    isOpen: boolean;
    onClose: () => void;
    allFiles?: Models.Document[];
}

const FileViewer = ({ file, isOpen, onClose, allFiles = [] }: FileViewerProps) => {
    const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(
        allFiles.findIndex((f) => f.$id === file.$id)
    );

    const currentFile = allFiles[currentIndex] || file;
    const canNavigate = allFiles.length > 1;

    const handleNext = () => {
        if (currentIndex < allFiles.length - 1) {
            setCurrentIndex(currentIndex + 1);
            resetControls();
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            resetControls();
        }
    };

    const resetControls = () => {
        setZoom(100);
        setRotation(0);
    };

    const handleDownload = () => {
        const downloadUrl = constructDownloadUrl(currentFile.bucketFileId);
        window.open(downloadUrl, "_blank");
    };

    const getHeaderStyle = (type: string) => {
        switch (type) {
            case "image":
                return "bg-gradient-to-r from-blue/10 to-blue/5 border-blue/20";
            case "document":
                return "bg-gradient-to-r from-green/10 to-green/5 border-green/20";
            case "video":
                return "bg-gradient-to-r from-orange/10 to-orange/5 border-orange/20";
            case "audio":
                return "bg-gradient-to-r from-pink/10 to-pink/5 border-pink/20";
            default:
                return "bg-gradient-to-r from-brand/10 to-brand/5 border-brand/20";
        }
    };

    const renderContent = () => {
        const fileType = currentFile.type;

        // Image Viewer
        if (fileType === "image") {
            return (
                <div className="flex h-full items-center justify-center overflow-hidden bg-surface-container/50 p-8">
                    <div
                        className="relative flex h-full w-full items-center justify-center transition-transform duration-300 ease-in-out"
                        style={{
                            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                        }}
                    >
                        <Image
                            src={currentFile.url}
                            alt={currentFile.name}
                            width={1200}
                            height={800}
                            className="h-full w-full object-contain drop-shadow-md"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                        />
                    </div>
                </div>
            );
        }

        // Video Viewer
        if (fileType === "video") {
            return (
                <div className="flex h-full items-center justify-center bg-black/90 p-4">
                    <video
                        src={currentFile.url}
                        controls
                        className="h-full w-full max-h-[80vh] max-w-[90vw] object-contain"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        }

        // Audio Viewer
        if (fileType === "audio") {
            return (
                <div className="flex h-full flex-col items-center justify-center gap-8 p-8">
                    <div className="flex-center size-32 rounded-full bg-brand/10">
                        <Image
                            src="/assets/icons/file-audio.svg"
                            alt="audio"
                            width={64}
                            height={64}
                        />
                    </div>
                    <div className="text-center">
                        <h3 className="h3 mb-2 text-light-100">{currentFile.name}</h3>
                        <p className="body-2 text-light-200">Audio File</p>
                    </div>
                    <audio
                        src={currentFile.url}
                        controls
                        className="w-full max-w-md"
                    >
                        Your browser does not support the audio tag.
                    </audio>
                </div>
            );
        }

        // PDF Viewer
        if (currentFile.extension === "pdf") {
            return (
                <div className="h-full w-full">
                    <iframe
                        src={`${currentFile.url}#toolbar=1`}
                        className="h-full w-full"
                        title={currentFile.name}
                    />
                </div>
            );
        }

        // Document Viewer (txt, doc, etc.)
        if (fileType === "document") {
            // For text files
            if (currentFile.extension === "txt") {
                return (
                    <div className="h-full overflow-auto bg-white p-8">
                        <iframe
                            src={currentFile.url}
                            className="h-full w-full border-none"
                            title={currentFile.name}
                        />
                    </div>
                );
            }

            // For other documents, use Google Docs Viewer
            const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(currentFile.url)}&embedded=true`;
            return (
                <div className="h-full w-full">
                    <iframe
                        src={viewerUrl}
                        className="h-full w-full"
                        title={currentFile.name}
                    />
                </div>
            );
        }

        // Fallback for other file types
        return (
            <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
                <div className="flex-center size-32 rounded-full bg-surface-container">
                    <Image
                        src="/assets/icons/file-other.svg"
                        alt="file"
                        width={64}
                        height={64}
                    />
                </div>
                <div className="text-center">
                    <h3 className="h3 mb-2 text-light-100">{currentFile.name}</h3>
                    <p className="body-2 text-light-200">
                        Preview not available for this file type
                    </p>
                </div>
                <Button onClick={handleDownload} className="primary-btn">
                    <Download className="mr-2 size-4" />
                    Download to View
                </Button>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-7xl w-full h-[95vh] flex flex-col gap-0 bg-surface p-0 outline-none sm:rounded-[26px] overflow-hidden border border-light-300/20 shadow-xl">
                {/* Header */}
                <div className={cn("flex items-center justify-between border-b px-6 py-4 z-50 bg-surface", getHeaderStyle(currentFile.type))}>
                    <DialogHeader className="flex-1 text-left">
                        <DialogTitle className="h4 line-clamp-1 text-light-100">{currentFile.name}</DialogTitle>
                        <DialogDescription className="sr-only">
                            Preview of {currentFile.name}
                        </DialogDescription>
                        <p className="caption text-light-200">
                            {currentFile.extension.toUpperCase()} • {(currentFile.size / 1024).toFixed(2)} KB
                        </p>
                    </DialogHeader>

                    <div className="flex items-center gap-3">
                        {/* Zoom controls for images */}
                        {currentFile.type === "image" && (
                            <div className="flex items-center gap-1 rounded-full bg-surface-container-high/50 p-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-full hover:bg-surface-container-high"
                                    onClick={() => setZoom(Math.max(50, zoom - 25))}
                                    disabled={zoom <= 50}
                                >
                                    <ZoomOut className="size-4 text-light-200" />
                                </Button>
                                <span className="caption min-w-[3rem] text-center text-light-100">{zoom}%</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-full hover:bg-surface-container-high"
                                    onClick={() => setZoom(Math.min(200, zoom + 25))}
                                    disabled={zoom >= 200}
                                >
                                    <ZoomIn className="size-4 text-light-200" />
                                </Button>
                                <div className="mx-1 h-4 w-px bg-light-300" />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-full hover:bg-surface-container-high"
                                    onClick={() => setRotation((rotation + 90) % 360)}
                                >
                                    <RotateCw className="size-4 text-light-200" />
                                </Button>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <Button onClick={handleDownload} className="rounded-full bg-brand/10 p-2 hover:bg-brand/20 h-10 w-10 shadow-none">
                                <Download className="size-5 text-brand" />
                            </Button>
                            <Button onClick={onClose} className="rounded-full bg-light-400/20 p-2 hover:bg-light-400/40 h-10 w-10 shadow-none">
                                <X className="size-5 text-light-100" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative flex-1 overflow-hidden bg-surface-container">
                    {renderContent()}

                    {/* Navigation arrows for gallery */}
                    {canNavigate && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white transition-all"
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft className="size-6 text-light-100" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white transition-all"
                                onClick={handleNext}
                                disabled={currentIndex === allFiles.length - 1}
                            >
                                <ChevronRight className="size-6 text-light-100" />
                            </Button>
                        </>
                    )}
                </div>

                {/* Footer with navigation info */}
                {canNavigate && (
                    <div className="border-t border-light-200/10 bg-surface px-6 py-3 text-center">
                        <p className="caption text-light-200">
                            {currentIndex + 1} of {allFiles.length}
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FileViewer;