"use client";

export default function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-brand via-brand-100/30 to-brand">
            {/* Floating Shapes */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float-slow" />
            <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-brand-100/20 rounded-full blur-2xl animate-float-medium" />
            <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-white/15 rounded-full blur-lg animate-float-fast" />
            <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-brand-100/15 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '-2s' }} />
            <div className="absolute bottom-1/3 right-1/2 w-20 h-20 bg-white/10 rounded-full blur-lg animate-float-medium" style={{ animationDelay: '-1s' }} />

            {/* Geometric Shapes */}
            <div className="absolute top-20 left-20 w-16 h-16 border-2 border-white/20 rotate-45 animate-spin-slow" />
            <div className="absolute bottom-32 right-24 w-12 h-12 border-2 border-white/15 rotate-12 animate-spin-slow" style={{ animationDelay: '-3s' }} />
            <div className="absolute top-1/2 left-12 w-8 h-8 bg-white/10 rotate-45 animate-bounce-slow" />
        </div>
    );
}
