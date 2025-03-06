'use client'
import Navbar from '@/components/navbar';
import { ReactNode } from 'react'

interface ChildrenProps {
    children: ReactNode;
}
export default function MainLayout({
    children,
}: ChildrenProps) {

    return <>
        <Navbar />
        {children}
    </>;
}
