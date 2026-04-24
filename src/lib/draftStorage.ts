// export type DraftJob = {
//   id: string;
//   data: any;
//   updatedAt: number;
// };

// const KEY = "job_drafts";

// export function getDrafts(): DraftJob[] {
//   if (typeof window === "undefined") return [];
//   return JSON.parse(localStorage.getItem(KEY) || "[]");
// }

// export function saveDraft(draft: DraftJob) {
//   const drafts = getDrafts();
//   const updated = drafts.filter(d => d.id !== draft.id);
//   localStorage.setItem(KEY, JSON.stringify([...updated, draft]));
// }

// export function getDraftById(id: string) {
//   return getDrafts().find(d => d.id === id);
// }

// export function deleteDraft(id: string) {
//   const drafts = getDrafts().filter(d => d.id !== id);
//   localStorage.setItem(KEY, JSON.stringify(drafts));
// }

// const DRAFT_KEY = "jobDrafts";

// export const getDrafts = () => {
//   if (typeof window === "undefined") return [];
//   return JSON.parse(localStorage.getItem(DRAFT_KEY) || "[]");
// };

// export const saveDraft = (draft: any) => {
//   const drafts = getDrafts();
//   drafts.push(draft);
//   localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
// };

// export const deleteDraft = (id: number) => {
//   const drafts = getDrafts();

//   const updatedDrafts = drafts.filter(
//     (draft: any) => draft.id !== id
//   );

//   localStorage.setItem(DRAFT_KEY, JSON.stringify(updatedDrafts));
// };

const DRAFT_KEY = "jobDrafts";

export const getDrafts = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(DRAFT_KEY) || "[]");
};

export const getDraftById = (id: string) => {
  const drafts = getDrafts();
  return drafts.find((draft: any) => String(draft.id) === String(id));
};

export const saveDraft = (draft: any) => {
  const drafts = getDrafts();

  const existingIndex = drafts.findIndex(
    (d: any) => String(d.id) === String(draft.id)
  );

  if (existingIndex !== -1) {
    drafts[existingIndex] = draft;
  } else {
    drafts.push(draft);
  }

  localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
};

export const deleteDraft = (id: number | string) => {
  const drafts = getDrafts();
  const updatedDrafts = drafts.filter(
    (draft: any) => String(draft.id) !== String(id)
  );
  localStorage.setItem(DRAFT_KEY, JSON.stringify(updatedDrafts));
};
