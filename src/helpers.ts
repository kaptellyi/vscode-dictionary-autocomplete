import { window as vsWindow, ProgressLocation } from 'vscode'

export const withProgress = async <T>(title: string, callback: () => T) => {
  return vsWindow.withProgress(
    {
      title,
      location: ProgressLocation.Window,
      cancellable: false
    },
    async () => {
      return new Promise((resolve, reject) => {
        const result = callback()

        if (!result) {
          reject()
        }

        resolve(result)
      }) as Promise<T>
    }
  )
}

export const flattenObjectToKeys = (obj: object, parent?: string): string[] => {
  return Object.keys(obj).reduce((prev, key) => {
    const propName = parent ? `${parent}.${key}` : key
    const nextValue = obj[key]

    if (typeof nextValue === 'object') {
      return [...prev, ...flattenObjectToKeys(nextValue, propName)]
    }

    return [...prev, propName]
  }, [] as string[])
}

export const deriveTermFromFunction = (line: string, targetNames: string[]) => {
  // Pattern: quote | term | quote
  const inParenthesesPattern = `('|")(.*)('|")`
  const inTargetMethodPattern = `\\({\\s?id:\\s?${inParenthesesPattern}\\s?}\\)`
  const allowedMethodNames = `(${targetNames.join('|')})`
  const lineTermPattern = new RegExp(
    `${allowedMethodNames}${inTargetMethodPattern}`
  )

  const matchedLineTerms = line.match(lineTermPattern)

  // the word inside parentheses
  const term = matchedLineTerms?.[3]

  return term
}

export const shallowEqual = (objA: object, objB: object) => {
  if (objA === objB) {
    return true
  }

  if (!objA || !objB) {
    return false
  }

  let aKeys = Object.keys(objA)
  let bKeys = Object.keys(objB)
  let len = aKeys.length

  if (bKeys.length !== len) {
    return false
  }

  for (let i = 0; i < len; i++) {
    let key = aKeys[i]

    if (
      objA[key] !== objB[key] ||
      !Object.prototype.hasOwnProperty.call(objB, key)
    ) {
      return false
    }
  }

  return true
}
