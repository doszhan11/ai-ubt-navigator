
-- Restrict execute on security definer helpers
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.get_my_role() FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;

-- Set search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Replace permissive insert on error_reports with reported_by check
DROP POLICY IF EXISTS "Authed insert reports" ON public.error_reports;
CREATE POLICY "Authed insert own reports" ON public.error_reports
  FOR INSERT TO authenticated
  WITH CHECK (reported_by = auth.uid() OR reported_by IS NULL);
