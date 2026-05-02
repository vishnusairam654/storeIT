"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Calendar, Database, Copy, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullName: string;
  email: string;
  avatar: string;
  accountId?: string;
  createdAt?: string;
}

const AccountDetailsModal = ({
  isOpen,
  onClose,
  fullName,
  email,
  avatar,
  accountId = "N/A",
  createdAt = "N/A",
}: AccountDetailsModalProps) => {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast({
      title: "Copied!",
      description: `${fieldName} copied to clipboard.`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Flex Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-[28px] bg-white p-6 shadow-elevation-3 max-h-[90vh] overflow-y-auto"
            >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="h3 text-on-surface">Account Details</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex-center size-10 rounded-full bg-surface-container-highest text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
              >
                <X className="size-5" />
              </motion.button>
            </div>

            {/* Avatar Section */}
            <div className="mb-6 flex flex-col items-center">
              <div className="relative mb-4">
                <Image
                  src={avatar}
                  alt={fullName}
                  width={96}
                  height={96}
                  className="rounded-full ring-4 ring-brand/20"
                />
              </div>
              <h3 className="h4 text-on-surface">{fullName}</h3>
              <p className="body-2 text-on-surface-variant">{email}</p>
            </div>

            {/* Details Grid */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl bg-surface-container p-4 group">
                <div className="flex-center size-10 rounded-full bg-brand/10">
                  <User className="size-5 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="caption text-on-surface-variant">Full Name</p>
                  <p className="subtitle-2 text-on-surface break-words">{fullName}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(fullName, "Full Name")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedField === "Full Name" ? (
                    <Check className="size-4 text-brand" />
                  ) : (
                    <Copy className="size-4 text-on-surface-variant hover:text-on-surface" />
                  )}
                </button>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-surface-container p-4 group">
                <div className="flex-center size-10 rounded-full bg-brand/10">
                  <Mail className="size-5 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="caption text-on-surface-variant">Email Address</p>
                  <p className="subtitle-2 text-on-surface break-words">{email}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(email, "Email")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedField === "Email" ? (
                    <Check className="size-4 text-brand" />
                  ) : (
                    <Copy className="size-4 text-on-surface-variant hover:text-on-surface" />
                  )}
                </button>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-surface-container p-4 group">
                <div className="flex-center size-10 rounded-full bg-brand/10">
                  <Database className="size-5 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="caption text-on-surface-variant">Account ID</p>
                  <p className="subtitle-2 text-on-surface font-mono text-sm break-all">{accountId}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(accountId, "Account ID")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedField === "Account ID" ? (
                    <Check className="size-4 text-brand" />
                  ) : (
                    <Copy className="size-4 text-on-surface-variant hover:text-on-surface" />
                  )}
                </button>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-surface-container p-4">
                <div className="flex-center size-10 rounded-full bg-brand/10">
                  <Calendar className="size-5 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="caption text-on-surface-variant">Member Since</p>
                  <p className="subtitle-2 text-on-surface">{createdAt}</p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-brand px-6 py-3 text-white transition-all hover:shadow-md"
            >
              <span className="subtitle-1">Close</span>
            </motion.button>
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AccountDetailsModal;
