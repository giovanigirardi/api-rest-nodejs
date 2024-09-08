import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "../src/app";

describe("Transactions routes", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(() => {
		execSync("npx knex migrate:rollback --all");
		execSync("npx knex migrate:latest");
	});

	it("Should be able to create a new transaction", async () => {
		await request(app.server)
			.post("/transactions")
			.send({ title: "New transaction", type: "income", amount: 5000 })
			.expect(201);
	});

	it("Should be able to list all transactions", async () => {
		const createTransactionResponse = await request(app.server)
			.post("/transactions")
			.send({ title: "New transaction", type: "income", amount: 5000 });

		const cookies = createTransactionResponse.get("Set-Cookie");

		const listTransactionsResponse = await request(app.server)
			.get("/transactions")
			.set("Cookie", cookies || [])
			.expect(200);

		expect(listTransactionsResponse.body.transactions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					title: "New transaction",
					amount: 5000,
				}),
			]),
		);
	});

	it("Should be able to get a specific transaction", async () => {
		const createTransactionResponse = await request(app.server)
			.post("/transactions")
			.send({ title: "New transaction", type: "income", amount: 5000 });

		const cookies = createTransactionResponse.get("Set-Cookie");

		const listTransactionsResponse = await request(app.server)
			.get("/transactions")
			.set("Cookie", cookies || [])
			.expect(200);

		const transactionId = listTransactionsResponse.body.transactions[0].id;

		const getTransactionResponse = await request(app.server)
			.get(`/transactions/${transactionId}`)
			.set("Cookie", cookies || [])
			.expect(200);

		expect(getTransactionResponse.body.transaction).toEqual(
			expect.objectContaining({
				title: "New transaction",
				amount: 5000,
			}),
		);
	});

	it("Should be able to get transactions summary", async () => {
		const createTransactionResponse = await request(app.server)
			.post("/transactions")
			.send({ title: "New transaction", type: "income", amount: 5000 });

		const cookies = createTransactionResponse.get("Set-Cookie");

		await request(app.server)
			.post("/transactions")
			.set("Cookie", cookies || [])
			.send({ title: "Debit transaction", type: "expense", amount: 2000 });

		const summaryResponse = await request(app.server)
			.get("/transactions/summary")
			.set("Cookie", cookies || [])
			.expect(200);

		expect(summaryResponse.body.summary).toEqual(
			expect.objectContaining({
				amount: 3000,
			}),
		);
	});
});
