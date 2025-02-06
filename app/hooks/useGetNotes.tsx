"use client";

export default async function useGetNotes() {

    try {
        const token = localStorage.getItem('tars_token');
        const userId = localStorage.getItem('tars_userId') || '';
        const res = await fetch(`${process.env.BASE_URL}/api/dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'userId': userId,
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        return data.notes;
    } catch (error) {
        console.log(error);
    }
    return null;
}