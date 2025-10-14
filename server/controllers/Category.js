import { z } from "zod";
import { Category } from "../models/Category.js";

const categoryValidator = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional()
})

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

async function createCategory(req, res){

    try{
            const parsedResult = categoryValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsedResult.error.errors
            });
        }

        const { name, description } = parsedResult.data;

        const existingCategory = await Category.findOne({ name });

        if(existingCategory){
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }

        const categoryDetails = await Category.create({
            name, 
            description
        });

        return res.status(200).json({
            success: true,
            message: "Category created successfully",
            data: categoryDetails
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

async function showAllCategories(req, res){
    try{
        const allCategories = await Category.find().populate({
            path: "courses",
            match: {
                status: "Published"
            }
        }).lean().exec();

        res.status(200).json({
            success: true,
            data: allCategories
        });
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error:e.message
        })
    }
}

const categoryPageValidator = z.object({
    categoryId: z.string().min(1, "CategoryId is required")
})

async function categoryPageDetails(req, res){
    try{
        const parsedResult = categoryPageValidator.safeParse(req.params);

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsedResult.error.errors
            })
        }

        const { categoryId } = parsedResult.data;

        const selectedCategory = await Category.findById(categoryId).populate({
            path: "courses",
            match: {
                status: "Published"
            },
            populate: "ratingAndReview"
        }).exec()

        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        if(selectedCategory.courses.length === 0){
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category"
            })
        }

        const categoriesExceptSelected = await Category.find({
            _id: {
                $ne: categoryId
            }
        })

        let differentCategory = null;

        if(categoriesExceptSelected.length > 0){
            const randomCategoryId = categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
            
            differentCategory = await Category.findById(randomCategoryId).populate({
                path: "courses",
                match: {
                    status: "Published"
                }
            }).exec();
        }

        const allCategories = await Category.find().populate({
            path: "courses",
            match: {
                status: "Published"
            }
        }).lean().exec()

        const allCourses = allCategories.flatMap((category) => category.courses || [])
        const mostSellingCourses = allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10)

        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses
            }
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Internal sever error",
            error: e.message
        })
    }
}

export {
    createCategory,
    showAllCategories,
    categoryPageDetails
}