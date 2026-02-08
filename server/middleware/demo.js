const isDemo = async (req, res, next) => {
    console.log(req.user.email);
    if(req.user.email === "ashishpaljnpup@gmail.com" || req.user.email === "1234@gmail.com"){
        return res.status(401).json({
            success: false,
            message: "this is a demo user"
        });
    };
    next();
};

export {
    isDemo
};