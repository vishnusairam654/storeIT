"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { signOutUser } from "@/lib/actions/user.actions";
import AccountDetailsModal from "./AccountDetailsModal";

interface UserProfileChipProps {
  fullName: string;
  email: string;
  avatar: string;
  accountId?: string;
  createdAt?: string;
}

const UserProfileChip = ({ fullName, email, avatar, accountId, createdAt }: UserProfileChipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  const handleSignOut = async () => {
    await signOutUser();
  };

  const handleAccountInfo = () => {
    setIsOpen(false);
    setShowAccountDetails(true);
  };

  return (
    <>
      <div className="relative">
        {/* Profile Chip Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex h-[52px] items-center gap-2 rounded-full bg-surface-container-high px-3 transition-all hover:bg-surface-container-highest hover:shadow-md"
        >
          <Image
            src={avatar}
            alt={fullName}
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="hidden md:block text-on-surface subtitle-2 pr-2">
            {fullName.split(" ")[0]}
          </span>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute right-0 top-full mt-2 z-50 w-64 rounded-[20px] bg-surface-container-highest p-3 shadow-elevation-3"
              >
                {/* User Info */}
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-surface-container-high p-3">
                  <Image
                    src={avatar}
                    alt={fullName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="subtitle-2 text-on-surface truncate">{fullName}</p>
                    <p className="caption text-on-surface-variant truncate">{email}</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">
                  <button
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                    onClick={handleAccountInfo}
                  >
                    <User className="size-5" />
                    <span className="body-2">Account Info</span>
                  </button>

                  <div className="my-2 h-px bg-outline-variant" />

                  <form
                    action={handleSignOut}
                    className="w-full"
                  >
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-error transition-colors hover:bg-error/10"
                    >
                      <LogOut className="size-5" />
                      <span className="body-2">Sign Out</span>
                    </button>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AccountDetailsModal
        isOpen={showAccountDetails}
        onClose={() => setShowAccountDetails(false)}
        fullName={fullName}
        email={email}
        avatar={avatar}
        accountId={accountId}
        createdAt={createdAt}
      />
    </>
  );
};

export default UserProfileChip;
