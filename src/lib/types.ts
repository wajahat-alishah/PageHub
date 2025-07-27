export interface WebsiteSection {
  id: string;
  type: string;
  title: string;
  content: string;
  imagePrompt: string;
}

export interface WebsiteContent {
  sections: WebsiteSection[];
  parallax: boolean;
}

export type GenerateWebsiteParams = {
  prompt: string;
  sections: string[];
  parallax: boolean;
};
