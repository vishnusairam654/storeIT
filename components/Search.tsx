"use client";

import React, { useEffect, useState, useRef } from "react";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { useDebounce } from "use-debounce";
const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        if (isMounted) {
          setResults([]);
          setOpen(false);
          router.push(path.replace(searchParams.toString(), ""));
        }
        return;
      }

      const files = await getFiles({ types: [], searchText: debouncedQuery });
      if (isMounted) {
        setResults(files.documents);
        setOpen(true);
      }
    };

    fetchFiles();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, path, router, searchParams]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`,
    );
  };

  return (
    <div className="relative w-full md:max-w-[720px] mx-auto" ref={searchRef}>
      <div className="flex h-[52px] flex-1 items-center gap-3 rounded-full px-4 bg-surface-container transition-all focus-within:scale-[1.02] focus-within:bg-surface-container-high focus-within:shadow-md">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
          className="opacity-60"
        />
        <Input
          value={query}
          placeholder="Search..."
          className="body-2 shad-no-focus placeholder:body-1 w-full border-none p-0 shadow-none placeholder:text-on-surface-variant bg-transparent text-on-surface"
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className="absolute left-0 top-16 z-50 flex w-full flex-col gap-3 rounded-[20px] bg-white p-4 shadow-lg border border-outline-variant/20 backdrop-blur-sm">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  className="flex items-center justify-between cursor-pointer rounded-xl p-2 transition-colors hover:bg-surface-container"
                  key={file.$id}
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-on-surface">
                      {file.name}
                    </p>
                  </div>

                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-on-surface-variant"
                  />
                </li>
              ))
            ) : (
              <p className="body-2 text-center text-on-surface-variant">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
