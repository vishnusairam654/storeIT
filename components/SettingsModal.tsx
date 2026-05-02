"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Trash2, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
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
            onClick={handleCancel}
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
            <div className="mb-6 flex items-center justify-between sticky top-0 bg-white pb-2 z-10">
              <h2 className="h3 text-on-surface">Settings</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCancel}
                className="flex-center size-10 rounded-full bg-surface-container-highest text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
              >
                <X className="size-5" />
              </motion.button>
            </div>

            {/* Settings Sections */}
            <div className="space-y-4">

              {/* Security Section */}
              <div className="pt-4 border-t border-outline-variant">
                <p className="subtitle-2 text-on-surface mb-3">Security</p>
                
                <button 
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "Password change feature will be available soon.",
                    });
                  }}
                  className="flex w-full items-center gap-3 rounded-xl bg-surface-container p-4 transition-colors hover:bg-surface-container-highest"
                >
                  <div className="flex-center size-10 rounded-full bg-brand/10">
                    <Key className="size-5 text-brand" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="subtitle-2 text-on-surface">Change Password</p>
                    <p className="caption text-on-surface-variant">Update your password</p>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "Privacy settings will be available soon.",
                    });
                  }}
                  className="flex w-full items-center gap-3 rounded-xl bg-surface-container p-4 mt-3 transition-colors hover:bg-surface-container-highest"
                >
                  <div className="flex-center size-10 rounded-full bg-brand/10">
                    <Shield className="size-5 text-brand" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="subtitle-2 text-on-surface">Privacy Settings</p>
                    <p className="caption text-on-surface-variant">Manage data & privacy</p>
                  </div>
                </button>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-outline-variant">
                <p className="subtitle-2 text-error mb-3">Danger Zone</p>
                
                <button 
                  onClick={() => {
                    toast({
                      title: "Account Deletion",
                      description: "Please contact support to delete your account.",
                      variant: "destructive",
                    });
                  }}
                  className="flex w-full items-center gap-3 rounded-xl bg-error/10 p-4 transition-colors hover:bg-error/20"
                >
                  <div className="flex-center size-10 rounded-full bg-error/20">
                    <Trash2 className="size-5 text-error" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="subtitle-2 text-error">Delete Account</p>
                    <p className="caption text-on-surface-variant">Permanently delete your account</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3 sticky bottom-0 bg-white pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="flex-1 rounded-full bg-surface-container px-6 py-3 text-on-surface transition-all hover:bg-surface-container-highest"
              >
                <span className="subtitle-1">Cancel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex-1 rounded-full bg-brand px-6 py-3 text-white transition-all hover:shadow-md"
              >
                <span className="subtitle-1">Save Changes</span>
              </motion.button>
            </div>
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
