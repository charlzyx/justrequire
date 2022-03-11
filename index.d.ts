declare module 'justrequire' {
  <R = any>(
    /**
     * @description 模块名称或者文件地址
     **/
    moduleName: string,
    /**
     * @description 文件查找的前缀
     * @default 默认 process.cwd()
     **/
    prefix?: string
  ) => R
}
