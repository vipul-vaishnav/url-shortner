const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function toBase62(num: number): string {
  if (num === 0) return '00'
  let result = ''
  while (num > 0) {
    result = BASE62[num % 62] + result
    num = Math.floor(num / 62)
  }
  return result.padStart(2, '0')
}

function getRandomBase62(length: number): string {
  return Array.from({ length }, () => BASE62[Math.floor(Math.random() * BASE62.length)]).join('')
}

export function generateSlug(machineId: string, counter: number): string {
  const machinePart = machineId.slice(0, 3) // first 3 chars of machineId
  const counterPart = toBase62(counter) // 2 chars from counter
  const randomPart = getRandomBase62(3) // 3 chars random

  return machinePart + counterPart + randomPart // Total: 8 chars
}
