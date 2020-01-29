import fs from "fs";
import readline from "readline";

export async function firstLine(file: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const stream = fs.createReadStream(file, {
			highWaterMark: 1,
		});

		const lineReader = readline.createInterface(stream);

		stream.on("error", reject);
		lineReader.on("error", reject);
		
		lineReader.on("line", (line) => {
			stream.destroy();
			lineReader.close();

			resolve(line);
		});

	});
}
