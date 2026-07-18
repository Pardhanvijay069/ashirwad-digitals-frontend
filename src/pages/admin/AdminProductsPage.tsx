import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus, Pencil, Trash2, Printer } from 'lucide-react';
import { useGetProductsQuery, useDeleteProductMutation } from '@/services/productsApi';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/formatCurrency';
import { PRODUCT_CATEGORIES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('All');
  const { data: products, isLoading, isError, refetch } = useGetProductsQuery({
    category: category === 'All' ? undefined : category,
  });
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId).unwrap();
      toast.success('Product deactivated successfully.');
      setDeleteId(null);
    } catch {
      toast.error('Failed to deactivate product.');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Products</h1>
        <Link to="/admin/products/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>Add Product</Button>
        </Link>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium transition-all',
              category === cat
                ? 'bg-primary-600 text-white dark:bg-primary-500'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <Card padding="none">
        {isError ? (
          <div className="p-6">
            <ErrorState onRetry={refetch} />
          </div>
        ) : isLoading ? (
          <div className="p-6">
            <SkeletonTable rows={6} />
          </div>
        ) : products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 text-left dark:border-surface-700">
                  <th className="px-6 py-3 font-medium text-surface-500">Product</th>
                  <th className="px-6 py-3 font-medium text-surface-500">SKU</th>
                  <th className="px-6 py-3 font-medium text-surface-500">Category</th>
                  <th className="px-6 py-3 font-medium text-surface-500">Price</th>
                  <th className="px-6 py-3 font-medium text-surface-500">Stock</th>
                  <th className="px-6 py-3 font-medium text-surface-500">Status</th>
                  <th className="px-6 py-3 font-medium text-surface-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-surface-100 dark:bg-surface-800">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0].image_url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Printer className="h-4 w-4 text-surface-400" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-surface-900 dark:text-surface-100">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-surface-600 dark:text-surface-400">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-400">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 font-medium text-surface-900 dark:text-surface-100">
                      {formatCurrency(product.base_price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'font-medium',
                          product.stock_quantity <= product.min_stock_warning
                            ? 'text-danger-600 dark:text-danger-400'
                            : 'text-surface-700 dark:text-surface-300'
                        )}
                      >
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.is_active ? 'success' : 'danger'} dot>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                          className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 hover:text-primary-600 dark:hover:bg-surface-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="rounded-lg p-2 text-surface-500 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              title="No products found"
              description="Add your first product to get started."
              actionLabel="Add Product"
              onAction={() => navigate('/admin/products/new')}
              icon={<Printer className="h-8 w-8" />}
            />
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Deactivate Product"
        message="This product will be deactivated and hidden from the store. This action can be reversed."
        confirmLabel="Deactivate"
        isLoading={deleting}
      />
    </div>
  );
}
