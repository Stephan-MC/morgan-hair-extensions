export interface AccessToken {
  name: string;
  abilities: Array<string>;
  tokenable_id: string;
  tokenable_type: string;
  last_used_at: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export type PlainTextToken = `${number}|${string}`;
