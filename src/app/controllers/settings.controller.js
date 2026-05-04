import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

/**
 * GET USER SETTINGS
 */
export const getUserSettings = async (userId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  return await db.collection(COLLECTIONS.SETTINGS)
    .findOne({ userId: new ObjectId(userId) });
};

/**
 * CREATE DEFAULT SETTINGS (called when user registers)
 */
export const createDefaultSettings = async (userId, email) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const defaultSettings = {
    userId: new ObjectId(userId),
    email: email,
    personalUrl: null,
    securityQuestion: {
      question: "Mother's birthplace",
      answer: "" // User will set this later
    },
    accountStatus: "active",
    twoFactorEnabled: false,
    emailVerified: false,
    proposalCredits: 5,
    lastPasswordChange: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection(COLLECTIONS.SETTINGS).insertOne(defaultSettings);
  return { ...defaultSettings, _id: result.insertedId };
};

/* UPDATE PERSONAL URL */
export const updatePersonalUrl = async (userId, personalUrl) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Validate format (lowercase, alphanumeric, hyphens only)
  const urlRegex = /^[a-z0-9-]+$/;
  if (!urlRegex.test(personalUrl)) {
    throw new Error("URL can only contain lowercase letters, numbers, and hyphens");
  }

  if (personalUrl.length < 3 || personalUrl.length > 50) {
    throw new Error("URL must be between 3 and 50 characters");
  }

  // Check if URL already exists (for another user)
  const existing = await db.collection(COLLECTIONS.SETTINGS).findOne({
    personalUrl: personalUrl,
    userId: { $ne: new ObjectId(userId) }
  });

  if (existing) {
    throw new Error("This URL is already taken");
  }

  const result = await db.collection(COLLECTIONS.SETTINGS).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { 
      $set: { 
        personalUrl: personalUrl.toLowerCase(),
        updatedAt: new Date()
      }
    },
    { 
      returnDocument: "after",
      upsert: true
    }
  );

  return result.value;
};

/* UPDATE EMAIL */
export const updateEmail = async (userId, newEmail) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail)) {
    throw new Error("Invalid email format");
  }

  // Check if email already exists
  const userExists = await db.collection(COLLECTIONS.USERS).findOne({
    email: newEmail.toLowerCase(),
    _id: { $ne: new ObjectId(userId) }
  });

  if (userExists) {
    throw new Error("This email is already registered");
  }

  // Update in both Users and Settings collections
  await db.collection(COLLECTIONS.USERS).updateOne(
    { _id: new ObjectId(userId) },
    { 
      $set: { 
        email: newEmail.toLowerCase(),
        emailVerified: false // Need to verify new email
      }
    }
  );

  const result = await db.collection(COLLECTIONS.SETTINGS).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { 
      $set: { 
        email: newEmail.toLowerCase(),
        emailVerified: false,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* CHANGE PASSWORD */
export const changePassword = async (userId, currentPassword, newPassword) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Get user
  const user = await db.collection(COLLECTIONS.USERS).findOne({
    _id: new ObjectId(userId)
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password (if user has password - OAuth users might not)
  if (user.password) {
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }
  }

  // Validate new password
  if (newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password in Users collection
  await db.collection(COLLECTIONS.USERS).updateOne(
    { _id: new ObjectId(userId) },
    { 
      $set: { 
        password: hashedPassword
      }
    }
  );

  // Update lastPasswordChange in Settings
  const result = await db.collection(COLLECTIONS.SETTINGS).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { 
      $set: { 
        lastPasswordChange: new Date(),
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* UPDATE SECURITY QUESTION */
export const updateSecurityQuestion = async (userId, oldAnswer, newQuestion, newAnswer) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Get current settings
  const settings = await db.collection(COLLECTIONS.SETTINGS).findOne({
    userId: new ObjectId(userId)
  });

  // Verify old answer (if exists)
  if (settings?.securityQuestion?.answer) {
    const oldAnswerLower = oldAnswer?.toLowerCase().trim();
    const currentAnswerLower = settings.securityQuestion.answer.toLowerCase().trim();
    
    if (oldAnswerLower !== currentAnswerLower) {
      throw new Error("Current security answer is incorrect");
    }
  }

  // Validate new question
  const validQuestions = [
    "Mother's birthplace",
    "First pet's name",
    "Favorite teacher",
    "City where you were born",
    "Childhood nickname",
    "First school name"
  ];

  if (!validQuestions.includes(newQuestion)) {
    throw new Error("Invalid security question");
  }

  // Update security question
  const result = await db.collection(COLLECTIONS.SETTINGS).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { 
      $set: { 
        securityQuestion: {
          question: newQuestion,
          answer: newAnswer.trim()
        },
        updatedAt: new Date()
      }
    },
    { 
      returnDocument: "after",
      upsert: true
    }
  );

  return result.value;
};

/* UPDATE ACCOUNT STATUS */
export const updateAccountStatus = async (userId, status) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const validStatuses = ["active", "inactive", "suspended", "deleted"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid account status");
  }

  const result = await db.collection(COLLECTIONS.SETTINGS).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { 
      $set: { 
        accountStatus: status,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* TOGGLE TWO-FACTOR AUTHENTICATION */
export const toggleTwoFactor = async (userId, enabled) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.SETTINGS).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { 
      $set: { 
        twoFactorEnabled: enabled,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* UPDATE PROPOSAL CREDITS */
export const updateProposalCredits = async (userId, credits) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  if (credits < 0) {
    throw new Error("Credits cannot be negative");
  }

  const result = await db.collection(COLLECTIONS.SETTINGS).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { 
      $set: { 
        proposalCredits: credits,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* INCREMENT/DECREMENT PROPOSAL CREDITS */
export const adjustProposalCredits = async (userId, amount) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.SETTINGS).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { 
      $inc: { proposalCredits: amount },
      $set: { updatedAt: new Date() }
    },
    { returnDocument: "after" }
  );

  // Ensure credits don't go negative
  if (result.value && result.value.proposalCredits < 0) {
    await db.collection(COLLECTIONS.SETTINGS).updateOne(
      { userId: new ObjectId(userId) },
      { $set: { proposalCredits: 0 } }
    );
    result.value.proposalCredits = 0;
  }

  return result.value;
};

/* VERIFY EMAIL  */
export const verifyEmail = async (userId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Update in both collections
  await db.collection(COLLECTIONS.USERS).updateOne(
    { _id: new ObjectId(userId) },
    { $set: { emailVerified: true } }
  );

  const result = await db.collection(COLLECTIONS.SETTINGS).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { 
      $set: { 
        emailVerified: true,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* DELETE SETTINGS (when user account is deleted) */
export const deleteSettings = async (userId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.SETTINGS)
    .deleteOne({ userId: new ObjectId(userId) });

  return result.deletedCount > 0;
};
