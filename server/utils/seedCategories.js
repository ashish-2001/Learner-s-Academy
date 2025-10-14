import { Category } from "../models/Category"

const categories = [
    {
        name: "Programming",
        description: "All coding courses"
    },
    {
        name: "Design",
        description: "UI/UX and graphic design"
    },
    {
        name: "Marketing",
        description: "Marketing and sales"
    },
    {
        name: "Business",
        description: "Business and management"
    },
    {
        name: "Photography",
        description: "Photography"
    }
]


async function seedCategories(){
    try{
        const count = await Category.countDocuments();
        if(count === 0){
            await Category.insertMany(categories);
            console.log("Seeded initial categories");
        }
    }catch(e){
        console.log("Category seeding failed", e.message)
    }
}

export {
    seedCategories
}