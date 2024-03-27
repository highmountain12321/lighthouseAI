export interface SupplyDemandDataArrayOfObjects {
  name: string;
  count: number;
  avg_value: number;
  max_value: number;
}

export interface SupplyDemandData {
  name: string[];
  count: number[];
  avg_value: number[];
  max_value: number[];
}

export const convertSupplyDemandDataToArrayOfObjects = ({
  name,
  count,
  avg_value,
  max_value,
}: SupplyDemandData): SupplyDemandDataArrayOfObjects[] => {
  const result: SupplyDemandDataArrayOfObjects[] = name.map((location, index) => {
    return {
      name: location,
      count: count[index],
      avg_value: avg_value[index],
      max_value: max_value[index],
    };
  });

  return result;
};

export const convertLargerNumberToMillionOrTrillionOrWhatsBest = (number: number): string => {
  if (number >= 1000000000) {
    return `${(number / 1000000000).toFixed(0)}B`;
  } else if (number >= 1000000) {
    return `${(number / 1000000).toFixed(0)}M`;
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(0)}K`;
  } else {
    return number.toString();
  }
};

export const convert2ArraysToObjectArray = (projectArray: string[], volumeArray: number[]) => {
  // Check if arrays have the same length
  if (projectArray.length !== volumeArray.length) {
    alert('Input arrays must have the same length')
    throw new Error('Input arrays must have the same length')
  }

  // Use map to create a new array of objects
  const newArray = projectArray.map((label, index) => {
    // Check if the project name contains "By" (case insensitive)
    const hasBy = label.toUpperCase().includes('BY')

    // Create the object with label, value, and by properties
    let developer = ''
    if (hasBy) {
      // Split based on "BY" (case insensitive)
      const splitResult = label.split(/BY/i)

      if (splitResult.length > 1) {
        developer = splitResult[1].trim()
        // Remove "By" from the label
        label = label.replace(/BY/i, '').trim()
      }
    }

    return {
      label,
      value: volumeArray[index],
      by: developer,
    }
  })

  return newArray
}

export const extractLetters = (displayName: string): string => {
  const [firstName, lastName] = displayName.split(' ')

  const firstLetter = (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')

  return firstLetter.toUpperCase()
}

export const extractFirstAndLastName = (displayName: string) => {
  const [firstName, lastName] = displayName.split(' ')
  return {
    firstName,
    lastName,
  }
}
