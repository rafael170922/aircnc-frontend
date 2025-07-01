export function Dashboard(){
    const user_id = localStorage.getItem('user')
    return (
        <>
            <h1>Dashboard</h1>
            <p>{user_id}</p>
        </>
    )
}