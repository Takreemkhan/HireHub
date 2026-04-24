

// "use client";

// import React from "react";
// import Header from "@/components/common/Header";
// import FooterSection from "@/app/homepage/components/FooterSection";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import DraftSection from "@/app/client-dashboard/components/DraftSection";
// import { saveDraft } from "@/lib/draftStorage";
// import { nanoid } from "nanoid";


// import {
//   Clock,
//   MapPin,
//   Tag,
//   AlertCircle,
//   Briefcase,
//   Award,
//   Edit,
//   Save,
//   Send
// } from "lucide-react";

// const CurrentJobPost = () => {
//   const router = useRouter();
//   const jobData = {
//     title: "Website update like - https://www.simply-thrilled.com/",
//     postedTime: "17 hours ago",
//     location: "Remote",
//     jobId: "#4466032",
//     budget: "£275",
//     duration: "29 days",
//     experienceLevel: "Expert",
//     description: `We have an existing wordpress website, need it updated to something similar not the same - as https://www.simply-thrilled.com/

// IF YOU SEND A LONG AI REPLY YOU WILL BE BLOCKED.
// DO NOT CONTACT IF YOU HAVE 0 PROJECTS ON HERE.
// DO NOT CONTACT WITH A PITCH ABOUT HOW AMAZING YOU ARE.
// YOU MUST BE A WORDPRESS EXPERT, NOT AN AI PROMPTER.

// Just say hi, and send an example of ONE website you have created that you feel shows how amazing you are.`,
//     clientInfo: {
//       name: "S C.",
//       rating: "100% (59)",
//       projectsCompleted: 44,
//       freelancersWorked: 33,
//       projectsAwarded: "19%",
//       lastProject: "8 Sep 2025",
//       location: "United Kingdom"
//     },
//     status: "DRAFT"
//   };

//   const handlePostJob = () => {
//   router.push("/client-dashboard");
// };

// // const handleJobDraft = () => {
// //   // later you’ll also save this to DB
// //   router.push("/client-dashboard?tab=draft");
// // };

// const handleJobDraft = () => {
//   const draftId = nanoid();

//   saveDraft({
//     id: draftId,
//     data: {
//       title: jobData.title,
//       description: jobData.description,
//       budget: jobData.budget,
//       visibility: "public",
//     },
//     updatedAt: Date.now(),
//   });

//   router.push("/client-dashboard?tab=draft");
// };



//   return (
//     <>
//       <Header />

      
//       <div className="min-h-screen bg-gray-50 mt-10">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//             {/* LEFT COLUMN */}
//             <div className="lg:col-span-2 space-y-6">
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h1 className="text-2xl font-bold text-gray-900 mb-4">
//                   {jobData.title}
//                 </h1>

//                 <div className="flex flex-wrap gap-4 text-sm text-gray-600">
//                   <div className="flex items-center gap-1">
//                     <Clock className="w-4 h-4" />
//                     Posted {jobData.postedTime}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <MapPin className="w-4 h-4" />
//                     {jobData.location}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Tag className="w-4 h-4" />
//                     {jobData.jobId}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h2 className="text-xl font-bold mb-3">Description</h2>
//                 <p className="text-sm text-gray-600 mb-2">
//                   Experience Level: {jobData.experienceLevel}
//                 </p>
//                 <p className="text-gray-700 whitespace-pre-line">
//                   {jobData.description}
//                 </p>
//               </div>

//               <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
//                 <div className="flex gap-3">
//                   <AlertCircle className="w-5 h-5 text-orange-500" />
//                   <div>
//                     <h3 className="font-semibold text-orange-800">
//                       Important Guidelines
//                     </h3>
//                     <ul className="text-sm text-orange-700 mt-1 space-y-1">
//                       <li>• Keep proposals short</li>
//                       <li>• One strong example only</li>
//                       <li>• WordPress experts only</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT SIDEBAR */}
//             <div className="space-y-6 sticky top-24 h-fit">

//               {/* ACTION CARD */}
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <div className="text-center mb-6">
//                   <p className="text-sm text-gray-500">Fixed Budget</p>
//                   <p className="text-3xl font-bold">{jobData.budget}</p>
//                 </div>

//                 <div className="space-y-3">
//                   <button onClick={handlePostJob} 
//                   className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
//                     <Send className="w-4 h-4" />
//                     Post Job
//                   </button>

//                   <button onClick={handleJobDraft} className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium">
//                     <Save className="w-4 h-4" />
//                     Save as Draft
//                   </button>

//                   <button onClick={() => router.push(`/post-page?draftId=${jobData.jobId}`)} className="w-full flex items-center justify-center gap-2 text-blue-600 hover:underline py-2 text-sm">
//                     <Edit className="w-4 h-4" />
//                     Edit Job Details
//                   </button>
//                 </div>

//                 <p className="text-xs text-gray-500 text-center mt-4">
//                   Job Status: <span className="font-semibold">{jobData.status}</span>
//                 </p>
//               </div>

//               {/* CLIENT INFO */}
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center font-bold">
//                     {jobData.clientInfo.name.charAt(0)}
//                   </div>
//                   <div>
//                     <h3 className="font-bold">{jobData.clientInfo.name}</h3>
//                     <div className="flex items-center text-sm text-gray-600">
//                       <Award className="w-4 h-4 mr-1" />
//                       {jobData.clientInfo.rating}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="text-sm text-gray-600 space-y-2">
//                   <div className="flex justify-between">
//                     <span>Projects Completed</span>
//                     <span className="font-medium">{jobData.clientInfo.projectsCompleted}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Freelancers Worked</span>
//                     <span className="font-medium">{jobData.clientInfo.freelancersWorked}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Last Project</span>
//                     <span className="font-medium">{jobData.clientInfo.lastProject}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* RELATED */}
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h3 className="font-bold flex items-center gap-2 mb-2">
//                   <Briefcase className="w-5 h-5 text-orange-500" />
//                   Other Projects
//                 </h3>
//                 <p className="text-sm text-blue-600 hover:underline cursor-pointer">
//                   Looking for an experienced social media manager
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">£110</p>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
     


//       {/* <FooterSection /> */}
//     </>
//   );
// };

// export default CurrentJobPost;


"use client";

import React from "react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DraftSection from "@/app/client-dashboard/components/DraftSection";
import { saveDraft } from "@/lib/draftStorage";
import { nanoid } from "nanoid";


import {
  Clock,
  MapPin,
  Tag,
  AlertCircle,
  Briefcase,
  Award,
  Edit,
  Save,
  Send
} from "lucide-react";
import { useEffect } from "react";

const CurrentJobPost = () => {
  const router = useRouter();
  const [invitedFreelancers, setInvitedFreelancers] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("invitedFreelancers");
    if (stored) {
      setInvitedFreelancers(JSON.parse(stored));
    }
  }, []);
  const jobData = {
    title: "Website update like - https://www.simply-thrilled.com/",
    postedTime: "17 hours ago",
    location: "Remote",
    jobId: "#4466032",
    budget: "£275",
    duration: "29 days",
    experienceLevel: "Expert",
    description: `We have an existing wordpress website, need it updated to something similar not the same - as https://www.simply-thrilled.com/

IF YOU SEND A LONG AI REPLY YOU WILL BE BLOCKED.
DO NOT CONTACT IF YOU HAVE 0 PROJECTS ON HERE.
DO NOT CONTACT WITH A PITCH ABOUT HOW AMAZING YOU ARE.
YOU MUST BE A WORDPRESS EXPERT, NOT AN AI PROMPTER.

Just say hi, and send an example of ONE website you have created that you feel shows how amazing you are.`,
    clientInfo: {
      name: "S C.",
      rating: "100% (59)",
      projectsCompleted: 44,
      freelancersWorked: 33,
      projectsAwarded: "19%",
      lastProject: "8 Sep 2025",
      location: "United Kingdom"
    },
    status: "DRAFT"
  };

  const handlePostJob = () => {
    router.push("/client-dashboard");
  };

  // const handleJobDraft = () => {
  //   // later you’ll also save this to DB
  //   router.push("/client-dashboard?tab=draft");
  // };

  const handleJobDraft = () => {
    const draftId = nanoid();

    saveDraft({
      id: draftId,
      data: {
        title: jobData.title,
        description: jobData.description,
        budget: jobData.budget,
        visibility: "public",
      },
      updatedAt: Date.now(),
    });

    router.push("/client-dashboard?tab=draft");
  };



  return (
    <>
      <Header />


      <div className="min-h-screen bg-gray-50 mt-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {jobData.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Posted {jobData.postedTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {jobData.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {jobData.jobId}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-3">Description</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Experience Level: {jobData.experienceLevel}
                </p>
                <p className="text-gray-700 whitespace-pre-line">
                  {jobData.description}
                </p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-orange-800">
                      Important Guidelines
                    </h3>
                    <ul className="text-sm text-orange-700 mt-1 space-y-1">
                      <li>• Keep proposals short</li>
                      <li>• One strong example only</li>
                      <li>• WordPress experts only</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* INVITED FREELANCERS SECTION */}
              {invitedFreelancers.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">Invited Freelancers</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {invitedFreelancers.map((freelancer: any) => (
                      <div key={freelancer.id} className="relative bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-center">
                          <img
                            src={freelancer.image}
                            alt={freelancer.name}
                            className="w-[90px] h-[90px] rounded-full object-cover"
                          />
                        </div>

                        <div className="text-center mt-4">
                          <h3 className="font-semibold text-base text-gray-900">
                            {freelancer.name}
                          </h3>

                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {freelancer.title}
                          </p>

                          <p className="text-xs text-gray-500 mt-2">
                            {freelancer.country}
                          </p>

                          <div className="flex justify-center items-center gap-1 mt-2 text-sm">
                            ⭐ {freelancer.rating}
                            <span className="text-gray-500">({freelancer.reviews})</span>
                          </div>

                          <p className="mt-3 text-base font-semibold text-gray-900">
                            {freelancer.price}
                          </p>

                          <button
                            className="mt-4 w-full bg-orange-100 text-orange-600 px-4 py-2 text-sm rounded-md font-medium cursor-default"
                          >
                            Invited
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6 sticky top-24 h-fit">

              {/* ACTION CARD */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500">Fixed Budget</p>
                  <p className="text-3xl font-bold">{jobData.budget}</p>
                </div>

                <div className="space-y-3">
                  <button onClick={handlePostJob}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
                    <Send className="w-4 h-4" />
                    Post Job
                  </button>

                  <button onClick={handleJobDraft} className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium">
                    <Save className="w-4 h-4" />
                    Save as Draft
                  </button>

                  <button onClick={() => router.push(`/post-page?draftId=${jobData.jobId}`)} className="w-full flex items-center justify-center gap-2 text-blue-600 hover:underline py-2 text-sm">
                    <Edit className="w-4 h-4" />
                    Edit Job Details
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Job Status: <span className="font-semibold">{jobData.status}</span>
                </p>
              </div>

              {/* CLIENT INFO */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center font-bold">
                    {jobData.clientInfo.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold">{jobData.clientInfo.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="w-4 h-4 mr-1" />
                      {jobData.clientInfo.rating}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Projects Completed</span>
                    <span className="font-medium">{jobData.clientInfo.projectsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Freelancers Worked</span>
                    <span className="font-medium">{jobData.clientInfo.freelancersWorked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Project</span>
                    <span className="font-medium">{jobData.clientInfo.lastProject}</span>
                  </div>
                </div>
              </div>

              {/* RELATED */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-orange-500" />
                  Other Projects
                </h3>
                <p className="text-sm text-blue-600 hover:underline cursor-pointer">
                  Looking for an experienced social media manager
                </p>
                <p className="text-xs text-gray-500 mt-1">£110</p>
              </div>

              {/* INVITED FREELANCERS SECTION REMOVED */}

            </div>
          </div>
        </div>
      </div>



      {/* <FooterSection /> */}
    </>
  );
};

export default CurrentJobPost;