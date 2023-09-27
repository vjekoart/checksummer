export function getHumaneFileSize(fileSizeInBytes: number): string {
  const kb = Math.round((fileSizeInBytes / 1024 + Number.EPSILON) * 100) / 100

  if (kb > 1000) {
    const mb = Math.round((kb / 1024 + Number.EPSILON) * 100) / 100

    if (mb > 1000) {
      return `${Math.round((mb / 1024 + Number.EPSILON) * 100) / 100}GB`
    }

    return `${mb}MB`
  }

  return `${kb}KB`
}
