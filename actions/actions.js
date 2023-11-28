'use server';
import { Product } from "@/models/Product";
import { mongooseConnect } from '@/lib/mongoose'
import { redirect } from "next/navigation";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import mime from 'mime-types'

export async function createProduct(formData) {

  let formDataImages = formData.get("images").length > 0 ? formData.get("images").split(',') : [];

  await mongooseConnect();

  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const images = formDataImages;

  await Product.create({ 
    name, description, price, images
  });

  redirect("/products");
};

export async function editProduct(formData) {

  await mongooseConnect();

  const product = await Product.findById(formData.get("_id"));

  let images = formData.get("images").length > 0 ? formData.get("images").split(',') : [];

  product.name = formData.get("name");
  product.description = formData.get("description");
  product.price = formData.get("price");
  product.images = images;
  
  await product.save();

  redirect("/products");
};

export async function deleteProduct(formData) {
  await mongooseConnect();
  if (formData.get("action") === "confirm-delete"){
    await Product.deleteOne({_id: formData.get("_id")});
  }
  redirect("/products");
};

export async function saveImages(formData) {
  await mongooseConnect();

  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
  });

  const files = formData.getAll('file');
  const images = [];

  for (const file of files){
    const ext = file.name.split('.').pop();
    const newFilename = Date.now() + require('crypto').createHash('md5').update(file.name).digest('hex') + '.' + ext

    const imageBinary = await getImageBinary(file);

    await client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: newFilename,
      Body: imageBinary,
      ACL: 'public-read',
      ContentType: mime.lookup(file.name)
    }));

    const link = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${newFilename}`;
    images.push({
      key: newFilename,
      src: link
    });
  };
  return images;
};

async function getImageBinary(image){

  const imageReader = image.stream().getReader();
  const imageDataU8 = [];

  while (true){
    const {done,value} = await imageReader.read();
    if (done) {
      break;
    }
    imageDataU8.push(...value);
  }

  return Buffer.from(imageDataU8,'binary');
}

export async function removeImages(formData) {
  await mongooseConnect();

  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
  });

  await client.send(new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: formData.get('key'),
  }));
};

export async function getProducts() {
  await mongooseConnect();
  const products = await Product.find().lean();
  return products
};

export async function getProduct(id) {
  await mongooseConnect();
  const product = await Product.findById(id).lean();
  return product
}