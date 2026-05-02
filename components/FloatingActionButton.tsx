"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FileUploader from "@/components/FileUploader";

interface FABProps {
  accountId: string;
  userId: string;
}

const FloatingActionButton = ({ accountId, userId }: FABProps) => {
  const [isExtended, setIsExtended] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsExtended(!scrolled); // Collapse when scrolled
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        animate={{
          width: isExtended ? "auto" : 56,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <FileUploader
          ownerId={userId}
          accountId={accountId}
          className={`
            !h-14 !rounded-full !bg-brand !px-6 !shadow-elevation-3
            transition-all hover:!scale-105 hover:!shadow-elevation-3
            flex items-center gap-2
            ${!isExtended ? "!px-4" : ""}
          `}
        />
      </motion.div>
    </div>
  );
};

export default FloatingActionButton;
