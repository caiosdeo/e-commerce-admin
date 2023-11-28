import AdminLayout from "@/components/AdminLayout";
import { getProduct } from "@/actions/actions";
import ProductForm from "@/components/ProductForm";

const fetchProduct = async (id) => {
  let product = await getProduct(id);
  return product; 
};

export default async function EditProductPage({ params }) {

  const product = await fetchProduct(params.id);

  return (
    <AdminLayout>
      <h1>Editing product</h1>
      <ProductForm 
        _id={params.id}
        name={product.name} 
        description={product.description}
        price={product.price}
        images={product.images}
      />
    </AdminLayout>
  );
}