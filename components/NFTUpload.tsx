import React, { useState } from 'react'
import css from '../styles/DropZone.module.css'
import axios from 'axios'
import styled from 'styled-components'
import { NFTUploadImage } from 'icons'
import { ChakraProvider, Image } from '@chakra-ui/react'

const PUBLIC_PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || ''
const PUBLIC_PINATA_SECRET_API_KEY =
  process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY || ''
const PUBLIC_PINATA_URL = process.env.NEXT_PUBLIC_PINATA_URL || ''
const NFTUpload = ({ data, dispatch, item }) => {
  const [ipfsHashBIU, setIpfsHashBIU] = useState('')
  // onDragEnter sets inDropZone to true
  const handleDragEnterBIU = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true })
  }

  // onDragLeave sets inDropZone to false
  const handleDragLeaveBIU = (e) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false })
  }

  // onDragOver sets inDropZone to true
  const handleDragOverBIU = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // set dropEffect to copy i.e copy of the source item
    e.dataTransfer.dropEffect = 'copy'
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true })
  }

  // onDrop sets inDropZone to false and adds files to fileList
  const handleDropBIU = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // get files from event on the dataTransfer object as an array
    let files = [...e.dataTransfer.files]

    // ensure a file or files are dropped
    if (files && files.length > 0) {
      // loop over existing files
      const existingFiles = data.fileList.map((f) => f.name)
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates
      files = files.filter((f) => !existingFiles.includes(f.name))

      // dispatch action to add droped file or files to fileList
      dispatch({ type: 'ADD_FILE_TO_LIST', files })
      // reset inDropZone to false
      dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false })
      uploadFilesBIU(files)
    }
  }

  // handle file selection via input element
  const handleFileSelectBIU = (e) => {
    // get files from event on the input element as an array
    let files = [...e.target.files]

    // ensure a file or files are selected
    if (files && files.length > 0) {
      // loop over existing files
      const existingFiles = data.fileList.map((f) => f.name)
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates
      files = files.filter((f) => !existingFiles.includes(f.name))

      // dispatch action to add selected file or files to fileList
      dispatch({ type: 'ADD_FILE_TO_LIST', files })
      uploadFilesBIU(files)
    }
  }

  // to handle file uploads
  const uploadFilesBIU = async (files) => {
    // get the files from the fileList as an array
    // let files = data.fileList
    // initialize formData object
    const formData = new FormData()
    // loop over files and add to formData
    files.forEach((file) => formData.append('file', file))
    let url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
    let response = await axios.post(url, formData, {
      maxBodyLength: Infinity, //this is needed to prevent axios from erroring out with large files
      headers: {
        'Content-Type': `multipart/form-data`,
        pinata_api_key: PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: PUBLIC_PINATA_SECRET_API_KEY,
      },
    })
    if (response.status == 200) {
      setIpfsHashBIU(response.data.IpfsHash)
      dispatch({ type: 'SET_NFT', nft: response.data.IpfsHash })
    }
  }

  return (
    <ChakraProvider>
      <div
        onDrop={(e) => handleDropBIU(e)}
        onDragOver={(e) => handleDragOverBIU(e)}
        onDragEnter={(e) => handleDragEnterBIU(e)}
        onDragLeave={(e) => handleDragLeaveBIU(e)}
      >
        <DropzoneContainer className={ipfsHashBIU != '' ? 'opacity02' : ''}>
          <input
            id="fileSelectBIU"
            type="file"
            // multiple
            className={css.files}
            onChange={(e) => handleFileSelectBIU(e)}
          />
          <label htmlFor="fileSelectBIU">
            <ImageWrapper>
              <NFTUploadImage />
            </ImageWrapper>
            Drag and drop, or click to upload a JPG, PNG, GIF,
            <br />
            SVG, GLTF, GLB, MOV, or MP4 file.
          </label>
        </DropzoneContainer>
      </div>
    </ChakraProvider>
  )
}
const DropzoneContainer = styled.div`
  background: #272734;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09);
  backdrop-filter: blur(40px);
  /* Note: backdrop-filter has minimal browser support */
  padding: 30px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  label {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`
const ImageWrapper = styled.div`
  padding: 80px;
`
export default NFTUpload
