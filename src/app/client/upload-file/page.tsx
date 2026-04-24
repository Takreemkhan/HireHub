"use client";

import { useSession } from "next-auth/react";
import FileUpload from "../components/FileUpload";

const UploadFile = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session?.user?.id) {
    return <p>Unauthorized</p>;
  }

  return (
    <div>
      <FileUpload userId={session.user.id} />
    </div>
  );
};

export default UploadFile;