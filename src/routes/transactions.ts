import { knex } from "../database";

import type { FastifyInstance } from "fastify";

// biome-ignore lint/suspicious/useAwait: <explanation>
export async function transactionsRoutes(server: FastifyInstance) {
	server.get("/hello", async () => {
		const transactions = await knex("transactions").select("*");

		return transactions;
	});
}
