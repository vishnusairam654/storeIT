"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NavigationRail = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper to get color filter for SVG icons
  const getIconColorClass = (itemColor: string, isActive: boolean) => {
    if (isActive) return "brightness-0 invert"; // White for active
    
    // Apply color filter for inactive items based on their category
    const colorMap: Record<string, string> = {
      "text-brand": "[filter:invert(27%)_sepia(97%)_saturate(2573%)_hue-rotate(200deg)_brightness(92%)_contrast(101%)]", // Brand blue
      "text-blue": "[filter:invert(47%)_sepia(96%)_saturate(1829%)_hue-rotate(199deg)_brightness(98%)_contrast(95%)]", // Blue
      "text-green": "[filter:invert(71%)_sepia(56%)_saturate(434%)_hue-rotate(92deg)_brightness(91%)_contrast(86%)]", // Green
      "text-pink": "[filter:invert(53%)_sepia(94%)_saturate(4158%)_hue-rotate(311deg)_brightness(94%)_contrast(89%)]", // Pink
      "text-orange": "[filter:invert(60%)_sepia(84%)_saturate(1453%)_hue-rotate(353deg)_brightness(99%)_contrast(97%)]", // Orange
    };
    
    return colorMap[itemColor] || "";
  };

  return (
    <motion.aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      animate={{ width: isExpanded ? 320 : 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="remove-scrollbar hidden h-screen flex-col overflow-auto px-5 py-7 sm:flex bg-surface-container border-r border-outline-variant/10"
    >
      {/* Logo */}
      <Link href="/" className="mb-9">
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Image
              src="/assets/icons/storeIt_logo.png"
              alt="logo"
              width={160}
              height={50}
              priority
            />
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <Image
              src="/assets/icons/logo-brand.svg"
              alt="logo"
              width={52}
              height={52}
            />
          </div>
        )}
      </Link>

      {/* Navigation Items */}
      <nav className="flex-1">
        <ul className="flex flex-col gap-2">
          {navItems.map(({ url, name, icon, bgColor, color }) => {
            const isActive = pathname === url;
            
            return (
              <li key={name}>
                <Link href={url}>
                  <motion.div
                    whileHover={{ scale: 1.05, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "relative flex items-center gap-4 h-14 rounded-full transition-all group",
                      isActive
                        ? `${bgColor} text-white shadow-md`
                        : `text-on-surface-variant hover:bg-surface-container-high/50`,
                      isExpanded ? "px-6" : "justify-center"
                    )}
                  >
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <Image
                        src={icon}
                        alt={name}
                        width={24}
                        height={24}
                        className={cn(
                          "transition-all",
                          getIconColorClass(color, isActive)
                        )}
                      />
                    </div>

                    {/* Label - only show when expanded */}
                    {isExpanded && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 }}
                        className={cn(
                          "h5 font-medium transition-colors",
                          isActive ? "text-white" : color
                        )}
                      >
                        {name}
                      </motion.p>
                    )}

                    {/* Active Indicator - subtle glow effect */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-full ring-2 ring-white/20"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
};

export default NavigationRail;
