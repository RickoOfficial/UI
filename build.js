import fs from 'node:fs/promises'
import path from 'node:path'

const DIR_PATH = import.meta.dirname

const DIST_PATH = path.resolve(DIR_PATH, 'dist')
const MODULES_DIST_PATH = path.resolve(DIST_PATH, 'modules')

const SRC_PATH = path.resolve(DIR_PATH, 'src')
const MODULES_SRC_PATH = path.resolve(SRC_PATH, 'modules')

async function remakeDistDir() {
	try {
		await fs.rm(MODULES_DIST_PATH, { recursive: true })
	} catch (err) {}

	await fs.mkdir(MODULES_DIST_PATH, { recursive: true })
}

async function copyModules() {
	const modulesDirNames = await fs.readdir(MODULES_SRC_PATH)

	for (const module of modulesDirNames) {
		const modulePath = path.resolve(MODULES_SRC_PATH, module)
		const moduleAssetsPath = path.resolve(modulePath, 'dist', 'assets')

		const assetsFilePaths = await fs.readdir(moduleAssetsPath)

		assetsFilePaths.forEach(async (assetFileName) => {
			const sourcePath = path.resolve(moduleAssetsPath, assetFileName)
			const distPath = path.resolve(MODULES_DIST_PATH, module, assetFileName)

			await fs.cp(sourcePath, distPath)
		})
	}
}

remakeDistDir()
copyModules()
