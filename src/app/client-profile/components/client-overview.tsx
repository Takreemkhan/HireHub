"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, CreditCard, Phone, Mail } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const stats = [
    { label: "On time", value: "100%" },
    { label: "On budget", value: "100%" },
    { label: "Accept rate", value: "100%" },
  ];
  const [cover, setCover] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [company, setCompany] = useState("Coding Infotech");

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

    const saveProfile = () => {
    const profileData = {
      company,
      cover,
      logo,
      hourlyRate: 25,
      country: "India",
      rating: 4.9,
    };

    localStorage.setItem("clientProfile", JSON.stringify(profileData));
  };


  return (
    <div className="w-full min-h-screen bg-white">
      {/* COVER SECTION */}
      <div className="relative w-full h-64">
        {cover ? (
          <Image src={cover} alt="cover" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-black to-gray-800" />
        )}

        <div className="absolute left-4 sm:left-6 -bottom-12 sm:-bottom-14 z-20 ">
          <div
            className="
      relative 
      bg-white 
      rounded-xl 
      shadow-lg 
      flex flex-col items-center

      w-[140px] sm:w-[160px] lg:w-[200px] xl:w-[250px] 2xl:w-[300px] 
      p-3 sm:p-4 lg:p-6
    "
          >
            {/* LOGO */}
            <div
              className="
        border rounded-lg flex items-center justify-center overflow-hidden mb-2

        w-14 h-14 
        sm:w-16 sm:h-16 
        lg:w-20 lg:h-20
      "
            >
              {logo ? (
                <Image
                  src={logo}
                  alt="logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              ) : (
                <span className="font-bold text-lg lg:text-xl">Ci</span>
              )}
            </div>

            {/* COMPANY NAME */}
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company Name"
              aria-label="Company Name"
              className="
        text-center font-semibold outline-none w-full

        text-sm sm:text-[15px] lg:text-lg
      "
            />

            {/* EDIT PENCIL */}
            <label
              className="
        absolute 
        bottom-2 right-5 
        flex items-center justify-center 
        border rounded-md bg-white cursor-pointer shadow
        
        w-6 h-6 
        sm:w-7 sm:h-7 
        lg:w-8 lg:h-8
        text-xs sm:text-sm
      "
            >
              ✏️
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleImageUpload(e, (v) => setLogo(v))}
              />
            </label>

            {/* ONLINE STATUS DOT */}
            <span
              className="
        absolute -bottom-2 -right-2 
        bg-green-500 border-2 border-white rounded-full

        w-3 h-3 
        sm:w-4 sm:h-4 
        lg:w-5 lg:h-5
      "
            />
          </div>
        </div>

        <div className="absolute right-6 bottom-5 z-20 flex gap-3">
          {/* UPLOAD COVER */}
          <label className="bg-white px-4 py-2 rounded cursor-pointer text-sm font-medium shadow xl:px-8 xl:py-4 xl:text-xl">
            Upload cover photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleImageUpload(e, (v) => setCover(v))}
            />
          </label>

          {/* VIEW PROFILE */}
          {/* <button
            type="button"
            className="bg-white px-4 py-2 rounded text-sm font-medium shadow hover:bg-gray-100 xl:text-xl xl:py-4 xl:px-8 "
            onClick={() => {
              console.log("View profile clicked");
            }}
          >
            View Profile
          </button> */}

          <button
             type="button"
             className="bg-white px-4 py-2 rounded text-sm font-medium shadow hover:bg-gray-100 xl:text-xl xl:py-4 xl:px-8"
             onClick={() => {
                     saveProfile();
                     router.push("/client-profile/overview");
             }}
          >
          View Profile
          </button>

        </div>
      </div>

      <div className="w-full px-6 py-6 xl:py-20">
        <div className="flex items-center gap-6 text-sm xl:text-xl">
          <span className="font-semibold ">⭐ 4.9</span>
          <span>$25 / Hour</span>
          <span>🇮🇳 India</span>

          {/* <button
            type="button"
            className="ml-auto px-5 py-2 border rounded font-medium"
          >
            Edit profile
          </button> */}

          <button
            type="button"
            className="ml-auto px-5 py-2 border rounded font-medium"
            onClick={() => {
                    saveProfile();
                    router.push("/client-profile/edit");
            }}
         >
         Edit profile
         </button>

        </div>
      </div>

      <div className="max-w-full mx-auto bg-white p-4 sm:p-6 ">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 xl:text-6xl">
            Coding I.
          </h2>

          <span className="text-gray-500 text-sm sm:text-base xl:text-4xl">
            @shahidAnsari09
          </span>

          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            ✓
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm sm:text-base xl:mt-5">
          <div className="flex items-center gap-1 text-blue-500 xl:text-2xl">
            ★★★★★
            <span className="text-gray-700 ml-1">4.9</span>
          </div>

          <div className="flex items-center gap-1  xl:text-2xl">
            💬
            <span className="text-gray-700">4</span>
          </div>

          <div className="flex items-center gap-1 ">
            💲
            <span className="text-gray-700 xl:text-2xl">3.0</span>
          </div>

          <div className="flex items-center gap-1 text-blue-600">
            ⏱<span className="text-gray-700 xl:text-2xl">100%</span>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2 xl:text-3xl">
            🚀 8+ Years Exp. | Web & Mobile App Experts
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 text-gray-600 text-sm sm:text-base xl:text-2xl">
          <span className="font-medium">$25 USD / Hour</span>
          <span>· 🇮🇳 India (11:17 AM)</span>
          <span>· Joined on February 12, 2018</span>
          <span>· 1 Recommendation</span>
        </div>
      </div>

      <div className="w-full mx-auto px-5 py-10 flex flex-col lg:flex-row gap-10 xl:gap-40 items-start">
        <div className="flex-1">
          <p className="text-gray-900 text-sm sm:text-base mb-4 xl:text-2xl">
            <span className="font-semibold ">Greeting:</span> Premier Web &
            Mobile Development Agency | 8+ Years of Delivering Excellence
          </p>

          {/* Intro */}
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 xl:text-xl">
            Welcome to our profile. We are a team of senior developers and
            digital strategists led by a veteran architect with over 8 years of
            industry experience. Unlike solo freelancers, we offer the
            reliability of a company with the agility of a dedicated team.
          </p>

          {/* Mission */}
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 xl:text-xl">
            We don&apos;t just write code; we engineer robust, scalable, and
            high-performance web solutions that help businesses grow.
          </p>

          {/* Why Partner */}
          <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base xl:text-xl">
            Why Partner With Us?
          </h4>

          <div className="space-y-2 text-gray-700 text-sm sm:text-base leading-relaxed xl:text-xl">
            <p>
              <span className="font-semibold">Agency-Grade Reliability:</span>{" "}
              We have a full team, meaning no downtime, faster turnarounds, and
              diverse expertise under one roof.
            </p>

            <p>
              <span className="font-semibold">100% Completion Record:</span> We
              take pride in delivering every project On Time and On Budget.
            </p>

            <p>
              <span className="font-semibold">Complex Problem Solvers:</span> We
              specialize in fixing issues that other developers give up on.
            </p>

            <p>
              <span className="font-semibold">
                Seamless Global Collaboration:
              </span>{" "}
              We prioritize your timeline. Time zone differences are never an
              issue; we ensure clear, timely communication and availability to
              match your schedule.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN: Expertise & Content */}
        <div className="flex-1 space-y-8 text-[15px] sm:text-base">
          <section>
            <h2 className="text-lg font-bold mb-3 xl:text-xl">Our Core Expertise:</h2>
            <ul className="space-y-2 leading-relaxed xl:text-lg">
              <li><span className="font-semibold">E-Commerce Solutions (Specialists):</span> We build stores that sell, from custom themes to complex API integrations.</li>
              <li><span className="font-semibold">Shopify:</span> Shopify Plus, Liquid Coding, Public/Private App Development, Speed Optimization.</li>
              <li><span className="font-semibold">CMS Platforms:</span> WordPress (WooCommerce), Magento 2, BigCommerce, Wix.</li>
              <li><span className="font-semibold">Migrations:</span> Seamlessly moving your store from one platform to another with zero data loss.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 xl:text-xl">Full-Stack & Custom Development:</h2>
            <ul className="space-y-2 leading-relaxed xl:text-lg">
              <li><span className="font-semibold">Front-End:</span> React.js, Next.js, HTML5, CSS3, Tailwind CSS, jQuery.</li>
              <li><span className="font-semibold">Back-End:</span> PHP (Laravel/CodeIgniter), Node.js, MySQL, MongoDB, Google Firebase.</li>
              <li><span className="font-semibold">Performance:</span> Core Web Vitals optimization (Green Score Guaranteed).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 xl:text-xl">Our Process:</h2>
            <ul className="space-y-2 leading-relaxed xl:text-lg">
              <li><span className="font-semibold">Discovery:</span> We understand your business goals, not just your code.</li>
              <li><span className="font-semibold">Execution:</span> Clean, commented, and standard-compliant code.</li>
              <li><span className="font-semibold">Quality Assurance:</span> Rigorous testing before delivery.</li>
              <li><span className="font-semibold">Support:</span> We don&apos;t disappear after the project; we are here for the long run.</li>
            </ul>
          </section>

          <p className="text-base sm:text-lg font-medium pt-4 xl:text-2xl">
            Ready to elevate your business? Click <span className="text-blue-600 cursor-pointer hover:underline">&quot;Hire Me&quot;</span> to chat with our Lead Developer today!
          </p>
        </div>

      </div>
        </div>
        <div className="w-full sm:w-[280px] bg-white rounded-lg border border-gray-200 p-5 shadow-sm shrink-0 sticky top-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Verifications
          </h3>

          {/* Icons Row */}
          <div className="flex items-center justify-between mb-8">
            <User className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
            <CreditCard className="w-6 h-6 text-green-800" strokeWidth={2} />
            <Phone className="w-6 h-6 text-green-800" strokeWidth={2} />
            <Mail className="w-6 h-6 text-green-800" strokeWidth={2} />
            {/* Facebook Icon SVG */}
            <svg
              className="w-6 h-6 text-[#1877F2] fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>

          {/* Stats Rows */}
          <div className="space-y-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex justify-between items-center text-[15px]"
              >
                <span className="text-gray-600">{stat.label}</span>
                <span className="font-medium text-gray-900">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}
