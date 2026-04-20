const normalizeEnvValue = (value: string | undefined) =>
  value?.trim().replace(/^['"]|['"]$/g, '')

export const apiVersion =
  normalizeEnvValue(process.env.NEXT_PUBLIC_SANITY_API_VERSION) || '2026-04-04'

export const dataset = assertValue(
  normalizeEnvValue(process.env.NEXT_PUBLIC_SANITY_DATASET),
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  normalizeEnvValue(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
