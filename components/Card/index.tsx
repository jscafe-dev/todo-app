import { useState } from 'react'
import cx from 'classnames';
import { XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

import type { Task } from "@/lib/interface";
import { TASK_STATUS } from "@/lib/constants";
import { getStatusText } from '@/lib/utils';

import Button from "@/components/Button"
import Spinner from "@/components/Spinner";

interface CardProps {
    taskData: Task;
    fetchData: () => void;
}

const Card = (props: CardProps) => {
    const { taskData: { title, description, status, id }, fetchData } = props

    const [addDisableLayer, toggleDisableLayer] = useState(false)

    const [updatedTitle, setUpdatedTitle] = useState(title)
    const [updatedDescription, setUpdatedDescription] = useState(description)

    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [isEditingDescription, setIsEditingDescription] = useState(false)

    const [isSpinnerLoading, toggleSpinner] = useState(false)

    const updateTask = (newStatus = status) => {
        return fetch('/api/task', {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "PATCH",
            body: JSON.stringify({ title: updatedTitle, description: updatedDescription, status: newStatus, id })
        })
    }

    const handleInputBlur = async () => {
        toggleDisableLayer(true)
        await updateTask()
        toggleDisableLayer(false)
        fetchData()
        setIsEditingTitle(false)
    }

    const handleDescriptionBlur = async () => {
        toggleDisableLayer(true)
        await updateTask()
        toggleDisableLayer(false)
        fetchData()
        setIsEditingDescription(true)
    }

    const changeTaskStatus = async () => {
        toggleSpinner(true)
        let newStatus = TASK_STATUS.TODO;
        if (status === TASK_STATUS.TODO) {
            newStatus = TASK_STATUS.IN_PROGRESS
        } else if (status === TASK_STATUS.IN_PROGRESS) {
            newStatus = TASK_STATUS.DONE
        }
        const resp = await updateTask(newStatus)
        const data = await resp.json()
        if (data?.err) {
            toast.error(data?.error, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        fetchData()
        toggleSpinner(false)
    }

    const handleRemoveTask = async () => {
        toggleDisableLayer(true)
        const resp = await fetch('/api/task', {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "DELETE",
            body: JSON.stringify({ id })
        })
        const data = await resp.json()
        toggleDisableLayer(false)
        if (data?.error) {
            toast.error(data?.error, {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            fetchData()
        }
    }
    return <div className="bg-primaryGrey p-2 w-full rounded-md text-sm relative">
        {addDisableLayer && <div className='bg-pulseGrey opacity-70 z-10 h-full w-full absolute rounded-md top-0 left-0'></div>}
        <XCircle className='absolute -right-2 -top-2 text-white cursor-pointer z-20' onClick={handleRemoveTask} />
        {isEditingTitle ? <input className='w-full text-base rounded p-2 bg-primaryGrey text-white mb-2' value={updatedTitle} autoFocus onChange={(e) => setUpdatedTitle(e?.target?.value)} onBlur={handleInputBlur} /> : <div className='mb-2 p-2 text-white text-base font-semibold truncate' onDoubleClick={() => setIsEditingTitle(true)}>{updatedTitle}</div>}
        <hr className='border-white mb-2' />
        {isEditingDescription ? <textarea rows={10} className='w-full rounded p-2 bg-primaryGrey text-white' value={updatedDescription} autoFocus onChange={(e) => setUpdatedDescription(e?.target?.value)} onBlur={handleDescriptionBlur} /> : <div className='text-white p-2 break-words' onDoubleClick={() => setIsEditingDescription(true)}>{updatedDescription}</div>}
        <hr className='border-white my-2' />
        <div>
            <span className='text-white mr-1'>Status:</span> <span className={cx("font-bold", { "text-red1": status === TASK_STATUS.TODO }, { "text-yellow": status === TASK_STATUS.IN_PROGRESS }, { "text-green": status === TASK_STATUS.DONE })}>{getStatusText(status)}</span>
        </div>
        {status !== TASK_STATUS.DONE && <Button externalClass="w-full flex items-center justify-center bg-button2 mt-3 py-2 text-white rounded" onClick={changeTaskStatus}>
            {status === TASK_STATUS.TODO && <>{isSpinnerLoading && <Spinner externalClass="mr-2" />}<span className='text-white'>Mark in-progress!</span></>}
            {status === TASK_STATUS.IN_PROGRESS && <>{isSpinnerLoading && <Spinner externalClass="mr-2" />}<span className='text-white'>Mark done!</span></>}
        </Button>}
    </div>
}

export default Card;