import { useState } from 'react'

import styles from './main-form.module.css'

import { ComputationInitiation } from '@/data-structures'

interface MainFormSubmit {
  onError: (message: string) => void
  onSubmit: (ev: ComputationInitiation) => void
}

export default function MainForm({ onError, onSubmit }: MainFormSubmit) {
  const [ description, setDescription ] = useState('')
  const [ file,        setFile        ] = useState<File>()
  const [ fileName,    setFileName    ] = useState('...')

  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files

    if (!files || files.length === 0) {
      return
    }

    setFile(files[0])
    setFileName(files[0].name)
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()

    if (!file) {
      onError('Please select a proper file!')
      return
    }

    onSubmit({ file, description })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label
        data-testid="target-file"
        htmlFor="target-file"
      >Click to choose a file: {fileName}</label>
      <input
        id="target-file"
        className={styles['input-file']}
        type="file"
        name="target-file"
        onChange={handleFileChange}
      />

      <label>File description</label>
      <textarea
        data-testid="target-description"
        maxLength={500}
        rows={5}
        value={description}
        onChange={e => setDescription(e.target.value)}
      ></textarea>

      <button type="submit" data-testid="button-generate">GENERATE</button>
    </form>
  )
}
