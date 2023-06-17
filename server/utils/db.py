from decouple import config
from supabase import create_client, Client

url: str = config("SUPABASE_URL")
key: str = config("SUPABASE_KEY")
supabase: Client = create_client(url, key)