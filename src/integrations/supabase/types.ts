export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      fahrzeuge: {
        Row: {
          ausstattung_json: Json | null
          autohaus_id: string | null
          baujahr: number | null
          beschreibung: string | null
          created_at: string
          created_by: string | null
          farbe: string | null
          getriebe: string | null
          id: string
          km: number | null
          kraftstoff: string | null
          marke: string
          modell: string
          preis: number
          status: string
          tueren: number | null
          updated_at: string
          vin: string | null
        }
        Insert: {
          ausstattung_json?: Json | null
          autohaus_id?: string | null
          baujahr?: number | null
          beschreibung?: string | null
          created_at?: string
          created_by?: string | null
          farbe?: string | null
          getriebe?: string | null
          id?: string
          km?: number | null
          kraftstoff?: string | null
          marke: string
          modell: string
          preis: number
          status?: string
          tueren?: number | null
          updated_at?: string
          vin?: string | null
        }
        Update: {
          ausstattung_json?: Json | null
          autohaus_id?: string | null
          baujahr?: number | null
          beschreibung?: string | null
          created_at?: string
          created_by?: string | null
          farbe?: string | null
          getriebe?: string | null
          id?: string
          km?: number | null
          kraftstoff?: string | null
          marke?: string
          modell?: string
          preis?: number
          status?: string
          tueren?: number | null
          updated_at?: string
          vin?: string | null
        }
        Relationships: []
      }
      fotos: {
        Row: {
          created_at: string
          fahrzeug_id: string
          id: string
          reihenfolge: number
          storage_url: string
        }
        Insert: {
          created_at?: string
          fahrzeug_id: string
          id?: string
          reihenfolge?: number
          storage_url: string
        }
        Update: {
          created_at?: string
          fahrzeug_id?: string
          id?: string
          reihenfolge?: number
          storage_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fotos_fahrzeug_id_fkey"
            columns: ["fahrzeug_id"]
            isOneToOne: false
            referencedRelation: "fahrzeuge"
            referencedColumns: ["id"]
          },
        ]
      }
      ki_aktionen: {
        Row: {
          aktion_typ: string
          beschreibung: string
          created_at: string
          details: Json | null
          fahrzeug_id: string | null
          id: string
        }
        Insert: {
          aktion_typ: string
          beschreibung: string
          created_at?: string
          details?: Json | null
          fahrzeug_id?: string | null
          id?: string
        }
        Update: {
          aktion_typ?: string
          beschreibung?: string
          created_at?: string
          details?: Json | null
          fahrzeug_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ki_aktionen_fahrzeug_id_fkey"
            columns: ["fahrzeug_id"]
            isOneToOne: false
            referencedRelation: "fahrzeuge"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          anfrage_id: string | null
          erstellt_at: string
          fahrzeug_id: string | null
          id: string
          ki_zusammenfassung: string | null
          letzte_aktivitaet_at: string
          notizen: Json | null
          prioritaet: string
          quelle: string
          sender_email: string | null
          sender_name: string
          sender_phone: string | null
          status: string
        }
        Insert: {
          anfrage_id?: string | null
          erstellt_at?: string
          fahrzeug_id?: string | null
          id?: string
          ki_zusammenfassung?: string | null
          letzte_aktivitaet_at?: string
          notizen?: Json | null
          prioritaet?: string
          quelle?: string
          sender_email?: string | null
          sender_name: string
          sender_phone?: string | null
          status?: string
        }
        Update: {
          anfrage_id?: string | null
          erstellt_at?: string
          fahrzeug_id?: string | null
          id?: string
          ki_zusammenfassung?: string | null
          letzte_aktivitaet_at?: string
          notizen?: Json | null
          prioritaet?: string
          quelle?: string
          sender_email?: string | null
          sender_name?: string
          sender_phone?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_fahrzeug_id_fkey"
            columns: ["fahrzeug_id"]
            isOneToOne: false
            referencedRelation: "fahrzeuge"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
