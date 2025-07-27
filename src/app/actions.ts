
'use server';

import { generateWebsiteContent } from '@/ai/flows/generate-website-content';
import { suggestImagePrompts } from '@/ai/flows/suggest-image-prompts';
import { inlineAIEdit } from '@/ai/flows/inline-ai-edit';
import type { WebsiteContent, GenerateWebsiteParams } from '@/lib/types';

function parseRawContent(rawContent: string, sections: string[]): { title: string, content: string, type: string }[] {
  const parsedSections: { title: string, content: string, type: string }[] = [];
  
  // Create a flexible regex to find sections based on markdown headers
  // It handles variations in whitespace and case-insensitivity for section names
  const sectionHeaders = sections.map(s => s.replace(/ /g, '\\s*')).join('|');
  const regex = new RegExp(`^#+\\s*(${sectionHeaders})\\s*\\n`, 'gim');
  
  const parts = rawContent.split(regex);

  if (parts.length < 3) { // Not split, treat as single section
      const firstLineEnd = rawContent.indexOf('\n');
      const title = firstLineEnd !== -1 ? rawContent.substring(0, firstLineEnd).replace(/^#+\s*/, '') : 'Hero';
      const content = firstLineEnd !== -1 ? rawContent.substring(firstLineEnd + 1) : rawContent;
      return [{ title, content, type: 'hero' }];
  }

  // The first part is usually content before the first recognized section header, often a hero
  if (parts[0].trim()) {
     const heroContent = parts[0].trim();
     const firstLineEnd = heroContent.indexOf('\n');
     const title = firstLineEnd !== -1 ? heroContent.substring(0, firstLineEnd).replace(/^#+\s*/, '') : 'Hero';
     const content = firstLineEnd !== -1 ? heroContent.substring(firstLineEnd + 1).trim() : heroContent;
     parsedSections.push({title, content, type: 'hero'});
  }
  
  for (let i = 1; i < parts.length; i += 2) {
    const type = parts[i].trim().toLowerCase().replace(/\s/g, '-');
    const content = parts[i+1]?.trim() || '';
    if (content) {
      parsedSections.push({
        title: parts[i].trim(),
        content: content,
        type: type,
      });
    }
  }

  return parsedSections;
}

export async function generateWebsiteAction({
  prompt,
  sections,
  parallax,
}: GenerateWebsiteParams): Promise<WebsiteContent> {
  const fullPrompt = `Create website content for a company based on the following description: "${prompt}". The website should include the following sections: ${sections.join(
    ', '
  )}. The output should be formatted in markdown, with each section starting with a heading.`;

  const { websiteContent } = await generateWebsiteContent({ prompt: fullPrompt });

  const parsedSections = parseRawContent(websiteContent, sections);

  if (parsedSections.length === 0) {
    throw new Error("AI failed to generate parsable content. Please try again.");
  }
  
  const sectionContentForImagePrompts = parsedSections.reduce((acc, section) => {
    acc[section.title] = section.content;
    return acc;
  }, {} as Record<string, string>);


  const imagePrompts = await suggestImagePrompts({
    websiteContent: sectionContentForImagePrompts,
  });

  const finalSections = parsedSections.map((section, index) => ({
    ...section,
    id: `${section.type}-${index}`,
    imagePrompt: imagePrompts[section.title] || `abstract design for ${section.title}`,
  }));

  return { sections: finalSections, parallax };
}

export async function rewriteTextAction(
  originalText: string,
  instruction: string,
  context?: string,
): Promise<string> {
    const { editedText } = await inlineAIEdit({
        selectedText: originalText,
        instruction,
        context: context || '',
    });
    return editedText;
}
