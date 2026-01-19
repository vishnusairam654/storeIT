"use client";

interface StorageBreakdownProps {
    document: number;
    image: number;
    video: number;
    audio: number;
    other: number;
    total: number;
}

const StorageBreakdown = ({ document, image, video, audio, other, total }: StorageBreakdownProps) => {
    const categories = [
        { name: "Documents", size: document, color: "bg-green", icon: "📄" },
        { name: "Images", size: image, color: "bg-blue", icon: "🖼️" },
        { name: "Videos", size: video, color: "bg-orange", icon: "🎬" },
        { name: "Audio", size: audio, color: "bg-pink", icon: "🎵" },
        { name: "Others", size: other, color: "bg-brand", icon: "📦" },
    ];

    const getPercentage = (size: number) => {
        if (total === 0) return 0;
        return Math.round((size / total) * 100);
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
        return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
    };

    return (
        <div className="rounded-2xl bg-white p-5 shadow-elevation-1">
            <h3 className="h4 mb-4 text-light-100">Storage Breakdown</h3>

            {/* Visual bar */}
            <div className="mb-6 flex h-4 overflow-hidden rounded-full bg-light-300">
                {categories.map((cat, index) => (
                    <div
                        key={cat.name}
                        className={`${cat.color} transition-all duration-500`}
                        style={{
                            width: `${getPercentage(cat.size)}%`,
                            animationDelay: `${index * 100}ms`
                        }}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {categories.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-2">
                        <div className={`size-3 rounded-full ${cat.color}`} />
                        <div className="flex-1">
                            <p className="caption text-light-200">{cat.name}</p>
                            <p className="subtitle-2 text-light-100">
                                {formatSize(cat.size)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StorageBreakdown;
