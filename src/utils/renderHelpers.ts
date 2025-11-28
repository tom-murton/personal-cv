import React from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * Splits a text string into paragraphs and handles bullet points
 * @param text The text content to process
 * @returns An array of React elements representing the paragraphs
 */
export const renderParagraphsWithBullets = (text: string): React.ReactNode[] => {
  if (!text) return [];
  
  // Split the text into paragraphs by newline
  const paragraphs = text.split('\n');
  const result: React.ReactNode[] = [];
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    
    // Skip empty paragraphs
    if (!paragraph.trim()) continue;
    
    // Check if this is a bullet point paragraph
    if (paragraph.startsWith('•')) {
      // Collect all consecutive bullet points
      const bulletPoints: string[] = [];
      
      // Start from current paragraph and collect all consecutive bullet points
      let j = i;
      while (j < paragraphs.length && paragraphs[j].startsWith('•')) {
        bulletPoints.push(paragraphs[j].substring(1).trim());
        j++;
      }
      
      // Skip the bullet paragraphs we've processed
      i = j - 1;
      
      // Create a list element with all bullet points
      result.push(
        React.createElement(
          'ul',
          { className: "ml-0 my-2 space-y-2", key: `bullet-${i}` },
          bulletPoints.map((bullet, index) => 
            React.createElement(
              'li',
              { key: index, className: "flex items-start" },
              [
                React.createElement(
                  'div',
                  { className: "text-accent-teal mr-2 mt-1 flex-shrink-0", key: 'bullet-icon' },
                  React.createElement(ChevronRight, { size: 14 })
                ),
                React.createElement(
                  'span',
                  { key: 'bullet-text' },
                  bullet
                )
              ]
            )
          )
        )
      );
    } else {
      // Regular paragraph
      result.push(
        React.createElement(
          'p',
          { key: `p-${i}`, className: "mb-4" },
          paragraph
        )
      );
    }
  }
  
  return result;
}; 