import { useState, useEffect } from 'react'
import "./MainCourseInfo.css"
import BreadCrumb from '../../modules/BreadCrumb/BreadCrumb';
import CourseDetailBox from "../../templates/course-info/CourseDetailBox"
import Pageination from '../../modules/Pageination/Pageination';
import AccordionItem from "../../templates/course-info/AccordionItem"
import Comments from "../../templates/course-info/Comments"
import { Link, useNavigate, useParams } from 'react-router-dom'
import Accordion from 'react-bootstrap/Accordion';
import getMe from "../../../utils/auth"
import swal from 'sweetalert'

export default function MainCourseInfo() {
  const params = useParams()
  const navigator = useNavigate()

  const [courseInfo, setCourseInfo] = useState({})
  const [categoryInfo, setCategoryInfo] = useState({})
  const [relatedCourses, setRelatedCourses] = useState([])


  const [courseComments, setCurseComments] = useState([])
  const [courseSessions, setCurseSessions] = useState([])
  const [updatedAt, setUpdatedAt] = useState("")
  const [createdAt, setCreatedAt] = useState("")
  const [courseTeacher, setCourseTeacher] = useState({})


  const getCourseDetail = async () => {
    const token = await getMe()
    if (token) {
      const res = await fetch(`http://localhost:4000/v1/courses/${params.courseName}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.status === 200) {
        const data = await res.json()
        console.log(data);

        setCourseInfo(data)
        setCategoryInfo(data.categoryID)
        setCurseComments(data.comments)
        setCurseSessions(data.sessions)
        setUpdatedAt(data.updatedAt.slice(0, 10))
        setCreatedAt(data.createdAt)
        setCourseTeacher(data.creator)
      }
    }
  }

  const getRelatedCourse = async () => {
    const res = await fetch(`http://localhost:4000/v1/courses/related/${params.courseName}`)
    if (res.status === 200) {
      const data = await res.json()
      setRelatedCourses(data)
    }
  }

  useEffect(() => {
    getCourseDetail()
    getRelatedCourse()
  }, [params.courseName])


  const registerToCourse = async () => {
    const token = await getMe()
    if (token) {
      if (courseInfo.price === 0) {
        const res = await fetch(`http://localhost:4000/v1/courses/${courseInfo._id}/register`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ price: courseInfo.price })

        })
        if (res.status === 200) {
          swal({
            title: "you are registred successfully",
            icon: "success",
            buttons: "ok"
          })
          getCourseDetail()
        }
        else {
          swal({
            title: "someThing Went Wrong !",
            icon: "warning",
            buttons: "Try again"
          })
        }
      }
      else {
        swal({
          title: "Please send Discount Code :)",
          content: "input",
          buttons: ["Without Discount Code", "Submit"]
        })
          .then(async result => {
            if (result === null) {
              const res = await fetch(`http://localhost:4000/v1/courses/${courseInfo._id}/register`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ price: courseInfo.price })
              })
              if (res.status === 201) {
                swal({
                  title: "you are registred successfully",
                  icon: "success",
                  buttons: "ok"
                })
                getCourseDetail()
              }
              else {
                swal({
                  title: "something Went Wrong!",
                  icon: "warning",
                  buttons: "Try again"
                })
              }
            }
            else {
              const res = await fetch(`http://localhost:4000/v1/offs/${result}`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(
                  { course: courseInfo._id }
                )
              })

              const data = await res.json()
              if (res.ok) {
                const priceData = (courseInfo.price) - ((courseInfo.price * data.percent) / 100)

                const res = await fetch(`http://localhost:4000/v1/courses/${courseInfo._id}/register`, {
                  method: "POST",
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ price: priceData })
                })
                if (res.status === 201) {
                  swal({
                    title: "you are registred successfully",
                    icon: "success",
                    buttons: "ok"
                  })
                  getCourseDetail()
                }
              }
              else {
                swal({
                  title: "This code is not valid !!",
                  icon: "warning",
                  buttons: "ok"
                })
              }
            }
          })
      }
    }
    else {
      swal({
        title: "plaese loginIn First",
        icon: "success",
        buttons: "ok"
      }).then(result => {
        if (result) {
          navigator("/login")
        }
      })
    }
  }



  return (
    <div className="container mt-5">
      <BreadCrumb links={[
        { id: 1, title: "Home", to: "/" },
        { id: 2, title: "Frontend", to: "/category-info/frontend/1" },
        { id: 3, title: "Html", to: "/course-info/Html" },
      ]} />
      <div className="row" id="main-course">
        <div className="col-6">
          <video src='#'
            poster={`http://localhost:4000/courses/covers/${courseInfo.cover}`}
            className="course-info__video"></video>
        </div>

        <div className="col-6">
          <Link to={"/"} className="course-info__link">
            {categoryInfo.title}
          </Link>
          <h1 className="course-info__title">
            {courseInfo.name}
          </h1>
          <p className="course-info__text">
            {courseInfo.description}
          </p>
          <div className="course-info__social-media">
            <Link to={"/"} className="course-info__social-media-item">
              <i className="fab fa-telegram-plane course-info__icon"></i>
            </Link>
            <Link to={"/"} className="course-info__social-media-item">
              <i className="fab fa-twitter course-info__icon"></i>
            </Link>
            <Link to={"/"} className="course-info__social-media-item">
              <i className="fab fa-facebook-f course-info__icon"></i>
            </Link>
          </div>
        </div>

        <div className='col-4'>
          <div className="courses-info">
            <div className="course-info">
              <div className="course-info__register">
                {courseInfo.isUserRegisteredToThisCourse ?
                  <span className="course-info__register-title">
                    you are a student of the course
                  </span>
                  :
                  <span className='course-info__register-title'
                    onClick={() => registerToCourse()}>
                    Plaese register to this course :)
                  </span>}
              </div>
            </div>
            <div className="course-info">
              <div className="course-info__total">
                <div className="course-info__top">
                  <div className="course-info__total-sale">
                    <i className="fas fa-user-graduate course-info__total-sale-icon"></i>
                    <span className="course-info__total-sale-text">
                      Students
                    </span>
                    <span className="course-info__total-sale-number">
                      {courseInfo.courseStudentsCount}
                    </span>
                  </div>
                </div>
                <div className="course-info__bottom">
                  <div className="course-info__total-comment">
                    <i className="far fa-comments course-info__total-comment-icon"></i>
                    <span className="course-info__total-comment-text">
                      {courseComments.length}
                    </span>
                  </div>
                  <div className="course-info__total-view">
                    <i className="far fa-eye course-info__total-view-icon"></i>
                    <span className="course-info__total-view-text">
                      14,234 View
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="course-info">
              <div className="course-info__header-short-url">
                <i className="fas fa-link course-info__short-url-icon"></i>
                <span className="course-info__short-url-text">
                  Link
                </span>
              </div>
              <span className="course-info__short-url">
                https://Academia.com/?p=117472
              </span>
            </div>
            <div className="course-info">
              <span className="course-info__topic-title">
                Courses Topics
              </span>
              <span className="course-info__topic-text">
                Download Click :
                <Link href="#" style={{ color: "blue", fontWeight: " bold" }}>
                  Link
                </Link>
              </span>
            </div>
            <div className="course-info">
              <span
                className="course-info__courses-title">
                Related Courses</span>
              <ul className="course-info__courses-list">
                {relatedCourses.length ? relatedCourses.map((course, index) => (
                  <li key={index} className="course-info__courses-list-item">
                    <Link
                      to={`/course-info/${course.shortName}/1`}
                      className="course-info__courses-link">
                      <img
                        src={`http://localhost:4000/courses/covers/${course.cover}`}
                        alt="Course Cover"
                        className="course-info__courses-img" />
                      <span className="course-info__courses-text">
                        {course.name}
                      </span>
                    </Link>
                  </li>
                )) : <span>there isn't any related courses !</span>}
              </ul>
            </div>

          </div>
        </div>

        <div className="col-8">
          <div className="course-boxes">
            <div className="row">
              <CourseDetailBox title="Status"
                subtitle={courseInfo.isComplete === "1" ? "completed" : "uncompleted"}
                icon="fas fa-graduation-cap" />
              <CourseDetailBox
                title="CreatedAt"
                subtitle={createdAt.slice(0, 10)}
                icon="fas fa-clock" />
              <CourseDetailBox
                title="Latest update"
                subtitle={updatedAt}
                icon="fas fa-calendar-days" />
              <CourseDetailBox
                title="Suport"
                subtitle={courseInfo.support}
                icon="fas fa-user-large" />
              <CourseDetailBox
                title="Prerequisite"
                subtitle="Html Css"
                icon="fas fa-circle-info " />
              <CourseDetailBox title="Type of observation"
                subtitle="Online" icon="fas fa-play " />
            </div>
          </div>

          <div className="course-progress">
            <div className="course-progress__header">
              <i
                className="fas fa-chart-line course-progress__icon">
              </i>
              <span className="course-progress__title">
                Courses progress percentage
              </span>
            </div>
            <div className="progress course-progress__bar">
              <div className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar" aria-label="Animated striped example"
                aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"
                style={{ width: "75%" }}>
              </div>
            </div>
          </div>

          <div className="introduction">
            <div className="introduction__item">
              <span className="introduction__title title">
                Lorem ipsum dolor sit amet consectetur adipisicing.
              </span>
              <img
                src={`http://localhost:4000/courses/covers/${courseInfo.cover}`}
                alt="course info image"
                className="introduction__img img-fluid" />
              <p className="introduction__text">
                Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Voluptates enim natus explicabo a culpa quisquam velit, voluptatem et libero sint dolorum reprehenderit neque quibusdam reiciendis qui distinctio maiores earum eveniet?
              </p>
              <p className="introduction__text">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum, tempore atque porro explicabo aliquid ducimus veniam laborum, reprehenderit consectetur saepe itaque nostrum veritatis vitae omnis quidem quae quia aliquam ipsum!
              </p>
            </div>

            <div className="introduction__item">
              <span className="introduction__title title">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, dolore.
              </span>
              <p className="introduction__text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, quos error distinctio magni culpa aperiam! Reprehenderit, cumque dignissimos voluptatem officiis nesciunt quis blanditiis, consequuntur ea id, facilis nihil maxime est!
              </p>
            </div>

            <div className="introduction__btns">
              <Link href="#"
                className="introduction__btns-item">
                Download All Videos</Link>
            </div>

            <div className="introduction__topic">
              <Accordion>
                <Accordion.Item eventKey="one">
                  <Accordion.Header>Course Introduction</Accordion.Header>
                  {courseSessions.map((session, index) => (
                    <AccordionItem key={index}
                      {...session}
                      number={index + 1}
                      isUserRegisteredToThisCourse
                      ={courseInfo.isUserRegisteredToThisCourse} />
                  ))}
                </Accordion.Item>
              </Accordion>
            </div>
          </div>

          <div className="techer-details">
            <div className="techer-details__header">
              <div className="techer-details__header-right">
                <img src={courseTeacher.profile} alt="Teacher Profile"
                  className="techer-details__header-img"></img>
                <div className="techer-details__header-titles">
                  <Link href="#" className="techer-details__header-link">
                    {courseTeacher.name}</Link>
                  <span className="techer-details__header-skill">
                    Frontend & Backend Developer
                  </span>
                </div>
              </div>
              <div className="techer-details__header-left">
                <i className="fas fa-chalkboard-teacher techer-details__header-icon"></i>
                <span className="techer-details__header-name">Teacher</span>
              </div>
            </div>
            <p className="techer-details__footer">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Cumque quibusdam est doloremque perferendis corporis quasi iure minus dicta non quidem....
            </p>
          </div>
          <Comments
            courseInfo={courseInfo}
            data={courseComments} />
        </div>
      </div>
    </div>
  )


}
