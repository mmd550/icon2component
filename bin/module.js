import {argv as $32Xfx$argv} from "process";
import $32Xfx$yargs from "yargs";
import {hideBin as $32Xfx$hideBin} from "yargs/helpers";
import * as $32Xfx$changecase from "change-case";
import {lstat as $32Xfx$lstat, open as $32Xfx$open, mkdir as $32Xfx$mkdir, readdir as $32Xfx$readdir} from "node:fs/promises";
import {join as $32Xfx$join, extname as $32Xfx$extname, parse as $32Xfx$parse} from "node:path";
import {resolveConfigFile as $32Xfx$resolveConfigFile, format as $32Xfx$format} from "prettier";
import {optimize as $32Xfx$optimize} from "svgo";
import {parse as $32Xfx$parse1, stringify as $32Xfx$stringify} from "svgson";
import $32Xfx$path from "path";




async function $180e46b5e9ab8609$var$files({ src: src, output: output, deep: deep = false, ext: ext = "tsx", casing: casing = "paramCase" }) {
    const pathsTree = {};
    async function isDir(path) {
        return (await $32Xfx$lstat(path)).isDirectory();
    }
    async function fileExists(path) {
        try {
            const file = await $32Xfx$open(path, "r");
            file.close();
            return true;
        } catch (err) {
            return false;
        }
    }
    async function readFile(path) {
        try {
            const file = await $32Xfx$open(path, "r");
            const read = await file.readFile({
                encoding: "utf-8"
            });
            file.close();
            return read;
        } catch (err) {
            return "";
        }
    }
    async function writeFile(path, data) {
        const file = await $32Xfx$open(path, "w");
        file.writeFile(data);
        file.close();
    }
    async function createDir(path) {
        await $32Xfx$mkdir(path, {
            recursive: true
        });
    }
    async function calculatePaths(source) {
        const filePaths = await $32Xfx$readdir(source);
        const outDir = $32Xfx$join(output, source.replace($32Xfx$join(src), ""));
        pathsTree[source] = {
            iconPaths: [],
            indexFilePath: $32Xfx$join(outDir, "index.ts"),
            outDir: outDir
        };
        for (let filePath of filePaths){
            const wholePath = $32Xfx$join(source, filePath);
            const isDirectory = await isDir(wholePath);
            if (!isDirectory && $32Xfx$extname(filePath) !== ".svg") continue;
            if (isDirectory) {
                if (deep) calculatePaths(wholePath);
            } else {
                const parsed = $32Xfx$parse(wholePath);
                const name = parsed.name;
                const casedName = $32Xfx$changecase[casing](name);
                const out = $32Xfx$join(output, parsed.dir.replace($32Xfx$join(src), ""));
                const outputFilePath = $32Xfx$join(out, `${casedName}.${ext}`);
                const alreadyExists = await fileExists(outputFilePath);
                pathsTree[source].iconPaths.push({
                    sourceFilePath: wholePath,
                    outputFilePath: outputFilePath,
                    alreadyExists: alreadyExists,
                    name: name
                });
            }
        }
    }
    function getPathsTree() {
        return pathsTree;
    }
    await calculatePaths(src);
    return {
        getPathsTree: getPathsTree,
        fileExists: fileExists,
        readFile: readFile,
        writeFile: writeFile,
        createDir: createDir
    };
}
var $180e46b5e9ab8609$export$2e2bcd8739ae039 = $180e46b5e9ab8609$var$files;



function $9761b849f4f52c69$var$success(...message) {
    const prefix = "\uD83D\uDE42\uD83D\uDC4D ";
    console.log(prefix, ...message);
}
function $9761b849f4f52c69$var$log(...message) {
    console.log(...message);
}
function $9761b849f4f52c69$var$error(...message) {
    const prefix = "☹️\uD83D\uDC4E ";
    console.log(prefix, ...message);
}
const $9761b849f4f52c69$var$logger = {
    error: $9761b849f4f52c69$var$error,
    success: $9761b849f4f52c69$var$success,
    log: $9761b849f4f52c69$var$log
};
var $9761b849f4f52c69$export$2e2bcd8739ae039 = $9761b849f4f52c69$var$logger;


const $a66e1266d5b7abc1$var$prettierDefaultConfig = {};
async function $a66e1266d5b7abc1$var$formatter({ filePath: filePath, options: options }) {
    const configFilePath = filePath ? await $32Xfx$resolveConfigFile(filePath) : "";
    const resolvedConfig = configFilePath ? require(configFilePath) : $a66e1266d5b7abc1$var$prettierDefaultConfig;
    const formatterErrorMessage = "--icon-cli-formatter-error";
    async function format(source) {
        try {
            const result = await $32Xfx$format(source, {
                ...resolvedConfig || {},
                parser: "babel",
                ...options || {}
            });
            return result;
        } catch (err) {
            (0, $9761b849f4f52c69$export$2e2bcd8739ae039).error("error happened when formatting file: ", err);
            throw new Error(formatterErrorMessage);
        }
    }
    return {
        format: format,
        formatterErrorMessage: formatterErrorMessage
    };
}
var $a66e1266d5b7abc1$export$2e2bcd8739ae039 = $a66e1266d5b7abc1$var$formatter;



const $bdf22d3859a29e98$var$nodes = [
    "path",
    "circle",
    "ellipse",
    "line",
    "polygon",
    "polyline",
    "rect"
];
const $bdf22d3859a29e98$var$colorAttrs = [
    "stroke",
    "fill"
];
const $bdf22d3859a29e98$var$replaceColorsPlugin = {
    name: "replace-colors",
    fn: ()=>{
        return {
            element: {
                enter: (node)=>{
                    if ($bdf22d3859a29e98$var$nodes.includes(node.name)) {
                        for (let colorAttr of $bdf22d3859a29e98$var$colorAttrs)if (colorAttr in node.attributes) node.attributes[colorAttr] = "currentColor";
                    }
                }
            }
        };
    }
};
var $bdf22d3859a29e98$export$2e2bcd8739ae039 = $bdf22d3859a29e98$var$replaceColorsPlugin;


const $4d0ab9523d101f7d$var$nodes = [
    "svg"
];
const $4d0ab9523d101f7d$var$attrs = [
    "width",
    "height",
    "fill"
];
const $4d0ab9523d101f7d$var$removePropsPlugin = {
    name: "remove-props",
    fn: ()=>{
        return {
            element: {
                enter: (node)=>{
                    if ($4d0ab9523d101f7d$var$nodes.includes(node.name)) {
                        for (let attr of $4d0ab9523d101f7d$var$attrs)if (attr in node.attributes) delete node.attributes[attr];
                    }
                }
            }
        };
    }
};
var $4d0ab9523d101f7d$export$2e2bcd8739ae039 = $4d0ab9523d101f7d$var$removePropsPlugin;


function $3de5bca8c08e897f$var$optimizer(options) {
    const { keepColors: keepColors = false } = options || {};
    async function optimize(svgString) {
        return new Promise((resolve)=>{
            const result = $32Xfx$optimize(svgString, {
                plugins: [
                    ...!keepColors ? [
                        (0, $bdf22d3859a29e98$export$2e2bcd8739ae039)
                    ] : [],
                    (0, $4d0ab9523d101f7d$export$2e2bcd8739ae039)
                ]
            });
            resolve(result.data);
        });
    }
    return {
        optimize: optimize
    };
}
var $3de5bca8c08e897f$export$2e2bcd8739ae039 = $3de5bca8c08e897f$var$optimizer;





async function $17c4e157c8ac7fed$var$iconTemplate(svgString, variables) {
    const parsedSvg = await $32Xfx$parse1(svgString);
    const children = parsedSvg.children.reduce((prevValue, child)=>{
        return prevValue + $32Xfx$stringify(child);
    }, "");
    const rootProps = Object.entries(parsedSvg.attributes).reduce((prev, entry)=>{
        return prev + ` ${entry[0]}="${entry[1]}"`;
    }, "");
    return `
  import { SvgIcon, SvgIconProps } from "@mui/material";

  const ${variables.componentName} = (props: SvgIconProps) => {
    return (
      <SvgIcon${rootProps} {...props}>
            ${children}
      </SvgIcon>
    );
  };

  export default ${variables.componentName}
  `;
}
var $17c4e157c8ac7fed$export$2e2bcd8739ae039 = $17c4e157c8ac7fed$var$iconTemplate;




function $e68fa91ff24b1c9e$var$indexTemplate(filePaths) {
    const exportEntries = filePaths.map(({ path: filePath })=>{
        const basename = (0, $32Xfx$path).basename(filePath, (0, $32Xfx$path).extname(filePath));
        const exportName = /^\d/.test(basename) ? `Svg${basename}Icon` : `${(0, $32Xfx$pascalCase)(basename)}Icon`;
        return `export { default as ${exportName} } from './${basename}'`;
    });
    return exportEntries.join("\n");
}
var $e68fa91ff24b1c9e$export$2e2bcd8739ae039 = $e68fa91ff24b1c9e$var$indexTemplate;





const $149c1bd638913645$var$argv = (0, $32Xfx$yargs)((0, $32Xfx$hideBin)($32Xfx$argv)).argv;
async function $149c1bd638913645$var$mergeIndexes(rawOldIndexFile, rawNewIndexFile, indexPath) {
    const { format: format } = await (0, $a66e1266d5b7abc1$export$2e2bcd8739ae039)({
        filePath: indexPath,
        options: {
            parser: "babel-ts"
        }
    });
    const newIndexFile = await format(rawNewIndexFile);
    const oldIndexFile = await format(rawOldIndexFile);
    const newIndexFileArr = newIndexFile.split("\n").filter((line)=>line && line !== "\n" && line !== "\r\n");
    const oldIndexFileArr = oldIndexFile.split("\n").filter((line)=>line && line !== "\n" && line !== "\r\n");
    newIndexFileArr.forEach((line)=>{
        if (!oldIndexFileArr.includes(line)) oldIndexFileArr.push(line);
    });
    return oldIndexFileArr.join("\n");
}
function $149c1bd638913645$var$getArgs() {
    const sourceDir = $149c1bd638913645$var$argv["_"][1];
    const outDir = $149c1bd638913645$var$argv["outdir"] || $149c1bd638913645$var$argv["outDir"] || $149c1bd638913645$var$argv["out-dir"];
    const deep = $149c1bd638913645$var$argv["deep"];
    const keepColors = $149c1bd638913645$var$argv["keepColors"] || $149c1bd638913645$var$argv["keep-colors"] || $149c1bd638913645$var$argv["keepcolors"];
    const mui = $149c1bd638913645$var$argv["mui"];
    const ignoreExisting = $149c1bd638913645$var$argv["ignoreExisting"] || $149c1bd638913645$var$argv["ignore-existing"] || $149c1bd638913645$var$argv["ignoreexisting"];
    return {
        sourceDir: sourceDir,
        outDir: outDir,
        deep: deep,
        keepColors: keepColors,
        mui: mui,
        ignoreExisting: ignoreExisting
    };
}
async function $149c1bd638913645$var$bootstrap() {
    if (/(make)/.test($149c1bd638913645$var$argv["_"][0])) {
        await $149c1bd638913645$var$commands.createComponents();
        return;
    }
}
const $149c1bd638913645$var$commands = {
    async createComponents () {
        const { sourceDir: sourceDir, outDir: outDir, deep: deep, keepColors: keepColors, ignoreExisting: ignoreExisting } = $149c1bd638913645$var$getArgs();
        const { optimize: optimize } = (0, $3de5bca8c08e897f$export$2e2bcd8739ae039)({
            keepColors: keepColors
        });
        if (!outDir || !sourceDir) {
            (0, $9761b849f4f52c69$export$2e2bcd8739ae039).error("Please provide source and output paths\n", "example: iconlite make --out-dir <out-dir> <source-dir>");
            return;
        }
        const { getPathsTree: getPathsTree, createDir: createDir, readFile: readFile, writeFile: writeFile } = await (0, $180e46b5e9ab8609$export$2e2bcd8739ae039)({
            src: sourceDir,
            output: outDir,
            deep: deep
        });
        const pathsTree = getPathsTree();
        for(let directory in pathsTree){
            const dir = pathsTree[directory];
            const icons = dir.iconPaths;
            const outDir = dir.outDir;
            const indexPath = dir.indexFilePath;
            await createDir(outDir);
            const convertedIcons = [];
            for (let icon of icons){
                if (ignoreExisting && icon.alreadyExists) continue;
                const { format: format } = await (0, $a66e1266d5b7abc1$export$2e2bcd8739ae039)({
                    filePath: icon.outputFilePath,
                    options: {
                        parser: "babel-ts"
                    }
                });
                const svgString = await readFile(icon.sourceFilePath);
                const optimizedSvg = await optimize(svgString);
                await writeFile(icon.sourceFilePath, optimizedSvg);
                const component = await (0, $17c4e157c8ac7fed$export$2e2bcd8739ae039)(svgString, {
                    componentName: $32Xfx$pascalCase(icon.name) + "Icon"
                });
                const formattedComponent = await format(component);
                await writeFile(icon.outputFilePath, formattedComponent);
                convertedIcons.push({
                    path: icon.outputFilePath,
                    originalPath: icon.sourceFilePath
                });
            }
            const newIndexFile = (0, $e68fa91ff24b1c9e$export$2e2bcd8739ae039)(convertedIcons);
            const oldIndexFile = await readFile(indexPath);
            const mergedIndexFile = await $149c1bd638913645$var$mergeIndexes(oldIndexFile, newIndexFile, indexPath);
            await writeFile(indexPath, mergedIndexFile);
        }
        (0, $9761b849f4f52c69$export$2e2bcd8739ae039).success(`icons converted and added to ${outDir} successfully.`);
    }
};
$149c1bd638913645$var$bootstrap();


//# sourceMappingURL=module.js.map
