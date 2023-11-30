import AdminLayout from "@/components/AdminLayout";
import { deleteProduct, getProduct } from "@/actions/actions";

const fetchProduct = async (id) => {
  let product = await getProduct(id);
  return product; 
};

export default async function EditProductPage({ params }) {

  const product = await fetchProduct(params.id);

  return (
    <AdminLayout>
      <h1 className="text-center">Deleting product</h1>
      <form action={deleteProduct}>
        <input name='_id' value={product._id} hidden/>
        <label className="flex justify-center my-2">
          Do you really want to delete &quot;{product.name}&quot;?<br/>
        </label>
        <div className="flex gap-2 justify-center">
          <button 
            name="action"
            value="cancel-delete"
            className="btn-default"
            type="submit"
          >
            Cancel
          </button>
          <button 
            name="action"
            value="confirm-delete"
            className="btn-red"
            type="submit"
          >
            Delete
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}