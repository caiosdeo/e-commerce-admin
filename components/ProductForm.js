"use client";

import { createProduct, editProduct, removeImages, saveImages } from '@/actions/actions'
import { useState } from 'react';
import Spinner from '@/components/Spinner'

export default function ProductForm({
    _id = '',
    name: currentName = '', 
    description: currentDescription = '', 
    price: currentPrice = '',
    images: currentImages = [],
  }) {

  const [name, setName] = useState(currentName);
  const [description, setDescription] = useState(currentDescription);
  const [price, setPrice] = useState(currentPrice);
  const [images, setImages] = useState(currentImages);

  const [isUploading, setIsUpLoading] = useState(false)

  async function uploadImages(e){
    setIsUpLoading(true);
    const files = Array.from(e.target?.files);

    if (files.length > 0) {
      const data = new FormData();
      files.forEach(file => data.append('file', file));
      const newImages = await saveImages(data);

      setImages((oldImages = []) => {
        return [...oldImages, ...newImages]
      });
    }

    setIsUpLoading(false);
  }

  async function removeImage (e) {
    const data = new FormData();
    data.append('src', e.target.src);
    data.append('key', e.target.name);
    await removeImages(data);

    if (images.length === 1) {
      setImages([]);
    } else {
      setImages(images.filter (img => img.key !== e.target.name));
    }
  }



  return (
    <form action={_id ? editProduct : createProduct}>
      <input name='_id' value={_id} hidden readOnly={true}/>
      <input name='images' value={JSON.stringify(images)} hidden readOnly={true}/>
      <label>Product name</label>
      <input 
        type="text"
        placeholder="Product name"
        value={name}
        onChange={e => setName(e.target.value)}
        name="name"
      />
      <label>
        Images
      </label>
      <div className="mb-2 flex flex-wrap gap-2">
        {!!images?.length && images.map(image => (
          // 2:45:36
          <div key={image.key} onClick={removeImage} className="cursor-pointer h-24">
            <img 
              name={image.key}
              className="rounded-lg"
              src={image.src}
              alt="product"
            />
          </div> 
        ))}
        {isUploading && (
          <div className="h-24 p-1 flex items-center">
            <Spinner />
          </div>
        )}
        <label className='w-24 h-24 cursor-pointer gap-1 bg-gray-200 rounded-lg text-gray-500 text-sm text-center flex items-center justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
          </svg>
          Upload
          <input 
            type='file' 
            multiple={true}
            className='hidden'
            onChange={uploadImages}
          />
        </label>
      </div>
      <label>Description</label>
      <textarea 
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        name="description"
      />
      <label>Price (in USD)</label>
      <input 
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
        name="price"
      />
      <button 
        className="btn-primary"
        type="submit"
      >
        Save
      </button>
    </form>
  );

};