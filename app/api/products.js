import { Product } from "@/models/Product";
import { mongooseConnect } from '@/lib/mongoose'

export default async function handler(req, res) {
  const { method } = req;

  await mongooseConnect();

  if (method === 'POST') {

    const { name, description, price } = req.body;

    const productDoc = await Product.create({ 
      name, description, price 
    });
    res.json(productDoc);
  }
}