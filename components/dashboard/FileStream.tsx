"use client";

import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import { formatDateTime, convertFileSize } from "@/lib/utils";

interface FileStreamProps {
  files: Models.Document[];
}

export const FileStream = ({ files }: FileStreamProps) => {
  return (
    <div className="rounded-[32px] bg-white p-6 lg:p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="h3 font-bold text-light-100">Recent Stream</h2>
        <span className="text-xs font-semibold text-brand bg-brand/10 px-3 py-1 rounded-full">{files.length} items</span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {files.length > 0 ? (
           <div className="flex flex-col gap-4">
             {files.map(file => (
               <div key={file.$id} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-light-400/50 cursor-pointer transition-colors border border-transparent hover:border-light-300/50">
                   <div className="relative w-14 h-14 flex-shrink-0">
                       <Thumbnail type={file.type} extension={file.extension} url={file.url} className="rounded-xl !size-14" imageClassName="!size-8" />
                   </div>
                   
                   <div className="flex-1 min-w-0">
                       <p className="subtitle-2 truncate text-light-100 mb-0.5 group-hover:text-brand transition-colors">{file.name}</p>
                       <div className="flex items-center gap-2 text-xs text-light-200">
                           <span>{formatDateTime(file.$createdAt)}</span>
                           <span className="w-1 h-1 rounded-full bg-light-300" />
                           <span>{convertFileSize(file.size)}</span>
                       </div>
                   </div>
               </div>
             ))}
           </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-light-200">
                <p>No recent activity</p>
                <p className="text-xs mt-1">Files you upload will appear here stream.</p>
            </div>
        )}
      </div>
    </div>
  );
};
