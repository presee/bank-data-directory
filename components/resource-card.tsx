"use client"

import { useState } from "react"
import { BarChart3, Database, FileText, Heart, Info, Lock, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ResourceAttribute {
  label: string
  value: string
}

interface ResourceCardProps {
  title: string
  type: "table" | "metric" | "tag" | "report" | "field"
  description: string
  department: string
  owner: string
  attributes: ResourceAttribute[]
  tags: string[]
  onViewDetail: () => void
}

export function ResourceCard({
  title,
  type,
  description,
  department,
  owner,
  attributes,
  tags,
  onViewDetail,
}: ResourceCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

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
      case "field":
        return <Info className="h-5 w-5 text-gray-600" />
      default:
        return <Database className="h-5 w-5 text-blue-600" />
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case "table":
        return "数据表"
      case "metric":
        return "指标"
      case "tag":
        return "标签"
      case "report":
        return "报表"
      case "field":
        return "字段"
      default:
        return "数据表"
    }
  }

  return (
    <Card className="hover:border-blue-300 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon()}
            <Badge variant="outline" className="text-xs font-normal">
              {getTypeLabel()}
            </Badge>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsFavorite(!isFavorite)
                  }}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                  <span className="sr-only">收藏</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFavorite ? "取消收藏" : "添加到收藏"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <h3 className="text-lg font-medium text-blue-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>

        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span className="font-medium mr-2">所属部门:</span>
          <span>{department}</span>
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-3">
          <span className="font-medium mr-2">责任人:</span>
          <span>{owner}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {attributes.map((attr, index) => (
            <div key={index} className="bg-gray-50 p-1.5 rounded text-xs">
              <div className="font-medium text-gray-700">{attr.label}</div>
              <div className="text-gray-600">{attr.value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="ghost" size="sm" onClick={onViewDetail}>
          查看详情
        </Button>
      </CardFooter>
    </Card>
  )
}
