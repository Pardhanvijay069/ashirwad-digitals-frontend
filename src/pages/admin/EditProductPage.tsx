import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Star, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
} from '@/services/productsApi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { productFormSchema, type ProductFormData } from '@/utils/validators';
import { PRODUCT_CATEGORIES, FILE_UPLOAD } from '@/utils/constants';

const categoryOptions = PRODUCT_CATEGORIES.filter((c) => c !== 'All').map((c) => ({ value: c, label: c }));

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '0', 10);

  const { data, isLoading: fetching, isError, refetch } = useGetProductByIdQuery(productId);
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [uploadImages, { isLoading: uploading }] = useUploadProductImagesMutation();
  const [deleteImage] = useDeleteProductImageMutation();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);

  const product = data?.product;
  const images = data?.images || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    values: product ? {
      sku: product.sku,
      name: product.name,
      category: product.category,
      description: product.description || '',
      base_price: product.base_price,
      unit: product.unit || '',
      width: product.width ?? '',
      height: product.height ?? '',
      size_unit: product.size_unit || '',
      material: product.material || '',
      finish: product.finish || '',
      stock_quantity: product.stock_quantity,
      min_stock_warning: product.min_stock_warning,
      is_active: product.is_active,
    } : undefined,
  });

  const onSubmit = async (formData: ProductFormData) => {
    try {
      await updateProduct({
        id: productId,
        sku: formData.sku,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        base_price: formData.base_price,
        unit: formData.unit,
        width: formData.width ? Number(formData.width) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        size_unit: formData.size_unit,
        material: formData.material,
        finish: formData.finish,
        stock_quantity: formData.stock_quantity,
        min_stock_warning: formData.min_stock_warning,
        is_active: formData.is_active,
      }).unwrap();
      toast.success('Product updated successfully.');
    } catch {
      toast.error('Failed to update product.');
    }
  };

  const handleUploadImages = async () => {
    if (imageFiles.length === 0) return;
    const formData = new FormData();
    imageFiles.forEach((f) => formData.append('images', f));

    try {
      await uploadImages({ productId, formData }).unwrap();
      toast.success('Images uploaded successfully.');
      setImageFiles([]);
    } catch {
      toast.error('Failed to upload images.');
    }
  };

  const handleDeleteImage = async () => {
    if (!deleteImageId) return;
    try {
      await deleteImage({ imageId: deleteImageId, productId }).unwrap();
      toast.success('Image deleted.');
      setDeleteImageId(null);
    } catch {
      toast.error('Failed to delete image.');
    }
  };

  if (fetching) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !product) {
    return <ErrorState message="Product not found." onRetry={refetch} />;
  }

  const canUploadMore = images.length < FILE_UPLOAD.PRODUCT_IMAGE_MAX;

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
          Edit Product
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">Basic Information</h2>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="SKU *" error={errors.sku?.message} {...register('sku')} />
                <Input label="Product Name *" error={errors.name?.message} {...register('name')} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select label="Category *" options={categoryOptions} error={errors.category?.message} {...register('category')} />
                <Input label="Unit" {...register('unit')} />
              </div>
              <Textarea label="Description" error={errors.description?.message} {...register('description')} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">Pricing & Stock</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Base Price (₹) *" type="number" step="0.01" error={errors.base_price?.message} {...register('base_price')} />
              <Input label="Stock Quantity" type="number" error={errors.stock_quantity?.message} {...register('stock_quantity')} />
              <Input label="Min Stock Warning" type="number" error={errors.min_stock_warning?.message} {...register('min_stock_warning')} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">Specifications</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Width" type="number" step="0.01" {...register('width')} />
              <Input label="Height" type="number" step="0.01" {...register('height')} />
              <Input label="Size Unit" {...register('size_unit')} />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input label="Material" {...register('material')} />
              <Input label="Finish" {...register('finish')} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="is_active" className="h-4 w-4 rounded border-surface-300 text-primary-600" {...register('is_active')} />
              <label htmlFor="is_active" className="text-sm font-medium text-surface-700 dark:text-surface-300">
                Product is active
              </label>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="submit" isLoading={updating}>Save Changes</Button>
          </div>
        </form>

        {/* Images Section */}
        <Card className="mt-6">
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
            Product Images ({images.length}/{FILE_UPLOAD.PRODUCT_IMAGE_MAX})
          </h2>

          {/* Current Images */}
          {images.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((img) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700">
                  <img src={img.image_url} alt={img.alt_text || ''} className="h-full w-full object-cover" />
                  {img.is_primary && (
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-surface-900">
                      <Star className="h-3 w-3" /> Primary
                    </span>
                  )}
                  <button
                    onClick={() => setDeleteImageId(img.id)}
                    className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload New */}
          {canUploadMore && (
            <div className="space-y-3">
              <FileUpload
                accept={FILE_UPLOAD.PRODUCT_IMAGE_ACCEPT}
                maxFiles={FILE_UPLOAD.PRODUCT_IMAGE_MAX - images.length}
                multiple
                onChange={setImageFiles}
                value={imageFiles}
                hint={`Up to ${FILE_UPLOAD.PRODUCT_IMAGE_MAX - images.length} more image(s)`}
              />
              {imageFiles.length > 0 && (
                <Button
                  onClick={handleUploadImages}
                  isLoading={uploading}
                  leftIcon={<Upload className="h-4 w-4" />}
                >
                  Upload {imageFiles.length} Image{imageFiles.length > 1 ? 's' : ''}
                </Button>
              )}
            </div>
          )}
        </Card>
      </motion.div>

      <ConfirmDialog
        isOpen={deleteImageId !== null}
        onClose={() => setDeleteImageId(null)}
        onConfirm={handleDeleteImage}
        title="Delete Image"
        message="Are you sure you want to delete this image?"
        confirmLabel="Delete"
      />
    </div>
  );
}
