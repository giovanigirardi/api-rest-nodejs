import { knex as setupKnex } from "knex";
import { env } from "./env";

import type { Knex } from "knex";

export const config: Knex.Config = {
	client: "sqlite3",
	connection: {
		filename: env.DATABASE_URL,
	},
	useNullAsDefault: true,
	migrations: {
		extension: "ts",
		directory: "./db/migrations",
	},
};

export const knex = setupKnex(config);
