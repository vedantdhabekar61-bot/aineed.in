export interface AiTool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  icon?: string; // Optional icon placeholder
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  results: AiTool[];
  error: string | null;
}