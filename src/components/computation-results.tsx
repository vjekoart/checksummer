import styles from './computation-results.module.css'

import { ComputationResultsType } from '@/data-structures'
import { getHumaneFileSize      } from '@/lib/utils'

interface ComputationResultsProps {
  results: ComputationResultsType
}

export default function ComputationResults({ results }: ComputationResultsProps) {
  const fileSize = `${getHumaneFileSize(results.fileSize)} (${results.fileSize} bytes)`

  return (
    <div className={styles.results}>
      <h2>RESULTS</h2>
      <ul>
        <li>Filename: <strong data-testid="results-file-name" className={styles['file-name']}>{results.fileName}</strong></li>
        <li>File size: <strong data-testid="results-file-size" className={styles['file-size']}>{fileSize}</strong></li>
        <li>Hash: <strong data-testid="results-hash" className={styles.hash}>{results.hash}</strong></li>
        <li>Description: <strong data-testid="results-description" className={styles.description}>{results.description}</strong></li>
      </ul>
    </div>
  )
}
