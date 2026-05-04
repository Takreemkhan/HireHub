"use client";

import { FiPlus } from "react-icons/fi";
import { useState } from "react";


type Freelancer = {
  id: number;
  name: string;
  role: string;
  country: string;
  rate: string;
  rating: string;
  score: string;
  bio: string;
  skills: string[];
  image: string;
};


const freelancers: Freelancer[] = [
  {
    id: 1,
    name: "Charlie Martin",
    role: "Web, Content, Database Developer",
    country: "India",
    rate: "$52/hr",
    rating: "★★★★☆",
    score: "3.5 / 5",
    bio: "Experienced developer specializing in scalable web applications, content platforms and database architecture.",
    skills: ["Graphic Design", "CSS", "HTML5", "WordPress"],
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Sophia Williams",
    role: "UI/UX & Frontend Designer",
    country: "USA",
    rate: "$45/hr",
    rating: "★★★★★",
    score: "5 / 5",
    bio: "Creative designer focused on clean UI, smooth UX and modern frontend technologies.",
    skills: ["Figma", "Tailwind", "React", "UX Research"],
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Arjun Patel",
    role: "Full Stack MERN Developer",
    country: "India",
    rate: "$60/hr",
    rating: "★★★★☆",
    score: "4 / 5",
    bio: "Full stack developer with strong backend logic and scalable system design experience.",
    skills: ["MongoDB", "Express", "React", "Node.js"],
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

export default function ClientHome() {
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [hiredIds, setHiredIds] = useState<number[]>([]);

  const handleHire = (id: number) => {
    if (!hiredIds.includes(id)) {
      setHiredIds([...hiredIds, id]);
    }
  };

  return (
    // <div className="max-w-6xl mx-auto space-y-6">
    <div className="w-full max-w-screen-xl mx-auto space-y-6">

      {/* Top action bar */}
      <div className="flex w-full justify-end">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2 shadow transition">
          <FiPlus className="text-lg" />
          Post a Project
        </button>
      </div>

      {/* Freelancer list or single detail */}
      {!selectedFreelancer ? (
        <div className="space-y-6">
          {freelancers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow p-6 flex gap-6 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedFreelancer(user)}
            >
              {/* Profile image */}
              <img
                src={user.image}
                alt={user.name}
                className="w-28 h-28 rounded-lg object-cover"
              />

              {/* Middle content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <span className="text-green-600 text-sm">✔ Verified</span>
                </div>

                <p className="text-gray-600">{user.role}</p>

                <div className="text-sm text-gray-500">
                  {user.country} ·{" "}
                  <span className="text-yellow-600 font-medium">{user.rate}</span>
                </div>

                <p className="text-gray-600 text-sm mt-2">{user.bio}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {user.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right actions */}
              <div className="flex flex-col justify-between items-end">
                <div className="text-right">
                  <div className="text-yellow-500 text-lg">{user.rating}</div>
                  <div className="text-sm text-gray-500">{user.score}</div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHire(user.id);
                  }}
                  className={`px-6 py-2 rounded-md font-medium ${
                    hiredIds.includes(user.id)
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {hiredIds.includes(user.id) ? "Hired" : "Hire Me"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        
        


        <div className="bg-white rounded-xl shadow p-6 flex gap-6">
          <img
            src={selectedFreelancer.image}
            alt={selectedFreelancer.name}
            className="w-48 h-48 rounded-lg object-cover"
          />

          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold">{selectedFreelancer.name}</h2>
            <p className="text-gray-600">{selectedFreelancer.role}</p>
            <p>
              <strong>Country:</strong> {selectedFreelancer.country}
            </p>
            <p>
              <strong>Rate:</strong>{" "}
              <span className="text-yellow-600">{selectedFreelancer.rate}</span>
            </p>
            <p>
              <strong>Rating:</strong> {selectedFreelancer.rating} (
              {selectedFreelancer.score})
            </p>
            <p className="text-gray-600">{selectedFreelancer.bio}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedFreelancer.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            <button
              onClick={() => setSelectedFreelancer(null)}
              className="mt-4 bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-md font-medium"
            >
              Back to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
