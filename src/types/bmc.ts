export interface BmcItem {
  id: string;
  title: string;
  description: string;
  tag?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan' | 'slate';
}

export interface BmcBlock {
  key: string;
  titleId: string;
  titleEn: string;
  descriptionId: string;
  descriptionEn: string;
  iconName: string;
  accentColor: string;
}

export interface BmcData {
  id?: string;
  businessName: string;
  tagline: string;
  executiveSummary: string;
  elevatorPitch: string;
  keyPartners: BmcItem[];
  keyActivities: BmcItem[];
  keyResources: BmcItem[];
  valuePropositions: BmcItem[];
  customerRelationships: BmcItem[];
  channels: BmcItem[];
  customerSegments: BmcItem[];
  costStructure: BmcItem[];
  revenueStreams: BmcItem[];
  financialOverview?: {
    estimatedGrossMargin: string;
    primaryCostDrivers: string[];
    keyMetrics: string[];
  };
  swotSummary?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    strategicRecommendations?: string[];
  };
  nextActionItems?: string[];
  metadata?: {
    generatedAt: string;
    industry: string;
    language: 'id' | 'en';
  };
}

export interface BmcTemplate {
  id: string;
  name: string;
  industry: string;
  description: string;
  icon: string;
  data: BmcData;
}

export interface AiCritiqueResult {
  overallScore: number;
  rating: string;
  executiveSummary: string;
  strengths: string[];
  criticalRisks: string[];
  actionableRecommendations: string[];
  keyQuestionsToAnswer: string[];
}
