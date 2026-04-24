export type DocumentStatus = "Verified" | "Pending" | "Rejected";
export type DocumentType = "Aadhar Card" | "PAN Card" | "Passport" | "Driving License" | "Voter ID" | "Bank Statement" | "No Document" | "Other" | string;
export type UserRole = "client" | "freelancer";

export interface User {
  id: string;
  name: string;
  email: string;
  contact: string;
  role: UserRole;
  avatar: string;
  joinedDate: string;
  documentId: string | null;
  documentType: DocumentType;
  documentStatus: DocumentStatus;
  documentUrl: string | null;
  rejectionReason: string | null;
  uploadDate: string;
  hasDocument: boolean;
  isBlocked: boolean;
}

export interface FilterState {
  search: string;
  status: DocumentStatus | "All";
  role: UserRole | "All";
}

export interface StatCard {
  label: string;
  value: number;
  accent: string;
  gradient: string;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface ActionItem {
  label: string | ((user: User) => string);
  emoji: string;
  onClick: (user: User) => void;
}