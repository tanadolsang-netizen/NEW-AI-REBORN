-- Seeding for local dev only
insert into public.profiles (id, email, full_name, tz, lat, lon)
values
  ('00000000-0000-0000-0000-000000000001', 'dev@example.com', 'Dev User', 'Asia/Bangkok', 13.8591, 100.5217)
on conflict (id) do nothing;
