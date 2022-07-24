import * as yaml from 'js-yaml'
import { readFileSync } from 'fs'

import { workspace } from 'vscode'

import { LanguageDictionary } from './types'

const workspaceFolder = workspace.workspaceFolders?.[0]
const projectPath = workspaceFolder?.uri?.path

const parseDictionary = (dictionaryPath: string) => {
  try {
    const dictionary = readFileSync(dictionaryPath, 'utf8')
    const doc = yaml.load(dictionary) as LanguageDictionary

    return doc
  } catch (error) {
    console.error('yaml parse error :>>', error)
  }
}

export const parseUserDictionaries = (
  dictionaryNames: string[],
  folderPath: string
): LanguageDictionary => {
  const dictionaries = dictionaryNames.map((dictionaryName) =>
    parseDictionary(`${projectPath}/${folderPath}/${dictionaryName}.yml`)
  )

  const dictionary = dictionaries.reduce((prev, languageDictionary) => {
    if (!languageDictionary) {
      return prev
    }

    const { en: dictionary } = languageDictionary

    return { ...prev, ...dictionary }
  }, {})

  const languageDictionary = { en: dictionary }

  return languageDictionary
}
