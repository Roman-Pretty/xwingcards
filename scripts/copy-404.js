import fs from "fs";

const src = "dist/index.html";
const dest = "dist/404.html";

fs.copyFileSync(src, dest);
console.log(`Copied ${src} → ${dest}`);
