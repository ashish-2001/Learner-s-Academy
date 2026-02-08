import { z } from "zod";
import { Course } from "../models/Course.js"
import { Category } from "../models/Category.js";
import mongoose from "mongoose";

const categoryValidator = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional()
});


async function createCategory(req, res){

    try{
            const parsedResult = categoryValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "All the fields are required",
                errors: parsedResult.error.errors
            });
        }

        const { name, description } = parsedResult.data;

        const existingCategory = await Category.findOne({
            name: name.trim()
        });

        if(existingCategory){
            return res.status(409).json({
                success: false,
                message: "Category with this name already exists"
            })
        }

        const CategoryDetails = await Category.create({
            name: name.trim(), 
            description: description
        });

        console.log(CategoryDetails);

        return res.status(200).json({
            success: true,
            message: "Category created successfully",
            data: CategoryDetails
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating category",
            error: e.message
        })
    }
}

async function showAllCategories(req, res){
    try{
        console.log("Inside show all categories")
        const allCategories = await Category.find({}, {
            name: true,
            description: true
        });

        if(!allCategories || allCategories.length === 0){
            return res.status(404).json({
                success: false,
                message: "No categories found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "All Categories fetched successfully",
            data: allCategories
        });
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching categories",
            error:e.message
        })
    }
}

async function categoryPageDetails(req, res){
    try{

        const { categoryId } = req.body;

        if(!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)){
            return res.status(400).json({
                success: false,
                message: "Invalid or missing categoryId"
            })
        }

        const selectedCategory = await Category.findById(categoryId).populate({
            path: "courses",
            match: {
                status: "Published"
            },
            populate: ([{
                path: "instructor",
                select: "firstName lastName image"
            },
            {
                path:"ratingAndReviews",
                select: "rating review user"
            }])
        }).exec()

        if(!selectedCategory){
            console.log("Category not found");
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        if(!selectedCategory.courses || selectedCategory.courses.length === 0){
            console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category"
            });
        }

        const selectedCourses = selectedCategory.courses;

        if(!selectedCourses){
            return res.status(404).json({
                success: false,
                message: "Category not found!"
            });
        };

        const categoriesExceptSelected = await Category.find({
            _id: {
                $ne: categoryId
            }
        }).populate({
            path: "courses",
            match: {
                status: "Published",
            },
            populate: ([{
                path: "instructor",
                select: "firstName lastName image"
            }, 
            {
                path: "ratingAndReviews",
                select: "rating review user"
            }])
        });

        let differentCourses = [];

        for(const category of categoriesExceptSelected){
            if(category.courses?.length){
                differentCourses.push(...category.courses);
            }
        }
        
        const allCategories = await Category.find().populate({
            path: "courses",
            match: { 
                status: "Published" 
            }, 
            populate: ([{
                path: "instructor",
                select: "firstName lastName image"
            },
        {
            path: "ratingAndReviews",
            select: "rating review user"
        }])
    });

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 10);

        return res.status(200).json({
            success: true,
            data: {
                selectedCourses: selectedCategory.courses,
                differentCourses,
                mostSellingCourses
            }
        })
    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Internal sever error",
            error: e.message
        })
    }
}

async function addCourseToCategory(req, res){
    const { courseId, categoryId } = req.body;
        console.log("Course added to this category");
    try{
        const category = await Category.findById(categoryId);
        if(!category){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        if(category.courses.includes(courseId)){
            return res.status(200).json({
                success: true,
                message: "Course already exists in the category"
            });
        }

        category.courses.push(courseId);
        await category.save();
        return res.status(200).json({
            success: true,
            message: "Course added to the category successfully"
        });
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

export {
    createCategory,
    showAllCategories,
    categoryPageDetails,
    addCourseToCategory
}