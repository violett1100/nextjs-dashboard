'use client'

import { CustomerForm } from '@/app/lib/definitions'
import { CameraIcon, UserCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Button } from '@/app/ui/button'
import { updateCustomer, StateCustomer } from '@/app/lib/actions'
// import { useActionState } from 'react'
import { useFormState } from 'react-dom'

export default function EditCustomerForm({ customer }: { customer: CustomerForm }) {
    const initialState: StateCustomer = { message: null, errors: {} }
    const updateCustomerWithId = updateCustomer.bind(null, customer.id)
    const [state, formAction] = useFormState(updateCustomerWithId, initialState)
    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Customer Name */}
                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        Customer name{customer.picture}
                    </label>
                    <div className="relative">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            defaultValue={customer.name}
                            placeholder="Enter customer name"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="name-error"
                        />
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                {/* Customer Email */}
                <div className="mb-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                        Customer email
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={customer.email}
                                placeholder="Enter customer email"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="email-error"
                            />
                            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* Customer Picture */}
                <div className="mb-4">
                    <label htmlFor="picture" className="mb-2 block text-sm font-medium">
                        Customer picture
                    </label>
                    <div className="relative">
                        <input
                            id="picture"
                            name="picture"
                            type="text"
                            defaultValue={customer.picture}
                            placeholder="Enter customer picture URL"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="picture-error"
                        />
                        <CameraIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="picture-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.picture &&
                            state.errors.picture.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <p className="mt-2 text-sm text-red-500">{state.message}</p>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/customers"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Edit Customer</Button>
            </div>
        </form>
    )
}
