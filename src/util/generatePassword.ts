export function generatePassword(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-[]{}|;:",.<>?';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length - 2; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  result += 's1';
  return result;
}
