import Button from 'react-bootstrap/Button';
import Header from '@/components/Header'


export default function Search() {
    return (
        <>
            <Header />
            <main className='container'>


                <h2 className='text-center py-5'>Site Search</h2>
                <div className="row">
                    <div className="col-sm-10">
                        <input type="text" className="form-control" placeholder="Search Site Records..." aria-label="Search Site Records" />
                    </div>

                    <div className="col-sm">
                        <a href='/advanced-search'>
                            <Button variant='secondary'>Advanced Search</Button>
                        </a>
                    </div>

                </div>
            </main>
        </>
    )


}