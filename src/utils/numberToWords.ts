const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const trueTeens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

function convert_hundreds(num: number): string {
    if (num > 99) {
        return ones[Math.floor(num / 100)] + " Hundred " + convert_tens(num % 100);
    } else {
        return convert_tens(num);
    }
}

function convert_tens(num: number): string {
    if (num < 10) return ones[num];
    else if (num >= 10 && num < 20) return trueTeens[num - 10];
    else {
        return tens[Math.floor(num / 10)] + " " + ones[num % 10];
    }
}

function convert(num: number): string {
    if (num == 0) return "Zero";
    else return convert_hundreds(num);
}

export function numberToWords(amount: number): string {
  const wholePart = Math.floor(amount);
  const decimalPart = Math.round((amount - wholePart) * 100);

  if (wholePart === 0 && decimalPart === 0) return "Zero Pesos";

  let result = "";

  if (wholePart > 0) {
    if (wholePart >= 1000000) {
      result += convert(Math.floor(wholePart / 1000000)) + " Million ";
      let remainder = wholePart % 1000000;
      if (remainder >= 1000) {
        result += convert(Math.floor(remainder / 1000)) + " Thousand ";
        remainder = remainder % 1000;
      }
      result += convert(remainder);
    } else if (wholePart >= 1000) {
      result += convert(Math.floor(wholePart / 1000)) + " Thousand ";
      result += convert(wholePart % 1000);
    } else {
      result += convert(wholePart);
    }
    result = result.trim() + " Pesos";
  }

  if (decimalPart > 0) {
    if (wholePart > 0) result += " and ";
    result += convert(decimalPart) + " Centavos";
  }

  return result.replace(/\s+/g, ' ').trim();
}
