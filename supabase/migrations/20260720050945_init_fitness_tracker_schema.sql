-- =====================================================================
--  Fitness-Tracker – Supabase / Postgres Schema
--  Persönlicher Tracker, aber auth-fähig aufgebaut (RLS überall an).
--  Reihenfolge: Tabellen -> Indizes -> RLS -> Policies -> View -> Seed.
--  Tipp: In Supabase am besten als Migration ausführen (supabase db push),
--        nicht nur einmalig im SQL-Editor.
-- =====================================================================


-- =====================================================================
--  1) ÜBUNGSBIBLIOTHEK
--  user_id NULL  = globale Standard-Übung (für alle sichtbar)
--  user_id gesetzt = eigene, selbst angelegte Übung
-- =====================================================================
create table if not exists exercises (
    id             uuid primary key default gen_random_uuid(),
    user_id        uuid references auth.users (id) on delete cascade,
    name           text not null,
    category       text,                 -- z.B. 'strength', 'cardio', 'mobility'
    primary_muscle text,                 -- z.B. 'chest', 'back', 'legs'
    equipment      text,                 -- z.B. 'barbell', 'dumbbell', 'bodyweight'
    is_custom      boolean not null default true,
    created_at     timestamptz not null default now()
);


-- =====================================================================
--  2) TRAININGSVORLAGEN / PLÄNE (optional)
--  Damit du wiederkehrende Workouts nicht jedes Mal neu tippst.
-- =====================================================================
create table if not exists routines (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users (id) on delete cascade,
    name        text not null,
    description text,
    created_at  timestamptz not null default now()
);

create table if not exists routine_exercises (
    id           uuid primary key default gen_random_uuid(),
    routine_id   uuid not null references routines (id) on delete cascade,
    exercise_id  uuid not null references exercises (id) on delete restrict,
    position     int  not null default 0,   -- Reihenfolge in der Vorlage
    target_sets  int,
    target_reps  int
);


-- =====================================================================
--  3) TRAININGSEINHEITEN (das Herzstück)
--  workouts        = eine Session an einem Datum
--  workout_exercises = welche Übungen in dieser Session
--  sets            = die einzelnen Sätze pro Übung
-- =====================================================================
create table if not exists workouts (
    id               uuid primary key default gen_random_uuid(),
    user_id          uuid not null references auth.users (id) on delete cascade,
    performed_on     date not null default current_date,
    name             text,                 -- z.B. 'Push Day'
    notes            text,
    duration_minutes int,
    created_at       timestamptz not null default now()
);

create table if not exists workout_exercises (
    id           uuid primary key default gen_random_uuid(),
    workout_id   uuid not null references workouts (id) on delete cascade,
    exercise_id  uuid not null references exercises (id) on delete restrict,
    position     int  not null default 0,  -- Reihenfolge in der Session
    notes        text
);

create table if not exists sets (
    id                  uuid primary key default gen_random_uuid(),
    workout_exercise_id uuid not null references workout_exercises (id) on delete cascade,
    set_number          int  not null,
    reps                int,
    weight              numeric(6,2),      -- in kg (oder lb, je nach Vorliebe)
    rpe                 numeric(3,1),      -- Anstrengung 1–10 (optional)
    is_warmup           boolean not null default false,
    completed           boolean not null default true
);


-- =====================================================================
--  4) KÖRPERWERTE (Fortschrittskurve, optional)
-- =====================================================================
create table if not exists body_measurements (
    id           uuid primary key default gen_random_uuid(),
    user_id      uuid not null references auth.users (id) on delete cascade,
    measured_on  date not null default current_date,
    weight       numeric(6,2),            -- Körpergewicht
    body_fat_pct numeric(4,1),
    notes        text
);


-- =====================================================================
--  5) INDIZES  (schnelle Abfragen nach Nutzer, Datum, Fremdschlüssel)
-- =====================================================================
create index if not exists idx_exercises_user            on exercises (user_id);
create index if not exists idx_routines_user             on routines (user_id);
create index if not exists idx_routine_exercises_routine on routine_exercises (routine_id);
create index if not exists idx_workouts_user_date        on workouts (user_id, performed_on desc);
create index if not exists idx_workout_exercises_workout on workout_exercises (workout_id);
create index if not exists idx_sets_we                   on sets (workout_exercise_id);
create index if not exists idx_measurements_user_date    on body_measurements (user_id, measured_on desc);


-- =====================================================================
--  6) ROW LEVEL SECURITY einschalten
-- =====================================================================
alter table exercises          enable row level security;
alter table routines           enable row level security;
alter table routine_exercises  enable row level security;
alter table workouts           enable row level security;
alter table workout_exercises  enable row level security;
alter table sets               enable row level security;
alter table body_measurements  enable row level security;


-- =====================================================================
--  7) POLICIES
--  Grundregel: jeder sieht/ändert nur seine eigenen Zeilen.
--  Kind-Tabellen (sets, workout_exercises, routine_exercises) prüfen
--  den Besitzer über die Eltern-Tabelle.
-- =====================================================================

-- exercises: eigene Zeilen ODER globale Standard-Übungen (user_id IS NULL) lesbar
create policy "exercises: read own or global" on exercises
    for select using (user_id = auth.uid() or user_id is null);
create policy "exercises: insert own" on exercises
    for insert with check (user_id = auth.uid());
create policy "exercises: update own" on exercises
    for update using (user_id = auth.uid());
create policy "exercises: delete own" on exercises
    for delete using (user_id = auth.uid());

-- routines
create policy "routines: all own" on routines
    for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- routine_exercises (Besitzer über routines)
create policy "routine_exercises: via routine" on routine_exercises
    for all using (exists (
        select 1 from routines r
        where r.id = routine_exercises.routine_id and r.user_id = auth.uid()
    )) with check (exists (
        select 1 from routines r
        where r.id = routine_exercises.routine_id and r.user_id = auth.uid()
    ));

-- workouts
create policy "workouts: all own" on workouts
    for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- workout_exercises (Besitzer über workouts)
create policy "workout_exercises: via workout" on workout_exercises
    for all using (exists (
        select 1 from workouts w
        where w.id = workout_exercises.workout_id and w.user_id = auth.uid()
    )) with check (exists (
        select 1 from workouts w
        where w.id = workout_exercises.workout_id and w.user_id = auth.uid()
    ));

-- sets (Besitzer über workout_exercises -> workouts)
create policy "sets: via workout" on sets
    for all using (exists (
        select 1 from workout_exercises we
        join workouts w on w.id = we.workout_id
        where we.id = sets.workout_exercise_id and w.user_id = auth.uid()
    )) with check (exists (
        select 1 from workout_exercises we
        join workouts w on w.id = we.workout_id
        where we.id = sets.workout_exercise_id and w.user_id = auth.uid()
    ));

-- body_measurements
create policy "measurements: all own" on body_measurements
    for all using (user_id = auth.uid()) with check (user_id = auth.uid());


-- =====================================================================
--  8) BEISPIEL-VIEW: persönliche Rekorde (max. Gewicht je Übung)
--  Rekorde NICHT als Tabelle speichern -> immer aus den Sätzen berechnen.
--  security_invoker sorgt dafür, dass RLS des Aufrufers greift.
-- =====================================================================
create or replace view personal_records
with (security_invoker = true) as
select
    w.user_id,
    e.id   as exercise_id,
    e.name as exercise_name,
    max(s.weight) as best_weight,
    max(s.reps)   as best_reps
from sets s
join workout_exercises we on we.id = s.workout_exercise_id
join workouts w          on w.id  = we.workout_id
join exercises e         on e.id  = we.exercise_id
where s.completed and not s.is_warmup
group by w.user_id, e.id, e.name;


-- =====================================================================
--  9) OPTIONALES SEED: ein paar Standard-Übungen (global, user_id = NULL)
--  Nur einmalig ausführen.
-- =====================================================================
insert into exercises (user_id, name, category, primary_muscle, equipment, is_custom)
values
    (null, 'Bankdrücken',   'strength', 'chest', 'barbell',   false),
    (null, 'Kniebeuge',     'strength', 'legs',  'barbell',   false),
    (null, 'Kreuzheben',    'strength', 'back',  'barbell',   false),
    (null, 'Klimmzug',      'strength', 'back',  'bodyweight',false),
    (null, 'Schulterdrücken','strength','shoulders','dumbbell',false)
on conflict do nothing;

-- Fortschrittsfotos: KEINE Tabelle nötig -> in Supabase einen Storage-Bucket
-- 'progress-photos' anlegen und dort mit einer RLS-Policy pro Nutzer ablegen.
