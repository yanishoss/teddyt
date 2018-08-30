// getDifferences looks at obj1 and obj2,
// it returns the keys present in obj1 that are not present in obj2
export function getDifferences<A extends {[key: string]: any}, B extends {[key: string]: any}>(obj1: A, obj2: B): string[] {
  let differences: string[] = [];

  for (const k in obj1) {
    if (obj2[k]) {
      continue;
    }

    differences = [...differences, k];
  }

  return differences;
}