import { GridFSBucket, MongoClient, type Db } from "mongodb";

const DATABASE_NAME = process.env.MONGODB_DATABASE?.trim() || "voyage26";
const MONGO_URI = process.env.MONGODB_URI?.trim();

type MongoState = {
  uri: string;
  client: MongoClient;
  ready?: Promise<Db>;
};

type GlobalMongo = typeof globalThis & {
  __voyageMongoState__?: MongoState;
};

const globalMongo = globalThis as GlobalMongo;

function mongoClient(): MongoClient {
  if (!MONGO_URI) {
    throw new Error("MongoDB is not configured. Set MONGODB_URI in the server environment.");
  }
  const state = globalMongo.__voyageMongoState__;
  if (state && state.uri !== MONGO_URI) {
    throw new Error("MONGODB_URI changed while the server was running. Restart the server to reconnect.");
  }
  if (!state) {
    globalMongo.__voyageMongoState__ = {
      uri: MONGO_URI,
      client: new MongoClient(MONGO_URI, { maxPoolSize: 10 }),
    };
  }
  return globalMongo.__voyageMongoState__!.client;
}

export function getMongoClient(): MongoClient {
  return mongoClient();
}

export function getMongoDatabaseName(): string {
  return DATABASE_NAME;
}

async function seedMongoDatabase(db: Db): Promise<void> {
  const siteSettings = db.collection("site_settings");
  if (!(await siteSettings.findOne({ id: 1 }))) {
    await siteSettings.insertOne({
      id: 1,
      event_title: "Voyage '26",
      tagline: "Chart your course. Command your crew.",
      description:
        "A leadership development programme by AIESEC in IIT, set on a Caribbean pirate saga. Delegates sail through crew challenges, command labs, and a night council that forges captains — not passengers.",
      about_text:
        "Voyage '26 is AIESEC in IIT's flagship leadership development programme. For one charged day the campus becomes a privateer port: crews form at dawn, charts are drawn at noon, and by nightfall every delegate has taken the wheel.",
      venue: "Main Campus Grounds, IIT · Port of Call Tent",
      event_starts_at: "2026-10-30T03:30:00.000Z",
      registration_fee_cents: 149900,
      updated_at: new Date(),
    });
  }

  const products = db.collection("products");
  if ((await products.estimatedDocumentCount()) === 0) {
    await products.insertMany([
      { id: 1, slug: "compass-tee", name: "Compass Rose Tee", description: "Heavyweight black cotton with a gold embroidered compass rose.", price_cents: 79900, image_url: "/images/product-tee.jpg", stock: 48, active: true, sort_order: 1 },
      { id: 2, slug: "night-watch-tricorn", name: "Night Watch Tricorn", description: "Weathered leather tricorn with gold braid.", price_cents: 64900, image_url: "/images/product-hat.jpg", stock: 24, active: true, sort_order: 2 },
      { id: 3, slug: "brass-compass", name: "Brass Pocket Compass", description: "A working antique-finish compass on a chain.", price_cents: 129900, image_url: "/images/product-compass.jpg", stock: 18, active: true, sort_order: 3 },
      { id: 4, slug: "chart-tote", name: "Nautical Chart Tote", description: "Canvas tote printed with a faded Caribbean chart.", price_cents: 44900, image_url: "/images/product-tote.jpg", stock: 60, active: true, sort_order: 4 },
      { id: 5, slug: "lantern-mug", name: "Lantern Enamel Mug", description: "Matte black enamel with a gold compass mark.", price_cents: 34900, image_url: "/images/product-mug.jpg", stock: 80, active: true, sort_order: 5 },
      { id: 6, slug: "captains-journal", name: "Captain's Field Journal", description: "Leather-bound log with a brass clasp and deckled pages.", price_cents: 59900, image_url: "/images/product-journal.jpg", stock: 36, active: true, sort_order: 6 },
    ]);
  }

  const gallery = db.collection("gallery_items");
  if ((await gallery.estimatedDocumentCount()) === 0) {
    await gallery.insertMany([
      { id: 1, image_url: "/images/gallery-deck.jpg", caption: "First watch — crews form on deck at golden hour.", sort_order: 1 },
      { id: 2, image_url: "/images/gallery-map.jpg", caption: "The chart room. Every voyage begins as ink on parchment.", sort_order: 2 },
      { id: 3, image_url: "/images/gallery-beach.jpg", caption: "Night council on the sand. Rank dissolves. Honesty does not.", sort_order: 3 },
      { id: 4, image_url: "/images/hero-galleon.jpg", caption: "The flagship holds station off the port of call.", sort_order: 4 },
      { id: 5, image_url: "/images/product-compass.jpg", caption: "Instruments of command, issued to every crew lead.", sort_order: 5 },
      { id: 6, image_url: "/images/product-journal.jpg", caption: "Delegates keep a captain's log from dawn to last bell.", sort_order: 6 },
    ]);
  }

  const sessions = db.collection("event_sessions");
  if ((await sessions.estimatedDocumentCount()) === 0) {
    await sessions.insertMany([
      { id: 1, title: "Opening Gun & Crew Formation", description: "Colours rise. Delegates form crews and receive their chart and code.", day_label: "Dawn Watch", time_label: "09:00 – 10:30", sort_order: 1 },
      { id: 2, title: "Command Labs", description: "Influence without rank, decision under fog, and difficult orders.", day_label: "First Tide", time_label: "10:45 – 13:00", sort_order: 2 },
      { id: 3, title: "Treaty Table", description: "Crews negotiate a shared prize as alliances form.", day_label: "Crosswinds", time_label: "14:00 – 16:00", sort_order: 3 },
      { id: 4, title: "Night Council", description: "A facilitated circle on the values you keep when nobody is watching.", day_label: "Last Bell", time_label: "16:30 – 18:00", sort_order: 4 },
      { id: 5, title: "Commissioning", description: "Each crew presents its voyage; captains are named.", day_label: "Harbour Lights", time_label: "18:15 – 19:30", sort_order: 5 },
    ]);
  }

  const paymentSettings = db.collection("registration_payment_settings");
  await paymentSettings.updateOne(
    { id: 1 },
    {
      $setOnInsert: {
        id: 1,
        account_holder: "",
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        upi_id: "",
        registration_image_url: "",
        package_prices: {
          "Delegate Pack": 0,
          "T-shirt Only": 0,
          "Mouse Pad Only": 0,
          "Delegate Pack + Mouse Pad": 0,
          "T-shirt + Mouse Pad": 0,
        },
        updated_at: new Date(),
      },
    },
    { upsert: true },
  );

  await Promise.all([
    siteSettings.createIndex({ id: 1 }, { unique: true }),
    products.createIndex({ id: 1 }, { unique: true }),
    products.createIndex({ slug: 1 }, { unique: true }),
    products.createIndex({ active: 1, sort_order: 1 }),
    gallery.createIndex({ id: 1 }, { unique: true }),
    sessions.createIndex({ id: 1 }, { unique: true }),
    db.collection("registrations").createIndex({ id: 1 }, { unique: true }),
    db.collection("registrations").createIndex({ email: 1 }),
    db.collection("registrations").createIndex({ ticket_token: 1 }, { unique: true, sparse: true }),
    db.collection("orders").createIndex({ public_id: 1 }, { unique: true }),
    db.collection("order_items").createIndex({ id: 1 }, { unique: true }),
    paymentSettings.createIndex({ id: 1 }, { unique: true }),
  ]);

  const counters = db.collection<{ _id: string; value: number }>("id_counters");
  for (const [name, initialValue] of [["products", 6], ["gallery_items", 6], ["event_sessions", 5], ["registrations", 0], ["orders", 0], ["order_items", 0]] as const) {
    const maxRow = await db.collection<{ id: number } & Document>(name)
      .find({}, { projection: { id: 1 } })
      .sort({ id: -1 })
      .limit(1)
      .next();
    await counters.updateOne(
      { _id: name },
      { $setOnInsert: { value: Math.max(initialValue, maxRow?.id ?? 0) } },
      { upsert: true },
    );
  }
}

export async function getMongoDb(): Promise<Db> {
  const client = mongoClient();
  const mongoState = globalMongo.__voyageMongoState__!;
  mongoState.ready ??= client.connect().then(async () => {
    const db = client.db(DATABASE_NAME);
    await seedMongoDatabase(db);
    return db;
  }).catch((error: unknown) => {
    mongoState.ready = undefined;
    throw error;
  });
  return mongoState.ready;
}

export async function getPrivateFilesBucket(): Promise<GridFSBucket> {
  return new GridFSBucket(await getMongoDb(), { bucketName: "private_files" });
}

export async function nextMongoId(collectionName: string): Promise<number> {
  const db = await getMongoDb();
  const counter = await db.collection<{ _id: string; value: number }>("id_counters")
    .findOneAndUpdate(
      { _id: collectionName },
      { $inc: { value: 1 } },
      { returnDocument: "after" },
    );
  if (!counter) throw new Error(`Could not allocate an ID for ${collectionName}.`);
  return counter.value;
}
