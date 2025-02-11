export const formatPrice = (num: number): string => {
    const [left, right = "00"] = num.toFixed(2).split(".");
    const formattedLeft = left.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${formattedLeft}.${right}`;
}