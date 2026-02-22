import React, { useState } from 'react';
import { createCategory } from '../../../services/operations/courseDetailsAPI';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const AdminPanel = () => {
    const { token } = useSelector((state) => state.auth);
    const [category, setCategory] = useState({
        name: '',
        description: ''
    });

    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category.name || !category.description) {
            toast.error("All the fields are required");
            return;
        };
        setLoading(true);
        try{
            const response = await createCategory({
                name: category.name,
                description: category.description
            }, token);

            if(response?.success){
                toast.success("Category created successfully");
                setCategory({
                    name: "",
                    description: ""
                });
                return;
            } else {
                toast.error(response?.message || "Failed to create category");
            }
        } catch(error){
            toast.error("Something went wrong", error.message);
        }  finally {
            setLoading(false);
        };
    };

    return (
        // create categories
        <div className=' text-[#CCCCCC] text-xl p-5'>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="categoryName">Category Name</label>
                    <input 
                        value={category.name} 
                        type="text" 
                        id="categoryName"
                        name='categoryName'
                        className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none" 
                        placeholder='Enter Category Name'
                        onChange={(e) => setCategory({ ...category, name: e.target.value })
                    }/>
                </div>

                <div className='flex flex-col gap-2 mt-10'>
                    <label htmlFor="categoryDescription">Category Description</label>
                    <textarea 
                        value={category.description} 
                        onChange={
                            (e) => setCategory({ ...category, description: e.target.value })
                        }
                        id="categoryDescription" 
                        name='categoryDescription'
                        className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none" 
                        placeholder='Enter category description' 
                    />
                </div>
                <button 
                    type="submit"
                    disabled={loading}
                    className={`mt-10 rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 hover:shadow-none  disabled:bg-[#585D69] sm:text-[16px] ${
                        loading ? "opacity-70 cursor-not-allowed" : ""}`}>
                            { loading ? "Creating..." : "Create" }
                </button>
            </form>
        </div>
    );
};

export {
    AdminPanel
};