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
    taskData: Task
}

const Card = (props: CardProps) => {
    const { taskData: { title, description, status, id } } = props

    const [showCard, toggleCard] = useState(true)

    const [updatedTitle, setUpdatedTitle] = useState(title)
    const [updatedDescription, setUpdatedDescription] = useState(description)
    const [updatedStatus, setUpdatedStatus] = useState(status)

    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [isEditingDescription, setIsEditingDescription] = useState(false)

    const [isSpinnerLoading, toggleSpinner] = useState(false)

    const updateTask = (newStatus = status) => {
    
    }

    const handleInputBlur = () => {
        updateTask()
        setIsEditingTitle(false)
    }

    const handleDescriptionBlur = () => {
        updateTask()
        setIsEditingDescription(true)
    }

    const changeTaskStatus = () => {
        
    }

    const removeTask = () => {
        
    }
    if (!showCard) return undefined
    return <div className="bg-primaryGrey p-2 w-full rounded-md text-sm relative">
        <XCircle className='absolute -right-2 -top-2 text-white cursor-pointer' onClick={removeTask} />
        {isEditingTitle ? <input className='w-full text-base rounded p-2 bg-primaryGrey text-white mb-2' value={updatedTitle} autoFocus onChange={(e) => setUpdatedTitle(e?.target?.value)} onBlur={handleInputBlur} /> : <div className='mb-2 p-2 text-white text-base font-semibold truncate' onDoubleClick={() => setIsEditingTitle(true)}>{updatedTitle}</div>}
        <hr className='border-white mb-2' />
        {isEditingDescription ? <textarea rows={10} className='w-full rounded p-2 bg-primaryGrey text-white' value={updatedDescription} autoFocus onChange={(e) => setUpdatedDescription(e?.target?.value)} onBlur={handleDescriptionBlur} /> : <div className='text-white p-2 break-words' onDoubleClick={() => setIsEditingDescription(true)}>{updatedDescription}</div>}
        <hr className='border-white my-2' />
        <div>
            <span className='text-white mr-1'>Status:</span> <span className={cx("font-bold", { "text-red1": updatedStatus === TASK_STATUS.TODO }, { "text-yellow": updatedStatus === TASK_STATUS.IN_PROGRESS }, { "text-green": updatedStatus === TASK_STATUS.DONE })}>{getStatusText(updatedStatus)}</span>
        </div>
        {updatedStatus !== TASK_STATUS.DONE && <Button externalClass="w-full flex items-center justify-center bg-button2 mt-3 py-2 text-white rounded" onClick={changeTaskStatus}>
            {updatedStatus === TASK_STATUS.TODO && <>{isSpinnerLoading && <Spinner externalClass="mr-2" />}<span className='text-white'>Mark in-progress!</span></>}
            {updatedStatus === TASK_STATUS.IN_PROGRESS && <>{isSpinnerLoading && <Spinner externalClass="mr-2" />}<span className='text-white'>Mark done!</span></>}
        </Button>}
    </div>
}

export default Card;