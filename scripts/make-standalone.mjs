import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectRoot, "dist");
const htmlPath = path.join(outputDirectory, "index.html");
let html = await readFile(htmlPath, "utf8");

const assetDataUrl = async (assetName) => {
    const assetPath = path.join(outputDirectory, "assets", assetName);
    const contents = await readFile(assetPath);
    const extension = path.extname(assetName).toLowerCase();
    const mimeTypes = {
        ".gif": "image/gif",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
    };
    const mimeType = mimeTypes[extension];

    if (!mimeType) {
        throw new Error(`Unsupported standalone asset type: ${assetName}`);
    }

    return `data:${mimeType};base64,${contents.toString("base64")}`;
};

const bundledScripts = [
    ...html.matchAll(
        /<script\b(?=[^>]*\btype="module")(?=[^>]*\bsrc="([^"]+)")[^>]*>\s*<\/script>/g,
    ),
];

if (bundledScripts.length === 0) {
    throw new Error("Could not find Vite's JavaScript bundle in dist/index.html.");
}

for (const match of bundledScripts) {
    const scriptPath = path.join(outputDirectory, match[1].replace(/^\/+/, ""));
    let script = await readFile(scriptPath, "utf8");
    const imageReferences = [
        ...script.matchAll(/\/assets\/([^"'`]+?\.(?:gif|jpe?g|png|svg|webp))(?=["'`])/g),
    ];

    for (const [, assetName] of imageReferences) {
        script = script.replace(
            `/assets/${assetName}`,
            await assetDataUrl(assetName),
        );
    }

    const encodedScript = Buffer.from(script).toString("base64");
    html = html.replace(
        match[0],
        `<script type="module">import("data:text/javascript;base64,${encodedScript}");</script>`,
    );
}

const bundledStylesheets = [
    ...html.matchAll(
        /<link\b(?=[^>]*\brel="stylesheet")(?=[^>]*\bhref="([^"]*\/assets\/[^"]+\.css)")[^>]*>/g,
    ),
];

for (const match of bundledStylesheets) {
    const stylesheetPath = path.join(
        outputDirectory,
        match[1].replace(/^\/+/, ""),
    );
    const stylesheet = (await readFile(stylesheetPath, "utf8")).replace(
        /<\/style/gi,
        "<\\/style",
    );
    html = html.replace(match[0], `<style>\n${stylesheet}\n</style>`);
}

await writeFile(htmlPath, html);
console.log("Created a standalone portfolio at dist/index.html");
