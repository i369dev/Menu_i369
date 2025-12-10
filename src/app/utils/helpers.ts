
// Helper to calculate cyclic index
export const getCyclicIndex = (i: number, length: number) => {
    return ((i % length) + length) % length;
};
