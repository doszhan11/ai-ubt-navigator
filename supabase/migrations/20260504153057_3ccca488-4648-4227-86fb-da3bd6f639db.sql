
-- Helper function: promote an existing auth user to a given role by email.
-- SECURITY DEFINER so it can write to user_roles regardless of caller, but
-- we restrict execution to the service role only (used from server code / SQL).
CREATE OR REPLACE FUNCTION public.promote_user_by_email(_email text, _role public.app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
BEGIN
  SELECT id INTO _uid FROM auth.users WHERE email = _email LIMIT 1;
  IF _uid IS NULL THEN
    RAISE NOTICE 'No user with email %', _email;
    RETURN;
  END IF;

  -- Remove default 'student' role and add the requested role
  DELETE FROM public.user_roles WHERE user_id = _uid;
  INSERT INTO public.user_roles (user_id, role) VALUES (_uid, _role)
    ON CONFLICT DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.promote_user_by_email(text, public.app_role) FROM PUBLIC, anon, authenticated;
