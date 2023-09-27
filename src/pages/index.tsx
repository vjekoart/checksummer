import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

import styles from '@/styles/Index.module.css'

import {
  ComputationInitiation,
  ComputationResultsType
} from '@/data-structures'

import WorkerBackend      from '@/lib/worker-backend'

import ComputationResults from '@/components/computation-results'
import MainForm           from '@/components/main-form'
import StatusUpdate       from '@/components/status-update'
import Title              from '@/components/title'

export default function Home() {
  const workerBackendRef = useRef<WorkerBackend>()

  const [ fileResults,    setFileResults    ] = useState<ComputationResultsType | null>(null)
  const [ isFatalError,   setIsFatalError   ] = useState(false)
  const [ statusMessage,  setStatusMessage  ] = useState('Initializing...')
  const [ statusProgress, setStatusProgress ] = useState(0)

  const handleFormError = (message: string) => setStatusMessage(message)

  const handleSubmit = (initiationData: ComputationInitiation) => {
    setFileResults(null)

    if (!workerBackendRef.current) {
      setStatusMessage('There was an internal error. Cannot start hash computation!')
      return
    }

    try {
      workerBackendRef.current.startSession(initiationData)
    } catch (error) {
      console.error('Computation error', error)
      setStatusMessage('Failed to compute.')
    }
  }

  useEffect(() => {
    try {
      workerBackendRef.current = new WorkerBackend({
        progressUpdate: (progress: number) => setStatusProgress(progress),
        resultsUpdate: (results: ComputationResultsType) => setFileResults(results),
        statusUpdate: (message: string) => setStatusMessage(message)        
      })

      setStatusMessage('Engine is ready. Please select a file.')
    } catch (error) {
      setStatusMessage('There was an error during initialization. Sorry!')
      setIsFatalError(true)
    }

    return () => {
      workerBackendRef.current?.terminate()
    }
  }, [])

  return (
    <>
      <Head>
        <title>Checksummer</title>

        <meta name="description" content="Small client-side web app that calculates SHA256 checksum of a given file." />
        <meta name="viewport"    content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <Title />
        {isFatalError ? <></> : <MainForm onSubmit={handleSubmit} onError={handleFormError} />}
        <StatusUpdate message={statusMessage} progress={statusProgress} />
        {fileResults ? <ComputationResults results={fileResults} /> : <></>}
      </main>
    </>
  )
}
