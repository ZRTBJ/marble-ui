import React, { useState } from 'react'
import css from '../styles/DropZone.module.css'
import axios from 'axios'
import styled from 'styled-components'
import { NoImage, Trash } from 'icons'
import { ChakraProvider } from '@chakra-ui/react'
import { RoundedIcon } from './RoundedIcon'

const PUBLIC_PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || ''
const PUBLIC_PINATA_SECRET_API_KEY =
  process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY || ''
const DropZone = ({ data, dispatch, item }) => {
  const [ipfsHash, setIpfsHash] = useState('')
  // onDragEnter sets inDropZone to true
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true })
  }

  // onDragLeave sets inDropZone to false
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false })
  }

  // onDragOver sets inDropZone to true
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // set dropEffect to copy i.e copy of the source item
    e.dataTransfer.dropEffect = 'copy'
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true })
  }

  // onDrop sets inDropZone to false and adds files to fileList
  const handleDrop = (e) => {
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
      // files = files.filter((f) => !existingFiles.includes(f.name))

      // dispatch action to add droped file or files to fileList
      dispatch({ type: 'ADD_FILE_TO_LIST', files })
      // reset inDropZone to false
      dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false })
      uploadFiles(files)
    }
  }

  // handle file selection via input element
  const handleFileSelect = (e) => {
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
      uploadFiles(files)
    }
  }

  // to handle file uploads
  const uploadFiles = async (files) => {
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
      setIpfsHash(response.data.IpfsHash)
      dispatch({ type: 'SET_LOGO', logo: response.data.IpfsHash })
    }
  }

  return (
    <ChakraProvider>
      <div
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
      >
        {ipfsHash ? (
          <DropzoneContainer>
            <Flex>
              <RoundedIcon
                src={process.env.NEXT_PUBLIC_PINATA_URL + ipfsHash}
                size="80px"
              />
              <IconButton
                onClick={() => {
                  setIpfsHash('')
                }}
              >
                <Trash />
              </IconButton>
            </Flex>
          </DropzoneContainer>
        ) : (
          <DropzoneContainer className={ipfsHash != '' ? 'opacity02' : ''}>
            <NoImage />
            <input
              id="fileSelect"
              type="file"
              // multiple
              className={css.files}
              onChange={(e) => handleFileSelect(e)}
            />
            <label htmlFor="fileSelect" className={css.uploadMessage}>
              {'Drag and drop or click to upload'}
            </label>
          </DropzoneContainer>
        )}
      </div>
    </ChakraProvider>
  )
}
const DropzoneContainer = styled.div`
  background: #272734;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09);
  backdrop-filter: blur(40px);
  /* Note: backdrop-filter has minimal browser support */
  padding: 30px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const IconButton = styled.div`
  cursor: pointer;
`
export default DropZone
