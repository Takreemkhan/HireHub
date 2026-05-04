
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// // Brand colors: Primary #1B365D | Secondary #2E5984 | Accent #FF6B35

// interface ProfileData {
//   name: string; title: string; location: string; hourlyRate: number; availability: string;
//   bio: string; skills: string[];
//   languages: { name: string; level: string; width: string }[];
//   experience: { title: string; company: string; period: string }[];
//   education: { degree: string; school: string; period: string }[];
//   certifications: { name: string; issuer: string }[];
//   portfolio: { title: string; src: string }[];
//   contact: { email: string; phone: string; website: string; linkedin: string; github: string };
// }

// const defaultData: ProfileData = {
//   name: "Sarah Chen", title: "Senior Full-Stack Developer & UI/UX Designer",
//   location: "San Francisco, CA", hourlyRate: 85, availability: "Available now",
//   bio: "I'm a passionate full-stack developer with over 8 years of experience building web applications. I specialize in React, Node.js, and cloud technologies. My approach combines technical expertise with a keen eye for design, creating user-friendly solutions that drive business results.\n\nI've worked with startups and Fortune 500 companies, delivering projects on time and exceeding expectations. I believe in clean code, thorough testing, and clear communication throughout the development process.",
//   skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "GraphQL", "PostgreSQL", "MongoDB", "Docker", "Figma", "UI/UX Design"],
//   languages: [
//     { name: "English", level: "Native", width: "100%" },
//     { name: "Spanish", level: "Fluent", width: "85%" },
//     { name: "Mandarin", level: "Basic", width: "30%" },
//   ],
//   experience: [
//     { title: "Senior Software Engineer", company: "Google", period: "Jan 2021 - Present • 3 years" },
//     { title: "Full-Stack Developer", company: "Amazon", period: "Mar 2018 - Dec 2020 • 2 years 10 months" },
//     { title: "Frontend Developer", company: "Tech Startup", period: "Jun 2015 - Feb 2018 • 2 years 9 months" },
//   ],
//   education: [
//     { degree: "M.S. Computer Science", school: "Stanford University", period: "2013 - 2015" },
//     { degree: "B.S. Computer Science", school: "UC Berkeley", period: "2009 - 2013" },
//   ],
//   certifications: [
//     { name: "AWS Solutions Architect", issuer: "Amazon • 2023" },
//     { name: "Google Cloud Professional", issuer: "Google • 2022" },
//     { name: "Meta Frontend Expert", issuer: "Meta • 2021" },
//   ],
//   portfolio: [
//     { title: "E-commerce Platform", src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop" },
//     { title: "Analytics Dashboard", src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop" },
//     { title: "Mobile Banking App", src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop" },
//   ],
//   contact: { email: "sarah@example.com", phone: "+1 (555) 123-4567", website: "sarahchen.dev", linkedin: "linkedin.com/in/sarahchen", github: "github.com/sarahchen" },
// };

// // Reusable right-sidebar card
// function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
//       <h3 className="text-sm font-bold mb-4 pb-2 border-b border-gray-100" style={{ color: "#1B365D" }}>{title}</h3>
//       {children}
//     </div>
//   );
// }

// // Reusable main section card
// function Section({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
//       <h2 className="text-base font-bold mb-4 pb-2 border-b border-gray-100" style={{ color: "#1B365D" }}>{title}</h2>
//       {children}
//     </div>
//   );
// }

// const inp = "border border-blue-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 w-full";

// export default function Profile() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [data, setData] = useState<ProfileData>(defaultData);
//   const [saved, setSaved] = useState<ProfileData>(defaultData);
//   const [newSkill, setNewSkill] = useState("");
//   const router = useRouter();

//   const update = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) =>
//     setData((prev) => ({ ...prev, [key]: value }));
//   const save = () => { setSaved(data); setIsEditing(false); };
//   const cancel = () => { setData(saved); setIsEditing(false); };
//   const addSkill = () => { if (newSkill.trim()) { update("skills", [...data.skills, newSkill.trim()]); setNewSkill(""); } };

//   return (
//     /**
//      * KEY LAYOUT RULE (matching image 3 / Overview page):
//      * - The component is rendered inside the dashboard layout which already has a left sidebar.
//      * - We use w-full + min-h-screen with NO max-w centering — content fills 100% of remaining space.
//      * - Horizontal padding: px-6 everywhere (same as Overview).
//      * - The cover banner is a direct child with NO px padding so it bleeds edge-to-edge.
//      */
//     <div className="w-full min-h-screen" style={{ backgroundColor: "#FAFBFC" }}>

//       {/* ─── Page Title Row (like "Welcome back" in Overview) ─── */}
//       <div className="w-full px-6 pt-6 pb-4 flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold" style={{ color: "#1B365D" }}>My Profile</h1>
//           <p className="text-sm text-gray-500 mt-0.5">Manage how clients see you</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => router.push("/freelancer-dashboard/freelancer-profile-preview")}
//             className="flex items-center gap-2 px-4 py-2 border text-sm font-medium rounded-lg transition hover:bg-gray-50"
//             style={{ borderColor: "#2E5984", color: "#2E5984" }}
//           >
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//             </svg>
//             Preview as Client
//           </button>
//           {isEditing ? (
//             <>
//               <button onClick={cancel} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
//               <button onClick={save} className="px-5 py-2 text-white rounded-lg text-sm font-semibold transition" style={{ backgroundColor: "#FF6B35" }}>Save Changes</button>
//             </>
//           ) : (
//             <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2 text-white rounded-lg text-sm font-semibold transition" style={{ backgroundColor: "#FF6B35" }}>
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//               </svg>
//               Edit Profile
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Edit mode info strip — full bleed */}
//       {isEditing && (
//         <div className="w-full px-6 py-2.5 text-sm flex items-center gap-2 mb-2" style={{ backgroundColor: "#EBF4FF", color: "#2E5984", borderTop: "1px solid #BFDBFE", borderBottom: "1px solid #BFDBFE" }}>
//           <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           You&apos;re in edit mode — update any field below, then save when done.
//         </div>
//       )}

//       {/* ─── COVER BANNER — full bleed, no side padding, no card wrapper ─── */}
//       <div className="w-full h-36 relative" style={{ background: "linear-gradient(135deg, #1B365D 0%, #2E5984 55%, #FF6B35 100%)" }}>
//         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }} />
//         {isEditing && (
//           <button className="absolute bottom-3 right-6 bg-black/30 hover:bg-black/50 text-white px-3 py-1.5 rounded-lg text-xs backdrop-blur-sm transition flex items-center gap-1.5">
//             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//             </svg>
//             Edit Cover
//           </button>
//         )}
//       </div>

//       {/* ─── PROFILE INFO ROW — px-6, pulls avatar up over cover ─── */}
//       <div className="w-full bg-white border-b border-gray-100 shadow-sm px-6 pb-5 mt-10"
//       >
//         <div className="flex flex-col lg:flex-row lg:items-end gap-5 -mt-10 pt-0">
//           {/* Avatar */}
//           <div className="relative w-20 h-20 flex-shrink-0">
//             <div className="w-20 h-20 rounded-xl border-4 border-white shadow-lg overflow-hidden bg-gray-200">
//               <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face" alt="Profile" width={80} height={80} className="w-full h-full object-cover" />
//             </div>
//             <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
//             {isEditing && (
//               <button className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition">
//                 <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                 </svg>
//               </button>
//             )}
//           </div>

//           {/* Name / Title */}
//           <div className="flex-1 min-w-0">
//             {isEditing ? (
//               <div className="space-y-2 pt-2">
//                 <input value={data.name} onChange={(e) => update("name", e.target.value)} className={inp + " text-base font-bold"} placeholder="Full Name" />
//                 <input value={data.title} onChange={(e) => update("title", e.target.value)} className={inp} placeholder="Professional Title" />
//                 <div className="flex gap-2 flex-wrap">
//                   <input value={data.location} onChange={(e) => update("location", e.target.value)} placeholder="Location" className="border border-blue-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 w-40" />
//                   <select value={data.availability} onChange={(e) => update("availability", e.target.value)} className="border border-blue-200 rounded-lg px-2 py-1 text-xs focus:outline-none bg-blue-50">
//                     <option>Available now</option><option>Open to offers</option><option>Not available</option>
//                   </select>
//                 </div>
//               </div>
//             ) : (
//               <div className="pt-3">
//                 <h2 className="text-xl font-bold" style={{ color: "#1B365D" }}>{data.name}</h2>
//                 <p className="text-sm text-gray-600 mt-0.5">{data.title}</p>
//                 <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-gray-500">
//                   <span className="flex items-center gap-1">
//                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
//                     {data.location}
//                   </span>
//                   <span className="flex items-center gap-1 font-medium text-green-600">
//                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />{data.availability}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     {[1,2,3,4,5].map(i => <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
//                     <span className="ml-1 font-medium text-gray-600">4.9 (127 reviews)</span>
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Rate + actions */}
//           <div className="flex items-center gap-4 flex-shrink-0">
//             <div className="text-right">
//               {isEditing ? (
//                 <div className="flex items-center gap-1 justify-end">
//                   <span className="text-gray-400 text-sm">$</span>
//                   <input type="number" value={data.hourlyRate} onChange={(e) => update("hourlyRate", Number(e.target.value))} className="w-20 text-xl font-bold text-center border border-blue-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50" style={{ color: "#FF6B35" }} />
//                   <span className="text-gray-400 text-sm">/hr</span>
//                 </div>
//               ) : (
//                 <div className="text-2xl font-bold" style={{ color: "#FF6B35" }}>
//                   ${data.hourlyRate}<span className="text-sm font-normal text-gray-400">/hr</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Completeness bar — full width within white strip */}
//         {!isEditing && (
//           <div className="mt-4 rounded-lg p-3 flex items-center justify-between" style={{ backgroundColor: "#EBF4FF" }}>
//             <div className="flex-1 mr-4">
//               <div className="flex justify-between text-xs mb-1.5">
//                 <span className="font-medium" style={{ color: "#1B365D" }}>Profile Completeness</span>
//                 <span className="font-bold" style={{ color: "#FF6B35" }}>87%</span>
//               </div>
//               <div className="h-2 rounded-full" style={{ backgroundColor: "#BFDBFE" }}>
//                 <div className="h-2 rounded-full" style={{ width: "87%", backgroundColor: "#FF6B35" }} />
//               </div>
//             </div>
//             <span className="text-xs font-medium whitespace-nowrap" style={{ color: "#2E5984" }}>Add portfolio to reach 100%</span>
//           </div>
//         )}
//       </div>

//       {/* ─── MAIN CONTENT GRID — px-6, full width, two-column ─── */}
//       <div className="w-full px-6 py-6">
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

//           {/* ══ LEFT COLUMN ══ */}
//           <div className="xl:col-span-2 space-y-5">

//             <Section title="About Me">
//               {isEditing ? (
//                 <textarea value={data.bio} onChange={(e) => update("bio", e.target.value)} className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 resize-none leading-relaxed" rows={6} placeholder="Tell clients about yourself..." />
//               ) : (
//                 <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{data.bio}</p>
//               )}
//             </Section>

//             <Section title="Skills">
//               <div className="flex flex-wrap gap-2">
//                 {data.skills.map((skill, idx) => (
//                   <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border" style={{ backgroundColor: "#EBF4FF", color: "#1B365D", borderColor: "#BFDBFE" }}>
//                     {skill}
//                     {isEditing && (
//                       <button onClick={() => update("skills", data.skills.filter((_, i) => i !== idx))} className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-xs hover:bg-red-400 hover:text-white transition" style={{ backgroundColor: "#BFDBFE", color: "#1B365D" }}>×</button>
//                     )}
//                   </span>
//                 ))}
//                 {isEditing && (
//                   <div className="flex items-center gap-1.5">
//                     <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} placeholder="Add skill..." className="border border-dashed border-blue-300 rounded-full px-3 py-1.5 text-sm focus:outline-none bg-blue-50 w-28" />
//                     <button onClick={addSkill} className="text-white w-7 h-7 rounded-full text-lg flex items-center justify-center" style={{ backgroundColor: "#FF6B35" }}>+</button>
//                   </div>
//                 )}
//               </div>
//             </Section>

//             <Section title="Work Experience">
//               <div className="space-y-5">
//                 {data.experience.map((exp, idx) => (
//                   <div key={idx} className="flex gap-3 items-start">
//                     <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#EBF4FF" }}>
//                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#2E5984" }}>
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                     </div>
//                     <div className="flex-1">
//                       {isEditing ? (
//                         <div className="space-y-1.5">
//                           <input value={exp.title} onChange={(e) => { const u = [...data.experience]; u[idx] = { ...exp, title: e.target.value }; update("experience", u); }} className={inp + " font-semibold"} placeholder="Job Title" />
//                           <input value={exp.company} onChange={(e) => { const u = [...data.experience]; u[idx] = { ...exp, company: e.target.value }; update("experience", u); }} className={inp} placeholder="Company" />
//                           <input value={exp.period} onChange={(e) => { const u = [...data.experience]; u[idx] = { ...exp, period: e.target.value }; update("experience", u); }} className="border border-blue-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none bg-blue-50 w-full" placeholder="e.g. Jan 2021 - Present" />
//                         </div>
//                       ) : (
//                         <>
//                           <p className="text-sm font-semibold" style={{ color: "#1B365D" }}>{exp.title}</p>
//                           <p className="text-sm font-medium" style={{ color: "#2E5984" }}>{exp.company}</p>
//                           <p className="text-xs text-gray-400 mt-0.5">{exp.period}</p>
//                         </>
//                       )}
//                     </div>
//                     {isEditing && (
//                       <button onClick={() => update("experience", data.experience.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-400 transition mt-1">
//                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//                       </button>
//                     )}
//                   </div>
//                 ))}
//                 {isEditing && (
//                   <button onClick={() => update("experience", [...data.experience, { title: "", company: "", period: "" }])} className="text-sm font-medium flex items-center gap-1.5" style={{ color: "#FF6B35" }}>
//                     <span className="text-lg">+</span> Add Experience
//                   </button>
//                 )}
//               </div>
//             </Section>

//             <Section title="Education">
//               <div className="space-y-5">
//                 {data.education.map((edu, idx) => (
//                   <div key={idx} className="flex gap-3 items-start">
//                     <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
//                       </svg>
//                     </div>
//                     <div className="flex-1">
//                       {isEditing ? (
//                         <div className="space-y-1.5">
//                           <input value={edu.degree} onChange={(e) => { const u = [...data.education]; u[idx] = { ...edu, degree: e.target.value }; update("education", u); }} className={inp + " font-semibold"} placeholder="Degree" />
//                           <input value={edu.school} onChange={(e) => { const u = [...data.education]; u[idx] = { ...edu, school: e.target.value }; update("education", u); }} className={inp} placeholder="Institution" />
//                           <input value={edu.period} onChange={(e) => { const u = [...data.education]; u[idx] = { ...edu, period: e.target.value }; update("education", u); }} className="border border-blue-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none bg-blue-50 w-full" placeholder="e.g. 2013 - 2015" />
//                         </div>
//                       ) : (
//                         <>
//                           <p className="text-sm font-semibold" style={{ color: "#1B365D" }}>{edu.degree}</p>
//                           <p className="text-sm text-gray-600">{edu.school}</p>
//                           <p className="text-xs text-gray-400 mt-0.5">{edu.period}</p>
//                         </>
//                       )}
//                     </div>
//                     {isEditing && (
//                       <button onClick={() => update("education", data.education.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-400 transition mt-1">
//                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//                       </button>
//                     )}
//                   </div>
//                 ))}
//                 {isEditing && (
//                   <button onClick={() => update("education", [...data.education, { degree: "", school: "", period: "" }])} className="text-sm font-medium flex items-center gap-1.5" style={{ color: "#FF6B35" }}>
//                     <span className="text-lg">+</span> Add Education
//                   </button>
//                 )}
//               </div>
//             </Section>

//             <Section title="Portfolio">
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                 {data.portfolio.map((item, idx) => (
//                   <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
//                     <Image src={item.src} alt={item.title} width={300} height={300} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
//                       <p className="text-white text-xs font-medium truncate">{item.title}</p>
//                     </div>
//                     {isEditing && (
//                       <button onClick={() => update("portfolio", data.portfolio.filter((_, i) => i !== idx))} className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">×</button>
//                     )}
//                   </div>
//                 ))}
//                 {isEditing && (
//                   <div className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition" style={{ borderColor: "#2E5984" }}>
//                     <svg className="w-7 h-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#2E5984" }}>
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                     <span className="text-xs font-medium" style={{ color: "#2E5984" }}>Add Work</span>
//                   </div>
//                 )}
//               </div>
//             </Section>
//           </div>

//           {/* ══ RIGHT SIDEBAR ══ */}
//           <div className="space-y-5">

//             <SideCard title="Quick Stats">
//               <div className="space-y-3">
//                 {[
//                   { label: "Response Time", value: "< 1 hour", icon: "⚡" },
//                   { label: "Jobs Completed", value: "156", icon: "✅" },
//                   { label: "Ongoing Projects", value: "3", icon: "🔄" },
//                   { label: "Total Earnings", value: "$185K+", icon: "💰" },
//                   { label: "Member Since", value: "Jan 2018", icon: "📅" },
//                 ].map((s) => (
//                   <div key={s.label} className="flex items-center justify-between text-sm">
//                     <span className="text-gray-500 flex items-center gap-1.5">{s.icon} {s.label}</span>
//                     <span className="font-semibold" style={{ color: "#1B365D" }}>{s.value}</span>
//                   </div>
//                 ))}
//               </div>
//             </SideCard>

//             <SideCard title="Languages">
//               <div className="space-y-3">
//                 {data.languages.map((lang, idx) => (
//                   <div key={idx}>
//                     <div className="flex justify-between text-xs mb-1.5">
//                       {isEditing ? (
//                         <>
//                           <input value={lang.name} onChange={(e) => { const u = [...data.languages]; u[idx] = { ...lang, name: e.target.value }; update("languages", u); }} className="border border-blue-200 rounded px-1.5 py-0.5 text-xs w-20 focus:outline-none bg-blue-50" />
//                           <select value={lang.level} onChange={(e) => { const u = [...data.languages]; u[idx] = { ...lang, level: e.target.value }; update("languages", u); }} className="border border-blue-200 rounded px-1.5 py-0.5 text-xs focus:outline-none bg-blue-50">
//                             <option>Native</option><option>Fluent</option><option>Intermediate</option><option>Basic</option>
//                           </select>
//                         </>
//                       ) : (
//                         <><span className="text-gray-600">{lang.name}</span><span className="font-semibold" style={{ color: "#1B365D" }}>{lang.level}</span></>
//                       )}
//                     </div>
//                     <div className="h-2 rounded-full" style={{ backgroundColor: "#EBF4FF" }}>
//                       <div className="h-2 rounded-full" style={{ width: lang.width, backgroundColor: "#FF6B35" }} />
//                     </div>
//                   </div>
//                 ))}
//                 {isEditing && (
//                   <button onClick={() => update("languages", [...data.languages, { name: "", level: "Basic", width: "20%" }])} className="text-xs font-medium flex items-center gap-1 mt-1" style={{ color: "#FF6B35" }}>+ Add Language</button>
//                 )}
//               </div>
//             </SideCard>

//             <SideCard title="Certifications">
//               <div className="space-y-3">
//                 {data.certifications.map((cert, idx) => (
//                   <div key={idx} className="flex items-center gap-2.5">
//                     <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EBF4FF" }}>
//                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#2E5984" }}>
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                       </svg>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       {isEditing ? (
//                         <>
//                           <input value={cert.name} onChange={(e) => { const u = [...data.certifications]; u[idx] = { ...cert, name: e.target.value }; update("certifications", u); }} className="border border-blue-200 rounded px-1.5 py-0.5 text-xs font-medium w-full focus:outline-none bg-blue-50 mb-1 block" />
//                           <input value={cert.issuer} onChange={(e) => { const u = [...data.certifications]; u[idx] = { ...cert, issuer: e.target.value }; update("certifications", u); }} className="border border-blue-200 rounded px-1.5 py-0.5 text-xs w-full focus:outline-none bg-blue-50 block" />
//                         </>
//                       ) : (
//                         <>
//                           <p className="text-xs font-semibold truncate" style={{ color: "#1B365D" }}>{cert.name}</p>
//                           <p className="text-xs text-gray-500">{cert.issuer}</p>
//                         </>
//                       )}
//                     </div>
//                     {isEditing && (
//                       <button onClick={() => update("certifications", data.certifications.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-400 transition">
//                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//                       </button>
//                     )}
//                   </div>
//                 ))}
//                 {isEditing && (
//                   <button onClick={() => update("certifications", [...data.certifications, { name: "", issuer: "" }])} className="text-xs font-medium flex items-center gap-1 mt-1" style={{ color: "#FF6B35" }}>+ Add Certification</button>
//                 )}
//               </div>
//             </SideCard>

//             <SideCard title="Contact Information">
//               <div className="space-y-2.5">
//                 {[
//                   { key: "email" as const, label: "Email", icon: "✉️" },
//                   { key: "phone" as const, label: "Phone", icon: "📞" },
//                   { key: "website" as const, label: "Website", icon: "🌐" },
//                   { key: "linkedin" as const, label: "LinkedIn", icon: "💼" },
//                   { key: "github" as const, label: "GitHub", icon: "💻" },
//                 ].map(({ key, label, icon }) => (
//                   <div key={key} className="flex items-center gap-2">
//                     <span className="text-base w-5 flex-shrink-0">{icon}</span>
//                     {isEditing ? (
//                       <input value={data.contact[key]} onChange={(e) => update("contact", { ...data.contact, [key]: e.target.value })} placeholder={label} className="border border-blue-200 rounded-lg px-2 py-1 text-xs w-full focus:outline-none bg-blue-50" />
//                     ) : (
//                       <span className="text-xs text-gray-600 truncate">{data.contact[key]}</span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </SideCard>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { MainLoader } from "@/components/Loader/Loader";
import ResumeVideoManager from "./ResumeVideoManager";

// Brand colors: Primary #1B365D | Secondary #2E5984 | Accent #FF6B35

/** API response shape for GET /api/freelancer/profile?userId=... */
interface ApiFreelancerProfile {
  name?: string;
  title?: string;
  location?: string;
  hourlyRate?: number;
  occupationTime?: string;
  responseTime?: string;
  about?: string;
  skills?: string[];
  completedJobs?: number;
  activeProjects?: number;
  totalEarned?: number;
  memberSince?: string;
  profileCompleteness?: number;
  image?: string;
  profileImage?: string;
  coverPhoto?: string;
  experience?: { title: string; company: string; period: string }[];
  workExperience?: { title: string; company: string; period: string }[];
  education?: { degree: string; school: string; period: string }[];
  certifications?: { name: string; issuer: string }[];
  portfolio?: { title: string; src: string }[];
  languages?: { name: string; level: string; width?: string }[];
  contact?: { email: string; phone: string; website: string; linkedin: string; github: string };
}

interface ProfileData {
  name: string; title: string; location: string; hourlyRate: number; availability: string;
  bio: string; skills: string[];
  languages: { name: string; level: string; width: string }[];
  experience: { title: string; company: string; period: string }[];
  education: { degree: string; school: string; period: string }[];
  certifications: { name: string; issuer: string }[];
  portfolio: { title: string; src: string }[];
  contact: { email: string; phone: string; website: string; linkedin: string; github: string };
}

const emptyProfileData: ProfileData = {
  name: "", title: "", location: "", hourlyRate: 0, availability: "Available now",
  bio: "", skills: [],
  languages: [
    { name: "English", level: "Native", width: "100%" },
    { name: "Spanish", level: "Fluent", width: "85%" },
    { name: "Mandarin", level: "Basic", width: "30%" },
  ],
  experience: [],
  education: [],
  certifications: [],
  portfolio: [],
  contact: { email: "", phone: "", website: "", linkedin: "", github: "" },
};

function apiProfileToForm(api: ApiFreelancerProfile | null): ProfileData {
  if (!api) return { ...emptyProfileData };
  const availability = api.occupationTime ?? api.responseTime ?? "Available now";
  const experience = api.workExperience ?? api.experience ?? [];
  const languages = api.languages ?? emptyProfileData.languages;
  const langWithWidth = languages.map((l) => ({
    name: l.name ?? "",
    level: l.level ?? "Basic",
    width: "width" in l && l.width ? l.width : "50%",
  }));
  return {
    ...emptyProfileData,
    name: api.name ?? "",
    title: api.title ?? "",
    location: api.location ?? "",
    hourlyRate: typeof api.hourlyRate === "number" ? api.hourlyRate : Number(api.hourlyRate) || 0,
    availability: typeof availability === "string" ? availability : "Available now",
    bio: api.about ?? "",
    skills: Array.isArray(api.skills) ? api.skills : [],
    experience: Array.isArray(experience) ? experience : [],
    education: Array.isArray(api.education) ? api.education : [],
    certifications: Array.isArray(api.certifications) ? api.certifications : [],
    portfolio: Array.isArray(api.portfolio) ? api.portfolio : [],
    languages: langWithWidth.length ? langWithWidth : emptyProfileData.languages,
    contact: api.contact && typeof api.contact === "object"
      ? { ...emptyProfileData.contact, ...api.contact }
      : emptyProfileData.contact,
  };
}

// Reusable right-sidebar card
function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-bold mb-4 pb-2 border-b border-gray-100" style={{ color: "#1B365D" }}>{title}</h3>
      {children}
    </div>
  );
}

// Bar width by language proficiency (dropdown value)
function languageLevelToWidth(level: string): string {
  switch (level) {
    case "Native": return "100%";
    case "Fluent": return "85%";
    case "Intermediate": return "60%";
    case "Basic": return "30%";
    default: return "30%";
  }
}

// Reusable main section card
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-bold mb-4 pb-2 border-b border-gray-100" style={{ color: "#1B365D" }}>{title}</h2>
      {children}
    </div>
  );
}

const inp = "border border-blue-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 w-full";

type ProfileProps = { onProfileImageChange?: (url: string | null) => void };

export default function Profile({ onProfileImageChange }: ProfileProps = {}) {
  const { data: session, status: sessionStatus } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const [data, setData] = useState<ProfileData>(emptyProfileData);
  const [saved, setSaved] = useState<ProfileData>(emptyProfileData);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStats, setApiStats] = useState<{ responseTime: string; jobsCompleted: number; ongoingProjects: number; totalEarnings: string; memberSince: string; profileCompleteness: number }>({
    responseTime: "< 1 hour",
    jobsCompleted: 0,
    ongoingProjects: 0,
    totalEarnings: "$0",
    memberSince: "—",
    profileCompleteness: 0,
  });
  const [profileImageFromApi, setProfileImageFromApi] = useState<string | null>(null);
  const [coverPhotoFromApi, setCoverPhotoFromApi] = useState<string | null>(null);
  const [profileImageLocal, setProfileImageLocal] = useState<string | null | undefined>(undefined);
  const [coverPhotoLocal, setCoverPhotoLocal] = useState<string | null | undefined>(undefined);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const portfolioImageInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // const searchParams = useSearchParams();
  //   const freelancerId = searchParams.get("userId") ?? "";


  //   const UserId = (freelancerId || userId) ?? "";
  const { data: freelancerSession, status: freelancerStatus } = useSession();
  const freelancerId = (freelancerSession?.user as { id?: string })?.id ?? null;
  console.log("freelancerId", freelancerId);
  useEffect(() => {
    setMounted(true);
  }, []);

  const userId = (session?.user as { id?: string })?.id ?? null;

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/freelancer/profile?userId=${encodeURIComponent(userId)}`, { credentials: "include" });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 404) {
          setData(emptyProfileData);
          setSaved(emptyProfileData);
          setApiStats((s) => ({ ...s, jobsCompleted: 0, ongoingProjects: 0, profileCompleteness: 0 }));
          return;
        }
        throw new Error(json.message || "Failed to load profile");
      }
      const profile = json.profile as ApiFreelancerProfile;
      const formData = apiProfileToForm(profile);
      setData(formData);
      setSaved(formData);
      setApiStats({
        responseTime: profile.occupationTime ?? profile.responseTime ?? "< 1 hour",
        jobsCompleted: profile.completedJobs ?? 0,
        ongoingProjects: profile.activeProjects ?? 0,
        totalEarnings: profile.totalEarned != null ? `$${Math.round(profile.totalEarned).toLocaleString()}` : "$0",
        memberSince: profile.memberSince ? new Date(profile.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—",
        profileCompleteness: typeof profile.profileCompleteness === "number" ? Math.min(100, Math.max(0, profile.profileCompleteness)) : 0,
      });
      const imgUrl = profile.profileImage ?? profile.image ?? null;
      setProfileImageFromApi(imgUrl);
      setCoverPhotoFromApi(profile.coverPhoto ?? null);
      onProfileImageChange?.(imgUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load profile");
      setData(emptyProfileData);
      setSaved(emptyProfileData);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated" || !userId) {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [sessionStatus, userId, fetchProfile]);


  const [isPlanActive, setIsPlanActive] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/freelancer/plans', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setIsPlanActive(d?.subscription?.isPlanActive ?? false))
      .catch(() => setIsPlanActive(false));
  }, []);

  const update = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));
  const cancel = () => {
    setData(saved);
    setIsEditing(false);
    setProfileImageLocal(undefined);
    setCoverPhotoLocal(undefined);
  };

  const readFileAsDataUrl = (file: File, callback: (dataUrl: string) => void) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setSaveInProgress(true);
    setError(null);
    try {
      const payload = {
        name: data.name,
        title: data.title,
        location: data.location,
        hourlyRate: Number(data.hourlyRate) || 0,
        occupationTime: data.availability,
        about: data.bio,
        skills: data.skills,
        workExperience: data.experience,
        experience: data.experience,
        education: data.education,
        certifications: data.certifications,
        portfolio: data.portfolio,
        languages: data.languages,
        contact: data.contact,
        profileImage: profileImageLocal === null ? "" : (profileImageLocal ?? profileImageFromApi ?? ""),
        coverPhoto: coverPhotoLocal === null ? "" : (coverPhotoLocal ?? coverPhotoFromApi ?? ""),
      };
      const res = await fetch("/api/freelancer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("You need to sign in to save your profile. Please sign in and try again.");
        }
        throw new Error(json.message || "Failed to save profile");
      }
      setSaved(data);
      setIsEditing(false);
      setProfileImageLocal(undefined);
      setCoverPhotoLocal(undefined);
      await fetchProfile();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save profile");
    } finally {
      setSaveInProgress(false);
    }
  };

  const addSkill = () => { if (newSkill.trim()) { update("skills", [...data.skills, newSkill.trim()]); setNewSkill(""); } };

  if (!mounted) {
    return (
      <div className="w-full min-h-screen" style={{ backgroundColor: "#FAFBFC" }}>
        <div className="w-full px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold" style={{ color: "#1B365D" }}>My Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage how clients see you</p>
        </div>
        <div className="w-full px-6 py-12 flex flex-col items-center justify-center gap-3 text-gray-500">
          <div className="w-8 h-8 border-2 border-blue-300 border-t-[#1B365D] rounded-full animate-spin" />
          <MainLoader
            name="Loading profile..."
          />

        </div>
      </div>
    );
  }

  return (
    /**
     * KEY LAYOUT RULE (matching image 3 / Overview page):
     * - The component is rendered inside the dashboard layout which already has a left sidebar.
     * - We use w-full + min-h-screen with NO max-w centering — content fills 100% of remaining space.
     * - Horizontal padding: px-6 everywhere (same as Overview).
     * - The cover banner is a direct child with NO px padding so it bleeds edge-to-edge.
     */
    <div className="w-full min-h-screen" style={{ backgroundColor: "#FAFBFC" }}>

      {/* ─── Page Title Row (like "Welcome back" in Overview) ─── */}
      <div className="w-full px-6 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1B365D" }}>My Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage how clients see you</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/freelancer-dashboard/freelancer-profile-preview")}
            className="flex items-center gap-2 px-4 py-2 border text-sm font-medium rounded-lg transition hover:bg-gray-50"
            style={{ borderColor: "#2E5984", color: "#2E5984" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview as Client
          </button>
          {isEditing ? (
            <>
              <button onClick={cancel} disabled={saveInProgress} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50">Cancel</button>
              <button onClick={save} disabled={saveInProgress} className="px-5 py-2 text-white rounded-lg text-sm font-semibold transition disabled:opacity-70" style={{ backgroundColor: "#FF6B35" }}>
                {saveInProgress ? "Saving…" : "Save Changes"}
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} disabled={loading} className="flex items-center gap-2 px-5 py-2 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50" style={{ backgroundColor: "#FF6B35" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="w-full px-6 py-3 flex items-center justify-between bg-red-50 border-b border-red-200 text-red-800 text-sm">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="text-red-600 hover:underline">Dismiss</button>
        </div>
      )}

      {sessionStatus === "unauthenticated" && (
        <div className="w-full px-6 py-8">
          <div className="max-w-md mx-auto rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="font-medium text-amber-900 mb-2">You need to sign in to view and edit your profile.</p>
            <p className="text-sm text-amber-800 mb-4">The &quot;Unauthorized - No valid token found&quot; error appears because saving your profile requires an active session.</p>
            <button
              type="button"
              onClick={() => router.push("/sign-in-page")}
              className="px-5 py-2.5 text-white rounded-lg font-medium transition"
              style={{ backgroundColor: "#FF6B35" }}
            >
              Sign in
            </button>
          </div>
        </div>
      )}

      {loading && (
        <MainLoader
          name="Loading profile..."
        />
      )}

      {!loading && sessionStatus !== "unauthenticated" && (
        <>
          {/* Edit mode info strip — full bleed */}
          {isEditing && (
            <div className="w-full px-6 py-2.5 text-sm flex items-center gap-2 mb-2" style={{ backgroundColor: "#EBF4FF", color: "#2E5984", borderTop: "1px solid #BFDBFE", borderBottom: "1px solid #BFDBFE" }}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              You&apos;re in edit mode — update any field below, then save when done.
            </div>
          )}

          {/* ─── COVER BANNER — loads from API; edit/update/delete via file picker ─── */}
          <input
            ref={coverImageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="Upload cover photo"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) readFileAsDataUrl(file, (url) => setCoverPhotoLocal(url));
              e.target.value = "";
            }}
          />
          <div
            className="w-full h-36 relative bg-cover bg-center"
            style={
              (coverPhotoLocal !== undefined ? (coverPhotoLocal || null) : coverPhotoFromApi)
                ? { backgroundImage: `url(${coverPhotoLocal !== undefined ? coverPhotoLocal : coverPhotoFromApi})` }
                : { background: "linear-gradient(135deg, #1B365D 0%, #2E5984 55%, #FF6B35 100%)" }
            }
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }} />
            {isEditing && (
              <div className="absolute bottom-3 right-6 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => coverImageInputRef.current?.click()}
                  className="bg-black/30 hover:bg-black/50 text-white px-3 py-1.5 rounded-lg text-xs backdrop-blur-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                  Edit Cover
                </button>
                {(coverPhotoFromApi || coverPhotoLocal) && (
                  <button
                    type="button"
                    onClick={() => setCoverPhotoLocal(null)}
                    className="bg-red-500/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs backdrop-blur-sm transition cursor-pointer"
                  >
                    Remove cover
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ─── PROFILE INFO ROW — avatar loads from API; edit/update/delete via file picker ─── */}
          <input
            ref={profileImageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="Upload profile photo"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) readFileAsDataUrl(file, (url) => {
                setProfileImageLocal(url);
                // Also update the dashboard sidebar immediately
                if (onProfileImageChange) onProfileImageChange(url);
              });
              e.target.value = "";
            }}
          />
          <div className="w-full bg-white border-b border-gray-100 shadow-sm px-6 pb-5 mt-10"
          >
            <div className="flex flex-col lg:flex-row lg:items-end gap-5 -mt-10 pt-0">
              {/* Avatar — no default photo: when removed, show empty placeholder only */}
              <div className="relative w-20 h-20 flex-shrink-0">
                {(() => {
                  const src = profileImageLocal !== undefined ? profileImageLocal ?? null : (profileImageFromApi || null);
                  const hasPhoto = !!src;
                  return (
                    <>
                      <div className="w-20 h-20 rounded-xl border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={() => profileImageInputRef.current?.click()}
                            className="w-full h-full block cursor-pointer group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B35] rounded-xl"
                          >
                            {hasPhoto ? (
                              <img src={src} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <span className="w-full h-full flex flex-col items-center justify-center gap-0.5 text-gray-400">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                </svg>
                                <span className="text-[10px] font-medium">Add photo</span>
                              </span>
                            )}
                            {hasPhoto && (
                              <span className="absolute inset-0 bg-black/45 rounded-xl flex flex-col items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                </svg>
                                <span className="text-white text-[10px] font-medium">Change photo</span>
                              </span>
                            )}
                          </button>
                        ) : hasPhoto ? (
                          <img src={src} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                            </svg>
                            <span className="text-[10px] mt-0.5">No photo</span>
                          </span>
                        )}
                      </div>
                      {isEditing && hasPhoto && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileImageLocal(null);
                            onProfileImageChange?.(null);
                          }}
                          className="absolute -bottom-1 left-0 text-[10px] font-medium text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          Remove photo
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Name / Title */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="space-y-2 pt-2">
                    <input value={data.name} onChange={(e) => update("name", e.target.value)} className={inp + " text-base font-bold"} placeholder="Full Name" />
                    <input value={data.title} onChange={(e) => update("title", e.target.value)} className={inp} placeholder="Professional Title" />
                    <div className="flex gap-2 flex-wrap">
                      <input value={data.location} onChange={(e) => update("location", e.target.value)} placeholder="Location" className="border border-blue-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 w-40" />
                      <select value={data.availability} onChange={(e) => update("availability", e.target.value)} className="border border-blue-200 rounded-lg px-2 py-1 text-xs focus:outline-none bg-blue-50">
                        <option>Available now</option><option>Open to offers</option><option>Not available</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3">
                    <h2 className="text-xl font-bold" style={{ color: "#1B365D" }}>{data.name}</h2>
                    <p className="text-sm text-gray-600 mt-0.5">{data.title}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        {data.location}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-green-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />{data.availability}
                      </span>
                      <span className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(i => <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                        <span className="ml-1 font-medium text-gray-600">4.9 (127 reviews)</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Rate + actions */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  {isEditing ? (
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-gray-400 text-sm">$</span>
                      <input type="number" value={data.hourlyRate} onChange={(e) => update("hourlyRate", Number(e.target.value))} className="w-20 text-xl font-bold text-center border border-blue-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50" style={{ color: "#FF6B35" }} />
                      <span className="text-gray-400 text-sm">/hr</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold" style={{ color: "#FF6B35" }}>
                      ${data.hourlyRate}<span className="text-sm font-normal text-gray-400">/hr</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Completeness bar — from backend profileCompleteness */}
            {!isEditing && (
              <div className="mt-4 rounded-lg p-3 flex items-center justify-between" style={{ backgroundColor: "#EBF4FF" }}>
                <div className="flex-1 mr-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium" style={{ color: "#1B365D" }}>Profile Completeness</span>
                    <span className="font-bold" style={{ color: "#FF6B35" }}>{apiStats.profileCompleteness}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: "#BFDBFE" }}>
                    <div className="h-2 rounded-full transition-[width] duration-300" style={{ width: `${apiStats.profileCompleteness}%`, backgroundColor: "#FF6B35" }} />
                  </div>
                </div>
                <span className="text-xs font-medium whitespace-nowrap" style={{ color: "#2E5984" }}>{apiStats.profileCompleteness >= 100 ? "Profile complete" : "Add more details to reach 100%"}</span>
              </div>
            )}
          </div>

          {/* ─── MAIN CONTENT GRID — px-6, full width, two-column ─── */}
          <div className="w-full px-6 py-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* ══ LEFT COLUMN ══ */}
              <div className="xl:col-span-2 space-y-5 min-w-0 overflow-hidden">

                <Section title="About Me">
                  {isEditing ? (
                    <textarea value={data.bio} onChange={(e) => update("bio", e.target.value)} className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 resize-none leading-relaxed" rows={6} placeholder="Tell clients about yourself..." />
                  ) : (
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line break-words break-all min-w-0">{data.bio}</p>
                  )}
                </Section>

                <Section title="Skills">
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, idx) => (
                      <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border" style={{ backgroundColor: "#EBF4FF", color: "#1B365D", borderColor: "#BFDBFE" }}>
                        {skill}
                        {isEditing && (
                          <button onClick={() => update("skills", data.skills.filter((_, i) => i !== idx))} className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-xs hover:bg-red-400 hover:text-white transition" style={{ backgroundColor: "#BFDBFE", color: "#1B365D" }}>×</button>
                        )}
                      </span>
                    ))}
                    {isEditing && (
                      <div className="flex items-center gap-1.5">
                        <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} placeholder="Add skill..." className="border border-dashed border-blue-300 rounded-full px-3 py-1.5 text-sm focus:outline-none bg-blue-50 w-28" />
                        <button onClick={addSkill} className="text-white w-7 h-7 rounded-full text-lg flex items-center justify-center" style={{ backgroundColor: "#FF6B35" }}>+</button>
                      </div>
                    )}
                  </div>
                </Section>

                <Section title="Work Experience">
                  <div className="space-y-5">
                    {data.experience.map((exp, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#EBF4FF" }}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#2E5984" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-1.5">
                              <input value={exp.title} onChange={(e) => { const u = [...data.experience]; u[idx] = { ...exp, title: e.target.value }; update("experience", u); }} className={inp + " font-semibold"} placeholder="Job Title" />
                              <input value={exp.company} onChange={(e) => { const u = [...data.experience]; u[idx] = { ...exp, company: e.target.value }; update("experience", u); }} className={inp} placeholder="Company" />
                              <input value={exp.period} onChange={(e) => { const u = [...data.experience]; u[idx] = { ...exp, period: e.target.value }; update("experience", u); }} className="border border-blue-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none bg-blue-50 w-full" placeholder="e.g. Jan 2021 - Present" />
                            </div>
                          ) : (
                            <>
                              <p className="text-sm font-semibold" style={{ color: "#1B365D" }}>{exp.title}</p>
                              <p className="text-sm font-medium" style={{ color: "#2E5984" }}>{exp.company}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{exp.period}</p>
                            </>
                          )}
                        </div>
                        {isEditing && (
                          <button onClick={() => update("experience", data.experience.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-400 transition mt-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <button onClick={() => update("experience", [...data.experience, { title: "", company: "", period: "" }])} className="text-sm font-medium flex items-center gap-1.5" style={{ color: "#FF6B35" }}>
                        <span className="text-lg">+</span> Add Experience
                      </button>
                    )}
                  </div>
                </Section>

                <Section title="Education">
                  <div className="space-y-5">
                    {data.education.map((edu, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-1.5">
                              <input value={edu.degree} onChange={(e) => { const u = [...data.education]; u[idx] = { ...edu, degree: e.target.value }; update("education", u); }} className={inp + " font-semibold"} placeholder="Degree" />
                              <input value={edu.school} onChange={(e) => { const u = [...data.education]; u[idx] = { ...edu, school: e.target.value }; update("education", u); }} className={inp} placeholder="Institution" />
                              <input value={edu.period} onChange={(e) => { const u = [...data.education]; u[idx] = { ...edu, period: e.target.value }; update("education", u); }} className="border border-blue-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none bg-blue-50 w-full" placeholder="e.g. 2013 - 2015" />
                            </div>
                          ) : (
                            <>
                              <p className="text-sm font-semibold" style={{ color: "#1B365D" }}>{edu.degree}</p>
                              <p className="text-sm text-gray-600">{edu.school}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{edu.period}</p>
                            </>
                          )}
                        </div>
                        {isEditing && (
                          <button onClick={() => update("education", data.education.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-400 transition mt-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <button onClick={() => update("education", [...data.education, { degree: "", school: "", period: "" }])} className="text-sm font-medium flex items-center gap-1.5" style={{ color: "#FF6B35" }}>
                        <span className="text-lg">+</span> Add Education
                      </button>
                    )}
                  </div>
                </Section>

                <section>

                  {/* ✅ Naya — plan ho to show karo, nahi to locked UI */}
                  {isPlanActive === null && (
                    <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm py-4">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Advance feature-Starting ₹499/month
                    </div>
                  )}

                  {isPlanActive === true && (
                    <ResumeVideoManager readOnly={!isEditing} />
                  )}

                  {isPlanActive === false && (
                    <div className="p-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1A1D23]">Resume Video Upload Locked</p>
                        <p className="text-xs text-[#6B7280] mt-1">Choose a plan (Basic / Pro / Elite) to upload resume videos and stand out from other freelancers.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { router.push('/freelancer-plans'); }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition"
                        style={{ backgroundColor: '#FF6B35' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Advance feature-Starting ₹499/month
                      </button>
                    </div>
                  )}
                </section>

                <Section title="Portfolio">
                  <input
                    ref={portfolioImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    aria-label="Add portfolio image"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          update("portfolio", [...data.portfolio, { title: "Portfolio item", src: reader.result as string }]);
                        };
                        reader.readAsDataURL(file);
                      }
                      e.target.value = "";
                    }}
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {data.portfolio.map((item, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                        {item.src.startsWith("data:") ? (
                          <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        ) : (
                          <Image src={item.src} alt={item.title} width={300} height={300} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                          <p className="text-white text-xs font-medium truncate">{item.title}</p>
                        </div>
                        {isEditing && (
                          <button type="button" onClick={() => update("portfolio", data.portfolio.filter((_, i) => i !== idx))} className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">×</button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => portfolioImageInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-[#2E5984] focus:ring-offset-2"
                        style={{ borderColor: "#2E5984" }}
                      >
                        <svg className="w-7 h-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#2E5984" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-xs font-medium" style={{ color: "#2E5984" }}>Add Work</span>
                      </button>
                    )}

                  </div>

                </Section>
              </div>

              {/* ══ RIGHT SIDEBAR ══ */}
              <div className="space-y-5">

                <SideCard title="Quick Stats">
                  <div className="space-y-3">
                    {[
                      { label: "Response Time", value: apiStats.responseTime, icon: "⚡" },
                      { label: "Jobs Completed", value: String(apiStats.jobsCompleted), icon: "✅" },
                      { label: "Ongoing Projects", value: String(apiStats.ongoingProjects), icon: "🔄" },
                      { label: "Total Earnings", value: apiStats.totalEarnings, icon: "💰" },
                      { label: "Member Since", value: apiStats.memberSince, icon: "📅" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">{s.icon} {s.label}</span>
                        <span className="font-semibold" style={{ color: "#1B365D" }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </SideCard>

                <SideCard title="Languages">
                  <div className="space-y-3">
                    {data.languages.map((lang, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs mb-1.5">
                          {isEditing ? (
                            <>
                              <input value={lang.name} onChange={(e) => { const u = [...data.languages]; u[idx] = { ...lang, name: e.target.value }; update("languages", u); }} className="border border-blue-200 rounded px-1.5 py-0.5 text-xs w-20 focus:outline-none bg-blue-50" />
                              <select value={lang.level} onChange={(e) => { const u = [...data.languages]; u[idx] = { ...lang, level: e.target.value }; update("languages", u); }} className="border border-blue-200 rounded px-1.5 py-0.5 text-xs focus:outline-none bg-blue-50">
                                <option>Native</option><option>Fluent</option><option>Intermediate</option><option>Basic</option>
                              </select>
                            </>
                          ) : (
                            <><span className="text-gray-600">{lang.name}</span><span className="font-semibold" style={{ color: "#1B365D" }}>{lang.level}</span></>
                          )}
                        </div>
                        <div className="h-2 rounded-full" style={{ backgroundColor: "#EBF4FF" }}>
                          <div className="h-2 rounded-full transition-[width] duration-200" style={{ width: languageLevelToWidth(lang.level), backgroundColor: "#FF6B35" }} />
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <button onClick={() => update("languages", [...data.languages, { name: "", level: "Basic", width: "30%" }])} className="text-xs font-medium flex items-center gap-1 mt-1" style={{ color: "#FF6B35" }}>+ Add Language</button>
                    )}
                  </div>
                </SideCard>

                <SideCard title="Certifications">
                  <div className="space-y-3">
                    {data.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EBF4FF" }}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#2E5984" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <>
                              <input value={cert.name} onChange={(e) => { const u = [...data.certifications]; u[idx] = { ...cert, name: e.target.value }; update("certifications", u); }} className="border border-blue-200 rounded px-1.5 py-0.5 text-xs font-medium w-full focus:outline-none bg-blue-50 mb-1 block" />
                              <input value={cert.issuer} onChange={(e) => { const u = [...data.certifications]; u[idx] = { ...cert, issuer: e.target.value }; update("certifications", u); }} className="border border-blue-200 rounded px-1.5 py-0.5 text-xs w-full focus:outline-none bg-blue-50 block" />
                            </>
                          ) : (
                            <>
                              <p className="text-xs font-semibold truncate" style={{ color: "#1B365D" }}>{cert.name}</p>
                              <p className="text-xs text-gray-500">{cert.issuer}</p>
                            </>
                          )}
                        </div>
                        {isEditing && (
                          <button onClick={() => update("certifications", data.certifications.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-400 transition">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <button onClick={() => update("certifications", [...data.certifications, { name: "", issuer: "" }])} className="text-xs font-medium flex items-center gap-1 mt-1" style={{ color: "#FF6B35" }}>+ Add Certification</button>
                    )}
                  </div>
                </SideCard>

                <SideCard title="Contact Information">
                  <div className="space-y-2.5">
                    {[
                      { key: "email" as const, label: "Email", icon: "✉️" },
                      { key: "phone" as const, label: "Phone", icon: "📞" },
                      { key: "website" as const, label: "Website", icon: "🌐" },
                      { key: "linkedin" as const, label: "LinkedIn", icon: "💼" },
                      { key: "github" as const, label: "GitHub", icon: "💻" },
                    ].map(({ key, label, icon }) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-base w-5 flex-shrink-0">{icon}</span>
                        {isEditing ? (
                          <input value={data.contact[key]} onChange={(e) => update("contact", { ...data.contact, [key]: e.target.value })} placeholder={label} className="border border-blue-200 rounded-lg px-2 py-1 text-xs w-full focus:outline-none bg-blue-50" />
                        ) : (
                          <span className="text-xs text-gray-600 truncate">{data.contact[key]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </SideCard>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}