import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCreateProductMutation } from '@/services/productsApi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { productFormSchema, type ProductFormData } from '@/utils/validators';
import { PRODUCT_CATEGORIES } from '@/utils/constants';
import { Link } from 'react-router';

const categoryOptions = PRODUCT_CATEGORIES.filter((c) => c !== 'All').map((c) => ({ value: c, label: c }));

export default function AddProductPage() {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      is_active: true,
      stock_quantity: 0,
      min_stock_warning: 5,
      base_price: 0,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const result = await createProduct({
        sku: data.sku,
        name: data.name,
        category: data.category,
        description: data.description,
        base_price: data.base_price,
        unit: data.unit,
        width: data.width ? Number(data.width) : undefined,
        height: data.height ? Number(data.height) : undefined,
        size_unit: data.size_unit,
        material: data.material,
        finish: data.finish,
        stock_quantity: data.stock_quantity,
        min_stock_warning: data.min_stock_warning,
        is_active: data.is_active,
      }).unwrap();

      toast.success('Product created! Now upload images.');
      navigate(`/admin/products/${result.product_id}/edit`);
    } catch (error: unknown) {
      const message = (error as { data?: { message?: string } })?.data?.message || 'Failed to create product.';
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/admin/products"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 dark:text-surface-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-6 text-2xl font-bold text-surface-900 dark:text-surface-100">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="SKU *" placeholder="ASH-XXX-001" error={errors.sku?.message} {...register('sku')} />
                <Input label="Product Name *" placeholder="Product name" error={errors.name?.message} {...register('name')} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Category *"
                  options={categoryOptions}
                  placeholder="Select category"
                  error={errors.category?.message}
                  {...register('category')}
                />
                <Input label="Unit" placeholder="e.g. piece, box of 100" error={errors.unit?.message} {...register('unit')} />
              </div>
              <Textarea label="Description" placeholder="Product description..." error={errors.description?.message} {...register('description')} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
              Pricing & Stock
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Base Price (₹) *" type="number" step="0.01" placeholder="0.00" error={errors.base_price?.message} {...register('base_price')} />
              <Input label="Stock Quantity" type="number" placeholder="0" error={errors.stock_quantity?.message} {...register('stock_quantity')} />
              <Input label="Min Stock Warning" type="number" placeholder="5" error={errors.min_stock_warning?.message} {...register('min_stock_warning')} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
              Specifications
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Width" type="number" step="0.01" placeholder="0.00" {...register('width')} />
              <Input label="Height" type="number" step="0.01" placeholder="0.00" {...register('height')} />
              <Input label="Size Unit" placeholder="e.g. inch, cm" {...register('size_unit')} />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input label="Material" placeholder="e.g. 350 GSM Art Card" {...register('material')} />
              <Input label="Finish" placeholder="e.g. Matte, Glossy" {...register('finish')} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                {...register('is_active')}
              />
              <label htmlFor="is_active" className="text-sm font-medium text-surface-700 dark:text-surface-300">
                Product is active and visible to customers
              </label>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Link to="/admin/products">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit" isLoading={isLoading}>
              Create Product
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
