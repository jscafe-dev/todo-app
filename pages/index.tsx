import { useState } from "react";
import cx from 'classnames';
import { toast } from 'react-toastify';
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { LogIn } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import GradientButton from "@/components/Button/gradientButton";
import Profile from "@/components/Profile";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";

import { TASK_STATUS, FILTERS } from "@/lib/constants";
import { getFilterStatusText } from '@/lib/utils';
import type { Task } from "@/lib/interface";

import styles from '@/styles/index.module.css';

export default function Home() {
  const { data: session, status } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeFilter, setActiveFilter] = useState(FILTERS.ALL)
  const isLoggedIn = status === 'authenticated'

  const changeFilter = (newFilter: FILTERS) => {
    setActiveFilter(newFilter)
  }

  return (
    <div className="bg-primaryBlack">
      {isLoggedIn ? <Profile name={session?.user?.name} profileImageUrl={session?.user?.image} /> : <GradientButton onClick={() => signIn("google")}>
        Sigin <LogIn className="ml-2" size={20} />
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
              if (!isLoggedIn) {
                toast.error("You must be signed in to create tasks", {
                  position: toast.POSITION.TOP_RIGHT
                });
                resetForm()
                setSubmitting(false);
                return
              }
              const response = await fetch('/api/task', {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: values.title, description: values.description, status: TASK_STATUS.TODO, email: session?.user?.email })
              })

              const data = await response.json()

              if (data?.error) {
                toast.error(data?.error, {
                  position: toast.POSITION.TOP_RIGHT
                });
              } else {
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
        {isLoggedIn && <div className={cx("flex mt-5", styles.filters)}>
          <Button onClick={() => changeFilter(FILTERS.ALL)} externalClass={cx("px-2 rounded font-bold mr-2", { "bg-button2 text-white": activeFilter === FILTERS.ALL, "bg-white text-black": activeFilter !== FILTERS.ALL })}>{getFilterStatusText(FILTERS.ALL)}</Button>
          <Button onClick={() => changeFilter(FILTERS.TODO)} externalClass={cx("px-2 rounded font-bold mr-2", { "bg-button2 text-white": activeFilter === FILTERS.TODO, "bg-red1 text-white": activeFilter !== FILTERS.TODO })}>{getFilterStatusText(FILTERS.TODO)}</Button>
          <Button onClick={() => changeFilter(FILTERS.IN_PROGRESS)} externalClass={cx("px-2 rounded font-bold mr-2", { "bg-button2 text-white": activeFilter === FILTERS.IN_PROGRESS, "bg-yellow text-black": activeFilter !== FILTERS.IN_PROGRESS })}>{getFilterStatusText(FILTERS.IN_PROGRESS)}</Button>
          <Button onClick={() => changeFilter(FILTERS.DONE)} externalClass={cx("px-2 rounded font-bold mr-2", { "bg-button2 text-white": activeFilter === FILTERS.DONE, "bg-green text-white": activeFilter !== FILTERS.DONE })}>{getFilterStatusText(FILTERS.DONE)}</Button>
        </div>}
      </div>
    </div>
  )
}
