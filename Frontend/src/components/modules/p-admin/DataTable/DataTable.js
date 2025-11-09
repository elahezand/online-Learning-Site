import "./DataTable.css"


export default function DataTable({ title, children }) {

    return (
        <>
            <div className='table-container'>
                <h1>{title}</h1>             
                  {children}         
            </div>

        </>
    )
}







