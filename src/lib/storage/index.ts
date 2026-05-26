import { StorageProvider } from "./types"
import { LocalStorageProvider } from "./local"
import { R2StorageProvider } from "./r2"

let _provider: StorageProvider | null = null

export function getStorageProvider(): StorageProvider {
  if (_provider) return _provider

  const provider = process.env.STORAGE_PROVIDER || "local"

  switch (provider) {
    case "r2": {
      const r2 = new R2StorageProvider()
      _provider = r2
      return r2
    }
    case "local":
    default: {
      const local = new LocalStorageProvider()
      _provider = local
      return local
    }
  }
}

export function resetStorageProvider() {
  _provider = null
}
