-- RLS coverage for public.profiles.
-- Run with `supabase test db` when a local Supabase database is available.
-- The test uses pgTAP and rolls back all fixture data.

begin;

create extension if not exists pgtap with schema extensions;

select plan(16);

select has_table(
  'public',
  'profiles',
  'profiles table exists'
);

select col_is_pk(
  'public',
  'profiles',
  'id',
  'profiles.id is the primary key'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.profiles'::regclass
  ),
  'RLS is enabled on profiles'
);

select policies_are(
  'public',
  'profiles',
  array[
    'Users can view their own profile',
    'Users can create their own profile',
    'Users can update their own profile'
  ],
  'profiles has only the expected policies'
);

insert into auth.users (id, email, raw_user_meta_data)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'profiles-rls-owner@example.test',
    '{}'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'profiles-rls-other@example.test',
    '{}'
  );

insert into public.profiles (id, display_name)
values
  ('00000000-0000-0000-0000-000000000001', 'Owner'),
  ('00000000-0000-0000-0000-000000000002', 'Other');

set local role anon;

select throws_ok(
  $$select * from public.profiles$$,
  '42501',
  null,
  'anon cannot read profiles'
);

select throws_ok(
  $$insert into public.profiles (id, display_name)
    values ('00000000-0000-0000-0000-000000000003', 'Anonymous')$$,
  '42501',
  null,
  'anon cannot insert profiles'
);

select throws_ok(
  $$update public.profiles
    set display_name = 'Anonymous'
    where id = '00000000-0000-0000-0000-000000000001'$$,
  '42501',
  null,
  'anon cannot update profiles'
);

select throws_ok(
  $$delete from public.profiles
    where id = '00000000-0000-0000-0000-000000000001'$$,
  '42501',
  null,
  'anon cannot delete profiles'
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select is(
  (select count(*)::integer from public.profiles),
  1,
  'a user can read only their own profile'
);

select lives_ok(
  $$insert into public.profiles (id, display_name)
    values ('00000000-0000-0000-0000-000000000001', 'Owner Updated')
    on conflict (id) do update set display_name = excluded.display_name$$,
  'a user can insert or upsert their own profile'
);

select throws_ok(
  $$insert into public.profiles (id, display_name)
    values ('00000000-0000-0000-0000-000000000002', 'Impersonated')$$,
  '42501',
  null,
  'a user cannot insert another user profile'
);

select lives_ok(
  $$update public.profiles
    set display_name = 'Owner Updated'
    where id = '00000000-0000-0000-0000-000000000001'$$,
  'a user can update their own profile'
);

select throws_ok(
  $$delete from public.profiles
    where id = '00000000-0000-0000-0000-000000000001'$$,
  '42501',
  null,
  'authenticated users cannot delete profiles'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select is(
  (select count(*)::integer
   from public.profiles
   where id = '00000000-0000-0000-0000-000000000001'),
  0,
  'a different user cannot read the owner profile'
);

select is(
  (select count(*)::integer from public.profiles),
  1,
  'a different user can read their own profile'
);

reset role;

select is(
  (select display_name from public.profiles
   where id = '00000000-0000-0000-0000-000000000001'),
  'Owner Updated',
  'the owner update was persisted'
);

select * from finish();

rollback;
