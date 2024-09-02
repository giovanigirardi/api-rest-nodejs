// biome-ignore lint/correctness/noUnusedImports: Importing the type is necessary for the type to be available in the file
import { Knex } from "knex";

declare module "knex/types/tables" {
	export interface Tables {
		transactions: {
			id: string;
			title: string;
			amount: number;
			created_at: string;
			session_id?: string;
		};
	}
}
