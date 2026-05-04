const GRADIENT_COLORS = [
  "from-red-500 to-red-700",
  "from-pink-500 to-pink-700",
  "from-purple-500 to-purple-700",
  "from-indigo-500 to-indigo-700",
  "from-blue-500 to-blue-700",
  "from-cyan-500 to-cyan-700",
  "from-teal-500 to-teal-700",
  "from-green-500 to-green-700",
  "from-lime-500 to-lime-700",
  "from-yellow-500 to-yellow-700",
  "from-orange-500 to-orange-700",
  "from-rose-500 to-rose-700",
  "from-fuchsia-500 to-fuchsia-700",
  "from-violet-500 to-violet-700",
  "from-sky-500 to-sky-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-lime-600 to-green-700",
  "from-blue-600 to-indigo-700",
  "from-pink-600 to-rose-700",
];

export function getAvatarGradient(email: string): string {
  if (!email) return "from-gray-500 to-gray-700";
  
  let hash = 0;
  const cleanEmail = email.toLowerCase().trim();
  
  for (let i = 0; i < cleanEmail.length; i++) {
    hash += cleanEmail.charCodeAt(i) * (i + 1);
  }
  
  const index = Math.abs(hash) % GRADIENT_COLORS.length;
  
  return GRADIENT_COLORS[index];
}

export function getInitials(email: string): string {
  if (!email) return "U";
  
  const username = email.split('@')[0];
  const parts = username.split(/[._-]/);
  
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return username.charAt(0).toUpperCase();
}