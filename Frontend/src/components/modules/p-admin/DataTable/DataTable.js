import "./DataTable.css"

/* Card wrapper for admin tables. Children should be a
   <table className="table table-hover align-middle mb-0">. */
export default function DataTable({ title, children }) {
    return (
        <section className='card data-table mt-4'>
            {title &&
                <div className="card-header bg-transparent py-3">
                    <h2 className="h5 fw-bold mb-0">{title}</h2>
                </div>}
            <div className="table-responsive">
                {children}
            </div>
        </section>
    )
}
