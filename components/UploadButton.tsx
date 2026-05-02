"use client";

import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FileUploader from "@/components/FileUploader";

interface UploadButtonProps {
  ownerId: string;
  accountId: string;
}

const UploadButton = ({ ownerId, accountId }: UploadButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex h-[52px] items-center gap-2 rounded-full bg-brand px-5 text-white shadow-sm transition-all hover:shadow-md"
      >
        <Upload className="size-5" />
        <span className="hidden md:block subtitle-2">Upload</span>
      </motion.button>

      {/* Upload Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 z-[101] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-6 shadow-elevation-3"
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="h3 text-on-surface">Upload Files</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="flex-center size-10 rounded-full bg-surface-container-highest text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                >
                  <X className="size-5" />
                </motion.button>
              </div>

              {/* File Uploader */}
              <FileUploader
                ownerId={ownerId}
                accountId={accountId}
                hideButton={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default UploadButton;
