import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type SeedUser = { email: string; password: string; full_name: string; role: "admin" | "teacher" };

const SEED_USERS: SeedUser[] = [
  { email: "1234@aiubt.kz", password: "1234", full_name: "Admin", role: "admin" },
  { email: "123@aiubt.kz", password: "123", full_name: "Teacher", role: "teacher" },
];

/**
 * Idempotent: ensures the seed admin / teacher accounts exist and have the right role.
 * Safe to call from the login page on the fly. Uses the service role key.
 */
export const ensureSeedUsers = createServerFn({ method: "POST" }).handler(async () => {
  const results: Array<{ email: string; created: boolean }> = [];

  for (const u of SEED_USERS) {
    // Try to find existing user by listing (admin API)
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existing = list?.users.find((x) => x.email?.toLowerCase() === u.email.toLowerCase());

    let userId: string | undefined = existing?.id;

    if (!existing) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name },
      });
      if (error) {
        console.error(`[seed] failed to create ${u.email}:`, error.message);
        continue;
      }
      userId = data.user?.id;
      results.push({ email: u.email, created: true });
    } else {
      results.push({ email: u.email, created: false });
    }

    if (!userId) continue;

    // Promote: remove default 'student' role (added by trigger), set requested role
    await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);
    await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: u.role });
  }

  return { ok: true, results };
});
