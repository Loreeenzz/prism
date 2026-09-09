-- Keep client permissions explicit instead of relying on Supabase defaults.
revoke all on table public.profiles from anon, authenticated;

grant select, insert, update on table public.profiles to authenticated;
