// "use client";
// import { FaHeart } from "react-icons/fa";
// import { FiDollarSign, FiClock, FiMapPin, FiFolder } from "react-icons/fi";

// type Job = {
//   id: number;
//   title: string;
//   name: string;
//   verified: boolean;
//   description: string;
//   skills: string[];
//   budget: string;
//   country: string;
//   type: string;
//   timeline: string;
// };

// const jobs: Job[] = [
//   {
//     id: 1,
//     title: "Android app with web admin interface",
//     name: "Jack Wilshere",
//     verified: true,
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
//     skills: ["Graphic Design", "CSS", "HTML5", "WordPress"],
//     budget: "$241.00",
//     country: "India",
//     type: "Fixed",
//     timeline: "Less than a week",
//   },
//   {
//     id: 2,
//     title: "Construction business website",
//     name: "Barry Allen",
//     verified: true,
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
//     skills: ["React", "Tailwind", "Node.js"],
//     budget: "$350.00",
//     country: "India",
//     type: "Fixed",
//     timeline: "Less than a week",
//   },
// ];

// export default function FreelancerHome() {
//   return (
//     <div className="space-y-4">
//       {jobs.map((job) => (
//         <div key={job.id} className="bg-white rounded-lg shadow flex justify-between p-6">
//           <div className="flex-1">
//             <h2 className="text-lg font-bold">{job.title}</h2>
//             <p className="text-green-600 flex items-center gap-2 mt-1">
//               {job.verified && <span>✔</span>} {job.name}
//             </p>
//             <p className="text-gray-600 mt-2">{job.description}</p>
//             <div className="flex flex-wrap gap-2 mt-3">
//               {job.skills.map((skill) => (
//                 <span key={skill} className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Right sidebar inside card */}
//           <div className="flex flex-col gap-2 text-sm text-gray-600 ml-6 min-w-[180px]">
//             <div className="flex items-center gap-2"><FiDollarSign className="text-yellow-500" /> Expensive</div>
//             <div className="flex items-center gap-2"><FiMapPin /> {job.country}</div>
//             <div className="flex items-center gap-2"><FiFolder /> Type: {job.type}</div>
//             <div className="flex items-center gap-2"><FiClock /> {job.timeline}</div>
//             <div className="flex items-center gap-2"><FaHeart className="text-red-500" /> Favorite</div>
//             <button className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 font-medium">Bid Now</button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


"use client";

import { FiHeart, FiMapPin, FiDollarSign, FiClock } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Job = {
  id: number;
  title: string;
  client: string;
  verified: boolean;
  description: string;
  skills: string[];
  budget: string;
  country: string;
  type: string;
  timeline: string;
  clientImage: string;
};

const jobs: Job[] = [
  {
    id: 1,
    title: "Android app with web admin interface",
    client: "Jack Wilshere",
    verified: true,
    description: "Looking for an experienced Android developer to build a mobile app with a web-based admin panel for content management.",
    skills: ["Android", "Java", "Kotlin", "Firebase", "REST API"],
    budget: "$2,500 - $5,000",
    country: "United States",
    type: "Fixed Price",
    timeline: "2-3 months",
    clientImage: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    title: "Construction business website",
    client: "Barry Allen",
    verified: true,
    description: "Need a modern, professional website for our construction company with portfolio showcase and contact forms.",
    skills: ["WordPress", "PHP", "CSS", "JavaScript", "SEO"],
    budget: "$1,500 - $3,000",
    country: "United Kingdom",
    type: "Fixed Price",
    timeline: "1 month",
    clientImage: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    title: "E-commerce Platform Development",
    client: "Diana Prince",
    verified: true,
    description: "Build a full-featured e-commerce platform with payment integration, inventory management, and customer dashboard.",
    skills: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
    budget: "$5,000 - $10,000",
    country: "Canada",
    type: "Fixed Price",
    timeline: "3-4 months",
    clientImage: "https://randomuser.me/api/portraits/women/1.jpg",
  },
];

export default function FreelancerHome() {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const handleSaveJob = (id: number) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter(jobId => jobId !== id));
    } else {
      setSavedJobs([...savedJobs, id]);
    }
  };

  const handleApply = (jobId: number) => {
    // Navigate to job details or application page
    router.push(`/project-detail-pages?id=${jobId}`);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-6 px-4 py-8">
      
      {/* Top action bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1A1D23]">Available Jobs</h1>
        <button 
          onClick={() => router.push('/search-and-discovery')}
          className="bg-[#FF6B35] hover:bg-[#E5602F] text-white px-6 py-2 rounded-md font-medium shadow transition"
        >
          Advanced Search
        </button>
      </div>

      {/* Job listings */}
      <div className="space-y-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 hover:shadow-md transition"
          >
            <div className="flex gap-6">
              {/* Client image */}
              <img
                src={job.clientImage}
                alt={job.client}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#E2E8F0]"
              />

              {/* Main content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[#1A1D23] hover:text-[#FF6B35] cursor-pointer">
                      {job.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-[#6B7280]">{job.client}</p>
                      {job.verified && (
                        <span className="text-green-600 text-xs flex items-center gap-1">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveJob(job.id)}
                    className={`p-2 rounded-lg transition ${
                      savedJobs.includes(job.id)
                        ? "text-red-500 bg-red-50"
                        : "text-[#6B7280] hover:bg-[#F7FAFC]"
                    }`}
                  >
                    <FiHeart
                      size={20}
                      className={savedJobs.includes(job.id) ? "fill-current" : ""}
                    />
                  </button>
                </div>

                <p className="text-[#6B7280] text-sm leading-relaxed">
                  {job.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Job details */}
                <div className="flex flex-wrap gap-6 text-sm text-[#6B7280] pt-2">
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="text-green-600" />
                    <span className="font-medium text-[#1A1D23]">{job.budget}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-[#FF6B35]" />
                    <span>{job.country}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FiClock />
                    <span>{job.timeline}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-[#F7FAFC] rounded text-xs font-medium">
                      {job.type}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleApply(job.id)}
                    className="flex-1 bg-[#FF6B35] hover:bg-[#E5602F] text-white px-6 py-2.5 rounded-lg font-medium shadow transition"
                  >
                    Apply Now
                  </button>
                  <button className="px-6 py-2.5 border-2 border-[#E2E8F0] text-[#1A1D23] rounded-lg font-medium hover:bg-[#F7FAFC] transition">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      <div className="flex justify-center pt-4">
        <button className="px-8 py-3 border-2 border-[#E2E8F0] text-[#1A1D23] rounded-lg font-medium hover:bg-[#F7FAFC] transition">
          Load More Jobs
        </button>
      </div>
    </div>
  );
}