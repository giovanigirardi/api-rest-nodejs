// biome-ignore lint/correctness/noUnusedImports: Importing the type is necessary for the type to be available in the file
import { Knex } from "knex";

declare module "knex/types/tables" {
	export interface Tables {
		transactions: {
			id: string;
			title: string;
			amount: number;
			// biome-ignore lint/style/useNamingConvention: The column name is defined by the database schema
			created_at: string;
			// biome-ignore lint/style/useNamingConvention: The column name is defined by the database schema
			session_id?: string;
		};
	}
}
