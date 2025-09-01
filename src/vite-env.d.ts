/// <reference types="vite/client" />

interface ViteTypeOptions {}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_WS_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
