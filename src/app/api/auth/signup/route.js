// import { NextResponse } from "next/server";
// import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
// import bcrypt from "bcryptjs";

// /*POST - Register new user with email and password
//  * Route: /api/auth/signup
//  */
// export async function POST(req) {
//   try {
//     const body = await req.json();
//     //const { name, email, password, confirmPassword } = body;
//     const { firstName, lastName, email, password, confirmPassword } = body;


//     // Validation
//     if (!email || !password) {
//       return NextResponse.json(
//         { 
//           success: false,
//           message: "Email and password are required" 
//         },
//         { status: 400 }
//       );
//     }

//     if (!firstName || firstName.trim().length < 2) {
//   return NextResponse.json(
//     { success: false, message: "First name must be at least 2 characters" },
//     { status: 400 }
//   );
// }

// if (!lastName || lastName.trim().length < 2) {
//   return NextResponse.json(
//     { success: false, message: "Last name must be at least 2 characters" },
//     { status: 400 }
//   );
// }

// const fullName = `${firstName.trim()} ${lastName.trim()}`;


//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { 
//           success: false,
//           message: "Invalid email format" 
//         },
//         { status: 400 }
//       );
//     }

//     // Password validation
//     if (password.length < 8) {
//       return NextResponse.json(
//         { 
//           success: false,
//           message: "Password must be at least 8 characters" 
//         },
//         { status: 400 }
//       );
//     }

//     // Password strength check (optional)
//     const hasUpperCase = /[A-Z]/.test(password);
//     const hasLowerCase = /[a-z]/.test(password);
//     const hasNumber = /[0-9]/.test(password);
    
//     if (!hasUpperCase || !hasLowerCase || !hasNumber) {
//       return NextResponse.json(
//         { 
//           success: false,
//           message: "Password must contain uppercase, lowercase, and number" 
//         },
//         { status: 400 }
//       );
//     }

//     // Check if passwords match
//     if (password !== confirmPassword) {
//       return NextResponse.json(
//         { 
//           success: false,
//           message: "Passwords do not match" 
//         },
//         { status: 400 }
//       );
//     }

//     // Connect to MongoDB
//     const client = await clientPromise;
//     const db = client.db(DB_NAME);

//     // Check if user already exists
//     const existingUser = await db.collection(COLLECTIONS.USERS).findOne({
//       email: email.toLowerCase()
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { 
//           success: false,
//           message: "User with this email already exists" 
//         },
//         { status: 409 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const newUser = {
//       name: fullName,
//       email: email.toLowerCase(),
//       password: hashedPassword,
//       emailVerified: false,
//       image: null,
//       accountStatus: "active",
//       provider: "credentials",
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     const result = await db.collection(COLLECTIONS.USERS).insertOne(newUser);

//     // Create default settings (optional)
//     try {
//       await db.collection(COLLECTIONS.SETTINGS).insertOne({
//         userId: result.insertedId,
//         email: email.toLowerCase(),
//         personalUrl: null,
//         securityQuestion: {
//           question: "Mother's birthplace",
//           answer: ""
//         },
//         accountStatus: "active",
//         twoFactorEnabled: false,
//         emailVerified: false,
//         proposalCredits: 5,
//         lastPasswordChange: new Date(),
//         createdAt: new Date(),
//         updatedAt: new Date()
//       });
//     } catch (error) {
//       console.error("Failed to create default settings:", error);
//       // Continue even if settings creation fails
//     }

//     // Create default profile (optional)
//     try {
//       await db.collection(COLLECTIONS.PROFILES).insertOne({
//         userId: result.insertedId,
//         hourlyRate: 25,
//         currency: "USD",
//         professionalHeadline: "",
//         topSkills: [],
//         summary: "",
//         availability: "available",
//         profileCompleteness: 0,
//         matchingJobsCount: 0,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       });
//     } catch (error) {
//       console.error("Failed to create default profile:", error);
//       // Continue even if profile creation fails
//     }

//     return NextResponse.json(
//       { 
//         success: true,
//         message: "Account created successfully! Please sign in.",
//         user: {
//           id: result.insertedId.toString(),
//           name: newUser.name,
//           email: newUser.email
//         }
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error("Signup error:", error);
//     return NextResponse.json(
//       { 
//         success: false,
//         message: "Failed to create account", 
//         error: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }


















import { NextResponse } from "next/server";
import { signUpWithOTP } from "@/app/controllers/otp-verification.controller";

/* POST - Sign up with email verification (sends OTP)*/
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, confirmPassword, firstName, lastName, role } = body;

    // Validation
    if (!email || !password || !confirmPassword || !firstName || !lastName || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required"
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format"
        },
        { status: 400 }
      );
    }

    // Password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match"
        },
        { status: 400 }
      );
    }

    // Password strength
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters"
        },
        { status: 400 }
      );
    }

    // Role validation
    if (!["client", "freelancer"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Role must be either 'client' or 'freelancer'"
        },
        { status: 400 }
      );
    }

    // Name validation
    if (firstName.length < 2 || lastName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "First name and last name must be at least 2 characters"
        },
        { status: 400 }
      );
    }

    // Create user and send OTP
    const result = await signUpWithOTP({
      email,
      password,
      firstName,
      lastName,
      role
    });

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        email: result.email,
        requiresVerification: true
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);

    if (error.message.includes("already registered")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create account",
        error: error.message
      },
      { status: 500 }
    );
  }
}