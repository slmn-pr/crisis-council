type Mission = 'scored' | 'analytical' | 'team';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  avatar: string;
}

interface ResultEntry {
  id: string;
  userId: string;
  mission: Mission;
  data: Record<string, any>;
  createdAt: number;
}

interface APIClient {
  login(profile: Omit<User, 'id'>): Promise<{ user: User }>;
  me(): Promise<{ user: User }>;
  logout(): Promise<{ ok: boolean }>;
  saveResult(mission: Mission, data: Record<string, any>): Promise<{ ok: boolean; id: string }>;
  results(): Promise<{ results: ResultEntry[] }>;
  leaderboard(): Promise<{ leaderboard: Array<{ nickname: string; avatar: string; score: number }> }>;
}

declare const API: APIClient;

interface Window {
  API: APIClient;
  currentUser?: User;
  showResults: (...args: any[]) => void;
}
