import { Database } from "./database";
import { SetGameHiddenState } from "./main";



export type CountryRow = {
    code: string;
    name: string;
};

class CountryEditor {
    private container: HTMLElement;
    private table!: HTMLTableElement;
    private rows: CountryRow[] = [];

    constructor(container: HTMLElement) {
        this.container = container;
        this.build();
        this.addRow();
    }

    toggle() {
        this.container.hidden = !this.container.hidden;
    }

    private build() {
        this.table = document.createElement("table");
        this.table.className = "table table-sm table-striped align-middle mb-0";

        const thead = this.table.createTHead();
        const hrow = thead.insertRow();

        ["Zkratka", "Země", ""].forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            hrow.appendChild(th);
        });

        this.table.createTBody();
        this.container.appendChild(this.table);
    }

    private addRow(data: CountryRow = { code: "", name: "" }) {
        this.rows.push(data);
        const rowIndex = this.rows.length - 1;

        const row = this.table.tBodies[0].insertRow();

        const codeInput = document.createElement("input");
        codeInput.className = "form-control form-control-sm";
        codeInput.placeholder = "OK";

        const nameInput = document.createElement("input");
        nameInput.className = "form-control form-control-sm";
        nameInput.placeholder = "Česká republika";

        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-sm btn-outline-danger";
        delBtn.innerHTML = "✕";

        codeInput.value = data.code;
        nameInput.value = data.name;

        codeInput.addEventListener("keydown", e => {
            if (e.key === "Enter") nameInput.focus();
        });

        nameInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                if (rowIndex === this.rows.length - 1) {
                    this.addRow();
                }
                const next = this.table.rows[row.rowIndex + 1];
                next?.cells[0].querySelector("input")?.focus();
            }
        });

        const sync = () => {
            this.rows[rowIndex] = {
                code: codeInput.value.trim(),
                name: nameInput.value.trim()
            };
        };

        codeInput.addEventListener("input", sync);
        nameInput.addEventListener("input", sync);

        delBtn.onclick = () => {
            this.rows.splice(rowIndex, 1);
            row.remove();
        };

        row.insertCell().appendChild(codeInput);
        row.insertCell().appendChild(nameInput);
        row.insertCell().appendChild(delBtn);

        codeInput.focus();
    }

    saveToFile() {
        const obj = this.rows.filter(r => r.code || r.name);
        Database.LoadFromObject(obj);
        const blob = new Blob(
            [JSON.stringify(obj, null, 2)],
            { type: "application/json" }
        );

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "zeme.json";
        a.click();
        URL.revokeObjectURL(a.href);
    }

    loadFromFile(file: File) {
        const reader = new FileReader();
        reader.onload = () => {
            const data = JSON.parse(reader.result as string) as CountryRow[];
            Database.LoadFromObject(data as []);
            this.rows = [];
            this.table.tBodies[0].innerHTML = "";

            data.forEach(r => this.addRow(r));
            this.addRow();
        };
        reader.readAsText(file);
    }
}



const element = document.getElementById("country-editor")!;

const editor = new CountryEditor(
    element
);

document.getElementById("toggle")!.onclick = () => { SetGameHiddenState(element.hidden); editor.toggle(); }
document.getElementById("save")!.onclick = () => editor.saveToFile();

document.getElementById("load")!.addEventListener("change", e => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) editor.loadFromFile(file);
});

