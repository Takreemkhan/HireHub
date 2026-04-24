"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";
import ClientForm from "../components/client-form";

export default function ClientProfileEditPage() {
  const router = useRouter();

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4 mt-10">
        <ClientForm
          onSave={() => router.push("/client-profile/overview")}
        />
      </div>

      <FooterSection />
    </>
  );
}
