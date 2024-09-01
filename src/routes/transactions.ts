import type { FastifyInstance } from "fastify";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { knex } from "../database";

// biome-ignore lint/suspicious/useAwait: Fastify plugins need to be async functions
export async function transactionsRoutes(server: FastifyInstance) {
	server.post("/", async (request, reply) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(["income", "expense"]),
		});

		const { amount, title, type } = createTransactionBodySchema.parse(request.body);

		await knex("transactions").insert({
			id: randomUUID(),
			title,
			amount: type === "income" ? amount : amount * -1,
		});

		reply.status(201).send();
	});
}
