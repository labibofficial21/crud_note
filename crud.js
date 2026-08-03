import { supabase } from "./server.js";
import express from "express";

const router = express.Router();

router.post("/saveData", async (req, res) => {
	if (!req.body || !Object.keys(req.body).length) {
		return res.status(400).json({ status: "gagal", message: "data yang diberikan kurang lengkap" });
	}
	try {
		const { data, error } = await supabase.from("crud_notes").insert(req.body).select().single();
		// console.log(data);

		if (error) {
			return res.status(400).json({ status: "gagal", message: error.message });
		}
		return res.json({ status: "diterima", data: data });
	} catch (error) {
		return res.status(500).json({ status: "error", message: error.message });
	}
});

router.get("/getData/:id", async (req, res) => {
	let id = Number(req.params.id);
	const { data, error } = await supabase.from("crud_notes").select("*").eq("id", id).single();

	if (error) {
		return res.status(404).json({ pesan: "Gagal ambil data", detail: error.message });
	}
	return res.json(data);
});

router.delete("/deleteData/:id", async (req, res) => {
	// console.log(Object.keys(req));
	// console.log(req.params.id);
	let id = Number(req.params.id);
	// console.log(typeof id);
	const { data, error } = await supabase.from("crud_notes").delete().eq("id", id).select();
	if (error) {
		return res.status(400).json({ status: "gagal", message: error.message });
	}
	return res.json({ status: "berhasil dihapus", data: data });
});

router.put("/updateData/:id", async (req, res) => {
	// console.log(Object.keys(req.body));
	let id = Number(req.params.id);
	let { todo, explaination, date } = req.body;
	let { data, error } = await supabase.from("crud_notes").update({ todo, explaination, date }).eq("id", id).select();

	if (error) {
		return res.status(400).json({ status: "gagal", message: error.message });
	}
	return res.json({ status: "update data berhasil", data: data });
});

export default router;
