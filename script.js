let name = document.getElementById("name");
let explain = document.getElementById("explain");
let date = document.getElementById("date");
let submit = document.getElementById("submit");
let showData = document.getElementById("showData");
let emptyMsg = document.getElementById("emptyMsg");
let inputMsg = document.getElementById("inputMsg");
let normal = document.getElementById("priority-normal");
let urgent = document.getElementById("priority-urgent");
let search = document.getElementById("search");
let editId = null;
let searchNotes = [];

// clean form
function cleanForm() {
	name.value = "";
	explain.value = "";
	date.value = "";

	// reset status edit
	editId = null;
	submit.innerText = "Save";
}

// search notes
search.addEventListener("input", (e) => {
	let keyword = e.target.value.toLowerCase();
	console.log(keyword);
	// console.log(searchNotes);

	let filteredData = searchNotes.filter((value) => {
		// console.log(value.todo);
		let data = value.todo.toLowerCase();

		return data.includes(keyword);
	});

	// console.log(filteredData);
	renderData(filteredData);
});

// delete input msg
[name, explain, date].forEach((input) => {
	input.addEventListener("input", () => {
		if (inputMsg.innerText !== "") {
			inputMsg.innerText = "";
		}
	});
});

// tombol save
submit.addEventListener("click", function (e) {
	e.preventDefault();
	// console.log("clicked");

	if (editId === null) {
		saveData();
	} else {
		updateData(editId);
	}
});

showData.addEventListener("click", function (e) {
	e.preventDefault();

	// tombol hapus
	if (e.target.className === "btn-delete") {
		let getId = e.target.dataset.id;
		// console.log(getId);

		deleteData(getId);
	}

	// tombol update
	if (e.target.className === "btn-update") {
		// console.log("ini button update");
		let getId = e.target.dataset.id;
		let data = e;
		submit.innerText = "Update";

		// console.log(data);
		editData(getId);
	}
});

function renderData(dataList) {
	let content = "";

	if (dataList && dataList.length > 0) {
		for (const item of dataList) {
			content += `
				<div>
					<h3>Todo : ${item.todo}</h3>
					<p>Explain : ${item.explaination}</p>
					<p>Date : ${item.date}</p>
					<p>ID : ${item.id}</p>
					<p>Priority : ${item.priority ? item.priority : "normal"}</p>
					<button class="btn-delete" data-id="${item.id}">Hapus Data</button>
					<button class="btn-update" data-id="${item.id}">Ubah Data</button>
				</div>
				`;
		}
		emptyMsg.innerText = "";
	} else {
		emptyMsg.innerText = "Data tidak ditemukan";
	}
	showData.innerHTML = content;
}

async function getData() {
	try {
		emptyMsg.innerText = "Sedang mengambil data";

		let data = await fetch("/getData");
		let result = await data.json();
		// console.log(result[0]);

		searchNotes = result;
		console.log(searchNotes);
		renderData(searchNotes);
	} catch (error) {
		console.error(error);
		emptyMsg.innerText = "Server terputus. Gagal mengambil data";
	}
}

async function saveData() {
	try {
		// console.log(typeof date);
		if (!name.value.trim() || !explain.value.trim() || !date.value) {
			console.log("isi data dengan lengkap terlebih dulu!");
			inputMsg.innerText = "Isi semua data dengan lengkap!";
			return;
		}

		let data = await fetch("/saveData", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				todo: name.value,
				explaination: explain.value,
				date: date.value,
				priority: normal.checked ? normal.value : urgent.value,
			}),
		});

		if (!data.ok) {
			throw new Error(`Server error status : ${data.status}`);
		}

		let result = await data.json();
		console.log(result);

		let save = "";

		if (result.data) {
			emptyMsg.innerText = "";
			inputMsg.innerText = "";

			cleanForm();
			getData();
		} else {
			alert("data gagal disimpan");
			console.log(result.message);
		}
	} catch (error) {
		console.error("Gagal menyimpan data ", error);
	}
}

async function deleteData(id) {
	// console.log("benar idnya adalah ", id);

	try {
		let hapusData = confirm("Yakin ini menghapus data ini?");
		if (hapusData === true) {
			let data = await fetch(`/deleteData/${id}`, {
				method: "DELETE",
			});

			let result = await data.json();
			// console.log(result);

			getData();
		}
	} catch (error) {
		console.error("data gagal dihapus, ", error);
	}
}

async function editData(id) {
	try {
		console.log("ini edit data");
		// console.log(id);

		let getData = await fetch(`/getData/${id}`);

		if (!getData.ok) {
			throw new Error("data tidak ditemukan!");
		}
		let resultData = await getData.json();
		editId = id;
		// console.log(resultData);
		// console.log(id);

		window.scrollTo({ top: 0, behavior: "smooth" });

		name.value = resultData.todo;
		explain.value = resultData.explaination;
		date.value = resultData.date?.split("T")[0];
	} catch (error) {
		console.log(error);
	}
}

async function updateData(id) {
	if (!name.value.trim() || !explain.value.trim() || !date.value) {
		console.log("isi data dengan lengkap terlebih dulu!");
		inputMsg.innerText = "Isi semua data dengan lengkap!";
		return;
	}

	console.log("update data!");
	// console.log(id);

	try {
		let putData = await fetch(`/updateData/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: id,
				todo: name.value,
				explaination: explain.value,
				date: date.value,
			}),
		});

		if (!putData.ok) {
			throw new Error(`Gagal update status: ${putData.status}`);
		}
		let result = await putData.json();
		console.log(result);

		getData();
		cleanForm();
	} catch (error) {
		console.error("Gagal update data: ", error);
		inputMsg.innerText = "Gagal memperbarui data. Coba lagi!";
	}
}

getData();
