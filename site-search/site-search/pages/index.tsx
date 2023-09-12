import Head from 'next/head'
import Image from 'next/image'
import Button from 'react-bootstrap/Button';

// import { Inter } from 'next/font/google'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import styles from '@/styles/Home.module.css'

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Site Search</title>
        <meta name="description" content="BCGov Site Search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
{/* 
      <main className={`${styles.main}`}>
    
      </main> */}

      <main>
        <h2>Site Search</h2>
        <div className="row">
          <div className="col">
            <input type="text" className="form-control" placeholder="Search" aria-label="Search" />
          </div>

          <div className="col">
            <Button variant="secondary">Advanced Search</Button>
          </div>

        </div>
      </main>
    </>
  )
}
