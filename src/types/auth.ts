// Previous imports and types remain...

export interface RegistrationCode {
  id: string;
  code: string;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
  createdBy: string;
  createdAt: string;
  academicYearId: string;
  active: boolean;
}

export interface RegistrationSettings {
  enabled: boolean;
  requireCode: boolean;
  defaultRole: UserRole;
  allowedRoles: UserRole[];
  autoApprove: boolean;
  notifyAdmin: boolean;
}