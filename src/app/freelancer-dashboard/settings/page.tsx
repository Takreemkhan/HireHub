// 'use client';

// import { useState } from 'react';

// export default function SettingsSection() {
//   const [editingLabel, setEditingLabel] = useState<string | null>(null);
//   const [emailDraft, setEmailDraft] = useState({ newEmail: '', confirmEmail: '' });
//   const [emailError, setEmailError] = useState<string | null>(null);
//   const [passwordDraft, setPasswordDraft] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   });
//   const [passwordError, setPasswordError] = useState<string | null>(null);
//   const [securityDraft, setSecurityDraft] = useState({
//     newAnswer: '',
//     selectedQuestion: "Mother's birthplace",
//   });
//   const [securityAnswer, setSecurityAnswer] = useState('************');
//   const [securityError, setSecurityError] = useState<string | null>(null);

//   const securityQuestions = [
//     "Mother's birthplace",
//     "First pet's name",
//     'Name of your first school',
//     "Favorite teacher's name",
//     'City where you were born',
//   ];

//   const [formData, setFormData] = useState({
//     'Personal URL': 'pph.me/username',
//     Email: 'your_email@example.com',
//     Password: '************',
//     Account: 'Active',
//     'Security Question': "Mother's birthplace",
//     'Proposal Credits': '5',
//   });

//   const items = Object.keys(formData);

//   const handleSave = (label: string) => {
//     if (label === 'Email') {
//       const newEmail = emailDraft.newEmail.trim();
//       const confirmEmail = emailDraft.confirmEmail.trim();
//       if (!newEmail || !confirmEmail) {
//         setEmailError('Please enter and confirm your new email.');
//         return;
//       }
//       if (newEmail !== confirmEmail) {
//         setEmailError('Email addresses do not match.');
//         return;
//       }
//       setFormData((prev) => ({ ...prev, Email: newEmail }));
//       setEmailDraft({ newEmail: '', confirmEmail: '' });
//       setEmailError(null);
//     }
//     if (label === 'Password') {
//       const { currentPassword, newPassword, confirmPassword } = passwordDraft;
//       if (!currentPassword) {
//         setPasswordError('Please enter your current password.');
//         return;
//       }
//       if (!newPassword || !confirmPassword) {
//         setPasswordError('Please enter and confirm your new password.');
//         return;
//       }
//       if (newPassword !== confirmPassword) {
//         setPasswordError('Passwords do not match.');
//         return;
//       }
//       setFormData((prev) => ({ ...prev, Password: '************' }));
//       setPasswordDraft({ currentPassword: '', newPassword: '', confirmPassword: '' });
//       setPasswordError(null);
//     }
//     if (label === 'Security Question') {
//       const newAnswer = securityDraft.newAnswer.trim();
//       const selectedQuestion = securityDraft.selectedQuestion;
//       if (!newAnswer) {
//         setSecurityError('Please enter an answer.');
//         return;
//       }
//       setFormData((prev) => ({ ...prev, 'Security Question': selectedQuestion }));
//       setSecurityAnswer(newAnswer);
//       setSecurityDraft((prev) => ({ ...prev, newAnswer: '' }));
//       setSecurityError(null);
//     }
//     setEditingLabel(null);
//   };

//   const startEdit = (label: string) => {
//     if (label === 'Proposal Credits') return;

//     if (label === 'Email') return; // Email cannot be edited
//     setEditingLabel(label);

//     if (label === 'Password') {
//       setPasswordDraft({ currentPassword: '', newPassword: '', confirmPassword: '' });
//       setPasswordError(null);
//     }
//     if (label === 'Security Question') {
//       setSecurityDraft({ newAnswer: '', selectedQuestion: formData['Security Question'] });
//       setSecurityError(null);
//     }
//   };

//   const cancelEdit = () => {
//     setEditingLabel(null);
//     setEmailDraft({ newEmail: '', confirmEmail: '' });
//     setEmailError(null);
//     setPasswordDraft({ currentPassword: '', newPassword: '', confirmPassword: '' });
//     setPasswordError(null);
//     setSecurityDraft({ newAnswer: '', selectedQuestion: formData['Security Question'] });
//     setSecurityError(null);
//   };

//   return (
//     <div className="bg-white">
//       <div className="px-8 py-6 border-b border-gray-200">
//         <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
//       </div>
//       <div className="divide-y divide-gray-100">
//         {items.map((label) => {
//           const isEditing = editingLabel === label;
//           return (
//             <div
//               key={label}
//               className="px-8 py-6 grid grid-cols-[220px_minmax(0,1fr)_120px] gap-10 items-start"
//             >
//               <p className="text-sm font-medium text-gray-900">{label}</p>
//               <div className="w-full max-w-md justify-self-center">
//                 {!isEditing && (
//                   <p className="text-sm text-gray-500 text-left">
//                     {formData[label as keyof typeof formData]}
//                   </p>
//                 )}
//                 {isEditing && (
//                   <div className="w-full">
//                     {label === 'Email' ? (
//                       <div className="space-y-3">
//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-1">Current mail id</label>
//                           <input
//                             type="email"
//                             value={formData.Email}
//                             readOnly
//                             disabled
//                             className="w-full border rounded-md px-3 py-2 text-sm text-left bg-gray-50 text-gray-500 cursor-not-allowed"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-1">New mail id</label>
//                           <input
//                             type="email"
//                             placeholder="Enter new email"
//                             value={emailDraft.newEmail}
//                             onChange={(e) => setEmailDraft((prev) => ({ ...prev, newEmail: e.target.value }))}
//                             className="w-full border rounded-md px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-orange-400"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-1">Confirm mail id</label>
//                           <input
//                             type="email"
//                             placeholder="Confirm new email"
//                             value={emailDraft.confirmEmail}
//                             onChange={(e) => setEmailDraft((prev) => ({ ...prev, confirmEmail: e.target.value }))}
//                             className="w-full border rounded-md px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-orange-400"
//                           />
//                         </div>
//                         {emailError && <p className="text-xs text-red-600">{emailError}</p>}
//                       </div>
//                     ) : label === 'Password' ? (
//                       <div className="space-y-3">
//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-1">Current password</label>
//                           <input
//                             type="password"
//                             placeholder="Enter current password"
//                             value={passwordDraft.currentPassword}
//                             onChange={(e) => setPasswordDraft((prev) => ({ ...prev, currentPassword: e.target.value }))}
//                             className="w-full border rounded-md px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-orange-400"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-1">New password</label>
//                           <input
//                             type="password"
//                             placeholder="Enter new password"
//                             value={passwordDraft.newPassword}
//                             onChange={(e) => setPasswordDraft((prev) => ({ ...prev, newPassword: e.target.value }))}
//                             className="w-full border rounded-md px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-orange-400"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-1">Confirm password</label>
//                           <input
//                             type="password"
//                             placeholder="Confirm new password"
//                             value={passwordDraft.confirmPassword}
//                             onChange={(e) => setPasswordDraft((prev) => ({ ...prev, confirmPassword: e.target.value }))}
//                             className="w-full border rounded-md px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-orange-400"
//                           />
//                         </div>
//                         {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
//                       </div>
//                     ) : label === 'Account' ? (
//                       <div className="w-full">
//                         <label className="block text-xs font-medium text-gray-600 mb-1">Account status</label>
//                         <select
//                           value={formData.Account}
//                           onChange={(e) => setFormData((prev) => ({ ...prev, Account: e.target.value as 'Active' | 'Inactive' }))}
//                           className="w-full border rounded-md px-3 py-2 text-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
//                         >
//                           <option value="Active">Active</option>
//                           <option value="Inactive">Inactive</option>
//                         </select>
//                       </div>
//                     ) : label === 'Security Question' ? (
//                       <div className="space-y-3">
//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-1">Current security question</label>
//                           <input
//                             type="text"
//                             value={formData['Security Question']}
//                             readOnly
//                             disabled
//                             className="w-full border rounded-md px-3 py-2 text-sm text-left bg-gray-50 text-gray-500 cursor-not-allowed"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-1">New answer</label>
//                           <input
//                             type="text"
//                             placeholder="Enter new answer"
//                             value={securityDraft.newAnswer}
//                             onChange={(e) => setSecurityDraft((prev) => ({ ...prev, newAnswer: e.target.value }))}
//                             className="w-full border rounded-md px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-orange-400"
//                           />
//                           <div className="mt-2">
//                             <label className="block text-xs font-medium text-gray-600 mb-1">New security question</label>
//                             <select
//                               value={securityDraft.selectedQuestion}
//                               onChange={(e) => setSecurityDraft((prev) => ({ ...prev, selectedQuestion: e.target.value }))}
//                               className="w-full border rounded-md px-3 py-2 text-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
//                             >
//                               {[securityDraft.selectedQuestion, ...securityQuestions.filter((q) => q !== securityDraft.selectedQuestion)].map((q) => (
//                                 <option key={q} value={q}>{q}</option>
//                               ))}
//                             </select>
//                           </div>
//                         </div>
//                         {securityError && <p className="text-xs text-red-600">{securityError}</p>}
//                         <p className="text-xs text-gray-400 text-left">Current answer: {securityAnswer}</p>
//                       </div>
//                     ) : (
//                       <div className="w-full">
//                         <input
//                           type={label === 'Password' ? 'password' : 'text'}
//                           placeholder={label}
//                           value={formData[label as keyof typeof formData]}
//                           onChange={(e) => setFormData({ ...formData, [label]: e.target.value })}
//                           className="w-full border rounded-md px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-orange-400"
//                         />
//                         {label === 'Personal URL' && (
//                           <p className="mt-1 text-xs text-gray-400 text-left">e.g. http://pph.me/xenios</p>
//                         )}
//                       </div>
//                     )}
//                     <div className="flex justify-center gap-4 mt-4">
//                       <button type="button" onClick={() => handleSave(label)} className="px-6 py-2 bg-orange-500 text-white rounded-md text-sm font-medium">
//                         Save
//                       </button>
//                       <button type="button" onClick={cancelEdit} className="px-6 py-2 border rounded-md text-sm text-gray-600">
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <div className="flex justify-end w-[120px]">
//                 {!isEditing && label === 'Proposal Credits' && (
//                   <button type="button" onClick={() => console.log('Buy more proposal credits')} className="text-sm font-medium text-orange-500 hover:underline">
//                     Buy More
//                   </button>
//                 )}

//                 {!isEditing && label !== 'Proposal Credits' && label !== 'Email' && (

//                   <button type="button" onClick={() => startEdit(label)} className="text-sm font-medium text-orange-500 hover:underline">
//                     Edit
//                   </button>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline'; // or any icon library

export default function SettingsMainContent() {
  // ------------------- My Profile state -------------------
  const [profile, setProfile] = useState({
    visibility: 'Public',
    customUrl: '/freelancers/shahidansari',
    projectPreference: 'Both short-term and long-term projects',
    earningsPrivacy: 'Hide my FreelanceHub Pro earnings',
  });
  const [editingProfile, setEditingProfile] = useState<string | null>(null);

  // ------------------- Experience level state -------------------
  const [experience, setExperience] = useState<'entry' | 'intermediate' | 'expert'>('intermediate');
  const [experienceDraft, setExperienceDraft] = useState<'entry' | 'intermediate' | 'expert'>('intermediate');
  const [editingExperience, setEditingExperience] = useState(false);

  // ------------------- Categories state (nested) -------------------
  const [categories, setCategories] = useState({
    web: {
      checked: true,
      sub: {
        ecommerce: true,
        design: false,
        development: true,
      },
    },
    design: {
      checked: true,
      sub: {
        graphic: true,
      },
    },
  });
  const [editingCategories, setEditingCategories] = useState(false);

  // ------------------- Specialized profiles state -------------------
  const [specialized, setSpecialized] = useState([
    { name: 'Ecommerce Website Development', published: true },
    { name: 'Full Stack Development', published: true },
  ]);
  const [editingSpecialized, setEditingSpecialized] = useState(false);
  const [specializedDraft, setSpecializedDraft] = useState([...specialized]);

  // ------------------- Linked accounts state -------------------
  const [linkedAccounts, setLinkedAccounts] = useState(['GitHub', 'StackOverflow']);
  const [editingLinked, setEditingLinked] = useState(false);
  const [linkedDraft, setLinkedDraft] = useState([...linkedAccounts]);

  // ------------------- AI preference state -------------------
  const [aiPreference, setAiPreference] = useState<'opt-in' | 'opt-out'>('opt-in');
  const [editingAi, setEditingAi] = useState(false);

  // ------------------- Helper: save/cancel for each section -------------------
  const saveProfileField = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setEditingProfile(null);
  };

  const cancelProfileEdit = () => setEditingProfile(null);

  const saveExperience = () => {
    setExperience(experienceDraft);
    setEditingExperience(false);
  };
  const cancelExperience = () => {
    setExperienceDraft(experience);
    setEditingExperience(false);
  };

  const saveCategories = () => setEditingCategories(false);
  const cancelCategories = () => setEditingCategories(false);

  const saveSpecialized = () => {
    setSpecialized(specializedDraft);
    setEditingSpecialized(false);
  };
  const cancelSpecialized = () => {
    setSpecializedDraft([...specialized]);
    setEditingSpecialized(false);
  };

  const saveLinked = () => {
    setLinkedAccounts(linkedDraft);
    setEditingLinked(false);
  };
  const cancelLinked = () => {
    setLinkedDraft([...linkedAccounts]);
    setEditingLinked(false);
  };

  const saveAi = () => setEditingAi(false);
  const cancelAi = () => setEditingAi(false);

  return (
    <main className="flex-1 p-8 bg-[#FAFBFC] font-sans">
      {/* My profile section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 font-display mb-4">My profile</h2>
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          {/* Visibility */}
          <div className="py-4 flex items-center gap-4 border-b border-[#E2E8F0]">
            <span className="w-40 text-sm font-medium text-[#4A5568]">Visibility</span>
            {editingProfile === 'visibility' ? (
              <div className="flex-1">
                <select
                  value={profile.visibility}
                  onChange={(e) => setProfile((p) => ({ ...p, visibility: e.target.value }))}
                  className="w-full max-w-md border border-[#E2E8F0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                >
                  <option>Public</option>
                  <option>Private</option>
                </select>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => saveProfileField('visibility', profile.visibility)}
                    className="px-4 py-2 bg-[#FF6B35] text-white rounded-md text-sm font-medium hover:bg-[#e55a2b]"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelProfileEdit}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-md text-sm text-[#4A5568] hover:bg-[#F7FAFC]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="flex-1 text-sm text-[#1A202C] px-1 py-1 rounded-full w-fit">
                  {profile.visibility}
                </span>
                <button
                  onClick={() => setEditingProfile('visibility')}
                  className="text-[#FF6B35] hover:text-[#e55a2b]"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Custom profile URL */}
          <div className="py-4 flex items-center gap-4 border-b border-[#E2E8F0]">
            <span className="w-40 text-sm font-medium text-[#4A5568]">Custom profile URL</span>
            {editingProfile === 'customUrl' ? (
              <div className="flex-1">
                <input
                  type="text"
                  value={profile.customUrl}
                  onChange={(e) => setProfile((p) => ({ ...p, customUrl: e.target.value }))}
                  className="w-full max-w-md border border-[#E2E8F0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => saveProfileField('customUrl', profile.customUrl)}
                    className="px-4 py-2 bg-[#FF6B35] text-white rounded-md text-sm font-medium hover:bg-[#e55a2b]"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelProfileEdit}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-md text-sm text-[#4A5568] hover:bg-[#F7FAFC]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="flex-1 text-sm text-[#FF6B35] break-all">{profile.customUrl}</span>
                <button
                  onClick={() => setEditingProfile('customUrl')}
                  className="text-[#FF6B35] hover:text-[#e55a2b]"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Project preference */}
          <div className="py-4 flex items-center gap-4 border-b border-[#E2E8F0]">
            <span className="w-40 text-sm font-medium text-[#4A5568]">Project preference</span>
            {editingProfile === 'projectPreference' ? (
              <div className="flex-1">
                <select
                  value={profile.projectPreference}
                  onChange={(e) => setProfile((p) => ({ ...p, projectPreference: e.target.value }))}
                  className="w-full max-w-md border border-[#E2E8F0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                >
                  <option>Both short-term and long-term projects</option>
                  <option>Short-term only</option>
                  <option>Long-term only</option>
                </select>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => saveProfileField('projectPreference', profile.projectPreference)}
                    className="px-4 py-2 bg-[#FF6B35] text-white rounded-md text-sm font-medium hover:bg-[#e55a2b]"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelProfileEdit}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-md text-sm text-[#4A5568] hover:bg-[#F7FAFC]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="flex-1 text-sm text-[#1A202C]">{profile.projectPreference}</span>
                <button
                  onClick={() => setEditingProfile('projectPreference')}
                  className="text-[#FF6B35] hover:text-[#e55a2b]"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Earnings privacy */}
          <div className="py-4 flex items-start gap-4">
            <span className="w-40 text-sm font-medium text-[#4A5568]">Earnings privacy</span>
            {editingProfile === 'earningsPrivacy' ? (
              <div className="flex-1">
                <select
                  value={profile.earningsPrivacy}
                  onChange={(e) => setProfile((p) => ({ ...p, earningsPrivacy: e.target.value }))}
                  className="w-full max-w-md border border-[#E2E8F0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                >
                  <option>Hide my FreelanceHub Pro earnings</option>
                  <option>Show my FreelanceHub Pro earnings</option>
                </select>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => saveProfileField('earningsPrivacy', profile.earningsPrivacy)}
                    className="px-4 py-2 bg-[#FF6B35] text-white rounded-md text-sm font-medium hover:bg-[#e55a2b]"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelProfileEdit}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-md text-sm text-[#4A5568] hover:bg-[#F7FAFC]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <p className="text-sm text-[#1A202C]">{profile.earningsPrivacy}</p>
                <p className="text-xs text-[#718096] mt-1 max-w-xl">
                  This setting hides historical earnings on your profile. Your earnings will still be visible when you submit proposals or accept invitations to interview.
                </p>
              </div>
            )}
            {editingProfile !== 'earningsPrivacy' && (
              <button
                onClick={() => setEditingProfile('earningsPrivacy')}
                className="text-[#FF6B35] hover:text-[#e55a2b]"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Experience level */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 font-display">Experience level</h2>
          {!editingExperience && (
            <button
              onClick={() => {
                setExperienceDraft(experience);
                setEditingExperience(true);
              }}
              className="text-[#FF6B35] hover:text-[#e55a2b]"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          {!editingExperience ? (
            <div className="space-y-4">
              {[
                { value: 'entry', label: 'Entry level', desc: 'I am relatively new to this field' },
                { value: 'intermediate', label: 'Intermediate', desc: 'I have substantial experience in this field' },
                { value: 'expert', label: 'Expert', desc: 'I have comprehensive and deep expertise in this field' },
              ].map((level) => {
                const isSelected = experience === level.value;
                return (
                  <div
                    key={level.value}
                    className={`flex items-start gap-3 p-3 rounded-md transition-colors ${
                      isSelected ? 'bg-[#F7FAFC] border border-[#FF6B35]/20' : ''
                    }`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-[#FF6B35] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-[#CBD5E0]"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A202C]">{level.label}</p>
                      <p className="text-xs text-[#718096]">{level.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="experience"
                  value="entry"
                  checked={experienceDraft === 'entry'}
                  onChange={() => setExperienceDraft('entry')}
                  className="mt-1 accent-[#FF6B35]"
                />
                <div>
                  <span className="text-sm font-medium text-[#1A202C]">Entry level</span>
                  <p className="text-xs text-[#718096]">I am relatively new to this field</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="experience"
                  value="intermediate"
                  checked={experienceDraft === 'intermediate'}
                  onChange={() => setExperienceDraft('intermediate')}
                  className="mt-1 accent-[#FF6B35]"
                />
                <div>
                  <span className="text-sm font-medium text-[#1A202C]">Intermediate</span>
                  <p className="text-xs text-[#718096]">I have substantial experience in this field</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="experience"
                  value="expert"
                  checked={experienceDraft === 'expert'}
                  onChange={() => setExperienceDraft('expert')}
                  className="mt-1 accent-[#FF6B35]"
                />
                <div>
                  <span className="text-sm font-medium text-[#1A202C]">Expert</span>
                  <p className="text-xs text-[#718096]">I have comprehensive and deep expertise in this field</p>
                </div>
              </label>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={saveExperience}
                  className="px-4 py-2 bg-[#FF6B35] text-white rounded-md text-sm font-medium hover:bg-[#e55a2b]"
                >
                  Save
                </button>
                <button
                  onClick={cancelExperience}
                  className="px-4 py-2 border border-[#E2E8F0] rounded-md text-sm text-[#4A5568] hover:bg-[#F7FAFC]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 font-display">Categories</h2>
          {!editingCategories && (
            <button
              onClick={() => setEditingCategories(true)}
              className="text-[#FF6B35] hover:text-[#e55a2b]"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          {!editingCategories ? (
            <div className="space-y-4">
              <div>
                <p className="font-medium text-[#1A202C]">Web, Mobile & Software Dev</p>
                <ul className="ml-4 text-sm text-[#4A5568] list-disc">
                  {categories.web.sub.ecommerce && <li>Ecommerce Development</li>}
                  {categories.web.sub.design && <li>Web & Mobile Design</li>}
                  {categories.web.sub.development && <li>Web Development</li>}
                </ul>
              </div>
              <div>
                <p className="font-medium text-[#1A202C]">Design & Creative</p>
                <ul className="ml-4 text-sm text-[#4A5568] list-disc">
                  {categories.design.sub.graphic && <li>Graphic, Editorial & Presentation Design</li>}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Web, Mobile & Software Dev */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1A202C]">
                  <input
                    type="checkbox"
                    checked={categories.web.checked}
                    onChange={() =>
                      setCategories((prev) => ({
                        ...prev,
                        web: { ...prev.web, checked: !prev.web.checked },
                      }))
                    }
                    className="accent-[#FF6B35]"
                  />
                  <span>Web, Mobile & Software Dev</span>
                </label>
                {categories.web.checked && (
                  <div className="ml-6 mt-2 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-[#4A5568]">
                      <input
                        type="checkbox"
                        checked={categories.web.sub.ecommerce}
                        onChange={() =>
                          setCategories((prev) => ({
                            ...prev,
                            web: {
                              ...prev.web,
                              sub: { ...prev.web.sub, ecommerce: !prev.web.sub.ecommerce },
                            },
                          }))
                        }
                        className="accent-[#FF6B35]"
                      />
                      Ecommerce Development
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-[#4A5568]">
                      <input
                        type="checkbox"
                        checked={categories.web.sub.design}
                        onChange={() =>
                          setCategories((prev) => ({
                            ...prev,
                            web: {
                              ...prev.web,
                              sub: { ...prev.web.sub, design: !prev.web.sub.design },
                            },
                          }))
                        }
                        className="accent-[#FF6B35]"
                      />
                      Web & Mobile Design
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-[#4A5568]">
                      <input
                        type="checkbox"
                        checked={categories.web.sub.development}
                        onChange={() =>
                          setCategories((prev) => ({
                            ...prev,
                            web: {
                              ...prev.web,
                              sub: { ...prev.web.sub, development: !prev.web.sub.development },
                            },
                          }))
                        }
                        className="accent-[#FF6B35]"
                      />
                      Web Development
                    </label>
                  </div>
                )}
              </div>
              {/* Design & Creative */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1A202C]">
                  <input
                    type="checkbox"
                    checked={categories.design.checked}
                    onChange={() =>
                      setCategories((prev) => ({
                        ...prev,
                        design: { ...prev.design, checked: !prev.design.checked },
                      }))
                    }
                    className="accent-[#FF6B35]"
                  />
                  <span>Design & Creative</span>
                </label>
                {categories.design.checked && (
                  <div className="ml-6 mt-2 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-[#4A5568]">
                      <input
                        type="checkbox"
                        checked={categories.design.sub.graphic}
                        onChange={() =>
                          setCategories((prev) => ({
                            ...prev,
                            design: {
                              ...prev.design,
                              sub: { ...prev.design.sub, graphic: !prev.design.sub.graphic },
                            },
                          }))
                        }
                        className="accent-[#FF6B35]"
                      />
                      Graphic, Editorial & Presentation Design
                    </label>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={saveCategories}
                  className="px-4 py-2 bg-[#FF6B35] text-white rounded-md text-sm font-medium hover:bg-[#e55a2b]"
                >
                  Save
                </button>
                <button
                  onClick={cancelCategories}
                  className="px-4 py-2 border border-[#E2E8F0] rounded-md text-sm text-[#4A5568] hover:bg-[#F7FAFC]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Specialized profiles */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900 font-display">Specialized profiles</h2>
          {!editingSpecialized && (
            <button
              onClick={() => setEditingSpecialized(true)}
              className="text-[#FF6B35] hover:text-[#e55a2b]"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-sm text-[#718096] mb-3">
          Create up to two different versions of your profile to more effectively highlight your individual specialties.{' '}
          <a href="#" className="text-[#FF6B35] hover:underline">Learn more</a>
        </p>
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
          {!editingSpecialized ? (
            <div className="space-y-2">
              {specialized.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-[#1A202C]">{item.name}</span>
                  <span className="text-xs text-[#10B981] bg-green-50 px-2 py-1 rounded-full">
                    {item.published ? 'Published' : 'Unpublished'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {specializedDraft.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newDraft = [...specializedDraft];
                      newDraft[idx].name = e.target.value;
                      setSpecializedDraft(newDraft);
                    }}
                    className="flex-1 border border-[#E2E8F0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                  <label className="flex items-center gap-1 text-sm text-[#4A5568]">
                    <input
                      type="checkbox"
                      checked={item.published}
                      onChange={(e) => {
                        const newDraft = [...specializedDraft];
                        newDraft[idx].published = e.target.checked;
                        setSpecializedDraft(newDraft);
                      }}
                      className="accent-[#FF6B35]"
                    />
                    Published
                  </label>
                </div>
              ))}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={saveSpecialized}
                  className="px-4 py-2 bg-[#FF6B35] text-white rounded-md text-sm font-medium hover:bg-[#e55a2b]"
                >
                  Save
                </button>
                <button
                  onClick={cancelSpecialized}
                  className="px-4 py-2 border border-[#E2E8F0] rounded-md text-sm text-[#4A5568] hover:bg-[#F7FAFC]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Linked accounts */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 font-display">Linked accounts</h2>
          {!editingLinked && (
            <button
              onClick={() => setEditingLinked(true)}
              className="text-[#FF6B35] hover:text-[#e55a2b]"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          {!editingLinked ? (
            <div className="flex gap-6">
              {linkedAccounts.map((acc, idx) => (
                <span key={idx} className="text-sm text-[#1A202C] font-medium">
                  {acc}
                </span>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {linkedDraft.map((acc, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={acc}
                    onChange={(e) => {
                      const newDraft = [...linkedDraft];
                      newDraft[idx] = e.target.value;
                      setLinkedDraft(newDraft);
                    }}
                    className="flex-1 border border-[#E2E8F0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                  <button
                    onClick={() => {
                      const newDraft = linkedDraft.filter((_, i) => i !== idx);
                      setLinkedDraft(newDraft);
                    }}
                    className="text-[#EF4444] hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => setLinkedDraft([...linkedDraft, 'New Account'])}
                className="text-sm text-[#FF6B35] font-medium hover:underline"
              >
                + Add account
              </button>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={saveLinked}
                  className="px-4 py-2 bg-[#FF6B35] text-white rounded-md text-sm font-medium hover:bg-[#e55a2b]"
                >
                  Save
                </button>
                <button
                  onClick={cancelLinked}
                  className="px-4 py-2 border border-[#E2E8F0] rounded-md text-sm text-[#4A5568] hover:bg-[#F7FAFC]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AI preference */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 font-display">AI preference</h2>
          {!editingAi && (
            <button
              onClick={() => setEditingAi(true)}
              className="text-[#FF6B35] hover:text-[#e55a2b]"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 flex items-center justify-between">
          {!editingAi ? (
            <>
              <p className="text-sm text-[#4A5568] max-w-xl">
                Choose how your FreelanceHub Pro data is used for AI training and improvement.{' '}<br/>
                <a href="#" className="text-[#FF6B35] hover:underline">Learn more</a>
              </p>
              <button
                onClick={() => alert('Preference settings would open here.')}
                className="px-4 py-2 bg-[#FF6B35] text-white rounded-md text-sm font-medium hover:bg-[#e55a2b]"
              >
                Set preference
              </button>
            </>
          ) : (
            <div className="w-full">
              <select
                value={aiPreference}
                onChange={(e) => setAiPreference(e.target.value as 'opt-in' | 'opt-out')}
                className="w-full max-w-md border border-[#E2E8F0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              >
                <option value="opt-in">Opt in to AI training</option>
                <option value="opt-out">Opt out of AI training</option>
              </select>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={saveAi}
                  className="px-4 py-2 bg-[#FF6B35] text-white rounded-md text-sm font-medium hover:bg-[#e55a2b]"
                >
                  Save
                </button>
                <button
                  onClick={cancelAi}
                  className="px-4 py-2 border border-[#E2E8F0] rounded-md text-sm text-[#4A5568] hover:bg-[#F7FAFC]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}