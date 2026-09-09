-- This function is invoked by the auth.users trigger, not by the Data API.
-- SECURITY DEFINER functions should not be callable by public API roles.
revoke execute on function public.handle_new_user() from public;
