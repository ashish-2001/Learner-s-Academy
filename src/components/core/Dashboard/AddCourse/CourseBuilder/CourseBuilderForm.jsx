import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice";
import { NestedView } from "./NestedView";
import { toast } from "react-hot-toast";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";

const CourseBuilderForm = () => {
  const { token } = useSelector((state) => state.auth);
  const [editSectionName, setEditSectionName] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { course } = useSelector((state) => state.course);

  const goNext = () => {
    if (course.courseContent.length > 0) {
      if (
        course.courseContent.some((section) => section.subSection.length > 0)
      ) {
        dispatch(setStep(3));
      } else {
        toast.error("Please add at least one lesson to esch section");
      }
    } else {
      toast.error("Please add at least one section to continue");
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let result=null;
    setLoading(true);
    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
          sectionId: editSectionName,
        },
        token
      );
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      );
    }
    if (result) {
      dispatch(setCourse(result));
      setValue("sectionName", "");
      setEditSectionName(false);
    }
    setLoading(false);
  };


  const handelChangeEditSectionName = (sectionId,sectionName) => {
    if (editSectionName===sectionId) {
      setEditSectionName(false);
      setValue("sectionName", "");
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-[#2C333F] bg-[#161D29] p-6">
      <p className="text-2xl font-semibold text-[#F1F2FF]">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="text-sm text-[#F1F2FF]" htmlFor="sectionName">
          Section Name<sup className="text-[#EF476F]">*</sup>
        </label>
        <input
          id="sectionName"
          placeholder="Add a section to build your course"
          name="sectionName"
          className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full"
          {...register("sectionName", { required: true })}
        />
        {errors.sectionName && (
          <p className="ml-2 text-xs tracking-wide text-[#EF476F]">This field is required</p>
        )}
        <div className="flex items-end gap-x-4">
          <button
            type="submit"
            className="flex items-center border border-[#FFD60A] bg-[#ffffff00] cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-[#000814] undefined"
          >
            <span className="text-[#FFD60A]">
              {editSectionName ? "Edit Section Name" : "Create Section"}
            </span>
            <AiOutlinePlusCircle size={20} className="text-[#FFD60A]" />
          </button>
          {editSectionName && (
            <button
              onClick={() => {
                setEditSectionName(false);
                setValue("sectionName", "");
              }}
              type="button"
              className="text-sm text-[#838894] underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      {course.courseContent.length > 0 && <NestedView handelChangeEditSectionName={handelChangeEditSectionName} />}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={() => {
            dispatch(setEditCourse(true));
            dispatch(setStep(1));
          }}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-[#838894] py-[8px] px-[20px] font-semibold text-[#000814]"
        >
          Back
        </button>
        <button
          onClick={goNext}
          className="flex items-center bg-[#FFD60A] cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-[#000814] undefined"
        >
          <span className="false">Next</span>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export {
  CourseBuilderForm
}