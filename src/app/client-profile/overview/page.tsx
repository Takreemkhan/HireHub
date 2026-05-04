"use client";


import { useEffect, useState } from "react";
// import ClientForm from "../components/client-form";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";
import ClientOverview from "../components/client-overview";

export default function ClientProfileOverviewPage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("clientProfile");
    if (data) setProfile(JSON.parse(data));
  }, []);

  if (!profile) return null;

  return (
    <>
    <Header/>
    {/* <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4 mt-10">
      <ClientForm />
    </div> */}
    <ClientOverview profile={profile} />
    <FooterSection/>
    </>
  );
}
