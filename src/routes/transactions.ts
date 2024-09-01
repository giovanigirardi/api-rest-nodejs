import type { FastifyInstance } from "fastify";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { knex } from "../database";

// biome-ignore lint/suspicious/useAwait: Fastify plugins need to be async functions
export async function transactionsRoutes(server: FastifyInstance) {
	server.get("/", async () => {
		const transactions = await knex("transactions").select();

		return { transactions };
	});

	server.get("/:id", async (request, reply) => {
		const getTransactionParamsSchema = z.object({
			id: z.string().uuid(),
		});

		const { id } = getTransactionParamsSchema.parse(request.params);

		const transaction = await knex("transactions").select().where({ id }).first();

		if (!transaction) {
			reply.status(404).send({ message: "Transaction not found" });
			return;
		}

		return { transaction };
	});

	server.get("/summary", async () => {
		const summary = await knex("transactions").sum("amount", { as: "amount" }).first();

		if (!summary) {
			return { summary: 0 };
		}

		return { summary };
	});

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
