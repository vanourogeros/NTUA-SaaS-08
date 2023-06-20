import { parseCSVFile } from "./csvUtils.js";
import * as bp from "./blueprints.js";

const object = await parseCSVFile(process.argv[2], bp.basicLineBlueprint);
console.log(JSON.stringify(object, null, 2));
