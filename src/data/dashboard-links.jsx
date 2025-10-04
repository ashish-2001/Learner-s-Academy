const sidebarLinks = [
    {
        id: 1,
        name: "Dashboard",
        path: "/dashboard",
        icon: "VscDashboard"
    },
    {
        id: 2,
        name: "My Profile",
        path: "/dashboard/my-profile",
        icon: "VscAccount"
    },
    {
        id: 3,
        name: "Enrolled Courses",
        path: "/dashboard/enrolled-courses",
        icon: "VscMortarBoard",
        type: "Student"
    },
    {
        id: 4,
        name: "My Courses",
        path: "/dashboard/my-courses",
        icon: "VscBook",
        type: "Instructor"
    },
    {
        id: 5,
        name: "Admin panel",
        path: "/dashboard/admin",
        icon: "VscServer",
        type: "Admin"
    }
]

export {
    sidebarLinks
}