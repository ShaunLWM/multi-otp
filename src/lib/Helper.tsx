export function getCurrentSeconds() {
  return Math.round(new Date().getTime() / 1000.0);
}

export function truncateTo(str: string, digits: number) {
  if (str.length <= digits) {
    return str;
  }

  return str.slice(-digits);
}
