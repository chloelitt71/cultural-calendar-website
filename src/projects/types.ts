export type ProjectItemType = 'talent' | 'match' | 'lookup' | 'event' | 'moment';

export interface ProjectSavedItem {
  id: string;
  sourceId: string;
  type: ProjectItemType;
  originPage: 'moments' | 'calendar' | 'talent' | 'talent-match' | 'talent-intel';
  title: string;
  subtitle?: string;
  description?: string;
  url?: string;
  metadata?: Record<string, string>;
  savedAt: string;
}

export interface ProjectRecord {
  id: string;
  name: string;
  brandName?: string;
  campaignGoal?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: ProjectSavedItem[];
}

export interface CreateProjectInput {
  name: string;
  brandName?: string;
  campaignGoal?: string;
  notes?: string;
}

export interface SaveProjectItemInput {
  projectId: string;
  item: Omit<ProjectSavedItem, 'id' | 'savedAt'>;
}
