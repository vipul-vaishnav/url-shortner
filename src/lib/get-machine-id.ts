import FingerprintJS from '@fingerprintjs/fingerprintjs'

const fpPromise = FingerprintJS.load()

export async function getMachineId(): Promise<string> {
  try {
    const fp = await fpPromise
    const result = await fp.get()
    return result.visitorId || 'unknown-machine-id'
  } catch (error) {
    console.error('Error getting machine ID:', error)
    return 'unknown-machine-id'
  }
}
