import { useEffect, useState } from 'react'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import AddNewCourse from '../../components/templates/p-admin/AddNewCourse/AddNewCourse'
import Pageination from '../../components/modules/Pageination/Pageination'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'

export default function CoursesPanel() {
    const param = useParams()
    const { page } = param

    const pageSize = 10

    const [allCourses, setAllCourses] = useState([])
    const [currentPage, setCurrentPage] = useState(1)


    const getAllCourses = async () => {
        const res = await fetch("http://localhost:4000/v1/courses")
        if (res.ok) {
            const data = await res.json()
            setAllCourses(data)
        }
    }

    useEffect(() => {
        getAllCourses()
    }, [])

    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(allCourses.length / pageSize)
    const paginatedData = allCourses.slice(firstChild, lastChild)

    const removeCourses = (Id) => {
        const getFromLocalStorage = JSON.parse(localStorage.getItem("userData"))
        swal({
            title: "are you sure to remove this course?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(result => {
            if (result) {
                fetch(`http://localhost:4000/v1/courses/${Id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${getFromLocalStorage.token} `
                    }
                }).then(res => res.json())
                    .then(data => {
                        swal({
                            title: "this courses was removed successfuly",
                            icon: "success",
                            buttons: "ok"
                        })
                        getAllCourses()
                    })
            }
        })
    }

    const editCourses = () => {
        /*edit courses*/
    }


    return (
        <>
            <AddNewCourse getAllCourses={getAllCourses} />
            <DataTable title={"Courses"}>
                <table className="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th className='number'>#</th>
                            <th>Name</th>
                            <th>categoryID</th>
                            <th>Status</th>
                            <th>ShortName</th>
                            <th>creator</th>
                            <th>support</th>
                            <th>Price</th>
                            <th><i className='fa fa-edit'></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, index) => (
                            <tr key={index}>
                                <td className='number'>{index + 1}</td>
                                <td className='fw-medium text-heading'>
                                    {item.name}
                                </td>
                                <td>{item.categoryID.title}</td>
                                <td>{item.isComplete ? "completed" : "uncompleted"}</td>
                                <td>{item.shortName}</td>
                                <td>{item.creator}</td>
                                <td>{item.support}</td>
                                <td>{item.price === 0 ? "Free" :
                                    `${item.price.toLocaleString()}$`}</td>
                                <td>
                                    <button
                                        onClick={(() => removeCourses(item._id))}
                                        className='btn btn-sm btn-danger'>Remove</button>
                                    <button
                                        className='btn btn-sm btn-primary'
                                        onClick={() => editCourses(item._id)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataTable>
            <Pageination
                data={paginatedData}
                pathName={`/p-admin/courses`}
                pageCount={pageCount}
                currentPage={currentPage} />
        </>
    )
}
