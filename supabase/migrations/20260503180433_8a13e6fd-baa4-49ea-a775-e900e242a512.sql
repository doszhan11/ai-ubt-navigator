
-- =========================
-- Enums
-- =========================
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE public.subscription_tier AS ENUM ('free', 'premium');
CREATE TYPE public.homework_type AS ENUM ('test', 'file');
CREATE TYPE public.submission_status AS ENUM ('pending', 'graded', 'reviewed');
CREATE TYPE public.session_status AS ENUM ('upcoming', 'live', 'ended');
CREATE TYPE public.report_status AS ENUM ('open', 'resolved');

-- =========================
-- profiles
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  language TEXT NOT NULL DEFAULT 'kz',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =========================
-- user_roles (separate table, secure)
-- =========================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY CASE role WHEN 'admin' THEN 1 WHEN 'teacher' THEN 2 ELSE 3 END
  LIMIT 1
$$;

-- =========================
-- subject_pairs
-- =========================
CREATE TABLE public.subject_pairs (
  id SERIAL PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_kz TEXT NOT NULL,
  subject_1_en TEXT NOT NULL,
  subject_1_kz TEXT NOT NULL,
  subject_2_en TEXT,
  subject_2_kz TEXT
);
ALTER TABLE public.subject_pairs ENABLE ROW LEVEL SECURITY;

-- =========================
-- student_profiles
-- =========================
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_pair_id INTEGER REFERENCES public.subject_pairs(id),
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  score_qazaqstan_tarihy NUMERIC NOT NULL DEFAULT 0,
  score_oku_saattylyghy NUMERIC NOT NULL DEFAULT 0,
  score_math_saattylyghy NUMERIC NOT NULL DEFAULT 0,
  score_subject_1 NUMERIC NOT NULL DEFAULT 0,
  score_subject_2 NUMERIC NOT NULL DEFAULT 0,
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- =========================
-- lessons
-- =========================
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_en TEXT NOT NULL,
  subject_kz TEXT NOT NULL,
  subject_slug TEXT NOT NULL,
  topic_en TEXT NOT NULL,
  topic_kz TEXT NOT NULL,
  description_en TEXT,
  description_kz TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  release_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- =========================
-- study_notes
-- =========================
CREATE TABLE public.study_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_kz TEXT NOT NULL,
  content_en TEXT,
  content_kz TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.study_notes ENABLE ROW LEVEL SECURITY;

-- =========================
-- homeworks
-- =========================
CREATE TABLE public.homeworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  subject_en TEXT NOT NULL,
  subject_kz TEXT NOT NULL,
  subject_slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_kz TEXT NOT NULL,
  description_en TEXT,
  description_kz TEXT,
  type homework_type NOT NULL DEFAULT 'test',
  questions JSONB,
  difficulty_distribution JSONB DEFAULT '{"easy":50,"medium":30,"hard":20}',
  deadline TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.homeworks ENABLE ROW LEVEL SECURITY;

-- =========================
-- homework_submissions
-- =========================
CREATE TABLE public.homework_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id UUID NOT NULL REFERENCES public.homeworks(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  answers JSONB,
  file_url TEXT,
  ai_score NUMERIC,
  ai_feedback TEXT,
  teacher_score NUMERIC,
  teacher_feedback TEXT,
  status submission_status NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;

-- =========================
-- tests
-- =========================
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_en TEXT NOT NULL,
  subject_kz TEXT NOT NULL,
  subject_slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_kz TEXT NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  time_limit_minutes INTEGER NOT NULL DEFAULT 90,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

-- =========================
-- test_results
-- =========================
CREATE TABLE public.test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  answers JSONB,
  score NUMERIC NOT NULL DEFAULT 0,
  max_score NUMERIC NOT NULL DEFAULT 140,
  weak_topics JSONB,
  predicted_unt_score NUMERIC,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- =========================
-- nusqa_sessions
-- =========================
CREATE TABLE public.nusqa_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_kz TEXT NOT NULL,
  description_en TEXT,
  description_kz TEXT,
  test_id UUID REFERENCES public.tests(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  max_students INTEGER DEFAULT 50,
  status session_status NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.nusqa_sessions ENABLE ROW LEVEL SECURITY;

-- =========================
-- lesson_schedule
-- =========================
CREATE TABLE public.lesson_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  release_at TIMESTAMPTZ NOT NULL,
  is_released BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lesson_schedule ENABLE ROW LEVEL SECURITY;

-- =========================
-- error_reports
-- =========================
CREATE TABLE public.error_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  related_content_id UUID,
  related_content_type TEXT,
  reported_by UUID REFERENCES public.profiles(id),
  status report_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.error_reports ENABLE ROW LEVEL SECURITY;

-- =========================
-- subscriptions
-- =========================
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'premium',
  price_kzt INTEGER NOT NULL DEFAULT 2990,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active'
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- =========================
-- Auto-create profile + student role on signup
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'language', 'kz')
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');

  INSERT INTO public.student_profiles (id) VALUES (NEW.id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- updated_at trigger
-- =========================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER student_profiles_updated_at BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- RLS POLICIES
-- =========================

-- profiles
CREATE POLICY "Profiles readable by authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins update any profile" ON public.profiles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- user_roles
CREATE POLICY "Users see own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins see all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- subject_pairs (public read for authed)
CREATE POLICY "Subject pairs readable" ON public.subject_pairs
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage subject pairs" ON public.subject_pairs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- student_profiles
CREATE POLICY "Student sees own student_profile" ON public.student_profiles
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Student updates own student_profile" ON public.student_profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Student inserts own student_profile" ON public.student_profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Teachers and admins read all student_profiles" ON public.student_profiles
  FOR SELECT TO authenticated USING (
    public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Admins manage student_profiles" ON public.student_profiles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- lessons
CREATE POLICY "Authed read published lessons" ON public.lessons
  FOR SELECT TO authenticated USING (
    is_published = true OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Teachers and admins manage lessons" ON public.lessons
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

-- study_notes
CREATE POLICY "Authed read notes" ON public.study_notes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers admins manage notes" ON public.study_notes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

-- homeworks
CREATE POLICY "Authed read published homeworks" ON public.homeworks
  FOR SELECT TO authenticated USING (
    is_published = true OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Teachers admins manage homeworks" ON public.homeworks
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

-- homework_submissions
CREATE POLICY "Student sees own submissions" ON public.homework_submissions
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Student inserts own submissions" ON public.homework_submissions
  FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Student updates own pending submissions" ON public.homework_submissions
  FOR UPDATE TO authenticated USING (student_id = auth.uid() AND status = 'pending');
CREATE POLICY "Teachers admins read submissions" ON public.homework_submissions
  FOR SELECT TO authenticated USING (
    public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Teachers admins update submissions" ON public.homework_submissions
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
  );

-- tests
CREATE POLICY "Authed read published tests" ON public.tests
  FOR SELECT TO authenticated USING (
    is_published = true OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Teachers admins manage tests" ON public.tests
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

-- test_results
CREATE POLICY "Student sees own test_results" ON public.test_results
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Student inserts own test_results" ON public.test_results
  FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Teachers admins read all test_results" ON public.test_results
  FOR SELECT TO authenticated USING (
    public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
  );

-- nusqa_sessions
CREATE POLICY "Authed read nusqa sessions" ON public.nusqa_sessions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage nusqa sessions" ON public.nusqa_sessions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- lesson_schedule
CREATE POLICY "Authed read schedule" ON public.lesson_schedule
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage schedule" ON public.lesson_schedule
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- error_reports
CREATE POLICY "Teachers admins read reports" ON public.error_reports
  FOR SELECT TO authenticated USING (
    public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Authed insert reports" ON public.error_reports
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Teachers admins update reports" ON public.error_reports
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
  );

-- subscriptions
CREATE POLICY "Student sees own subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Admins read all subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage subscriptions" ON public.subscriptions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- SEED: 13 subject pairs
-- =========================
INSERT INTO public.subject_pairs (id, name_en, name_kz, subject_1_en, subject_1_kz, subject_2_en, subject_2_kz) VALUES
(1,  'Biology – Geography',          'Биология – География',            'Biology',         'Биология',         'Geography',         'География'),
(2,  'Math – Physics',                'Математика – Физика',             'Mathematics',     'Математика',       'Physics',           'Физика'),
(3,  'Math – Computer Science',       'Математика – Информатика',        'Mathematics',     'Математика',       'Computer Science',  'Информатика'),
(4,  'Biology – Chemistry',           'Биология – Химия',                'Biology',         'Биология',         'Chemistry',         'Химия'),
(5,  'World History – Geography',     'Дүниежүзі тарихы – География',    'World History',   'Дүниежүзі тарихы', 'Geography',         'География'),
(6,  'Kazakh Lang – Kazakh Lit',      'Қазақ тілі – Қазақ әдебиеті',    'Kazakh Language', 'Қазақ тілі',       'Kazakh Literature', 'Қазақ әдебиеті'),
(7,  'Russian Lang – Russian Lit',    'Орыс тілі – Орыс әдебиеті',      'Russian Language','Орыс тілі',        'Russian Literature','Орыс әдебиеті'),
(8,  'Foreign Lang – World History',  'Шет тілі – Дүниежүзі тарихы',    'Foreign Language','Шет тілі',         'World History',     'Дүниежүзі тарихы'),
(9,  'Math – Geography',              'Математика – География',          'Mathematics',     'Математика',       'Geography',         'География'),
(10, 'World History – Law Basics',    'Дүниежүзі тарихы – Құқық негіздері','World History', 'Дүниежүзі тарихы', 'Basics of Law',     'Құқық негіздері'),
(11, 'Chemistry – Physics',           'Химия – Физика',                  'Chemistry',       'Химия',            'Physics',           'Физика'),
(12, 'Geography – Foreign Language',  'География – Шет тілі',           'Geography',       'География',        'Foreign Language',  'Шет тілі'),
(13, 'Creative',                      'Шығармашылық',                    'Creative',        'Шығармашылық',     NULL,                NULL);

SELECT setval(pg_get_serial_sequence('public.subject_pairs','id'), 13, true);
