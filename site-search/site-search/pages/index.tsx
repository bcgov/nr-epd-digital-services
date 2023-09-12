import Head from 'next/head'
import Image from 'next/image'
import Button from 'react-bootstrap/Button';
import Header from '@/components/Header'
import Link from 'next/link';


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

      <Header />

      <main className='container'>


        <h2 className='text-center py-5'>Site Search</h2>
        <div className="row">
          <div className="col-sm-10">
            <input type="text" className="form-control" placeholder="Search Site Records..." aria-label="Search Site Records" />
          </div>

          <div className="col-sm">
            <Link href='/advanced-search'>
              <Button variant='secondary'>Advanced Search</Button>
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
