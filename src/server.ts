import fastify from "fastify";
import { knex } from "./database";

const server = fastify();

server.get("/hello", async () => {
	const transactions = await knex("transactions").where("id", "d3734136-b1ef-468a-a75e-908e0cca4de9").select("*");

	return transactions;
});

server.listen({ port: 3333 });
