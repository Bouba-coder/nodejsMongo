import React from 'react'
import {useQueryClient} from 'react-query'
import TchatBox from '../../../../assets/tchatbox_logo.svg'

import {pendingUserName, isIncoming} from '../utils'
import {cancelPendingRequestApi} from '../../../../api/friend'
import {PENDING_REQUESTS_KEY, OUT_GOING_REQUESTS_KEY} from '../../../../constants/queryKeys'
import {useModal} from '../../../../context/modal-context/modal-context'

export default function PendingProfileModal({user, pending}) {
    const cache = useQueryClient()
    const [isLoading, setIsLoading] = React.useState(false)
    const modal = useModal()
    async function cancelPending() {
        setIsLoading(true)

        try {
            await cancelPendingRequestApi(pending.id)
            if (isIncoming(user, pending)) {
                cache.invalidateQueries(PENDING_REQUESTS_KEY)
            } else {
                cache.invalidateQueries(OUT_GOING_REQUESTS_KEY)
            }

            setIsLoading(false)
            modal.hideModal()
        } catch (err) {
            setIsLoading(false)
        }
    }

    return (
        <div
            className='flex flex-col lg:w-11/12 xl:w-8/12 md:w-10/12 sm:w-11/12 w-full bg-tchatbox-bgBlackModal'>
            <div
                className={`w-full bg-tchatbox-${
                isIncoming(user, pending)
                    ? pending
                        ?.from
                            ?.color
                            : pending
                                ?.to
                                    ?.color} h-20 relative rounded-t-lg`}>
                <div className='flex items-center absolute bottom-0 left-0 -mb-16 ml-4'>
                    <div className='flex flex-col'>
                        <div className='relative flex justify-center'>
                            <a
                                href='#'
                                className={`relative flex items-center mx-auto w-20 h-20 bg-tchatbox-${
                                isIncoming(user, pending)
                                    ? pending
                                        ?.from
                                            ?.color
                                            : pending
                                                ?.to
                                                    ?.color} text-white rounded-full inline-block p-2 border-6 border-tchatbox-900`}>
                                <TchatBox className={`w-12 h-12 text-center mx-auto`}/>
                            </a>
                            <span
                                className='bg-tchatbox-green w-6 h-6 rounded-full absolute right-0 bottom-0 border-6 border-tchatbox-900 mr-0 mb-2'></span>
                        </div>
                        <div className='flex items-center'>
                            <p className='text-white text-medium font-bold'>
                                {pendingUserName(user, pending)}
                            </p>
                            <p className='text-tchatbox-mainText text-medium'>
                                # {
                                    isIncoming(user, pending)
                                        ? pending.from.shortId
                                        : pending.to.shortId
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className='flex items-center absolute bottom-0 right-0 -mb-16 mr-4'>
                    {
                        isIncoming(user, pending) && (
                            <button
                                disabled={isLoading}
                                className='p-2 px-3 mx-1 text-xs bg-tchatbox-lightGreen hover:bg-tchatbox-greenHover text-white rounded-md focus:outline-none'>
                                Accept
                            </button>
                        )
                    }
                    <button
                        onClick={cancelPending}
                        disabled={isLoading}
                        className='p-2 px-3 mx-1 text-xs bg-tchatbox-grayDeep hover:bg-tchatbox-deepGrayHover text-white rounded-md focus:outline-none'>
                        {
                            isIncoming(user, pending)
                                ? 'Ignore'
                                : 'Cancel request'
                        }
                    </button>
                </div>
            </div>
            <div className='w-full flex'>
                <Tabs/>
            </div>
        </div>
    )
}

function Tabs() {
    const tabs = ['User Info', 'Mutual Servers', 'Mutual Friends']

    return (
        <div className='w-full flex flex-col mt-16'>
            <ul
                className='flex w-full justify-start items-start mt-2 py-4 border-b-1 border-tchatbox-600'>
                {
                    tabs.map((tab, i) => (
                        <li
                            key={i}
                            className='cursor-pointer px-4 text-tchatbox-mainText text-xs hover:text-tchatbox-100'>
                            {tab}
                        </li>
                    ))
                }
            </ul>

            <div className='w-full flex flex-col mt-4 px-4'>
                <h6 className='text-sm text-tchatbox-mainText font-bold'>NOTE</h6>
                <textarea
                    className='w-full mt-4 mb-4 bg-tchatbox-bgBlackModal text-sm text-tchatbox-mainText placeholder-tchatbox-mainText focus:outline-none focus:bg-tchatbox-900'
                    placeholder='Click to add a note'
                    rows='2'
                    maxLength='256'></textarea>
            </div>
        </div>
    )
}