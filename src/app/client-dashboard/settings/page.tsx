'use client';

import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline'; // or any icon library
import Filesection from './component/filesection';

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

      <Filesection/>


    </main>
  );
}