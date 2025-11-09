import BreadCrumb from "../../modules/BreadCrumb/BreadCrumb"
import Article from "../../modules/Article/Article"



export default function ArticlesMain({ showData }) {
  return (
    <>
      <div className='container mt-5'>
        <BreadCrumb links={[
          { id: 1, title: "Home", to: "/" },
          { id: 2, title: "Articles", to: "/Articles" },
        ]} />
        <div className='row m-4' style={{ gap: "1rem 0" }}>
          {showData.length && showData.map((article, index) =>
            <div className='col-4'>
              <Article key={index + 1} {...article} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
