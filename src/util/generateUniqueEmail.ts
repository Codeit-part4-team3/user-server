// 렌덤 이메일
export function generateUniqueEmail() {
  const timestamp = Date.now();
  return `test${timestamp}@example.com`;
}
