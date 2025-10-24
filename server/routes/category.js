import express from "express";
import { Category } from "../models/Category";

const router = express.Router();

router.get("/showAllCategories", async (req, res) => {
    try{
        const categories = await Category.find({});
        res.json({
            success: true,
            data: categories
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Could not fetch categories"
        })
    }
});

