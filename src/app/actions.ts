
'use server';

import { generateWebsiteContent } from '@/ai/flows/generate-website-content';
import { suggestImagePrompts } from '@/ai/flows/suggest-image-prompts';
import { inlineAIEdit } from '@/ai/flows/inline-ai-edit';
import type { WebsiteContent, GenerateWebsiteParams } from '@/lib/types';

function parseRawContent(rawContent: string, sections: string[]): { title: string, content: string, type: string }[] {
  if (!rawContent) return [];
  
  const parsedSections: { title: string, content: string, type: string }[] = [];
  const lines = rawContent.split('\n');
  
  let currentSection: { title: string, content: string, type: string } | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const isHeader = trimmedLine.startsWith('#');

    if (isHeader) {
      if (currentSection) {
        // Save previous section
        currentSection.content = currentSection.content.trim();
        parsedSections.push(currentSection);
      }
      // Start new section
      const title = trimmedLine.replace(/^#+\s*/, '').trim();
      const type = title.toLowerCase().replace(/\s+/g, '-');
      currentSection = { title, type, content: '' };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    } else {
      // Content before any header, treat as hero
      const title = 'Hero';
      currentSection = { title, type: 'hero', content: line + '\n' };
    }
  }

  // Add the last section
  if (currentSection) {
    currentSection.content = currentSection.content.trim();
    if(currentSection.content || parsedSections.length === 0){ // Add if it has content, or if it's the only section
        parsedSections.push(currentSection);
    }
  }

  // Fallback if parsing fails to produce anything
  if (parsedSections.length === 0 && rawContent.trim()) {
    parsedSections.push({
        title: 'Content',
        type: 'hero',
        content: rawContent.trim()
    });
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
