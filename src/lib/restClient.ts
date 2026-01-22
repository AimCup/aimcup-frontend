import { client } from "../../client";

client.setConfig({
	baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});
