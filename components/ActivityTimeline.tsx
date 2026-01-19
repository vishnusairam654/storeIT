import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import ActionDropdown from "@/components/ActionDropdown";

interface ActivityTimelineProps {
    files: Models.Document[];
}

const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
};

const getActivityIcon = (type: string) => {
    switch (type) {
        case "image":
            return "🖼️";
        case "document":
            return "📄";
        case "video":
            return "🎬";
        case "audio":
            return "🎵";
        default:
            return "📦";
    }
};

const ActivityTimeline = ({ files }: ActivityTimelineProps) => {
    if (files.length === 0) {
        return (
            <div className="flex-center h-40 rounded-2xl bg-surface-container">
                <p className="body-1 text-light-200">No recent activity</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {files.map((file, index) => (
                <div
                    key={file.$id}
                    className="group relative flex items-center gap-4 rounded-xl p-3 transition-all hover:bg-surface-container-high"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    {/* Timeline line */}
                    {index < files.length - 1 && (
                        <div className="absolute left-[27px] top-14 h-full w-0.5 bg-light-300" />
                    )}

                    {/* Activity indicator */}
                    <div className="relative z-10 flex-center size-10 rounded-full bg-brand/10 text-lg transition-transform group-hover:scale-110">
                        {getActivityIcon(file.type)}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Thumbnail
                                type={file.type}
                                extension={file.extension}
                                url={file.url}
                                className="!size-10"
                            />
                            <div>
                                <p className="subtitle-2 line-clamp-1 max-w-[200px] text-light-100">
                                    {file.name}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="caption text-light-200">
                                        Uploaded {getRelativeTime(file.$createdAt)}
                                    </span>
                                    <span className="size-1 rounded-full bg-light-300" />
                                    <span className="caption text-brand">
                                        {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <ActionDropdown file={file} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityTimeline;
