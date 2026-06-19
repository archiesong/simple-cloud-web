import type { LocaleType } from '#/config'

export const generatorMessage = (
  moduleFiles: Record<string, unknown>,
  locale: LocaleType = 'zh-CN',
) => {
  const allModules = Object.keys(moduleFiles).reduce((modules: { [key: string]: string }, path) => {
    const moduleName = path.replace(new RegExp(`^./${locale}/(.*)\\.\\w+$`), '$1')
    Object.keys((moduleFiles[path] as any)?.default).map((key, index) => {
      modules[`${moduleName}.${key}`] = Object.values((moduleFiles[path] as any)?.default)[
        index
      ] as string
    })
    return modules
  }, {})
  return allModules
}