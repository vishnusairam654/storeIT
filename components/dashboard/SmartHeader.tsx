"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import { useDebounce } from "use-debounce";

interface SmartHeaderProps {
  fullName: string;
}

export const SmartHeader = ({ fullName }: SmartHeaderProps) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(searchQuery);
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        return;
      }

      const files = await getFiles({ types: [], searchText: debouncedQuery });
      setResults(files.documents);
      setOpen(true);
    };

    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);
    router.push(`/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`);
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      {/* Welcome Section */}
      <div>
        <h1 className="h1 text-brand capitalize">
          Good Morning, {fullName.split(" ")[0]} 👋
        </h1>
        <p className="body-1 text-light-200 mt-1">
          Here&apos;s what&apos;s happening with your storage today.
        </p>
      </div>

      {/* Global Search and Theme Toggle */}
      <div className="flex items-center gap-4"> {/* Added a new flex container for search and toggle */}
        <div className="relative w-full md:w-[480px]">
          <div className="relative flex items-center rounded-full bg-white px-6 py-3 shadow-sm border-2 border-transparent focus-within:border-brand/20 focus-within:shadow-md transition-all">
            <Search size={24} className="text-light-200" />
            <input
              type="text"
              placeholder="Search your files..."
              className="body-2 placeholder:body-2 w-full border-none bg-transparent px-4 text-dark-100 outline-none placeholder:text-light-200"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>

          {/* Search Results Dropdown */}
          {open && results.length > 0 && (
              <div className="absolute top-16 left-0 w-full rounded-[24px] bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-2 px-2">
                      <p className="subtitle-2 text-light-100">Best matches</p>
                      <p className="caption text-light-200">{results.length} found</p>
                  </div>
                  
                  <ul className="flex flex-col gap-2">
                  {results.map((file) => (
                      <li
                      key={file.$id}
                      className="flex items-center gap-4 rounded-xl p-3 hover:bg-light-400 cursor-pointer transition-colors"
                      onClick={() => handleClickItem(file)}
                      >
                      <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                              <div className="flex items-center justify-center w-full h-full bg-brand/5 text-brand font-bold uppercase text-xs">
                                  {file.extension}
                              </div>
                          </div>
                          <div>
                              <p className="subtitle-2 line-clamp-1">{file.name}</p>
                              <p className="caption text-light-200">{file.extension.toUpperCase()}</p>
                          </div>
                      </div>
                      </li>
                  ))}
                  </ul>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
