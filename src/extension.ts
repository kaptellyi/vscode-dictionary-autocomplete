import {
  languages,
  workspace,
  ExtensionContext,
  TextDocument,
  Position
} from 'vscode'

import { deriveTermFromFunction, shallowEqual } from './helpers'
import { UserConfig } from './types'
import Autocomplete from './Autocomplete'

export let $config: UserConfig

const updateUserConfig = () => {
  const newUserConfig = workspace
    .getConfiguration()
    .get('dictionaryAutocomplete') as UserConfig

  $config = newUserConfig

  return newUserConfig
}

export async function activate(context: ExtensionContext) {
  const autocomplete = new Autocomplete()

  updateUserConfig()

  if (
    $config.dictionary.dictionaries &&
    $config.dictionary.dictionariesFolder
  ) {
    autocomplete.updateDictionary()
  }

  workspace.onDidChangeConfiguration(async (e) => {
    const isExtensionConfigChanged = e.affectsConfiguration(
      'dictionaryAutocomplete'
    )

    if (isExtensionConfigChanged) {
      const { dictionary: oldDictionaryState } = $config
      const { dictionary: newDictionaryState } = updateUserConfig()

      const isDictionariesStateChanged = !shallowEqual(
        oldDictionaryState,
        newDictionaryState
      )

      if (isDictionariesStateChanged) {
        autocomplete.updateDictionary()
      }
    }
  })

  workspace.onDidSaveTextDocument((e) => {
    const { dictionaries: dictionaryNames } = $config.dictionary
    const isDictionaryChanged = dictionaryNames?.some((dictionaryName) =>
      e.fileName.endsWith(`${dictionaryName}.yml`)
    )

    if (isDictionaryChanged) {
      autocomplete.updateDictionary()
    }
  })

  const disposableAutocompletionProvider =
    languages.registerCompletionItemProvider(
      ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
      {
        provideCompletionItems(document: TextDocument, position: Position) {
          const currentLine = document.lineAt(position).text
          const term = deriveTermFromFunction(currentLine, $config.methods)

          if (!term) {
            return []
          }

          const autocompleteItems = autocomplete.getTypingSuggestions(term)

          return autocompleteItems
        }
      }
    )

  context.subscriptions.push(disposableAutocompletionProvider)
}
