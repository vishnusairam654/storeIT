"use client";

import React from "react";
import Image from "next/image";
import AnimatedBackground from "@/components/AnimatedBackground";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Animated Background */}
      <section className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-brand p-10 lg:flex xl:w-2/5">
        <AnimatedBackground />

        <div className="relative z-10 flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12 text-white">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto"
          />

          <div className="space-y-5 text-white">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1">
              Awesome, we&apos;ve created the perfect place for you to store all
              your documents.
            </p>
          </div>
        </div>
      </section>

      {/* Right Side - Content */}
      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src="/assets/icons/storeIt_logo.png"
            alt="logo"
            width={224}
            height={82}
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </div>

        {children}
      </section>
    </div>
  );
};

export default Layout;
