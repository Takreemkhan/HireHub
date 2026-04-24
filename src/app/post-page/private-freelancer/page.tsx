
"use client";

import Header from "@/components/common/Header";
import { useState } from "react";
import Image from "next/image";
import { Freelancer } from "./freelancer-data";
import FooterSection from "@/app/homepage/components/FooterSection";
import { useRouter } from "next/navigation";
import { useProfile, usesendInviteJobs } from "@/app/hook/useProfile";

export default function PrivateFreelancerPage() {
  const router = useRouter();
  const { data, isLoading } = useProfile();
  const { mutate: sendInvite } = usesendInviteJobs();
  const freelancers = data?.profiles || [];
  const [search, setSearch] = useState("");
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const [invitedIds, setInvitedIds] = useState<number[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const filteredFreelancers = freelancers.filter((f: any) => {
    const searchMatch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase());

    const recommendedMatch = recommendedOnly ? f.recommended : true;

    return searchMatch && recommendedMatch;
  });

  const handleInvite = (id: number, email?: string, name?: string) => {


    const currentJobId = localStorage.getItem("newJobId") || "69c65ad0c0ebc6faf31b31a5";

    sendInvite(
      {
        jobId: currentJobId,
        data: {
          invites:
            [{ freelancerId: id, email: email ? email : "enterMail@gmail.com", name }],
        }
      },
      {
        onSuccess: () => {
          setInvitedIds((prev) => [...prev, id]);
          setLoadingId(null);
        },
        onError: (err) => {
          console.error("Failed to invite freelancer:", err);
          setLoadingId(null);
        },
      }
    );
  };
  if (isLoading) return <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin block" />
  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 py-6 sm:py-10 px-4 mt-10">
        <div className="max-w-7xl mx-auto bg-white rounded-lg p-4 sm:p-8 shadow-sm relative">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-4xl font-semibold text-gray-900">
                Invite your Freelancers
              </h1>
              <p className="text-xs sm:text-sm lg:text-lg text-gray-600 mt-1">
                Invite freelancers before posting your private job.
              </p>
            </div>

            {/* SEARCH + FILTER */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />

              <button
                onClick={() => setRecommendedOnly(!recommendedOnly)}
                className={`px-4 py-2 text-sm rounded-md border transition ${recommendedOnly
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-900"
                  }`}
              >
                Recommended
              </button>
            </div>
          </div>

          {/* FREELANCER CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 pb-24">
            {filteredFreelancers.map((freelancer: Freelancer) => (
              <FreelancerCard
                key={freelancer?.userId}
                freelancer={freelancer}
                isInvited={invitedIds.includes(freelancer.userId)}
                isLoading={loadingId === freelancer.userId}
                onInvite={() => handleInvite(freelancer.userId, freelancer.email, freelancer.name)}
              />
            ))}
          </div>

          {filteredFreelancers.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-10">
              No freelancers found
            </p>
          )}


          {/* PAGE LEVEL ACTION BAR */}
          <div className="absolute bottom-6 right-6 flex gap-4">

            <button
              onClick={() => router.push("/current-job-post")}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-md"
            >
              Preview Job
            </button>

            <button
              onClick={() => {
                const invitedFreelancers = freelancers.filter((f: Freelancer) => invitedIds.includes(f.userId));
                localStorage.setItem("invitedFreelancers", JSON.stringify(invitedFreelancers));
                router.push("/current-job-post");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md"
            >
              Post Job
            </button>

          </div>
        </div>
      </div>


      <FooterSection />
    </>
  );
}

/* ===============================
   FREELANCER CARD (CLEAN)
================================ */
function FreelancerCard({
  freelancer,
  onInvite,
  isInvited,
  isLoading,
}: {
  freelancer: Freelancer;
  onInvite: () => void;
  isInvited: boolean;
  isLoading: boolean;
}) {
  // console.log("Rendering card for:", freelancer);

  return (
    <div className="relative bg-white border rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition">
      {/* IMAGE */}
      <div className="flex justify-center rounded-full overflow-hidden ">
        <img
          src={freelancer?.profileImage ? freelancer?.profileImage : "/avatar.png"}
          alt={freelancer.name}
          width={90}
          height={90}
          className="w-[80px] h-[80px] object-cover rounded-full"
        />
      </div>

      {/* INFO */}
      <div className="text-center mt-4">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900">
          {freelancer.name}
        </h3>


        <p className="grid col-span-2 text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
          {freelancer.title}
        </p>


        <p className="text-xs text-gray-500 mt-2">
          {freelancer.location}
        </p>

        <div className="flex justify-center items-center gap-1 mt-2 text-xs sm:text-sm">
          ⭐ {freelancer.rating}
          <span className="text-gray-500">({freelancer.reviews})</span>
        </div>

        <p className="mt-3 text-sm sm:text-base font-semibold text-gray-900">
          {freelancer.price}
        </p>
      </div>

      {/* INVITE BUTTON ONLY */}
      <button
        disabled={isInvited || isLoading}
        onClick={onInvite}
        className={`absolute bottom-4 right-4 px-4 py-2 text-sm rounded-md transition ${isInvited
          ? "bg-orange-500 text-white cursor-default"
          : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
      >
        {isLoading ? (
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin block" />
        ) : isInvited ? (
          "Invited"
        ) : (
          "Invite"
        )}
      </button>
    </div>
  );
}