"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ResourceCard } from "@/components/resource-card"
import { ResourceDetail } from "@/components/resource-detail"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [categoryData, setCategoryData] = useState<any>(null)
  const [resources, setResources] = useState<any[]>([])
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const { id } = params

  useEffect(() => {
    // 模拟从API获取分类数据
    const fetchCategoryData = async () => {
      setLoading(true)

      // 这里应该是从API获取数据，这里模拟一些数据
      setTimeout(() => {
        // 根据分类ID返回模拟数据
        const mockCategoryData = {
          id,
          name: id
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          description: `包含与${id
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}相关的所有数据资源`,
        }

        // 模拟该分类下的资源列表
        const mockResources = [
          {
            id: `${id}_resource_1`,
            title: `${mockCategoryData.name}资源1`,
            type: "table",
            description: "这是一个示例资源描述",
            department: "数据部",
            owner: "张三",
            attributes: [
              { label: "字段数", value: "42" },
              { label: "更新频率", value: "日更新" },
              { label: "数据量", value: "1200万" },
            ],
            tags: ["示例标签", "数据资源"],
          },
          {
            id: `${id}_resource_2`,
            title: `${mockCategoryData.name}资源2`,
            type: "metric",
            description: "这是另一个示例资源描述",
            department: "分析部",
            owner: "李四",
            attributes: [
              { label: "计算频率", value: "日更新" },
              { label: "数据来源", value: "3个表" },
              { label: "覆盖率", value: "98%" },
            ],
            tags: ["指标", "分析"],
          },
          {
            id: `${id}_resource_3`,
            title: `${mockCategoryData.name}资源3`,
            type: "report",
            description: "这是第三个示例资源描述",
            department: "报表部",
            owner: "王五",
            attributes: [
              { label: "指标数", value: "18" },
              { label: "更新频率", value: "月更新" },
              { label: "数据来源", value: "5个表" },
            ],
            tags: ["报表", "月度"],
          },
        ]

        setCategoryData(mockCategoryData)
        setResources(mockResources)
        setLoading(false)
      }, 500)
    }

    fetchCategoryData()
  }, [id])

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
            <div className="h-4 w-96 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <Layers className="h-5 w-5 text-gray-600" />
              {categoryData?.name}
            </h1>
            <p className="text-gray-500">{categoryData?.description}</p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              title={resource.title}
              type={resource.type}
              description={resource.description}
              department={resource.department}
              owner={resource.owner}
              attributes={resource.attributes}
              tags={resource.tags}
              onViewDetail={() => setSelectedResource(resource.id)}
              onRequestPermission={() => console.log("Request permission for", resource.id)}
            />
          ))}
        </div>
      )}

      {selectedResource && (
        <Dialog
          open={!!selectedResource}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedResource(null)
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>资源详情</DialogTitle>
            </DialogHeader>
            <ResourceDetail
              resourceId={selectedResource}
              onViewLineage={() => console.log("View lineage")}
              onRequestPermission={() => console.log("Request permission")}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}