"use client";

import { Models } from "node-appwrite";
import { useState, useRef } from "react";
import Thumbnail from "@/components/Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";
import FileViewer from "@/components/FileViewer";

interface CardProps {
  file: Models.Document;
  allFiles?: Models.Document[];
}

const Card = ({ file, allFiles = [] }: CardProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isClickingAction = useRef(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening viewer if clicking on actions
    if (isClickingAction.current) {
      isClickingAction.current = false;
      return;
    }

    // Check if click target is inside action dropdown
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-action-dropdown]') ||
      target.closest('[role="menu"]') ||
      target.closest('[role="menuitem"]')
    ) {
      return;
    }

    setIsViewerOpen(true);
  };

  const handleActionInteraction = () => {
    isClickingAction.current = true;
  };

  return (
    <>
      <div
        ref={cardRef}
        className="file-card cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex justify-between">
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.url}
            className="!size-20"
            imageClassName="!size-11"
          />

          <div
            data-action-dropdown
            className="flex flex-col items-end justify-between"
            onMouseDown={handleActionInteraction}
            onTouchStart={handleActionInteraction}
          >
            <ActionDropdown file={file} />
            <p className="body-1">{convertFileSize(file.size)}</p>
          </div>
        </div>

        <div className="file-card-details">
          <p className="subtitle-2 line-clamp-1">{file.name}</p>
          <FormattedDateTime
            date={file.$createdAt}
            className="body-2 text-light-100"
          />
          <p className="caption line-clamp-1 text-light-200">
            By: {file.owner.fullName}
          </p>
        </div>
      </div>

      {/* File Viewer Modal */}
      <FileViewer
        file={file}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        allFiles={allFiles}
      />
    </>
  );
};

export default Card;