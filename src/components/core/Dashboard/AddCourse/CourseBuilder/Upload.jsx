import React from "react"
import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { useSelector } from "react-redux"

import "video-react/dist/video-react.css"
import { Player } from "video-react"

 function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
  const inputRef = useRef(null)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  })

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  useEffect(() => {
    register(name, { required: true });
  }, [register])

  useEffect(() => {
    setValue(name, selectedFile);
  }, [selectedFile, setValue])

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-[#F1F2FF]" htmlFor={name}>
        {label} {!viewData && <sup className="text-[#EF476F]">*</sup>}
      </label>
      <div
        className={`${
          isDragActive ? "bg-[#424854]" : "bg-[#2C333F]"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-[#585D69]`}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null)
                }}
                className="mt-3 text-[#6E727F] underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <label htmlFor="video" className="">
          <div
            className="flex w-full flex-col items-center p-6"
            {...getRootProps()}
          >
            <input {...getInputProps()} ref={inputRef} id="video" />
              
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-[#CCCCCC]">
              <FiUploadCloud className="text-2xl text-[#FFD60A]" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-[#999DAA]">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-[#FFD60A]">Browse</span> a
              file
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-[#999DAA]">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
          </label>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-[#EF476F]">
          {label} is required
        </span>
      )}
    </div>
  )
}

export {
  Upload
}