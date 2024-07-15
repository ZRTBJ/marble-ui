import React, { useEffect, useState } from 'react'
import css from '../styles/DropZone.module.css'
import axios from 'axios'
import styled from 'styled-components'
import { NoImage } from 'icons'
import { ChakraProvider, Image } from '@chakra-ui/react'

const PUBLIC_PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || ''
const PUBLIC_PINATA_SECRET_API_KEY =
  process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY || ''
const PUBLIC_PINATA_URL = process.env.NEXT_PUBLIC_PINATA_URL || ''
const BannerImageUpload = ({ hash, setHash, isActive = false }) => {
  const [ipfsHashBIU, setIpfsHashBIU] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  useEffect(() => {
    setIpfsHashBIU(hash)
  }, [hash])
  // onDragEnter sets inDropZone to true
  const handleDragEnterBIU = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // onDragLeave sets inDropZone to false
  const handleDragLeaveBIU = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // onDragOver sets inDropZone to true
  const handleDragOverBIU = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // set dropEffect to copy i.e copy of the source item
    e.dataTransfer.dropEffect = 'copy'
  }

  // onDrop sets inDropZone to false and adds files to fileList
  const handleDropBIU = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // get files from event on the dataTransfer object as an array
    let files = [...e.dataTransfer.files]

    // ensure a file or files are dropped
    if (files && files.length > 0) {
      uploadFilesBIU(files)
    }
  }

  // handle file selection via input element
  const handleFileSelectBIU = (e) => {
    // get files from event on the input element as an array
    let files = [...e.target.files]

    // ensure a file or files are selected
    if (files && files.length > 0) {
      uploadFilesBIU(files)
    }
  }

  // to handle file uploads
  const uploadFilesBIU = async (files) => {
    const formData = new FormData()
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
      setHash({ avatar: response.data.IpfsHash })
    }
  }
  console.log('ipfsHashBIU: ', ipfsHashBIU)
  return (
    <ChakraProvider>
      <Container>
        <div
          onDrop={(e) => handleDropBIU(e)}
          onDragOver={(e) => handleDragOverBIU(e)}
          onDragEnter={(e) => handleDragEnterBIU(e)}
          onDragLeave={(e) => handleDragLeaveBIU(e)}
          onMouseEnter={(e) => {
            isActive && setShowUpload(true)
          }}
          onMouseLeave={(e) => setShowUpload(false)}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        >
          {showUpload && (
            <DropzoneContainer>
              <input
                id="fileSelectBIU"
                type="file"
                // multiple
                className={css.files}
                onChange={(e) => handleFileSelectBIU(e)}
              />
              <label htmlFor="fileSelectBIU">
                <NoImage />
              </label>
            </DropzoneContainer>
          )}
        </div>
        <ImageContainer>
          {/* {ipfsHashBIU != '' && ( */}
          <StyledImage
            showUpload={showUpload}
            src={
              ipfsHashBIU
                ? `${PUBLIC_PINATA_URL}${ipfsHashBIU}`
                : '/default.png'
            }
          />
          {/* )} */}
        </ImageContainer>
      </Container>
    </ChakraProvider>
  )
}
const Container = styled.div`
  width: 100%;
  height: 100%;
`
const DropzoneContainer = styled.div`
  width: 100%;
  height: 100%;
  label {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
const StyledImage = styled.img<{ showUpload: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: -1;
  border-radius: 50%;
  opacity: ${({ showUpload }) => (showUpload ? '0.7' : '1')};
  backdrop-filter: blur(40px);
`
const ImageContainer = styled.div``
export default BannerImageUpload
