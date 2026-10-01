-- Voyage'26 event content, shop, registrations, and orders.

create table if not exists site_settings (
  id integer primary key,
  event_title text not null,
  tagline text not null,
  description text not null,
  about_text text not null,
  venue text not null,
  event_starts_at timestamptz not null,
  registration_fee_cents integer not null default 149900,
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id serial primary key,
  slug text not null unique,
  name text not null,
  description text not null,
  price_cents integer not null,
  image_url text not null,
  stock integer not null default 40,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists gallery_items (
  id serial primary key,
  image_url text not null,
  caption text not null,
  sort_order integer not null default 0
);

create table if not exists event_sessions (
  id serial primary key,
  title text not null,
  description text not null,
  day_label text not null,
  time_label text not null,
  sort_order integer not null default 0
);

create table if not exists registrations (
  id serial primary key,
  full_name text not null,
  email text not null,
  iit_email text,
  phone text not null,
  university text not null,
  year_of_study text not null,
  crew_track text not null,
  motivation text not null,
  delegate_option text not null default 'Delegate Pack',
  amount_cents integer not null,
  payment_status text not null default 'paid',
  payment_ref text not null,
  card_last4 text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id serial primary key,
  public_id text not null unique,
  user_id text,
  customer_name text not null,
  email text not null,
  phone text not null,
  address_line text not null,
  city text not null,
  pincode text not null,
  amount_cents integer not null,
  payment_status text not null default 'paid',
  payment_ref text not null,
  card_last4 text,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id serial primary key,
  order_id integer not null references orders(id) on delete cascade,
  product_id integer,
  name text not null,
  qty integer not null,
  unit_price_cents integer not null
);

create index if not exists orders_public_id_idx on orders (public_id);
create index if not exists registrations_email_idx on registrations (email);
create index if not exists products_active_idx on products (active, sort_order);

insert into site_settings (
  id, event_title, tagline, description, about_text, venue, event_starts_at, registration_fee_cents
) values (
  1,
  'Voyage ''26',
  'Chart your course. Command your crew.',
  'A leadership development programme by AIESEC in IIT, set on a Caribbean pirate saga. Delegates sail through crew challenges, command labs, and a night council that forges captains — not passengers.',
  'Voyage ''26 is AIESEC in IIT''s flagship leadership development programme. For one charged day the campus becomes a privateer port: crews form at dawn, charts are drawn at noon, and by nightfall every delegate has taken the wheel. The curriculum borrows the discipline of a ship''s company — watch rotations, shared command, navigation under pressure — and turns it into a practical leadership forge for students who want more than a certificate.

You will not sit through lectures. You will take a watch, negotiate a treaty, lose the wind, find it again, and stand in front of your crew. Inspired by the golden age of Caribbean privateers, the world of Voyage is original: lantern-lit decks, brass compasses, and a code of honour written for this generation of IIT leaders.',
  'Main Campus Grounds, IIT · Port of Call Tent',
  '2026-10-30 09:00:00+05:30',
  149900
) on conflict (id) do nothing;

insert into products (slug, name, description, price_cents, image_url, stock, sort_order) values
  ('compass-tee', 'Compass Rose Tee', 'Heavyweight black cotton with a gold embroidered compass rose. The unofficial uniform of the dawn watch.', 79900, '/images/product-tee.jpg', 48, 1),
  ('night-watch-tricorn', 'Night Watch Tricorn', 'Weathered leather tricorn with gold braid. Wear it on the deck, or to every lecture after.', 64900, '/images/product-hat.jpg', 24, 2),
  ('brass-compass', 'Brass Pocket Compass', 'A working antique-finish compass on a chain. Chart the campus. Chart the rest of the year.', 129900, '/images/product-compass.jpg', 18, 3),
  ('chart-tote', 'Nautical Chart Tote', 'Canvas tote printed with a faded Caribbean chart. Holds a laptop, a logbook, and a mutiny''s worth of snacks.', 44900, '/images/product-tote.jpg', 60, 4),
  ('lantern-mug', 'Lantern Enamel Mug', 'Matte black enamel with a gold compass mark. For coffee before first watch.', 34900, '/images/product-mug.jpg', 80, 5),
  ('captains-journal', 'Captain''s Field Journal', 'Leather-bound log with a brass clasp and deckled pages. Write the voyage. Then write the next one.', 59900, '/images/product-journal.jpg', 36, 6)
on conflict (slug) do nothing;

insert into gallery_items (image_url, caption, sort_order) values
  ('/images/gallery-deck.jpg', 'First watch — crews form on deck at golden hour.', 1),
  ('/images/gallery-map.jpg', 'The chart room. Every voyage begins as ink on parchment.', 2),
  ('/images/gallery-beach.jpg', 'Night council on the sand. Rank dissolves. Honesty does not.', 3),
  ('/images/hero-galleon.jpg', 'The flagship holds station off the port of call.', 4),
  ('/images/product-compass.jpg', 'Instruments of command, issued to every crew lead.', 5),
  ('/images/product-journal.jpg', 'Delegates keep a captain''s log from dawn to last bell.', 6);

insert into event_sessions (title, description, day_label, time_label, sort_order) values
  ('Opening Gun & Crew Formation', 'Colours rise. Delegates are sworn into crews of eight and issued a chart, a compass, and a code.', 'Dawn Watch', '09:00 – 10:30', 1),
  ('Command Labs', 'Rotating stations: influence without rank, decision under fog, and the art of the difficult order.', 'First Tide', '10:45 – 13:00', 2),
  ('Treaty Table', 'Crews negotiate a shared prize. Alliances form. Some of them last the afternoon.', 'Crosswinds', '14:00 – 16:00', 3),
  ('Night Council', 'Lanterns only. A facilitated circle on the values you will actually keep when nobody is watching.', 'Last Bell', '16:30 – 18:00', 4),
  ('Commissioning', 'Each crew presents its voyage. Captains are named. The fleet is dismissed until next year.', 'Harbour Lights', '18:15 – 19:30', 5);
