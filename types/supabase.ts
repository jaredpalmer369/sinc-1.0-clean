export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string
          type: string
          tags: string[]
          user_id: string
          is_favorite: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: string
          type: string
          tags?: string[]
          user_id?: string
          is_favorite?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string
          type?: string
          tags?: string[]
          user_id?: string
          is_favorite?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
      },
      executions: {
        Row: {
          id: string;
          prompt_id: string;
          user_id: string;
          output: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          prompt_id: string;
          user_id: string;
          output: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          prompt_id?: string;
          user_id?: string;
          output?: string;
          created_at?: string;
        };
      },
      prompt_runs: {
        Row: {
          id: string;
          user_id: string;
          prompt: string;
          result: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prompt: string;
          result: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          prompt?: string;
          result?: string;
          created_at?: string;
        };
      },
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
