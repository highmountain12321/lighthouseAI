export const truncateString = (str: string, numWords: number): string => {
    const words = str.split(' ');
    const truncatedWords = words.slice(0, numWords);
    return truncatedWords.join(' ');
};