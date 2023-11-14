import { useState, useEffect, useCallback } from "react";
import cx from 'classnames';
import { toast } from 'react-toastify';
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { LogIn, Megaphone, Box } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Masonry from 'react-masonry-css'

import GradientButton from "@/components/Button/gradientButton";
import Profile from "@/components/Profile";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import SkeletonCard from "@/components/Card/skeleton";
import Card from "@/components/Card";

import { TASK_STATUS, FILTERS, breakpointColumnsObj, skeletonCardsData } from "@/lib/constants";
import { getFilterStatusText } from '@/lib/utils';
import type { Task } from "@/lib/interface";

import styles from '@/styles/index.module.css';

export default function Home() {
  const { data: session, status } = useSession() // user session data
  const [tasks, setTasks] = useState<Task[]>([]) // array of all tasks
  const [showSkeleton, toggleSkeleton] = useState(true)
  const [activeFilter, setActiveFilter] = useState(FILTERS.ALL)
  const isLoggedIn = status === 'authenticated'

  const changeFilter = (newFilter: FILTERS) => {
    setActiveFilter(newFilter)
  }

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case FILTERS.ALL: {
        return tasks
      }
      case FILTERS.TODO: {
        return tasks.filter((task) => task.status === TASK_STATUS.TODO)
      }
      case FILTERS.IN_PROGRESS: {
        return tasks.filter((task) => task.status === TASK_STATUS.IN_PROGRESS)
      }
      case FILTERS.DONE: {
        return tasks.filter((task) => task.status === TASK_STATUS.DONE)
      }
    }
  }
  let filteredTasks = getFilteredTasks() || []

  const fetchData = useCallback(async () => {
    toggleSkeleton(true)
    const response = await fetch(`/api/task?email=${session?.user?.email}`)
    const data = await response.json() as Task[]
    setTasks(data)
    toggleSkeleton(false)
  }, [session?.user?.email])

  useEffect(() => {
    if (!session?.user?.email) return
    fetchData()
  }, [fetchData, session?.user?.email])

  return (
    <div className="bg-primaryBlack">
      {isLoggedIn ? <Profile name={session?.user?.name} profileImageUrl={session?.user?.image} /> : <GradientButton onClick={() => signIn("google")}>
        Signin <LogIn className="ml-2" size={20} />
      </GradientButton>}

      <div className={cx("mx-auto flex flex-col min-h-screen", styles.appContainer)}>
        <div className={cx("bg-darkGrey flex flex-col rounded p-10", styles.formContainer)}>
          <Formik
            initialValues={{ title: '', description: '' }}
            validate={values => {
              const errors = {};
              if (!values.title) {
                // @ts-ignore
                errors.title = 'Required';
              } else if (!values.description) {
                // @ts-ignore
                errors.description = 'Required';
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              // if the user is not signedin then show error toast and return
              if (!isLoggedIn) {
                toast.error("You must be signed in to create tasks", {
                  position: toast.POSITION.TOP_RIGHT
                });
                resetForm()
                setSubmitting(false);
                return
              }

              // make network call to add a task
              const response = await fetch('/api/task', {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: values.title, description: values.description, status: TASK_STATUS.TODO, email: session?.user?.email })
              })

              const data = await response.json()

              // if backend sends error then show error toast
              if (data?.error) {
                toast.error(data?.error, {
                  position: toast.POSITION.TOP_RIGHT
                });
              } else {
                // update app state with data provided by api
                const tasksLists = data?.tasks as Task[]
                setTasks(tasksLists)
                toast.success("Task Created", {
                  position: toast.POSITION.TOP_RIGHT
                });
                resetForm()
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="w-full flex flex-col">
                <div className="relative">
                  <Field type="text" name="title" placeholder="Enter your task title here" className="p-2 w-full rounded mr-2 bg-primaryGrey text-white" />
                  <ErrorMessage name="title" component="div" className="text-red1 absolute right-0 top-full" />
                </div>
                <div className="relative w-full">
                  <Field type="text" component="textarea" name="description" rows={5} placeholder="Enter task description" className="w-full mt-8 rounded p-2 bg-primaryGrey text-white" />
                  <ErrorMessage name="description" component="div" className="text-red1 absolute right-0 top-full" />
                </div>
                <Button type="submit" disabled={isSubmitting} externalClass="flex items-center justify-center bg-button2 mt-8 py-2 text-white rounded">
                  {isSubmitting ? <><Spinner externalClass="mr-2" /> <span>Adding Task</span></> : <span>Add Task</span>}
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Buttons to filter tasks */}
        {isLoggedIn && <div className={cx("flex mt-5", styles.filters)}>
          <Button onClick={() => changeFilter(FILTERS.ALL)} externalClass={cx("px-2 rounded font-bold mr-2", { "bg-button2 text-white border-white border-2": activeFilter === FILTERS.ALL, "bg-white text-black": activeFilter !== FILTERS.ALL })}>{getFilterStatusText(FILTERS.ALL)}</Button>
          <Button onClick={() => changeFilter(FILTERS.TODO)} externalClass={cx("px-2 rounded font-bold mr-2", { "bg-button2 text-white border-white border-2": activeFilter === FILTERS.TODO, "bg-red1 text-white": activeFilter !== FILTERS.TODO })}>{getFilterStatusText(FILTERS.TODO)}</Button>
          <Button onClick={() => changeFilter(FILTERS.IN_PROGRESS)} externalClass={cx("px-2 rounded font-bold mr-2", { "bg-button2 text-white border-white border-2": activeFilter === FILTERS.IN_PROGRESS, "bg-yellow text-black": activeFilter !== FILTERS.IN_PROGRESS })}>{getFilterStatusText(FILTERS.IN_PROGRESS)}</Button>
          <Button onClick={() => changeFilter(FILTERS.DONE)} externalClass={cx("px-2 rounded font-bold mr-2", { "bg-button2 text-white border-white border-2": activeFilter === FILTERS.DONE, "bg-green text-white": activeFilter !== FILTERS.DONE })}>{getFilterStatusText(FILTERS.DONE)}</Button>
        </div>}

        <div className={cx("bg-darkGrey mt-5 p-10 rounded", styles.tasks)}>
          {/* If the user is not signedin */}
          {!isLoggedIn && <div className="flex items-center justify-center text-white">
            <Megaphone size={40} className="mr-3" />
            <span className="text-xl">Signin to access the app</span>
          </div>}

          {/* No tasks present */}
          {!showSkeleton && isLoggedIn && filteredTasks.length === 0 && <div className="flex items-center justify-center text-white">
            <Box size={40} className="mr-3" />
            <span className="text-xl">No Tasks Found</span>
          </div>}

          {/* Skeleton Loader */}
          {showSkeleton && isLoggedIn && <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column">
            {skeletonCardsData.map((item) => <SkeletonCard key={item?.id} externalStyles={item?.externalStyles} />)}
          </Masonry>}

          {!showSkeleton && isLoggedIn && filteredTasks.length !== 0 && <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column">
            {filteredTasks.map((item) => <Card key={item.id} taskData={item} fetchData={fetchData}/>)}
          </Masonry>}
        </div>
      </div>
    </div>
  )
}
