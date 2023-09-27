import styles from './status-update.module.css'

import { StatusUpdateType } from '@/data-structures'

export default function Title({ message, progress }: StatusUpdateType) {
  return (
    <div className={styles.status}>
      <h2>COMPUTATION STATUS</h2>
      <p>{message}</p>
      <progress max="100" value={progress}></progress>
    </div>
  )
}
