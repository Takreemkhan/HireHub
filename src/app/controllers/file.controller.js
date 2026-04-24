import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
  import { ObjectId } from "mongodb";
  import { writeFile, unlink, mkdir } from "fs/promises";
  import path from "path";

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES_PER_UPLOAD = 10;

  /* UPLOAD FILES CONTROLLER */
  export const uploadFiles = async (userId, files, documentType = "other") => {
    try {
      // Validate user ID
      if (!ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID format");
      }

      // Validate files
      if (!files || files.length === 0) {
        throw new Error("No files provided");
      }

      if (files.length > MAX_FILES_PER_UPLOAD) {
        throw new Error(`Maximum ${MAX_FILES_PER_UPLOAD} files allowed at once`);
      }

      // Validate each file
      for (const file of files) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error(`Invalid format for file: ${file.name}. Only JPEG, PNG, and PDF are allowed.`);
        }
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
        }
      }

      // Create user upload directory
      const uploadDir = path.join(process.cwd(), "public", "uploads", userId);
      await mkdir(uploadDir, { recursive: true });

      const client = await clientPromise;
      const db = client.db(DB_NAME);
      
      const fileDocs = [];
      const uploadedFiles = [];

      // Process each file
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const uniqueName = `${timestamp}_${randomString}_${sanitizedName}`;
        const filePath = path.join(uploadDir, uniqueName);
        
        // Save file to filesystem
        await writeFile(filePath, buffer);

        // Prepare metadata for database
        const fileDoc = {
          userId: new ObjectId(userId),
          fileName: file.name,
          storedName: uniqueName,
          fileFormat: file.type.split('/')[1]?.toUpperCase() || "UNKNOWN",
          fileType: file.type,
          fileSize: file.size,
          url: `/uploads/${userId}/${uniqueName}`,
          uploadedAt: new Date(),
          documentType: documentType,   // ← ab save hoga
          verificationStatus: "pending"
        };

        fileDocs.push(fileDoc);
        uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: fileDoc.url,
        });
      }

      // Insert all files into database
      const result = await db.collection(COLLECTIONS.FILES).insertMany(fileDocs);

      return {
        success: true,
        message: `${files.length} file(s) uploaded successfully`,
        data: {
          files: uploadedFiles,
          insertedIds: result.insertedIds,
          count: files.length,
          verificationStatus:"pending"
        },
      };

    } catch (error) {
      throw new Error(error.message);
    }
  };

  /* GET FILES CONTROLLER */
  export const getFilesByUserId = async (userId) => {
    try {
      if (!ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID format");
      }

      const client = await clientPromise;
      const db = client.db(DB_NAME);

      const files = await db
        .collection(COLLECTIONS.FILES)
        .find({ 
          userId: new ObjectId(userId),
         
        })
        .sort({ uploadedAt: -1 })
        .toArray();

      return {
        success: true,
        count: files.length,
        data: files,
      };

    } catch (error) {
      throw new Error(error.message);
    }
  };

  /* DELETE FILE CONTROLLER - HARD DELETE */
  export const deleteFile = async (fileId, userId) => {
    try {
      // Validate IDs
      if (!ObjectId.isValid(fileId) || !ObjectId.isValid(userId)) {
        throw new Error("Invalid ID format");
      }

      const client = await clientPromise;
      const db = client.db(DB_NAME);

      // Find the file first (get its storedName for filesystem deletion)
    await db.collection(COLLECTIONS.FILES).updateOne(
    {
      _id: new ObjectId(fileId),
      userId: new ObjectId(userId),
    },
    {
      $set: {
        isActive: false,
        deletedAt: new Date(), // optional (best practice)
      },
    }
  );

      if (!file) {
        throw new Error("File not found");
      }

      

      if (deleteResult.deletedCount === 0) {
        throw new Error("Failed to delete file from database");
      }

      // 2️⃣ Delete from filesystem
      try {
        const filePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          userId,
          file.storedName
        );
        await unlink(filePath);
        console.log(`File deleted from filesystem: ${filePath}`);
      } catch (fsError) {
        // Log but don't throw - file might already be missing
        console.warn(`Filesystem deletion warning: ${fsError.message}`);
      }

      return {
        success: true,
        message: "File permanently deleted successfully",
        data: { 
          fileId, 
          fileName: file.fileName,
          deletedFrom: ["database", "filesystem"]
        },
      };

    } catch (error) {
      throw new Error(error.message);
    }
  };