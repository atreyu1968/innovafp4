export type ObservationType = 
  | 'methodology' 
  | 'technology' 
  | 'pedagogy' 
  | 'business';

export interface ObservationEntry {
  id: string;
  subnetId: string;
  type: ObservationType;
  title: string;
  description: string;
  url: string;
  status: 'pending' | 'draft' | 'published' | 'rejected';
  aiContent?: string;
  aiSummary?: string;
  aiTags?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface ObservatoryConfig {
  enabled: boolean;
  aiEnabled: boolean;
  autoPublish: boolean;
  moderators: string[];
  openaiApiKey?: string;
  promptTemplate?: string;
}