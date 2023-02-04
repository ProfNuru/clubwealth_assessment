import React from 'react'
import useRequestResource from '../../../hooks/useRequestResource'
import DataGallery from '../../ui/DataGallery'

const GalleryView = ({api}) => {
  const {
    data, 
    subCategories, 
    subCategory,
    loading
  } = useRequestResource({dataset:api})
  console.log(data,subCategories,subCategory,loading)

  return (
    <div>{api?.map((d,i)=><DataGallery
      data={data[d]}
      dataCategories={subCategories[d]}
      selectedCategory={subCategory[d]}
      key={i}
      />)}</div>
  )
}

export default GalleryView