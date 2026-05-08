import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (!supabase) {
  console.warn("Supabase client not initialized: Missing credentials.");
}

export const initializeStorage = async () => {
  if (!supabase) return;
  
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === 'tenant-documents');
  
  if (!exists) {
    console.log("Creating 'tenant-documents' bucket...");
    const { error } = await supabase.storage.createBucket('tenant-documents', {
      public: true
    });
    if (error) console.error("Error creating bucket:", error.message);
    else console.log("'tenant-documents' bucket created successfully.");
  }
};
