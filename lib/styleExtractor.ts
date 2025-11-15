/**
 * Represents a block configuration with optional styling and nested blocks
 */
export interface BlockConfig {
  /** Unique identifier for the block */
  id?: string;
  
  /** CSS content to be injected as a style tag */
  styleTagContent?: string;
  
  /** Nested child blocks */
  blocks?: BlockConfig[];
  
  /** Additional properties that may exist on a block */
  [key: string]: unknown;
}
/**
 * Extracts all unique styles from a block configuration tree
 * @param config - The root block configuration
 * @returns A Map of style IDs to style content
 */
export function extractStyles(config: BlockConfig | null | undefined): Map<string, string> {
  const styles = new Map<string, string>();
  
  if (!config) return styles;
  
  const traverse = (block: BlockConfig) => {
    // Extract style from current block
    if (block.styleTagContent) {
      const styleId = block.id 
        ? `style-${block.id}` 
        : `style-${hashCode(block.styleTagContent)}`;
      
      // Only add if not already present (deduplication)
      if (!styles.has(styleId)) {
        styles.set(styleId, block.styleTagContent);
      }
    }
    
    // Recursively traverse child blocks
    if (block.blocks && Array.isArray(block.blocks)) {
      block.blocks.forEach(childBlock => traverse(childBlock));
    }
  };
  
  traverse(config);
  return styles;
}

/**
 * Generates a simple hash code from a string
 * @param str - The input string
 * @returns A hash of the string
 */
function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Converts a style Map to an array of style tag strings
 * @param styles - Map of style IDs to content
 * @returns Array of HTML style tag strings
 */
export function stylesToHtml(styles: Map<string, string>): string[] {
  return Array.from(styles.entries()).map(([id, content]) => {
    return `<style id="${id}">${content}</style>`;
  });
}

/**
 * Generates a complete style block for server-side rendering
 * @param config - The block configuration
 * @returns A single HTML string with all style tags
 */
export function generateStyleBlock(config: BlockConfig | null | undefined): string {
  const styles = extractStyles(config);
  return stylesToHtml(styles).join('\n');
}