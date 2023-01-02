export function areSetEqual<T extends number | string>(arr1: T[], arr2: T[]): boolean {
    const set1 = new Set(arr1), 
          set2 = new Set(arr2);
          console.log(set1, set2);
    return set1.size === set2.size && arr1.every(elm => set2.has(elm));
}