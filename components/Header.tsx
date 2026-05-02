import React from "react";
import Search from "@/components/Search";
import UserProfileChip from "@/components/UserProfileChip";
import UploadButton from "@/components/UploadButton";
import { getCurrentUser } from "@/lib/actions/user.actions";

const Header = async () => {
  const currentUser = await getCurrentUser();

  // Format the created date
  const createdDate = currentUser?.$createdAt 
    ? new Date(currentUser.$createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "N/A";

  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <div className="flex items-center gap-3">
          <UploadButton
            ownerId={currentUser?.$id || ""}
            accountId={currentUser?.accountId || ""}
          />
          <UserProfileChip
            fullName={currentUser?.fullName || "User"}
            email={currentUser?.email || ""}
            avatar={currentUser?.avatar || "/assets/icons/logo-brand.svg"}
            accountId={currentUser?.accountId || "N/A"}
            createdAt={createdDate}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
