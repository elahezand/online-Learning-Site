import type { Category, CourseDetail as CourseDetailData } from "../../types/models"
import CourseDetailBox from "./CourseDetailBox"
import SessionItem from "./SessionItem"
import CourseComments from "../comments/CourseComments"
import { Link, useNavigate, useParams } from 'react-router-dom'
import Accordion from 'react-bootstrap/Accordion';
import { useAuth } from "../auth/useAuth"
import { useCourse, useRegisterCourse, useRelatedCourses } from "./hooks"
import { confirmToast } from '../../components/ui/toastActions'
import { coverUrl } from '../../config/env'
import { CoursePrice } from './CourseCard'
import useCart from '../cart/useCart'
import { FaCalendarDays, FaCartPlus, FaCartShopping, FaChalkboardUser, FaCircleCheck, FaCircleInfo, FaClock, FaGraduationCap, FaLink, FaPlay, FaRegComments, FaUser, FaUserGraduate, FaUserLarge } from 'react-icons/fa6'

export default function CourseDetail() {
  const params = useParams()
  const navigator = useNavigate()

  const { isLoggedIn } = useAuth()
  const { courseName } = params

  const { data } = useCourse(courseName)
  const courseInfo: Partial<CourseDetailData> = data ?? {}
  const { data: relatedCourses = [] } = useRelatedCourses(courseName)
  const categoryInfo: Partial<Category> = courseInfo.categoryID ?? {}
  const courseComments = courseInfo.comments ?? []
  const courseSessions = courseInfo.sessions ?? []
  const updatedAt = courseInfo.updatedAt?.slice(0, 10) ?? ""
  const createdAt = courseInfo.createdAt ?? ""
  const courseTeacher: Partial<NonNullable<CourseDetailData["creator"]>> = courseInfo.creator ?? {}

  const registerCourse = useRegisterCourse()
  const cart = useCart()
  const inCart = cart.has(courseInfo._id)
  const isFree = courseInfo.price === 0

  const registerToCourse = async () => {
    if (!isLoggedIn) {
      const goToLogin = await confirmToast({ title: "Please log in first", description: "You need an account to enroll in this course.", confirmLabel: "Log in", cancelLabel: "Not now", variant: "primary" })
      if (goToLogin) navigator("/login", { state: { from: { pathname: `/course-info/${courseName}` } } })
      return
    }

    if (courseInfo._id) registerCourse.mutate({ courseId: courseInfo._id, price: 0 })
  }

  return (
    <div className="container py-4 py-lg-5">
      <div className="row g-4 g-xl-5">
        <div className="col-12 col-lg-8 order-2 order-lg-1">
          <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow-sm bg-body-secondary mb-4">
            <img src={coverUrl(courseInfo.cover)} alt="" className="object-fit-cover" />
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            {categoryInfo.title &&
              <Link to={`/category-info/${categoryInfo.name}`} className="badge rounded-pill text-bg-primary">{categoryInfo.title}</Link>}
            <span className={`badge rounded-pill ${Number(courseInfo.isComplete) === 1 ? "text-bg-success" : "text-bg-secondary"}`}>
              {Number(courseInfo.isComplete) === 1 ? "Completed" : "In progress"}
            </span>
          </div>
          <h2 className="h3 fw-bold">{courseInfo.name}</h2>
          <p className="lead text-body-secondary">{courseInfo.description}</p>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 my-4">
            <CourseDetailBox title="Created" subtitle={createdAt.slice(0, 10)} icon={<FaClock />} />
            <CourseDetailBox title="Last update" subtitle={updatedAt} icon={<FaCalendarDays />} />
            <CourseDetailBox title="Support" subtitle={courseInfo.support} icon={<FaUserLarge />} />
            <CourseDetailBox title="Prerequisite" subtitle="HTML, CSS" icon={<FaCircleInfo />} />
            <CourseDetailBox title="Format" subtitle="Online" icon={<FaPlay />} />
            <CourseDetailBox title="Sessions" subtitle={courseSessions.length} icon={<FaGraduationCap />} />
          </div>

          <section className="card shadow-sm mb-4">
            <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2 py-3">
              <h2 className="h5 fw-bold mb-0">Course content</h2>
              <span className="small text-body-secondary">{courseSessions.length} sessions</span>
            </div>
            <Accordion defaultActiveKey="intro" flush>
              <Accordion.Item eventKey="intro">
                <Accordion.Header>Course introduction</Accordion.Header>
                <Accordion.Body className="p-0">
                  <div className="list-group list-group-flush">
                    {courseSessions.map((session, index) => (
                      <SessionItem key={session._id} {...session} number={index + 1} />
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </section>

          <section className="card shadow-sm mb-4">
            <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                {courseTeacher.profile ?
                  <img src={courseTeacher.profile} alt="" width="56" height="56" className="rounded-circle object-fit-cover" /> :
                  <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary-emphasis fs-4 p-3 lh-1"><FaUser /></span>}
                <div>
                  <div className="fw-bold text-body-emphasis">{courseTeacher.name}</div>
                  <div className="small text-body-secondary">Frontend &amp; Backend Developer</div>
                </div>
              </div>
              <span className="badge text-bg-primary d-inline-flex align-items-center gap-2 px-3 py-2"><FaChalkboardUser /> Teacher</span>
            </div>
          </section>

          <CourseComments courseInfo={{ shortName: courseInfo.shortName ?? "" }} data={courseComments} />
        </div>

        <aside className="col-12 col-lg-4 order-1 order-lg-2">
          <div className="sticky-lg-top d-grid gap-4" style={{ top: "6rem" }}>
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="fs-3 mb-3"><CoursePrice price={courseInfo.price ?? 0} discount={courseInfo.discount} /></div>
                {courseInfo.isUserRegisteredToThisCourse ?
                  <div className="alert alert-success d-flex align-items-center gap-2 mb-0">
                    <FaCircleCheck /> You are a student of this course
                  </div> :
                  isFree ?
                    <button type="button" className="btn btn-primary btn-lg w-100 d-inline-flex align-items-center justify-content-center gap-2"
                      onClick={registerToCourse} disabled={registerCourse.isPending}>
                      <FaGraduationCap /> Enroll in this course
                    </button> :
                    inCart ?
                      <Link to="/cart" className="btn btn-primary btn-lg w-100 d-inline-flex align-items-center justify-content-center gap-2">
                        <FaCartShopping /> In your cart — view cart
                      </Link> :
                      <button type="button" className="btn btn-primary btn-lg w-100 d-inline-flex align-items-center justify-content-center gap-2"
                        onClick={() => courseInfo._id && cart.add({
                          _id: courseInfo._id, name: courseInfo.name ?? "", shortName: courseInfo.shortName ?? "",
                          cover: courseInfo.cover, price: courseInfo.price ?? 0, discount: courseInfo.discount,
                        })}>
                        <FaCartPlus /> Add to cart
                      </button>}

                <ul className="list-unstyled d-grid gap-2 small text-body-secondary mt-4 mb-0">
                  <li className="d-flex justify-content-between"><span className="d-inline-flex align-items-center gap-2"><FaUserGraduate /> Students</span><span className="fw-medium text-body-emphasis">{courseInfo.courseStudentsCount ?? 0}</span></li>
                  <li className="d-flex justify-content-between"><span className="d-inline-flex align-items-center gap-2"><FaRegComments /> Comments</span><span className="fw-medium text-body-emphasis">{courseComments.length}</span></li>
                  <li className="d-flex justify-content-between"><span className="d-inline-flex align-items-center gap-2"><FaLink /> Short link</span><span className="fw-medium text-body-emphasis text-truncate ms-3">{window.location.host}/course-info/{courseInfo.shortName}</span></li>
                </ul>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-header py-3"><h2 className="h6 fw-bold mb-0">Related courses</h2></div>
              <div className="list-group list-group-flush">
                {relatedCourses.length ? relatedCourses.map(course => (
                  <Link key={course._id} to={`/course-info/${course.shortName}`}
                    className="list-group-item list-group-item-action d-flex align-items-center gap-3">
                    <img src={coverUrl(course.cover)} alt="" width="64" height="40" className="rounded object-fit-cover bg-body-secondary flex-shrink-0" />
                    <span className="small fw-medium text-truncate">{course.name}</span>
                  </Link>
                )) : <div className="list-group-item small text-body-secondary">No related courses.</div>}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}