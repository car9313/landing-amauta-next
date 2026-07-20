export interface SurveyData {
  ageGroup: '5-6' | '7-8' | '9-10' | '11-12' | '';
  subjectInterest: 'Aritmética' | 'Geometría' | 'Razonamiento' | 'Todo' | '';
  parentName: string;
  parentEmail: string;
  additionalComments?: string;
}


export interface FeatureItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
}

export interface TimelineStep {
  stepNumber: number;
  title: string;
  description: string;
  detailedPoints: string[];
}
