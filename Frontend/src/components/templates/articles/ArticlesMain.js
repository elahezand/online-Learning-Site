import BreadCrumb from "../../modules/BreadCrumb/BreadCrumb"
import Article from "../../modules/Article/Article"

export default function ArticlesMain({ showData }) {
  return (
    <div className='container mt-4'>
      <BreadCrumb links={[
        { id: 1, title: "Home", to: "/" },
        { id: 2, title: "Articles", to: "/Articles/1" },
      ]} />
      <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4'>
        {showData.length ? showData.map((article, index) =>
          <div className='col' key={index}>
            <Article {...article} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
