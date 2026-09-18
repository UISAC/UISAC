-- Run in the Supabase SQL Editor after 003.
-- Lets people edit and delete their own questions and replies, and lets admins
-- delete anything, without making authorship public.
--
-- Posts previously carried no author at all. user_id is now recorded, but
-- SELECT on that column is revoked so the API never returns it: other students
-- still cannot tell who wrote what. Anyone with database access can, which is a
-- deliberate trade for being able to enforce ownership server-side.
--
-- Rows created before this migration have a null user_id, so nobody owns them.
-- They can still be removed by an admin.

alter table public.questions
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists edited_at timestamptz;

alter table public.replies
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists edited_at timestamptz;

-- The default means an insert cannot forget to stamp the author, so the insert
-- policies below can require it to match the caller.
alter table public.questions alter column user_id set default auth.uid();
alter table public.replies alter column user_id set default auth.uid();

-- A table-level SELECT grant covers every column, so hiding one means revoking
-- the table grant and re-granting the rest. Note this also makes `select=*`
-- fail for these tables: callers must list columns, as app/discussions/actions.ts does.
revoke select on public.questions from anon, authenticated;
grant select (id, text, upvotes, created_at, edited_at) on public.questions to anon, authenticated;

revoke select on public.replies from anon, authenticated;
grant select (id, question_id, text, created_at, edited_at) on public.replies to anon, authenticated;

-- Editing is limited to the body. Without the column grant an author could
-- inflate upvotes on their own post or reassign it to somebody else, both of
-- which the row-level policy alone would happily allow.
revoke update on public.questions from anon, authenticated;
grant update (text, edited_at) on public.questions to authenticated;

revoke update on public.replies from anon, authenticated;
grant update (text, edited_at) on public.replies to authenticated;

-- ─── Policies ───────────────────────────────────────────────────────────────

drop policy if exists "Northwestern users can ask questions" on public.questions;
create policy "Northwestern users can ask questions"
  on public.questions for insert
  to authenticated
  with check (public.is_northwestern() and user_id = auth.uid());

drop policy if exists "Northwestern users can reply" on public.replies;
create policy "Northwestern users can reply"
  on public.replies for insert
  to authenticated
  with check (public.is_northwestern() and user_id = auth.uid());

drop policy if exists "Authors can edit their own questions" on public.questions;
create policy "Authors can edit their own questions"
  on public.questions for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Authors can edit their own replies" on public.replies;
create policy "Authors can edit their own replies"
  on public.replies for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Authors and admins can delete questions" on public.questions;
create policy "Authors and admins can delete questions"
  on public.questions for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Authors and admins can delete replies" on public.replies;
create policy "Authors and admins can delete replies"
  on public.replies for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ─── Ownership lookup ───────────────────────────────────────────────────────
-- The client cannot read user_id, so it cannot work out which posts to show
-- edit and delete controls on. security definer so it can read the hidden
-- column; it leaks nothing because it only ever matches auth.uid().

create or replace function public.my_discussion_ids()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'questions', coalesce(
      (select jsonb_agg(id) from public.questions where user_id = auth.uid()),
      '[]'::jsonb
    ),
    'replies', coalesce(
      (select jsonb_agg(id) from public.replies where user_id = auth.uid()),
      '[]'::jsonb
    )
  );
$$;

revoke execute on function public.my_discussion_ids() from anon, public;
grant execute on function public.my_discussion_ids() to authenticated;
