export const formatPrice = (num: number): string => {
    const [left, right = "00"] = num.toFixed(2).split("."); // Округляем до двух знаков и разделяем
    const formattedLeft = left.replace(/\B(?=(\d{3})+(?!\d))/g, " "); // Добавляем пробелы в левой части
    return `${formattedLeft}.${right}`;
}