CREATE TABLE IF NOT EXISTS building_alias (
    id TEXT PRIMARY KEY,
    building_number TEXT NOT NULL UNIQUE,
    alias TEXT NOT NULL
);
