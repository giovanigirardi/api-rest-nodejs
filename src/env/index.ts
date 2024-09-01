import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	// biome-ignore lint/style/useNamingConvention: env vars are uppercase
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	// biome-ignore lint/style/useNamingConvention: env vars are uppercase
	DATABASE_URL: z.string(),
	// biome-ignore lint/style/useNamingConvention: env vars are uppercase
	PORT: z.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error("Invalid environment variables", _env.error.format());
	throw new Error("Invalid environment variables");
}

export const env = _env.data;
