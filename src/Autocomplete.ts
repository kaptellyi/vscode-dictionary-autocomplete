import filterObj from 'filter-obj'
import { get } from 'object-path'
import { CompletionItem } from 'vscode'

import { parseUserDictionaries } from './parse'
import { flattenObjectToKeys, withProgress } from './helpers'

import { UserConfig, Dictionary, LanguageDictionary } from './types'
import { $config } from './extension'

interface AutocompleteI {
  dictionary: Dictionary
}

class Autocomplete implements AutocompleteI {
  dictionary: Dictionary = {}

  private prepareSuggestion(
    suggestion: string,
    { maxLength }: UserConfig['options']
  ) {
    const path = suggestion.split('.')

    if (suggestion.length <= maxLength) {
      return suggestion
    }

    let resultSuggestion = ''

    for (let index = 0; index < path.length; index++) {
      const currentLayerTerm = path[index]
      const newSuggestion =
        resultSuggestion.length === 0
          ? currentLayerTerm
          : `${resultSuggestion}.${currentLayerTerm}`

      if (newSuggestion.length > maxLength) {
        break
      }

      resultSuggestion = newSuggestion
    }

    return resultSuggestion
  }

  getTypingSuggestions(term: string) {
    const { options } = $config
    const nestedLevel = term.lastIndexOf('.')
    const path = term.slice(0, nestedLevel)
    const currentTerm = nestedLevel ? term.slice(nestedLevel + 1) : term

    const dictionaryLayer =
      nestedLevel > 0 ? get(this.dictionary, path) : this.dictionary

    const matchedSuggestions = filterObj(dictionaryLayer, (key) => {
      if (typeof key !== 'string') {
        return false
      }

      return key.startsWith(currentTerm)
    })

    const suggestions = flattenObjectToKeys(matchedSuggestions)
    const normalizedSuggestions = suggestions.map((suggestion) => {
      const normalized = this.prepareSuggestion(suggestion, options)

      return new CompletionItem(normalized)
    })

    return normalizedSuggestions
  }

  async updateDictionary() {
    const { dictionaries: dictionaryNames, dictionariesFolder } =
      $config.dictionary

    if (dictionariesFolder && dictionaryNames) {
      const { en: dictionary } = await withProgress<LanguageDictionary>(
        'Parsing dictionary',
        () => parseUserDictionaries(dictionaryNames, dictionariesFolder)
      )

      this.dictionary = dictionary
    }
  }
}

export default Autocomplete
