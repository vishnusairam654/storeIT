"use client";

export default function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-brand via-brand-100/30 to-brand">
            {/* Floating Shapes */}
            <div className="absolute left-1/4 top-1/4 size-32 rounded-full bg-white/10 blur-xl animate-float-slow" />
            <div className="absolute right-1/3 top-1/2 size-48 rounded-full bg-brand-100/20 blur-2xl animate-float-medium" />
            <div className="absolute bottom-1/4 left-1/3 size-24 rounded-full bg-white/15 blur-lg animate-float-fast" />
            <div className="absolute right-1/4 top-1/3 size-40 rounded-full bg-brand-100/15 blur-xl animate-float-slow" style={{ animationDelay: "-2s" }} />
            <div className="absolute bottom-1/3 right-1/2 size-20 rounded-full bg-white/10 blur-lg animate-float-medium" style={{ animationDelay: "-1s" }} />

            {/* Geometric Shapes */}
            <div className="absolute left-20 top-20 size-16 rotate-45 border-2 border-white/20 animate-spin-slow" />
            <div className="absolute bottom-32 right-24 size-12 rotate-12 border-2 border-white/15 animate-spin-slow" style={{ animationDelay: "-3s" }} />
            <div className="absolute left-12 top-1/2 size-8 rotate-45 bg-white/10 animate-bounce-slow" />
        </div>
    );
}
