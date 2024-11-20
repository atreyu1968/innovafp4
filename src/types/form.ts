export type FormFieldType = 
  | 'text' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'date' 
  | 'number'
  | 'file'
  | 'section'
  | 'scale';

export interface ScaleConfig {
  min: number;
  max: number;
  step: number;
  minLabel?: string;
  maxLabel?: string;
  showValue?: boolean;
}

export interface ConditionalRule {
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains';
  value: string;
  jumpToFieldId: string;
}

export interface FileResponse {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
  fileTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
  fields?: FormField[];
  conditionalRules?: ConditionalRule[];
  scaleConfig?: ScaleConfig;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  assignedRoles: string[];
  academicYearId: string;
  startDate?: string;
  endDate?: string;
  status: 'borrador' | 'publicado' | 'cerrado';
  acceptingResponses: boolean;
  allowMultipleResponses: boolean;
  allowResponseModification: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  createdByName?: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  userId: string;
  userName: string;
  userRole: string;
  academicYearId: string;
  responses: {
    [fieldId: string]: string | string[] | boolean | FileResponse[] | number;
  };
  status: 'borrador' | 'enviado';
  responseTimestamp: string;
  lastModifiedTimestamp: string;
  submissionTimestamp?: string;
  version: number;
  isModification?: boolean;
  originalResponseId?: string;
}