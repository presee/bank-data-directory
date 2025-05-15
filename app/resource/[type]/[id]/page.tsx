"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Database, BarChart3, Tag, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResourceDetail } from "@/components/resource-detail"

interface ResourcePageProps {
  params: {
    type: string
    id: string
  }
}

export default function ResourcePage({ params }: ResourcePageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [resourceData, setResourceData] = useState<any>(null)
  const { type, id } = params

  useEffect(() => {
    // 模拟从API获取资源数据
    const fetchResourceData = async () => {
      setLoading(true)

      // 这里应该是从API获取数据，这里模拟一些数据
      setTimeout(() => {
        // 根据不同类型返回不同的模拟数据
        const mockData = {
          id,
          type,
          name: `${id
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}`,
          // 其他数据字段...
        }

        setResourceData(mockData)
        setLoading(false)
      }, 500)
    }

    fetchResourceData()
  }, [id, type])

  const getTypeIcon = () => {
    switch (type) {
      case "table":
        return <Database className="h-5 w-5 text-blue-600" />
      case "metric":
        return <BarChart3 className="h-5 w-5 text-green-600" />
      case "tag":
        return <Tag className="h-5 w-5 text-purple-600" />
      case "report":
        return <FileText className="h-5 w-5 text-orange-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeName = () => {
    switch (type) {
      case "table":
        return "数据表"
      case "metric":
        return "指标"
      case "tag":
        return "标签"
      case "report":
        return "报表"
      default:
        return "资源"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="outline" className="gap-2 mb-4" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
          返回
        </Button>

        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              {getTypeIcon()}
              {resourceData?.name}
            </h1>
            <p className="text-gray-500">
              {getTypeName()} ID: {id}
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-60 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <ResourceDetail
          resourceId={id}
          onViewLineage={() => console.log("View lineage")}
          onRequestPermission={() => console.log("Request permission")}
        />
      )}
    </div>
  )
}
