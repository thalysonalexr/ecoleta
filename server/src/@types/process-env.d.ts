declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    BASE_URL: string
    VERSION: string
    APP_NAME: string
    UPLOAD_TYPE: 'local'
    UPLOAD_PATH: string
    UPLOAD_SIZE: string
    DATABASE_CONFIG: string
    NODE_ENV: 'development' | 'production' | 'test'
  }
}
