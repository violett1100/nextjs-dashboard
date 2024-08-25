import Form from '@/app/ui/customers/create-form'
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import { fetchCustomers } from '@/app/lib/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Creat Invoice',
}

export default async function Page() {
    const customers = await fetchCustomers()

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Customers', href: '/dashboard/customers' },
                    {
                        label: 'Create Customer',
                        href: '/dashboard/Customers/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    )
}
