import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import router from "./crud.js";
import "dotenv/config";

const PORT = 3000;
const app = express();

const URL = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;
const supabase = createClient(URL, key);

app.use(cors());
app.use(express.json());
app.use(router);

app.get("/", async (req, res) => {
	console.log("test opening");

	res.send("Koneksi opening sukses");
});

app.get("/getData", async (req, res) => {
	const { data, error } = await supabase.from("crud_notes").select("*").order("id", { ascending: false });

	if (error) {
		return res.status(500).json({ pesan: "Gagal ambil data", detail: error + "a" });
	} else {
		res.json(data);
	}
});

app.listen(PORT, () => {
	console.log("Server diaktifkan di port " + PORT);
});

export { supabase };
