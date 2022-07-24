interface UserConfigType {
  methods: string[]
  dictionary: {
    dictionariesFolder?: string
    dictionaries?: string[]
  }
  options: AutocompleteOptions
}

interface AutocompleteOptions {
  maxLength: number
}

export type UserConfig = Readonly<UserConfigType>

export interface LanguageDictionary {
  en: Dictionary
}

export type Dictionary = object
