// "use client";

// import Header from "@/components/common/Header";
// import { useRouter } from "next/navigation";
// import { useEffect, useState, Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import FooterSection from "@/app/homepage/components/FooterSection";
// import Script from "next/script";

// // ── ALL CATEGORIES & SUBCATEGORIES ────────────────────────────
// const CATEGORIES: Record<string, string[]> = {
//   "Development & IT": [
//     "Web Development", "Mobile App Development (iOS)", "Mobile App Development (Android)",
//     "Full Stack Development", "Frontend Development", "Backend Development",
//     "WordPress Development", "Shopify Development", "E-Commerce Development",
//     "Game Development", "Desktop App Development", "Browser Extension Development",
//     "API Development & Integration", "Cloud & DevOps", "Database Administration",
//     "Cybersecurity & Penetration Testing", "QA & Software Testing",
//     "Blockchain & Web3 Development", "AI / ML Development", "Data Science & Analytics",
//     "Scripting & Automation", "IT Support & Networking", "AR / VR Development",
//     "Embedded Systems & IoT", "Other Development & IT",
//   ],
//   "Design & Creative": [
//     "UI / UX Design", "Graphic Design", "Logo & Brand Identity", "Illustration",
//     "Motion Graphics & Animation", "Video Editing", "3D Modeling & Rendering",
//     "Product Design", "Print Design", "Social Media Design",
//     "Presentation Design (PowerPoint / Pitch Deck)", "Banner & Ad Design",
//     "Packaging Design", "Photography", "Photo Editing & Retouching", "Fashion Design",
//     "Interior Design", "Architecture & Floor Plans", "Character Design", "NFT Art",
//     "Other Design & Creative",
//   ],
//   "Sales & Marketing": [
//     "Digital Marketing Strategy", "Search Engine Optimization (SEO)",
//     "Search Engine Marketing (SEM / Google Ads)", "Social Media Marketing",
//     "Social Media Management", "Content Marketing", "Email Marketing",
//     "Influencer Marketing", "Affiliate Marketing", "Lead Generation", "Market Research",
//     "Brand Strategy", "Public Relations (PR)", "Sales Copywriting",
//     "Facebook & Instagram Ads", "LinkedIn Marketing", "YouTube Marketing",
//     "App Store Optimization (ASO)", "E-Commerce Marketing", "Marketing Automation",
//     "Other Sales & Marketing",
//   ],
//   "Writing & Translation": [
//     "Article & Blog Writing", "Copywriting", "Technical Writing", "SEO Writing",
//     "Creative Writing", "Ghostwriting", "Proofreading & Editing",
//     "Resume & Cover Letter Writing", "Academic Writing", "Grant Writing", "Scriptwriting",
//     "Email & Newsletter Writing", "Product Description Writing", "Legal Writing",
//     "Translation (English ↔ Hindi)", "Translation (English ↔ Spanish)",
//     "Translation (English ↔ French)", "Translation (English ↔ Arabic)",
//     "Translation (English ↔ German)", "Translation (Other Languages)",
//     "Transcription", "Subtitling & Captioning", "Other Writing & Translation",
//   ],
//   "Finance & Accounting": [
//     "Bookkeeping", "Accounting", "Tax Preparation & Filing", "Financial Analysis",
//     "Financial Modeling", "Payroll Management", "Auditing", "Business Valuation",
//     "Investment Research", "GST & Compliance", "CFO Services",
//     "QuickBooks / Tally / Zoho Books", "Invoice & Billing Management",
//     "Other Finance & Accounting",
//   ],
//   "Business & Consulting": [
//     "Business Strategy", "Startup Consulting", "Operations Management",
//     "Project Management", "Product Management", "Human Resources (HR)",
//     "Recruitment & Talent Acquisition", "Legal Consulting", "Compliance & Regulatory",
//     "Supply Chain & Logistics", "Business Plan Writing", "Process Improvement",
//     "Customer Support Setup", "Virtual Assistant", "Data Entry", "CRM Setup & Management",
//     "Other Business & Consulting",
//   ],
//   "Engineering & Architecture": [
//     "Civil Engineering", "Structural Engineering", "Mechanical Engineering",
//     "Electrical Engineering", "Chemical Engineering", "CAD Design", "PCB Design",
//     "3D Printing & Prototyping", "Architectural Design", "Interior Architecture",
//     "Landscape Architecture", "Construction Management", "Environmental Engineering",
//     "Other Engineering & Architecture",
//   ],
//   "Education & Training": [
//     "Online Tutoring", "Curriculum Development", "E-Learning Content Creation",
//     "Course Design (Video / LMS)", "Language Teaching", "Coding Bootcamp / Teaching",
//     "Test Prep (IELTS, GMAT, SAT etc.)", "Corporate Training", "Educational Consulting",
//     "Other Education & Training",
//   ],
//   "Legal": [
//     "Contract Drafting & Review", "Legal Research", "Intellectual Property (IP)",
//     "Trademark Registration", "Privacy Policy & Terms of Service",
//     "Company Incorporation", "Employment Law", "Immigration Law", "Litigation Support",
//     "Other Legal",
//   ],
//   "Data & Analytics": [
//     "Data Entry & Cleaning", "Data Analysis", "Data Visualization",
//     "Business Intelligence (BI)", "Power BI / Tableau", "Excel & Google Sheets",
//     "Web Scraping", "Database Design", "Statistical Analysis",
//     "Survey Design & Analysis", "Other Data & Analytics",
//   ],
//   "Music & Audio": [
//     "Music Composition", "Song Writing", "Audio Editing & Mixing", "Podcast Production",
//     "Voice Over", "Sound Design", "Audio Transcription", "Jingle Production",
//     "Other Music & Audio",
//   ],
//   "Video & Animation": [
//     "Video Editing", "Explainer Videos", "Whiteboard Animation", "2D Animation",
//     "3D Animation", "Intro / Outro Creation", "Video Ads", "Corporate Video Production",
//     "Drone Videography", "Other Video & Animation",
//   ],
//   "Customer Service": [
//     "Customer Support (Chat / Email)", "Call Center & Telemarketing",
//     "Technical Support", "Community Management", "Order Fulfillment Support",
//     "CRM Data Management", "Other Customer Service",
//   ],
//   "Health & Wellness": [
//     "Fitness & Nutrition Coaching", "Mental Health Counseling", "Medical Writing",
//     "Telemedicine Consulting", "Healthcare IT", "Other Health & Wellness",
//   ],
//   "Gaming": [
//     "Game Design & Concept Art", "Game Development (Unity)", "Game Development (Unreal Engine)",
//     "2D Game Art & Assets", "3D Game Characters & Modeling", "Game Testing & QA",
//     "Game Mechanics & Balancing", "Blockchain Game Development",
//   ],
//   "Blockchain & Crypto": [
//     "Smart Contract Development (Solidity)", "Web3 & DApp Development",
//     "Ethereum & EVM Development", "Binance Smart Chain Development",
//     "Solana & Rust Development", "NFT Marketplace Development", "DeFi & Token Development",
//     "Cryptocurrency Exchange Scripts", "White Paper & Crypto Writing",
//   ],
//   // ── "Other" category — user types their own subcategory ──
//   "Other": [],
// };

// function PostJobContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const draftId = searchParams.get("draftId");
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     subcategory: "",
//     budget: "",
//     budgetType: "Fixed",
//     currency: "USD",
//     visibility: "public",
//     questions: [""],
//     projectDuration: "",
//   });

//   // Subcategories based on selected category
//   const subcategories = formData.category ? CATEGORIES[formData.category] || [] : [];

//   const questionOptions = [
//     "Select an interview question",
//     "What similar projects have you worked on?",
//     "How would you approach this project?",
//     "What tools or technologies will you use?",
//     "What is your estimated delivery time?",
//   ];

//   const addQuestion = () => {
//     setFormData({ ...formData, questions: [...formData.questions, ""] });
//   };

//   const updateQuestion = (index: number, value: string) => {
//     const newQuestions = [...formData.questions];
//     newQuestions[index] = value;
//     setFormData({ ...formData, questions: newQuestions });
//   };

//   const removeQuestion = (index: number) => {
//     const newQuestions = formData.questions.filter((_, i) => i !== index);
//     setFormData({ ...formData, questions: newQuestions });
//   };

//   // ── CATEGORY CHANGE ───────────────────────────────────────────
//   const handleCategoryChange = (value: string) => {
//     const isOther = value === "Other";
//     setIsCustomSubcategory(isOther);
//     setFormData({ ...formData, category: value, subcategory: "" });
//   };

//   // ── SUBCATEGORY CHANGE (dropdown) ─────────────────────────────
//   const handleSubcategoryChange = (value: string) => {
//     if (value === "__custom__") {
//       setIsCustomSubcategory(true);
//       setFormData({ ...formData, subcategory: "" });
//     } else {
//       setIsCustomSubcategory(false);
//       setFormData({ ...formData, subcategory: value });
//     }
//   };

//   // ── LOAD DRAFT FROM API ──────────────────────────────────────
//   useEffect(() => {
//     if (!draftId) return;
//     const fetchDraft = async () => {
//       try {
//         const res = await fetch(`/api/jobs/drafts/${draftId}`);
//         const data = await res.json();
//         if (res.ok && data.draft) {
//           setFormData({
//             title: data.draft.title || "",
//             description: data.draft.description || "",
//             category: data.draft.category || "",
//             subcategory: data.draft.subCategory || "",
//             budget: data.draft.budget || "",
//             budgetType: data.draft.budgetType || "Fixed",
//             currency: data.draft.currency || "USD",
//             visibility: data.draft.visibility || "public",
//             questions: data.draft.questions || [""],
//             projectDuration: data.draft.projectDuration || "",
//           });
//           // If loaded category is "Other", show text input
//           if (data.draft.category === "Other") setIsCustomSubcategory(true);
//         }
//       } catch (err) {
//         console.error("Failed to load draft:", err);
//       }
//     };
//     fetchDraft();
//   }, [draftId]);

//   const handlePreview = () => {
//     localStorage.setItem(
//       "previewJob",
//       JSON.stringify({ ...formData, id: draftId || "preview", status: "PREVIEW" })
//     );
//     router.push("/current-job-post");
//   };

//   // ── SAVE DRAFT ───────────────────────────────────────────────
//   const handleSaveDraft = async () => {
//     try {
//       setSaving(true);
//       setError("");
//       if (!formData.title.trim()) {
//         setError("Title is required to save draft");
//         setSaving(false);
//         return;
//       }
//       const payload = {
//         title: formData.title.trim(),
//         description: formData.description || null,
//         category: formData.category || null,
//         subCategory: formData.subcategory || null,
//         budget: formData.budget ? Number(formData.budget) : null,
//         freelancerSource: formData.visibility === "private" ? "invited" : "any",
//         projectDuration: formData.projectDuration || null,
//         jobVisibility: formData.visibility || "public",
//       };
//       const url = draftId ? `/api/jobs/drafts/${draftId}` : `/api/jobs/drafts`;
//       const method = draftId ? "PUT" : "POST";
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (!res.ok || !data.success) {
//         if (res.status === 401) { router.push("/sign-in-page"); return; }
//         throw new Error(data.message || "Failed to save draft");
//       }
//       router.push("/client-dashboard?tab=draft");
//     } catch (err: any) {
//       setError(err.message || "Failed to save draft");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── RAZORPAY PAYMENT HANDLER ─────────────────────────────────
//   const handleRazorpayPayment = async (jobPayload: any) => {
//     try {
//       setLoading(true);
//       setError("");
//       const orderRes = await fetch("/api/jobs/payment/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(jobPayload),
//       });
//       const orderData = await orderRes.json();
//       if (!orderRes.ok || !orderData.success) {
//         throw new Error(orderData.message || "Failed to create payment order");
//       }
//       const { orderId, amountInPaise, currency, jobId, razorpayKeyId, clientName, clientEmail, jobBudget, platformCommission } = orderData;
//       const options = {
//         key: razorpayKeyId,
//         amount: amountInPaise,
//         currency: currency || "INR",
//         order_id: orderId,
//         name: "HireHub - Job Posting",
//         description: `Job: ${jobPayload.title} | Budget: ₹${jobBudget} + ₹${platformCommission?.toFixed(2)} commission`,
//         handler: async function (response: any) {
//           const verifyRes = await fetch("/api/jobs/payment/verify", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               jobId: jobId,
//             }),
//           });
//           const verifyData = await verifyRes.json();
//           if (verifyData.success) {
//             alert("✅ Payment successful! Your job is now live.");
//             if (formData.visibility === "private") {
//               localStorage.setItem("newJobId", jobId.toString());
//               router.push(`/post-page/private-freelancer/${jobId}`);

//             } else {
//               router.push("/client-dashboard");
//             }
//           } else {
//             setError("Payment verification failed. Contact support with payment ID: " + response.razorpay_payment_id);
//           }
//         },
//         prefill: { name: clientName || "", email: clientEmail || "" },
//         notes: { jobTitle: jobPayload.title },
//         theme: { color: "#4e73df" },
//         config: { display: { hide: [{ method: "emi" }, { method: "paylater" }] } },
//         modal: {
//           ondismiss: function () {
//             setLoading(false);
//             setError("Payment cancelled. Your job has been saved in draft. You can complete payment later.");
//           },
//         },
//       };
//       const rzp = new (window as any).Razorpay(options);
//       rzp.open();
//     } catch (err: any) {
//       setError(err.message || "Payment failed. Please try again.");
//       setLoading(false);
//     }
//   };

//   // ── POST JOB ──────────────────────────────────────────────────
//   const handlePostJob = async () => {
//     setError("");
//     if (!formData.title || !formData.description || !formData.category || !formData.subcategory || !formData.budget || !formData.projectDuration) {
//       setError("Please fill in all required fields (title, description, category, subcategory, budget, duration)");
//       return;
//     }
//     try {
//       setLoading(true);
//       if (draftId) {
//         const updatePayload = {
//           title: formData.title.trim(),
//           description: formData.description || null,
//           category: formData.category || null,
//           subCategory: formData.subcategory || null,
//           budget: formData.budget ? Number(formData.budget) : null,
//           freelancerSource: formData.visibility === "private" ? "invited" : "any",
//           projectDuration: formData.projectDuration || null,
//           currency: formData.currency || "USD",
//           jobVisibility: formData.visibility || "public",
//         };
//         const updateRes = await fetch(`/api/jobs/drafts/${draftId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatePayload) });
//         const updateData = await updateRes.json();
//         if (!updateRes.ok || !updateData.success) throw new Error(updateData.message || "Failed to update draft");
//         const publishRes = await fetch(`/api/jobs/drafts/${draftId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "publish" }) });
//         const publishData = await publishRes.json();
//         if (!publishRes.ok || !publishData.success) {
//           if (publishRes.status === 401) { router.push("/sign-in-page"); return; }
//           throw new Error(publishData.message || "Failed to publish draft");
//         }
//         if (formData.visibility === "private") { localStorage.setItem("newJobId", publishData.job._id); router.push("/post-page/private-freelancer"); }
//         else { router.push("/client-dashboard"); }
//         return;
//       }
//       const payload = {
//         category: formData.category,
//         subCategory: formData.subcategory,
//         title: formData.title,
//         description: formData.description,
//         budget: Number(formData.budget),
//         freelancerSource: formData.visibility === "private" ? "invited" : "any",
//         projectDuration: formData.projectDuration,
//         jobVisibility: formData.visibility,
//         currency: formData.currency || "USD",
//       };
//       const response = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
//       const res = await response.json();

//       if (response.status === 402 && res.requiresPayment) {
//         await handleRazorpayPayment(payload);
//         return;
//       }
//       if (!response.ok) {
//         if (response.status === 401) { router.push("/sign-in-page"); return; }
//         throw new Error(res.message || "Failed to post job");
//       }

//       if (res.job?._id) localStorage.setItem("newJobId", res.job._id);
//       if (formData.visibility === "private") { router.push(`/post-page/private-freelancer/${res.job._id}`); }
//       else { router.push("/client-dashboard"); }
//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Script src="https://checkout.razorpay.com/v1/checkout.js" />
//       <Header />
//       <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4 mt-10">
//         <div className="w-full max-w-7xl bg-white rounded-lg shadow-sm px-6 sm:px-10 md:px-14 lg:px-16 py-10">

//           {/* HEADER */}
//           <h1 className="font-semibold text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
//             {draftId ? "Edit Job Draft" : "Post a job"}
//           </h1>
//           <p className="mt-3 text-gray-600 text-base sm:text-lg md:text-xl">
//             Tell us what you need. We&apos;ll connect you with top talent.
//           </p>
//           <hr className="my-8" />

//           {/* CATEGORY */}
//           <section className="mb-12">
//             <p className="text-base md:text-lg text-gray-700 mb-6">
//               Choose a category that best fits your job.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

//               {/* Category dropdown */}
//               <div>
//                 <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
//                   Category *
//                 </label>
//                 <select
//                   className="w-full border border-gray-300 rounded px-4 py-3 text-lg"
//                   aria-label="Category"
//                   value={formData.category}
//                   onChange={(e) => handleCategoryChange(e.target.value)}
//                 >
//                   <option value="">Select a category</option>
//                   {Object.keys(CATEGORIES).map((cat) => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Subcategory — text input for "Other", dropdown otherwise */}
//               <div>
//                 <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
//                   Subcategory *
//                 </label>

//                 {isCustomSubcategory ? (
//                   /* ── FREE-TEXT INPUT ── */
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       autoFocus
//                       value={formData.subcategory}
//                       onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
//                       placeholder="Type your subcategory..."
//                       className="w-full border border-gray-300 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:rtext-gray-700 "
//                     />
//                     {/* Only show back button if category is NOT "Other" (i.e. came from __custom__ option) */}
//                     {formData.category !== "Other" && (
//                       <button
//                         type="button"
//                         title="Back to dropdown"
//                         onClick={() => {
//                           setIsCustomSubcategory(false);
//                           setFormData({ ...formData, subcategory: "" });
//                         }}
//                         className="text-gray-500 hover:text-gray-700 px-3 font-bold text-xl border border-gray-300 rounded"
//                       >
//                         ✕
//                       </button>
//                     )}
//                   </div>
//                 ) : (
//                   /* ── DROPDOWN ── */
//                   <select
//                     className="w-full border border-gray-300 rounded px-4 py-3 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     aria-label="Subcategory"
//                     value={formData.subcategory}
//                     disabled={!formData.category}
//                     onChange={(e) => handleSubcategoryChange(e.target.value)}
//                   >
//                     <option value="">
//                       {formData.category ? "Select a subcategory" : "Select category first"}
//                     </option>
//                     {subcategories.map((sub) => (
//                       <option key={sub} value={sub}>{sub}</option>
//                     ))}
//                     {/* Extra option for any non-Other category */}
//                     {formData.category && formData.category !== "Other" && (
//                       <option value="__custom__">✏️ Type my own subcategory...</option>
//                     )}
//                   </select>
//                 )}

//                 {/* Helper text when "Other" category is selected */}
//                 {formData.category === "Other" && (
//                   <p className="mt-1 text-sm text-gray-500">
//                     Please describe your subcategory in the box above.
//                   </p>
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* JOB TITLE */}
//           <section className="mb-12">
//             <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
//               Job title *
//             </label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               placeholder="Example: Build a responsive website"
//               className="w-full border border-gray-300 rounded px-4 py-3 text-lg"
//             />
//           </section>

//           {/* JOB DESCRIPTION */}
//           <section className="mb-12">
//             <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
//               Job description *
//             </label>
//             <textarea
//               rows={6}
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               placeholder="Describe your project, deliverables, timeline..."
//               className="w-full border border-gray-300 rounded px-4 py-3 text-lg resize-none"
//             />
//           </section>

//           {/* UPLOAD SAMPLES */}
//           <section className="mb-12">
//             <label className="block font-semibold uppercase text-gray-600 mb-3 text-sm">
//               Upload samples or helpful material (optional)
//             </label>
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//               <p className="text-gray-500 mb-2">Drop files here</p>
//               <label className="text-blue-600 font-medium cursor-pointer hover:underline">
//                 Browse
//                 <input type="file" multiple className="hidden" />
//               </label>
//             </div>
//           </section>

//           {/* BUDGET */}
//           <section className="mb-14">
//             <label className="block font-semibold uppercase text-gray-600 mb-4 text-sm">
//               Budget * <span className="text-gray-400 text-xs font-normal">(minimum ₹500)</span>
//             </label>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <select
//                 className="border border-gray-300 rounded px-4 py-3 text-lg"
//                 value={formData.budgetType}
//                 onChange={(e) => setFormData({ ...formData, budgetType: e.target.value })}
//               >
//                 <option>Fixed</option>
//                 <option>Hourly</option>
//               </select>
//               <select
//                 className="border border-gray-300 rounded px-4 py-3 text-lg"
//                 value={formData.currency}
//                 onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
//               >
//                 <option>USD</option>
//                 <option>INR</option>
//                 <option>GBP</option>
//                 <option>EUR</option>
//               </select>
//               <input
//                 type="number"
//                 value={formData.budget}
//                 onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
//                 placeholder="e.g. 500"
//                 className="border border-gray-300 rounded px-4 py-3 text-lg"
//               />
//             </div>
//           </section>

//           {/* VISIBILITY */}
//           <section className="mb-14">
//             <label className="block font-semibold uppercase text-gray-600 mb-3 text-sm">
//               Job visibility
//             </label>
//             <div className="space-y-3 text-lg text-gray-700">
//               <label className="flex gap-3 items-center">
//                 <input
//                   type="radio"
//                   className="accent-blue-600"
//                   checked={formData.visibility === "public"}
//                   onChange={() => setFormData({ ...formData, visibility: "public" })}
//                 />
//                 Public – Anyone can find this job
//               </label>
//               <label className="flex gap-3 items-center">
//                 <input
//                   type="radio"
//                   className="accent-blue-600"
//                   checked={formData.visibility === "private"}
//                   onChange={() => setFormData({ ...formData, visibility: "private" })}
//                 />
//                 Private – Only freelancers you invite
//               </label>
//             </div>
//           </section>

//           {/* GET TO KNOW YOUR FREELANCERS */}
//           <section className="mb-12">
//             <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
//               Get to know your freelancers{" "}
//               <span className="text-gray-400 font-normal">(optional)</span>
//             </label>
//             {formData.questions.map((question, index) => (
//               <div key={index} className="flex gap-2 mb-3">
//                 <input
//                   className="w-full border border-gray-300 rounded px-4 py-3 text-lg"
//                   aria-label={`Question ${index + 1}`}
//                   list={`question-options-${index}`}
//                   value={question}
//                   placeholder="Type your question or select from the list"
//                   onChange={(e) => updateQuestion(index, e.target.value)}
//                 />
//                 <datalist id={`question-options-${index}`}>
//                   {questionOptions
//                     .filter((opt) => opt !== "Select an interview question")
//                     .map((option) => (
//                       <option key={option} value={option} />
//                     ))}
//                 </datalist>
//                 {formData.questions.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeQuestion(index)}
//                     className="text-red-500 hover:text-red-700 px-2 font-bold text-xl"
//                     title="Remove question"
//                   >
//                     &times;
//                   </button>
//                 )}
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addQuestion}
//               className="mt-3 text-blue-600 text-sm font-medium hover:underline"
//             >
//               + Add another question
//             </button>
//           </section>

//           {/* ESTIMATED PROJECT DURATION */}
//           <section className="mb-14">
//             <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
//               Estimated project duration *
//             </label>
//             <select
//               className="w-full border border-gray-300 rounded px-4 py-3 text-lg"
//               aria-label="Project duration"
//               value={formData.projectDuration || ""}
//               onChange={(e) => setFormData({ ...formData, projectDuration: e.target.value })}
//             >
//               <option value="">Select</option>
//               <option value="Less than 1 week">Less than 1 week</option>
//               <option value="1 to 2 weeks">1 to 2 weeks</option>
//               <option value="2 to 4 weeks">2 to 4 weeks</option>
//               <option value="1 to 3 months">1 to 3 months</option>
//               <option value="3+ months">3+ months</option>
//             </select>
//           </section>

//           {/* ERROR MESSAGE */}
//           {error && (
//             <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
//               <p className="text-red-600 text-sm">{error}</p>
//             </div>
//           )}

//           {/* PAYMENT SUMMARY */}
//           {formData.budget && Number(formData.budget) >= 500 && (
//             <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <p className="text-sm font-semibold text-blue-800 mb-2">💳 Payment Summary</p>
//               <div className="flex justify-between text-sm text-gray-700">
//                 <span>Job Budget</span>
//                 <span>₹{Number(formData.budget).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
//               </div>
//               <div className="flex justify-between text-sm text-gray-700 mt-1">
//                 <span>Platform Commission (2%)</span>
//                 <span>₹{(Number(formData.budget) * 0.02).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
//               </div>
//               <div className="flex justify-between text-sm font-bold text-blue-900 mt-2 border-t border-blue-200 pt-2">
//                 <span>Total Payable</span>
//                 <span>₹{(Number(formData.budget) * 1.02).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
//               </div>
//             </div>
//           )}

//           {/* ACTION BUTTONS */}
//           <div className="flex justify-end gap-4 mt-10">
//             <button
//               onClick={handleSaveDraft}
//               disabled={saving}
//               className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-lg px-10 py-4 rounded-md transition disabled:opacity-50"
//             >
//               {saving ? "Saving..." : "Save as Draft"}
//             </button>
//             <button
//               type="button"
//               onClick={handlePreview}
//               className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-lg px-10 py-4 rounded-md transition"
//             >
//               Preview Job
//             </button>
//             <button
//               type="button"
//               onClick={handlePostJob}
//               disabled={loading}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-12 py-4 rounded-md transition disabled:opacity-50"
//             >
//               {loading ? "Processing..." : "Post job"}
//             </button>
//           </div>

//         </div>
//       </div>
//       <FooterSection />
//     </>
//   );
// }

// export default function PostJobPage() {
//   return (
//     <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
//       <PostJobContent />
//     </Suspense>
//   );
// }








"use client";
import Header from "@/components/common/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FooterSection from "@/app/homepage/components/FooterSection";
import Script from "next/script";
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

// ── ALL CATEGORIES & SUBCATEGORIES ────────────────────────────
const CATEGORIES: Record<string, string[]> = {
  "Development & IT": [
    "Web Development", "Mobile App Development (iOS)", "Mobile App Development (Android)",
    "Full Stack Development", "Frontend Development", "Backend Development",
    "WordPress Development", "Shopify Development", "E-Commerce Development",
    "Game Development", "Desktop App Development", "Browser Extension Development",
    "API Development & Integration", "Cloud & DevOps", "Database Administration",
    "Cybersecurity & Penetration Testing", "QA & Software Testing",
    "Blockchain & Web3 Development", "AI / ML Development", "Data Science & Analytics",
    "Scripting & Automation", "IT Support & Networking", "AR / VR Development",
    "Embedded Systems & IoT", "Other Development & IT",
  ],
  "Design & Creative": [
    "UI / UX Design", "Graphic Design", "Logo & Brand Identity", "Illustration",
    "Motion Graphics & Animation", "Video Editing", "3D Modeling & Rendering",
    "Product Design", "Print Design", "Social Media Design",
    "Presentation Design (PowerPoint / Pitch Deck)", "Banner & Ad Design",
    "Packaging Design", "Photography", "Photo Editing & Retouching", "Fashion Design",
    "Interior Design", "Architecture & Floor Plans", "Character Design", "NFT Art",
    "Other Design & Creative",
  ],
  "Sales & Marketing": [
    "Digital Marketing Strategy", "Search Engine Optimization (SEO)",
    "Search Engine Marketing (SEM / Google Ads)", "Social Media Marketing",
    "Social Media Management", "Content Marketing", "Email Marketing",
    "Influencer Marketing", "Affiliate Marketing", "Lead Generation", "Market Research",
    "Brand Strategy", "Public Relations (PR)", "Sales Copywriting",
    "Facebook & Instagram Ads", "LinkedIn Marketing", "YouTube Marketing",
    "App Store Optimization (ASO)", "E-Commerce Marketing", "Marketing Automation",
    "Other Sales & Marketing",
  ],
  "Writing & Translation": [
    "Article & Blog Writing", "Copywriting", "Technical Writing", "SEO Writing",
    "Creative Writing", "Ghostwriting", "Proofreading & Editing",
    "Resume & Cover Letter Writing", "Academic Writing", "Grant Writing", "Scriptwriting",
    "Email & Newsletter Writing", "Product Description Writing", "Legal Writing",
    "Translation (English ↔ Hindi)", "Translation (English ↔ Spanish)",
    "Translation (English ↔ French)", "Translation (English ↔ Arabic)",
    "Translation (English ↔ German)", "Translation (Other Languages)",
    "Transcription", "Subtitling & Captioning", "Other Writing & Translation",
  ],
  "Finance & Accounting": [
    "Bookkeeping", "Accounting", "Tax Preparation & Filing", "Financial Analysis",
    "Financial Modeling", "Payroll Management", "Auditing", "Business Valuation",
    "Investment Research", "GST & Compliance", "CFO Services",
    "QuickBooks / Tally / Zoho Books", "Invoice & Billing Management",
    "Other Finance & Accounting",
  ],
  "Business & Consulting": [
    "Business Strategy", "Startup Consulting", "Operations Management",
    "Project Management", "Product Management", "Human Resources (HR)",
    "Recruitment & Talent Acquisition", "Legal Consulting", "Compliance & Regulatory",
    "Supply Chain & Logistics", "Business Plan Writing", "Process Improvement",
    "Customer Support Setup", "Virtual Assistant", "Data Entry", "CRM Setup & Management",
    "Other Business & Consulting",
  ],
  "Engineering & Architecture": [
    "Civil Engineering", "Structural Engineering", "Mechanical Engineering",
    "Electrical Engineering", "Chemical Engineering", "CAD Design", "PCB Design",
    "3D Printing & Prototyping", "Architectural Design", "Interior Architecture",
    "Landscape Architecture", "Construction Management", "Environmental Engineering",
    "Other Engineering & Architecture",
  ],
  "Education & Training": [
    "Online Tutoring", "Curriculum Development", "E-Learning Content Creation",
    "Course Design (Video / LMS)", "Language Teaching", "Coding Bootcamp / Teaching",
    "Test Prep (IELTS, GMAT, SAT etc.)", "Corporate Training", "Educational Consulting",
    "Other Education & Training",
  ],
  "Legal": [
    "Contract Drafting & Review", "Legal Research", "Intellectual Property (IP)",
    "Trademark Registration", "Privacy Policy & Terms of Service",
    "Company Incorporation", "Employment Law", "Immigration Law", "Litigation Support",
    "Other Legal",
  ],
  "Data & Analytics": [
    "Data Entry & Cleaning", "Data Analysis", "Data Visualization",
    "Business Intelligence (BI)", "Power BI / Tableau", "Excel & Google Sheets",
    "Web Scraping", "Database Design", "Statistical Analysis",
    "Survey Design & Analysis", "Other Data & Analytics",
  ],
  "Music & Audio": [
    "Music Composition", "Song Writing", "Audio Editing & Mixing", "Podcast Production",
    "Voice Over", "Sound Design", "Audio Transcription", "Jingle Production",
    "Other Music & Audio",
  ],
  "Video & Animation": [
    "Video Editing", "Explainer Videos", "Whiteboard Animation", "2D Animation",
    "3D Animation", "Intro / Outro Creation", "Video Ads", "Corporate Video Production",
    "Drone Videography", "Other Video & Animation",
  ],
  "Customer Service": [
    "Customer Support (Chat / Email)", "Call Center & Telemarketing",
    "Technical Support", "Community Management", "Order Fulfillment Support",
    "CRM Data Management", "Other Customer Service",
  ],
  "Health & Wellness": [
    "Fitness & Nutrition Coaching", "Mental Health Counseling", "Medical Writing",
    "Telemedicine Consulting", "Healthcare IT", "Other Health & Wellness",
  ],
  "Gaming": [
    "Game Design & Concept Art", "Game Development (Unity)", "Game Development (Unreal Engine)",
    "2D Game Art & Assets", "3D Game Characters & Modeling", "Game Testing & QA",
    "Game Mechanics & Balancing", "Blockchain Game Development",
  ],
  "Blockchain & Crypto": [
    "Smart Contract Development (Solidity)", "Web3 & DApp Development",
    "Ethereum & EVM Development", "Binance Smart Chain Development",
    "Solana & Rust Development", "NFT Marketplace Development", "DeFi & Token Development",
    "Cryptocurrency Exchange Scripts", "White Paper & Crypto Writing",
  ],
  // ── "Other" category — user types their own subcategory ──
  "Other": [],
};

function PostJobContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draftId");
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [splitLoading, setSplitLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [showWalletConfirm, setShowWalletConfirm] = useState(false);
  const [showWalletSuccess, setShowWalletSuccess] = useState(false);
  const [showSplitConfirm, setShowSplitConfirm] = useState(false);
  const [showSplitNext, setShowSplitNext] = useState(false);
  const [splitData, setSplitData] = useState<{ walletPart: number; rzpPart: number } | null>(null);
  const [splitResponse, setSplitResponse] = useState<any>(null);

  // ── File upload state ──────────────────────────────────────────
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string; size: number }[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileUpload = async (files: FileList | File[]) => {
    const userId = (session?.user as any)?.id;
    if (!userId) { setUploadError('Please log in to upload files.'); return; }
    setUploadError('');
    const fileArr = Array.from(files);
    // Allowed types: JPEG, PNG, PDF
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    const invalid = fileArr.filter(f => !allowed.includes(f.type));
    if (invalid.length) { setUploadError(`Only JPEG, PNG, and PDF files are allowed.`); return; }
    const tooBig = fileArr.filter(f => f.size > 5 * 1024 * 1024);
    if (tooBig.length) { setUploadError(`Max file size is 5MB per file.`); return; }

    // Show progress bars
    setUploadingFiles(fileArr.map(f => ({ name: f.name, progress: 0 })));

    const formData = new FormData();
    fileArr.forEach(f => formData.append('files', f));
    formData.append('documentType', 'job_attachment');

    try {
      const result = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/api/client/${userId}/upload`);
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploadingFiles(prev => prev.map(f => ({ ...f, progress: pct })));
          }
        });
        xhr.onload = () => {
          if (xhr.status === 201) resolve(JSON.parse(xhr.responseText));
          else reject(new Error(`Upload failed: ${xhr.statusText}`));
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(formData);
      });

      if (result.success) {
        setUploadedFiles(prev => [
          ...prev,
          ...result.data.files.map((f: any) => ({ name: f.name, url: f.url, size: f.size }))
        ]);
      } else {
        setUploadError(result.message || 'Upload failed');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploadingFiles([]);
    }
  };

  // Prefetch dashboard route for instant navigation
  useEffect(() => { router.prefetch('/client-dashboard'); }, [router]);

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("/api/wallet/status");
        const data = await res.json();
        if (data.success) setWalletBalance(data.wallet.balance);
      } catch (err) {
        console.error("Failed to fetch wallet balance:", err);
      }
    };
    fetchBalance();
  }, []);

  const getTotalPayableNow = () => ((payLater && !isFeatured) ? 0 : (payLater && isFeatured) ? Number(formData.budget) * 0.02 : Number(formData.budget) * (isFeatured ? 1.04 : 1.02));

  const handleWalletPayment = async () => {
    if (!formData.title.trim() || !formData.budget) {
      setError("Please fill in the job details before paying.");
      return;
    }
    setShowWalletConfirm(true);
  };

  const confirmWalletPayment = async () => {
    setShowWalletConfirm(false);
    try {
      setWalletLoading(true);
      setError("");

      const payload = {
        title: formData.title.trim(),
        description: formData.description,
        category: formData.category,
        subCategory: formData.subcategory,
        budget: Number(formData.budget),
        projectDuration: formData.projectDuration,
        jobVisibility: formData.visibility,
        currency: formData.currency || "INR",
        questions: formData.questions,
        isFeatured,
        payLater
      };

      const response = await fetch("/api/jobs/payment/wallet-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || "Wallet payment failed");
      }

      if (res.jobId) localStorage.setItem("newJobId", res.jobId);
      await queryClient.invalidateQueries({ queryKey: ["current-jobs-clients"] });
      setIsPosting(true);
      router.replace("/client-dashboard?success=job_posted");
    } catch (err: any) {
      setError(err.message || "Something went wrong with wallet payment");
    } finally {
      setWalletLoading(false);
    }
  };

  const handleSplitPayment = async () => {
    const total = getTotalPayableNow();
    const available = walletBalance || 0;
    const rzpPart = total - available;

    setSplitData({ walletPart: available, rzpPart });
    setShowSplitConfirm(true);
  };

  const confirmSplitPayment = async () => {
    setShowSplitConfirm(false);
    if (!splitData) return;

    try {
      setSplitLoading(true);
      setError("");

      const jobPayload = {
        title: formData.title.trim(),
        description: formData.description,
        category: formData.category,
        subCategory: formData.subcategory,
        budget: Number(formData.budget),
        projectDuration: formData.projectDuration,
        jobVisibility: formData.visibility,
        currency: formData.currency || "INR",
        questions: formData.questions,
        walletAmount: splitData.walletPart,
        remainingAmount: splitData.rzpPart,
        isFeatured,
        payLater
      };

      const res = await fetch("/api/jobs/payment/create-split", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobPayload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create split payment");
      }

      const { orderId, amountInPaise, razorpayKeyId, clientName, clientEmail, jobId } = data;
      setSplitResponse(data);
      setSplitLoading(false);
      setShowSplitNext(true); // Show professional intermediate message
    } catch (err: any) {
      setError(err.message || "Split payment failed");
      setSplitLoading(false);
    }
  };

  const proceedToRazorpay = () => {
    setShowSplitNext(false);
    if (!splitResponse) return;

    const { razorpayKeyId, amountInPaise, orderId, jobId, clientName, clientEmail } = splitResponse;

    const options = {
      key: razorpayKeyId,
      amount: amountInPaise,
      currency: "INR",
      order_id: orderId,
      name: "HireHub - Finalize Payment",
      description: `Card payment: ₹${splitData?.rzpPart.toFixed(2)}`,
      handler: async function (response: any) {
        setLoading(true);
        const verifyRes = await fetch("/api/jobs/payment/verify-split", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            jobId: jobId,
            walletAmount: splitData?.walletPart
          }),
        });
        const verifyData = await verifyRes.json();
        setLoading(false);
        if (verifyData.success) {
          await queryClient.invalidateQueries({ queryKey: ["current-jobs-clients"] });
          setIsPosting(true);
          router.replace("/client-dashboard?success=job_posted");
        } else {
          setError("Payment verification failed. Please contact support.");
        }
      },
      prefill: { name: clientName, email: clientEmail },
      theme: { color: "#4e73df" },
      modal: {
        ondismiss: function () {
          setLoading(false);
          setError("Split payment cancelled. Job saved in drafts.");
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };
  const [error, setError] = useState("");
  const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [payLater, setPayLater] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    budget: "",
    budgetType: "Fixed",
    currency: "USD",
    visibility: "public",
    questions: [""],
    projectDuration: "",
  });

  // Subcategories based on selected category
  const subcategories = formData.category ? CATEGORIES[formData.category] || [] : [];

  const questionOptions = [
    "Select an interview question",
    "What similar projects have you worked on?",
    "How would you approach this project?",
    "What tools or technologies will you use?",
    "What is your estimated delivery time?",
  ];

  const addQuestion = () => {
    setFormData({ ...formData, questions: [...formData.questions, ""] });
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  // ── CATEGORY CHANGE ───────────────────────────────────────────
  const handleCategoryChange = (value: string) => {
    const isOther = value === "Other";
    setIsCustomSubcategory(isOther);
    setFormData({ ...formData, category: value, subcategory: "" });
  };

  // ── SUBCATEGORY CHANGE (dropdown) ─────────────────────────────
  const handleSubcategoryChange = (value: string) => {
    if (value === "__custom__") {
      setIsCustomSubcategory(true);
      setFormData({ ...formData, subcategory: "" });
    } else {
      setIsCustomSubcategory(false);
      setFormData({ ...formData, subcategory: value });
    }
  };

  // ── LOAD DRAFT FROM API ──────────────────────────────────────
  useEffect(() => {
    if (!draftId) return;
    const fetchDraft = async () => {
      try {
        const res = await fetch(`/api/jobs/drafts/${draftId}`);
        const data = await res.json();
        if (res.ok && data.draft) {
          setFormData({
            title: data.draft.title || "",
            description: data.draft.description || "",
            category: data.draft.category || "",
            subcategory: data.draft.subCategory || "",
            budget: data.draft.budget || "",
            budgetType: data.draft.budgetType || "Fixed",
            currency: data.draft.currency || "USD",
            visibility: data.draft.visibility || "public",
            questions: data.draft.questions || [""],
            projectDuration: data.draft.projectDuration || "",
          });
          // If loaded category is "Other", show text input
          if (data.draft.category === "Other") setIsCustomSubcategory(true);
        }
      } catch (err) {
        console.error("Failed to load draft:", err);
      }
    };
    fetchDraft();
  }, [draftId]);

  const handlePreview = () => {
    localStorage.setItem(
      "previewJob",
      JSON.stringify({ ...formData, id: draftId || "preview", status: "PREVIEW" })
    );
    router.push("/current-job-post");
  };

  // ── SAVE DRAFT ───────────────────────────────────────────────
  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      setError("");
      if (!formData.title.trim()) {
        setError("Title is required to save draft");
        setSaving(false);
        return;
      }
      const payload = {
        title: formData.title.trim(),
        description: formData.description || null,
        category: formData.category || null,
        subCategory: formData.subcategory || null,
        budget: formData.budget ? Number(formData.budget) : null,
        freelancerSource: formData.visibility === "private" ? "invited" : "any",
        projectDuration: formData.projectDuration || null,
        jobVisibility: formData.visibility || "public",
      };
      const url = draftId ? `/api/jobs/drafts/${draftId}` : `/api/jobs/drafts`;
      const method = draftId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        if (res.status === 401) { router.push("/sign-in-page"); return; }
        throw new Error(data.message || "Failed to save draft");
      }
      router.push("/client-dashboard?tab=draft");
    } catch (err: any) {
      setError(err.message || "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  // ── RAZORPAY PAYMENT HANDLER ─────────────────────────────────
  const handleRazorpayPayment = async (jobPayload: any) => {
    try {
      setLoading(true);
      setError("");
      const orderRes = await fetch("/api/jobs/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobPayload),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || "Failed to create payment order");
      }
      const { orderId, amountInPaise, currency, jobId, razorpayKeyId, clientName, clientEmail, jobBudget, platformCommission } = orderData;
      const orderCurrencySymbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '₹';
      const options = {
        key: razorpayKeyId,
        amount: amountInPaise,
        currency: currency || "INR",
        order_id: orderId,
        name: "HireHub - Job Posting",
        description: `Job: ${jobPayload.title} | Budget: ${orderCurrencySymbol}${jobBudget} + ${orderCurrencySymbol}${platformCommission?.toFixed(2)} commission`,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/jobs/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              jobId: jobId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            await queryClient.invalidateQueries({ queryKey: ["current-jobs-clients"] });
            setIsPosting(true);
            router.replace("/client-dashboard?success=job_posted");
          } else {
            setError("Payment verification failed. Contact support with payment ID: " + response.razorpay_payment_id);
          }
        },
        prefill: { name: clientName || "", email: clientEmail || "", contact: "9999999999" },
        notes: { jobTitle: jobPayload.title },
        theme: { color: "#4e73df" },
        config: { display: { hide: [{ method: "emi" }, { method: "paylater" }] } },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError("Payment cancelled. Your job has been saved in draft. You can complete payment later.");
          },
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  // ── POST JOB ──────────────────────────────────────────────────
  const handlePostJob = async () => {
    setError("");
    if (!formData.title || !formData.description || !formData.category || !formData.subcategory || !formData.budget || !formData.projectDuration) {
      setError("Please fill in all required fields (title, description, category, subcategory, budget, duration)");
      return;
    }
    try {
      setLoading(true);
      if (draftId) {
        const updatePayload = {
          title: formData.title.trim(),
          description: formData.description || null,
          category: formData.category || null,
          subCategory: formData.subcategory || null,
          budget: formData.budget ? Number(formData.budget) : null,
          freelancerSource: formData.visibility === "private" ? "invited" : "any",
          projectDuration: formData.projectDuration || null,
          currency: formData.currency || "USD",
          jobVisibility: formData.visibility || "public",
        };
        const updateRes = await fetch(`/api/jobs/drafts/${draftId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatePayload) });
        const updateData = await updateRes.json();
        if (!updateRes.ok || !updateData.success) throw new Error(updateData.message || "Failed to update draft");
        const publishRes = await fetch(`/api/jobs/drafts/${draftId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "publish" }) });
        const publishData = await publishRes.json();
        if (!publishRes.ok || !publishData.success) {
          if (publishRes.status === 401) { router.push("/sign-in-page"); return; }
          throw new Error(publishData.message || "Failed to publish draft");
        }
        if (formData.visibility === "private") { localStorage.setItem("newJobId", publishData.job._id); router.push("/post-page/private-freelancer"); }

        else {
          await queryClient.invalidateQueries({ queryKey: ["current-jobs-clients"] });
          router.push(`/project-detail-pages?jobId=${publishData.job._id}`);
        }
        return;
      }
      // app/post-page/page.tsx 
      const payload = {
        category: formData.category,
        subCategory: formData.subcategory,
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
        freelancerSource: formData.visibility === "private" ? "invited" : "any",
        projectDuration: formData.projectDuration,
        jobVisibility: formData.visibility,
        currency: formData.currency || "USD",
        isFeatured,
        payLater,
      };
      const res = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { router.push("/sign-in-page"); return; }
        if (res.status === 402 && data.requiresPayment) { await handleRazorpayPayment(payload); return; }
        throw new Error(data.message || "Failed to post job");
      }

      if (data.job?._id) localStorage.setItem("newJobId", data.job._id);
      if (formData.visibility === "private") { router.replace(`/post-page/private-freelancer/${data.job._id}`); }
      else {
        await queryClient.invalidateQueries({ queryKey: ["current-jobs-clients"] });
        setIsPosting(true);
        router.replace("/client-dashboard?success=job_posted");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const currencySymbol = formData.currency === 'USD' ? '$' : formData.currency === 'GBP' ? '£' : formData.currency === 'EUR' ? '€' : '₹';

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Header />

      {/* ── FULL-SCREEN POSTING OVERLAY ────────────────────────── */}
      {isPosting && (
        <div className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center">
          {/* Animated logo mark */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-xl shadow-blue-200">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            {/* Spinning ring */}
            <div className="absolute -inset-2 rounded-[1.5rem] border-4 border-blue-200 border-t-blue-600 animate-spin" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Publishing your job…</h2>
          <p className="text-gray-500 text-sm mb-8">Sit tight, redirecting you to your dashboard.</p>

          {/* Shimmer skeleton preview of dashboard */}
          <div className="w-full max-w-sm space-y-3 px-4">
            {[80, 60, 90, 50].map((w, i) => (
              <div key={i} className="h-3 bg-gray-200 rounded-full overflow-hidden relative" style={{ width: `${w}%`, margin: '0 auto' }}>
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animationDelay: `${i * 0.18}s` }} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4 mt-10">
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-sm px-6 sm:px-10 md:px-14 lg:px-16 py-10">

          {/* HEADER */}
          <h1 className="font-semibold text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            {draftId ? "Edit Job Draft" : "Post a job"}
          </h1>
          <p className="mt-3 text-gray-600 text-base sm:text-lg md:text-xl">
            Tell us what you need. We&apos;ll connect you with top talent.
          </p>

          {/* ERROR ALERT */}
          {error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm animate-in fade-in slide-in-from-top-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <hr className="my-8" />

          {/* CATEGORY */}
          <section className="mb-12">
            <p className="text-base md:text-lg text-gray-700 mb-6">
              Choose a category that best fits your job.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Category dropdown */}
              <div>
                <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
                  Category *
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-4 py-3 text-lg"
                  aria-label="Category"
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {Object.keys(CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory — text input for "Other", dropdown otherwise */}
              <div>
                <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
                  Subcategory *
                </label>

                {isCustomSubcategory ? (
                  /* ── FREE-TEXT INPUT ── */
                  <div className="flex gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      placeholder="Type your subcategory..."
                      className="w-full border border-gray-300 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:rtext-gray-700 "
                    />
                    {/* Only show back button if category is NOT "Other" (i.e. came from __custom__ option) */}
                    {formData.category !== "Other" && (
                      <button
                        type="button"
                        title="Back to dropdown"
                        onClick={() => {
                          setIsCustomSubcategory(false);
                          setFormData({ ...formData, subcategory: "" });
                        }}
                        className="text-gray-500 hover:text-gray-700 px-3 font-bold text-xl border border-gray-300 rounded"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ) : (
                  /* ── DROPDOWN ── */
                  <select
                    className="w-full border border-gray-300 rounded px-4 py-3 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                    aria-label="Subcategory"
                    value={formData.subcategory}
                    disabled={!formData.category}
                    onChange={(e) => handleSubcategoryChange(e.target.value)}
                  >
                    <option value="">
                      {formData.category ? "Select a subcategory" : "Select category first"}
                    </option>
                    {subcategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                    {/* Extra option for any non-Other category */}
                    {formData.category && formData.category !== "Other" && (
                      <option value="__custom__">✏️ Type my own subcategory...</option>
                    )}
                  </select>
                )}

                {/* Helper text when "Other" category is selected */}
                {formData.category === "Other" && (
                  <p className="mt-1 text-sm text-gray-500">
                    Please describe your subcategory in the box above.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* JOB TITLE */}
          <section className="mb-12">
            <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
              Job title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Example: Build a responsive website"
              className="w-full border border-gray-300 rounded px-4 py-3 text-lg"
            />
          </section>

          {/* JOB DESCRIPTION */}
          <section className="mb-12">
            <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
              Job description *
            </label>
            <textarea
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project, deliverables, timeline..."
              className="w-full border border-gray-300 rounded px-4 py-3 text-lg resize-none"
            />
          </section>

          {/* UPLOAD SAMPLES */}
          <section className="mb-12">
            <label className="block font-semibold uppercase text-gray-600 mb-3 text-sm">
              Upload samples or helpful material <span className="text-gray-400 font-normal normal-case text-xs">(optional — JPEG, PNG, PDF · max 5MB each)</span>
            </label>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files); }}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${isDragging
                ? 'border-blue-500 bg-blue-50 scale-[1.01]'
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                  <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Drag &amp; drop files here</p>
                <p className="text-gray-400 text-sm">or</p>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Browse Files
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,application/pdf"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  />
                </label>
              </div>
            </div>

            {/* Upload error */}
            {uploadError && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {uploadError}
              </p>
            )}

            {/* Uploading progress bars */}
            {uploadingFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {uploadingFiles.map((f, i) => (
                  <div key={i} className="bg-white border border-blue-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-700 truncate max-w-[80%]">{f.name}</span>
                      <span className="text-xs font-bold text-blue-600">{f.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-150"
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline truncate max-w-[180px]">{f.name}</a>
                    <button
                      type="button"
                      onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-green-500 hover:text-red-500 transition-colors ml-1"
                      title="Remove"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* BUDGET */}
          <section className="mb-14">
            <label className="block font-semibold uppercase text-gray-600 mb-4 text-sm">
              Budget * <span className="text-gray-400 text-xs font-normal">(minimum {currencySymbol}500)</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <select
                className="border border-gray-300 rounded px-4 py-3 text-lg"
                value={formData.budgetType}
                onChange={(e) => setFormData({ ...formData, budgetType: e.target.value })}
              >
                <option>Fixed</option>
                <option>Hourly</option>
              </select>
              <select
                className="border border-gray-300 rounded px-4 py-3 text-lg"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option>USD</option>
                <option>INR</option>
                <option>GBP</option>
                <option>EUR</option>
              </select>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                placeholder="e.g. 500"
                className="border border-gray-300 rounded px-4 py-3 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </section>

          {/* VISIBILITY */}
          <section className="mb-14">
            <label className="block font-semibold uppercase text-gray-600 mb-3 text-sm">
              Job visibility
            </label>
            <div className="space-y-3 text-lg text-gray-700">
              <label className="flex gap-3 items-center">
                <input
                  type="radio"
                  className="accent-blue-600"
                  checked={formData.visibility === "public"}
                  onChange={() => setFormData({ ...formData, visibility: "public" })}
                />
                Public – Anyone can find this job
              </label>
              <label className="flex gap-3 items-center">
                <input
                  type="radio"
                  className="accent-blue-600"
                  checked={formData.visibility === "private"}
                  onChange={() => setFormData({ ...formData, visibility: "private" })}
                />
                Private – Only freelancers you invite
              </label>
            </div>
          </section>

          {/* FEATURED JOB BOOST */}
          <section className="mb-14">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-orange-500 text-base">⚡</span>
              <label className="block font-semibold uppercase text-gray-600 text-sm">
                Boost Your Job
              </label>
            </div>
            <div
              onClick={() => setIsFeatured((v) => !v)}
              className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${isFeatured
                ? "border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm"
                : "border-gray-200 bg-gray-50 hover:border-orange-200 hover:bg-orange-50/30"
                }`}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left: Toggle + text */}
                <div className="flex items-center gap-3">
                  {/* Custom toggle */}
                  <div
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${isFeatured ? "bg-orange-500" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isFeatured ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-base">
                      Feature this job on top for 24 hours
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Pin your job at the top of search results so top freelancers see it first
                    </p>
                  </div>
                </div>
                {/* Right: Fee badge */}
                {formData.budget && Number(formData.budget) >= 500 && (
                  <div className="flex-shrink-0 text-right">
                    <span
                      className={`inline-flex flex-col items-center px-3 py-1.5 rounded-lg font-bold text-sm transition-all duration-200 ${isFeatured
                        ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                        : "bg-orange-100 text-orange-600"
                        }`}
                    >
                      <span className="text-[10px] font-semibold opacity-80 uppercase tracking-wide">
                        Featured Fee
                      </span>
                      <span className="text-base">
                        {currencySymbol}{(Number(formData.budget) * 0.02).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* GET TO KNOW YOUR FREELANCERS */}
          <section className="mb-12">
            <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
              Get to know your freelancers{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            {formData.questions.map((question, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  className="w-full border border-gray-300 rounded px-4 py-3 text-lg"
                  aria-label={`Question ${index + 1}`}
                  list={`question-options-${index}`}
                  value={question}
                  placeholder="Type your question or select from the list"
                  onChange={(e) => updateQuestion(index, e.target.value)}
                />
                <datalist id={`question-options-${index}`}>
                  {questionOptions
                    .filter((opt) => opt !== "Select an interview question")
                    .map((option) => (
                      <option key={option} value={option} />
                    ))}
                </datalist>
                {formData.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-500 hover:text-red-700 px-2 font-bold text-xl"
                    title="Remove question"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="mt-3 text-blue-600 text-sm font-medium hover:underline"
            >
              + Add another question
            </button>
          </section>

          {/* ESTIMATED PROJECT DURATION */}
          <section className="mb-14">
            <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
              Estimated project duration *
            </label>
            <select
              className="w-full border border-gray-300 rounded px-4 py-3 text-lg"
              aria-label="Project duration"
              value={formData.projectDuration || ""}
              onChange={(e) => setFormData({ ...formData, projectDuration: e.target.value })}
            >
              <option value="">Select</option>
              <option value="Less than 1 week">Less than 1 week</option>
              <option value="1 to 2 weeks">1 to 2 weeks</option>
              <option value="2 to 4 weeks">2 to 4 weeks</option>
              <option value="1 to 3 months">1 to 3 months</option>
              <option value="3+ months">3+ months</option>
            </select>
          </section>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* PAYMENT PREFERENCE */}
          <section className="mb-14">
            <label className="block font-semibold uppercase text-gray-600 mb-3 text-sm">
              Payment Preference
            </label>
            <div className="space-y-3 text-lg text-gray-700">
              <label
                className={`flex gap-3 items-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${!payLater ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  className="accent-blue-600 w-5 h-5"
                  checked={!payLater}
                  onChange={() => setPayLater(false)}
                />
                <div>
                  <p className="font-semibold text-gray-900">Pay Now</p>
                  <p className="text-sm text-gray-500 mt-0.5">Fund the escrow and pay all fees immediately. Your job will be fully live and ready to assign.</p>
                </div>
              </label>
              <label
                className={`flex gap-3 items-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${payLater ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  className="accent-blue-600 w-5 h-5"
                  checked={payLater}
                  onChange={() => setPayLater(true)}
                />
                <div>
                  <p className="font-semibold text-gray-900">Pay Later</p>
                  <p className="text-sm text-gray-500 mt-0.5">Post the job now with $0 due (except featured fee, if selected). Fund the escrow only when you are ready to assign a freelancer.</p>
                </div>
              </label>
            </div>
          </section>

          {/* PAYMENT SUMMARY */}
          {formData.budget && Number(formData.budget) >= 500 && (
            <div className="mb-6 overflow-hidden rounded-xl border border-blue-200 shadow-sm">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 flex items-center gap-2">
                <span className="text-white text-sm">💳</span>
                <p className="text-sm font-bold text-white tracking-wide uppercase">Payment Summary</p>
              </div>
              {/* Rows */}
              <div className="bg-white divide-y divide-gray-100">
                {/* Job Budget */}
                <div className="flex justify-between items-center px-5 py-3 text-sm text-gray-700">
                  <span className="font-medium">Job Budget <span className="text-xs text-gray-400 font-normal">{payLater ? '(Deferred to Assignment)' : ''}</span></span>
                  <span className={`font-semibold ${payLater ? 'line-through text-gray-400' : ''}`}>{currencySymbol}{Number(formData.budget).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                {/* Platform Fee */}
                <div className="flex justify-between items-center px-5 py-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
                    Platform Fee <span className="text-xs text-gray-400">(2%) {payLater ? ' (Deferred)' : ''}</span>
                  </span>
                  <span className={payLater ? 'line-through text-gray-400' : ''}>{currencySymbol}{(Number(formData.budget) * 0.02).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                {/* Featured Fee — only when isFeatured */}
                {isFeatured && (
                  <div className="flex justify-between items-center px-5 py-3 text-sm bg-orange-50/60">
                    <span className="flex items-center gap-1.5 text-orange-700 font-medium">
                      <span className="text-base">⚡</span>
                      Featured Fee <span className="text-xs text-orange-400 font-normal">(2% · 24h boost)</span>
                    </span>
                    <span className="font-semibold text-orange-600">{currencySymbol}{(Number(formData.budget) * 0.02).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {/* Due Later Note */}
                {payLater && (
                  <div className="flex justify-between items-center px-5 py-3 text-sm bg-gray-50 border-t border-gray-200">
                    <span className="font-medium text-gray-600">Due at Assignment (Escrow Deposit)</span>
                    <span className="font-semibold text-gray-800">{currencySymbol}{(Number(formData.budget) * 1.02).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {/* Total */}
                <div className="flex justify-between items-center px-5 py-3.5 bg-blue-50">
                  <span className="font-bold text-blue-900 text-sm">Total Payable Now</span>
                  <span className="font-extrabold text-blue-900 text-base">
                    {currencySymbol}{getTotalPayableNow().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {walletBalance !== null && (!payLater || isFeatured) && (
                <div className="border-t border-blue-100 bg-white px-5 py-4">
                  <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Your Wallet Balance</p>
                        <p className="font-bold text-blue-900">₹{walletBalance.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    {walletBalance >= getTotalPayableNow() ? (
                      <button
                        type="button"
                        onClick={handleWalletPayment}
                        disabled={loading || walletLoading || splitLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-md transition shadow-sm disabled:opacity-50"
                      >
                        {walletLoading ? "Processing..." : "Pay via Wallet"}
                      </button>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded">Insufficient Balance</span>
                        <button
                          type="button"
                          onClick={handleSplitPayment}
                          disabled={loading || splitLoading || walletLoading}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2 py-1.5 rounded transition shadow-sm whitespace-nowrap disabled:opacity-50"
                        >
                          {splitLoading ? "Processing..." : "Use Wallet + Card"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-4 mt-10">
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-lg px-10 py-4 rounded-md transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-lg px-10 py-4 rounded-md transition"
            >
              Preview Job
            </button>
            <button
              type="button"
              onClick={handlePostJob}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-12 py-4 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Post job"}
            </button>
          </div>

        </div>
      </div >
      <FooterSection />
      {/* MODALS */}
      {
        showWalletConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Confirm Wallet Payment</h3>
              <p className="text-center text-gray-600 mb-8">
                You are about to pay <span className="font-bold text-gray-900">₹{getTotalPayableNow().toLocaleString("en-IN")}</span> directly from your HireHub Wallet.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWalletConfirm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmWalletPayment}
                  disabled={walletLoading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {walletLoading ? "Processing..." : "Confirm & Pay"}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {
        showSplitConfirm && splitData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Confirm Split Payment</h3>
              <div className="bg-gray-50 rounded-xl p-4 mb-8 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">From Wallet</span>
                  <span className="font-bold text-gray-900">₹{splitData.walletPart.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">From Card/UPI</span>
                  <span className="font-bold text-blue-600">₹{splitData.rzpPart.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{getTotalPayableNow().toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSplitConfirm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={confirmSplitPayment}
                  disabled={splitLoading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {splitLoading ? "Processing..." : "Confirm Split"}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {
        showSplitNext && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Step 1 Successful!</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-600 font-medium">Wallet Contribution:</span>
                  <span className="text-emerald-600 font-bold">₹{splitData?.walletPart.toLocaleString()}</span>
                </div>
                <p className="text-gray-600 text-center px-2">
                  Your wallet balance has been verified. To complete job posting, please pay the remaining amount via your preferred card or UPI.
                </p>
                <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <span className="text-gray-700 font-semibold">Remaining Amount:</span>
                  <span className="text-blue-700 font-bold text-lg">₹{splitData?.rzpPart.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={proceedToRazorpay}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:opacity-90 transition shadow-lg shadow-blue-100 active:scale-95"
              >
                Proceed to Card Payment
              </button>
            </div>
          </div>
        )
      }

      {
        showWalletSuccess && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl text-center animate-in slide-in-from-bottom-10 duration-500">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 mx-auto scale-110">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
                  <svg className="w-10 h-10 text-emerald-500 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Job Posted!</h3>
              <p className="text-gray-500 mb-8 leading-relaxed px-4">
                Your payment was confirmed and your job is now live for freelancers to see.
              </p>
              <button
                onClick={() => router.push("/client-dashboard")}
                className="w-full py-4 bg-[#0a0a0a] text-white rounded-2xl font-bold text-lg hover:opacity-90 transition shadow-xl active:scale-95"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )
      }
    </>
  );
}

export default function PostJobPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PostJobContent />
    </Suspense>
  );
}