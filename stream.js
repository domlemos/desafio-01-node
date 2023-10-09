import assert from "assert";
import { parse } from "csv-parse";
import fs from "fs";
import { title } from "process";

const parser = parse({
  delimiter: ",",
  from_line: 2,
  skip_empty_lines: true,
});

const databasePath = new URL("tasks.csv", import.meta.url);
const csv = fs.createReadStream(databasePath);

async function handle() {
  const lines = csv.pipe(parser);

  for await (const line of lines) {
    const [title, description] = line
    await fetch("http://localhost:3333/tasks", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description
      }),
    })

  }
}

handle();
