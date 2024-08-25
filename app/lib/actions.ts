'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

const FormSchemaInvoice = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
})

const FormSchemaCustomer = z.object({
    id: z.string(),
    name: z.string().min(1, {
        message: 'Please enter customer name.',
    }),
    email: z.string().email({
        message: 'Please enter customer email.',
    }),
    picture: z.string().trim().min(1, {
        message: 'Please enter customer picture URL.',
    }),
})

const CreateInvoice = FormSchemaInvoice.omit({ id: true, date: true })
const UpdateInvoice = FormSchemaInvoice.omit({ id: true, date: true })
const CreateCustomer = FormSchemaCustomer.omit({ id: true })
const UpdateCustomer = FormSchemaCustomer.omit({ id: true })

export type StateInvoice = {
    errors?: {
        customerId?: string[]
        amount?: string[]
        status?: string[]
    }
    message?: string | null
}
export type StateCustomer = {
    errors?: {
        name?: string[]
        email?: string[]
        picture?: string[]
    }
    message?: string | null
}

export async function createInvoice(prevState: StateInvoice, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        }
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data
    const amountInCents = amount * 100
    const date = new Date().toISOString().split('T')[0]

    // Insert data into the database
    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Invoice.',
        }
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices')
    revalidatePath('/dashboard/customers')
    revalidatePath('/dashboard')
    redirect('/dashboard/invoices')
}

export async function updateInvoice(id: string, prevState: StateInvoice, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        }
    }

    const { customerId, amount, status } = validatedFields.data
    const amountInCents = amount * 100

    try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' }
    }

    revalidatePath('/dashboard/invoices')
    revalidatePath('/dashboard/customers')
    redirect('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {
    // throw new Error('Failed to Delete Invoice')
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`
        revalidatePath('/dashboard/invoices')
        revalidatePath('/dashboard/customers')
        revalidatePath('/dashboard')
        return { message: 'Deleted Invoice.' }
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' }
    }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}

export async function createCustomer(prevState: StateCustomer, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        picture: formData.get('picture'),
    })

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Customer.',
        }
    }

    // Prepare data for insertion into the database
    const { name, email, picture } = validatedFields.data

    // Insert data into the database
    try {
        await sql`
        INSERT INTO customers (name, email, image_url)
        VALUES (${name}, ${email}, ${picture})
      `
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Customer.',
        }
    }

    // Revalidate the cache for the customers page and redirect the user.
    revalidatePath('/dashboard/customers')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/invoices/create')
    redirect('/dashboard/customers')
}

export async function updateCustomer(id: string, prevState: StateCustomer, formData: FormData) {
    const validatedFields = UpdateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        picture: formData.get('picture'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        }
    }

    const { name, email, picture } = validatedFields.data

    try {
        await sql`
        UPDATE customers
        SET name = ${name}, email = ${email}, image_url = ${picture}
        WHERE id = ${id}
      `
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' }
    }

    revalidatePath('/dashboard/customers')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/invoices/create')
    redirect('/dashboard/customers')
}

export async function deleteCustomer(id: string) {
    // throw new Error('Failed to Delete Invoice')
    try {
        await sql`DELETE FROM customers WHERE id = ${id}`
        revalidatePath('/dashboard/customers')
        revalidatePath('/dashboard')
        revalidatePath('/dashboard/invoices/create')
        return { message: 'Deleted Customer.' }
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Customer.' }
    }
}
