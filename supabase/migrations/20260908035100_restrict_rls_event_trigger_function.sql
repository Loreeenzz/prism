-- Supabase's optional RLS event-trigger helper is not an application RPC.
-- Keep it callable by its event trigger, but not by Data API roles.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public;
  end if;
end
$$;
