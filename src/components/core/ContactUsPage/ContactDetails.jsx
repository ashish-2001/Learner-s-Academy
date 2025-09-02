const ContactDetails = () =>{

    return(
        <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6">
            {constactDetails.map((ele, i)=>{
                let Icon = Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon]
                return(
                    <div className="flex flex-col gap-[20px] p-3 text-sm text-richblack" key={i} >
                        <div className="flex flex-row items-center gap-3">
                            <Icon size={25}/>
                            <h1 className="text-lg font-semibold text-richblack-5">
                                {ele?.heading}
                            </h1>
                        </div>
                        <p className="font-medium">{ele?.description}</p>
                        <p className="font-semibold">{ele?.details}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default ContactDetails