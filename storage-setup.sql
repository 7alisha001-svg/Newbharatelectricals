insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do nothing;
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'products' );
drop policy if exists "Auth Insert" on storage.objects;
create policy "Auth Insert" on storage.objects for insert with check ( bucket_id = 'products' );
drop policy if exists "Auth Update" on storage.objects;
create policy "Auth Update" on storage.objects for update using ( bucket_id = 'products' );
drop policy if exists "Auth Delete" on storage.objects;
create policy "Auth Delete" on storage.objects for delete using ( bucket_id = 'products' );
