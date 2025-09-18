import { useParams } from 'react-router-dom'

export default function ProductDetailPage() {
  const params = useParams()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Product Details</h1>
      <p>Product ID: {params.id}</p>
    </div>
  )
}
