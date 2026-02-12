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

    private lastRow!: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.build();
        this.addRow();
    }

    setHidden(hidden: boolean) {
        this.container.hidden = hidden;
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

        const row = this.table.tBodies[0].insertRow();

        const codeInput = document.createElement("input");
        codeInput.className = "form-control form-control-sm";
        codeInput.placeholder = "OK";
        codeInput.value = data.code;

        const nameInput = document.createElement("input");
        nameInput.className = "form-control form-control-sm";
        nameInput.placeholder = "Česká republika";
        nameInput.value = data.name;

        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-sm btn-outline-danger";
        delBtn.innerHTML = "✕";

        const isLastRow = () =>
            row.rowIndex === this.table.rows.length - 1;

        codeInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                nameInput.focus();
            }
        });

        nameInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                if (isLastRow()) {
                    this.addRow();
                }

                const nextRow =
                    this.table.rows[row.rowIndex + 1];

                nextRow?.cells[0]
                    .querySelector("input")
                    ?.focus();
            }
        });

        const sync = () => {
            const index = row.rowIndex - 1; // subtract header row
            this.rows[index] = {
                code: codeInput.value.trim(),
                name: nameInput.value.trim()
            };
        };

        codeInput.addEventListener("input", sync);
        nameInput.addEventListener("input", sync);

        delBtn.onclick = () => {
            if (this.table.tBodies[0].rows.length === 1)
                return;

            const index = row.rowIndex - 1;
            this.rows.splice(index, 1);
            row.remove();
        };

        row.insertCell().appendChild(codeInput);
        row.insertCell().appendChild(nameInput);
        row.insertCell().appendChild(delBtn);

        codeInput.focus();
    }


    saveToFile() {
        (document.getElementById("close") as any).disabled = false;
        const obj = this.rows.filter(r => r.code || r.name);
        Database.LoadFromObject(obj);

        let csv = "code,name\n";
        obj.forEach(r => {
            csv += `${r.code},${r.name}\n`;
        });

        const blob = new Blob(
            [csv],
            { type: "text/csv" }
        );
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "zeme.csv";
        a.click();
        URL.revokeObjectURL(a.href);
    }

    loadFromFile(file: File) {
        (document.getElementById("close") as any).disabled = false;
        const reader = new FileReader();
        reader.onload = () => {
            const csv = reader.result as string;
            const rows = csv.trim().split("\n").slice(1);
            const data: CountryRow[] = rows.map(r => {
                const [code, name] = r.split(",");
                return { code: code.trim(), name: name.trim() };
            });
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

let editorHiddenState = true;

export function ToggleEditor(forceState : boolean | null = null){
    if (forceState !== null) {
        editorHiddenState = forceState;
    } else {
        editorHiddenState = !editorHiddenState;
    }
    SetGameHiddenState(!editorHiddenState);
    editor.setHidden(editorHiddenState);
}

export function IsEditorHidden(){
    return editorHiddenState;
}

document.getElementById("toggle")!.onclick = () => {
    ToggleEditor();
}
document.getElementById("save")!.onclick = () => editor.saveToFile();

document.getElementById("load")!.addEventListener("change", e => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) editor.loadFromFile(file);
});

document.getElementById("close")!.onclick = () => {
    document.getElementById("editorPanel")!.hidden = true;
    SetGameHiddenState(false);
}
