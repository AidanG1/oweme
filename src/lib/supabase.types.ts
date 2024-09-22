export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      friends: {
        Row: {
          accepted: boolean
          created_at: string
          friend_1: string
          friend_2: string
          id: string
        }
        Insert: {
          accepted?: boolean
          created_at?: string
          friend_1: string
          friend_2: string
          id?: string
        }
        Update: {
          accepted?: boolean
          created_at?: string
          friend_1?: string
          friend_2?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_friend_1_fkey"
            columns: ["friend_1"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_friend_2_fkey"
            columns: ["friend_2"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      item_user: {
        Row: {
          amount_basis_points: number
          created_at: string
          email: string
          id: string
          item: string
        }
        Insert: {
          amount_basis_points: number
          created_at?: string
          email: string
          id?: string
          item: string
        }
        Update: {
          amount_basis_points?: number
          created_at?: string
          email?: string
          id?: string
          item?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_user_item_fkey"
            columns: ["item"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          name: string
          transaction: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          name: string
          transaction: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          name?: string
          transaction?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_items_transaction_fkey"
            columns: ["transaction"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      owed: {
        Row: {
          amount_cents: number
          created_at: string
          email: string
          id: string
          ower: string | null
          paid: boolean
          transaction: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          email: string
          id?: string
          ower?: string | null
          paid?: boolean
          transaction: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          email?: string
          id?: string
          ower?: string | null
          paid?: boolean
          transaction?: string
        }
        Relationships: [
          {
            foreignKeyName: "owed_ower_fkey"
            columns: ["ower"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "owed_transaction_fkey"
            columns: ["transaction"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          receiver: string
          sender: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          receiver: string
          sender: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          receiver?: string
          sender?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_receiver_fkey1"
            columns: ["receiver"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_sender_fkey1"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string
          email: string
          id: string
          name: string | null
          updated_at: string | null
          venmo: string | null
        }
        Insert: {
          avatar_url?: string
          email?: string
          id: string
          name?: string | null
          updated_at?: string | null
          venmo?: string | null
        }
        Update: {
          avatar_url?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string | null
          venmo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          created_at: string
          id: string
          name: string | null
          ordered_time: string | null
          subtotal_cents: number | null
          tax_cents: number | null
          tip_cents: number | null
          total_cents: number | null
          transaction: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          ordered_time?: string | null
          subtotal_cents?: number | null
          tax_cents?: number | null
          tip_cents?: number | null
          total_cents?: number | null
          transaction: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          ordered_time?: string | null
          subtotal_cents?: number | null
          tax_cents?: number | null
          tip_cents?: number | null
          total_cents?: number | null
          transaction?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_transaction_fkey"
            columns: ["transaction"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          name: string
          paid: boolean | null
          payer: string
          selected_emails: string[]
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          name: string
          paid?: boolean | null
          payer: string
          selected_emails?: string[]
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          name?: string
          paid?: boolean | null
          payer?: string
          selected_emails?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_payer_fkey1"
            columns: ["payer"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
