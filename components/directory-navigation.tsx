"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  Database,
  BarChart3,
  Tag,
  FileText,
  Info,
  Building,
  Layers,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DirectoryItem {
  id: string
  name: string
  type?: string
  children?: DirectoryItem[]
  expanded?: boolean
  count?: number
  isNew?: boolean
  isUpdated?: boolean
}

interface DirectoryNavigationProps {
  activeCategory: string
  onItemSelect?: (id: string, type: string, name: string) => void
}

export function DirectoryNavigation({ activeCategory, onItemSelect }: DirectoryNavigationProps) {
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    business: true,
    organization: true,
    type: true,
    customer: true,
    transaction: false,
    risk: false,
    retail: true,
    credit: false,
    tables: true,
    metrics: false,
    tags: false,
  })

  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredItems, setFilteredItems] = useState<DirectoryItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [expandAll, setExpandAll] = useState(false)

  const businessItems: DirectoryItem[] = [
    {
      id: "customer",
      name: "客户",
      count: 42,
      children: [
        { id: "customer_basic", name: "基本信息", type: "table", count: 12 },
        { id: "customer_contact", name: "联系方式", type: "table", count: 8 },
        { id: "customer_preference", name: "偏好设置", type: "table", count: 6, isNew: true },
        { id: "customer_value", name: "价值评估", type: "metric", count: 16 },
      ],
    },
    {
      id: "transaction",
      name: "交易",
      count: 36,
      children: [
        { id: "transaction_detail", name: "交易明细", type: "table", count: 18 },
        { id: "transaction_summary", name: "交易汇总", type: "table", count: 10 },
        { id: "transaction_trend", name: "交易趋势", type: "report", count: 8, isUpdated: true },
      ],
    },
    {
      id: "risk",
      name: "风险",
      count: 28,
      children: [
        { id: "risk_score", name: "风险评分", type: "metric", count: 14 },
        { id: "risk_alert", name: "风险预警", type: "tag", count: 8 },
        { id: "risk_report", name: "风险报告", type: "report", count: 6 },
      ],
    },
    {
      id: "product",
      name: "产品",
      count: 24,
      children: [
        { id: "product_info", name: "产品信息", type: "table", count: 16 },
        { id: "product_performance", name: "产品绩效", type: "metric", count: 8 },
      ],
    },
  ]

  const organizationItems: DirectoryItem[] = [
    {
      id: "retail",
      name: "零售部",
      count: 38,
      children: [
        { id: "retail_customer", name: "客户信息", type: "table", count: 14 },
        { id: "retail_transaction", name: "交易数据", type: "table", count: 16 },
        { id: "retail_performance", name: "业绩指标", type: "metric", count: 8 },
      ],
    },
    {
      id: "credit",
      name: "信贷部",
      count: 32,
      children: [
        { id: "credit_application", name: "贷款申请", type: "table", count: 12 },
        { id: "credit_approval", name: "审批流程", type: "table", count: 10 },
        { id: "credit_risk", name: "风险评估", type: "metric", count: 10, isNew: true },
      ],
    },
    {
      id: "finance",
      name: "财务部",
      count: 24,
      children: [
        { id: "finance_ledger", name: "总账数据", type: "table", count: 14 },
        { id: "finance_report", name: "财务报表", type: "report", count: 10 },
      ],
    },
    {
      id: "marketing",
      name: "营销部",
      count: 22,
      children: [
        { id: "marketing_campaign", name: "营销活动", type: "table", count: 12 },
        { id: "marketing_effect", name: "效果分析", type: "report", count: 10, isUpdated: true },
      ],
    },
  ]

  const typeItems: DirectoryItem[] = [
    {
      id: "tables",
      name: "数据表",
      count: 86,
      children: [
        { id: "tables_customer", name: "客户相关表", type: "folder", count: 32 },
        { id: "tables_transaction", name: "交易相关表", type: "folder", count: 28 },
        { id: "tables_product", name: "产品相关表", type: "folder", count: 26 },
      ],
    },
    {
      id: "metrics",
      name: "指标",
      count: 42,
      children: [
        { id: "metrics_business", name: "业务指标", type: "folder", count: 18 },
        { id: "metrics_risk", name: "风险指标", type: "folder", count: 14 },
        { id: "metrics_performance", name: "绩效指标", type: "folder", count: 10 },
      ],
    },
    {
      id: "tags",
      name: "标签",
      count: 36,
      children: [
        { id: "tags_customer", name: "客户标签", type: "folder", count: 16 },
        { id: "tags_behavior", name: "行为标签", type: "folder", count: 12 },
        { id: "tags_risk", name: "风险标签", type: "folder", count: 8 },
      ],
    },
    {
      id: "reports",
      name: "报表",
      count: 28,
      children: [
        { id: "reports_daily", name: "日报表", type: "folder", count: 16 },
        { id: "reports_monthly", name: "月报表", type: "folder", count: 12 },
      ],
    },
  ]

  const getActiveItems = () => {
    switch (activeCategory) {
      case "business":
        return businessItems
      case "organization":
        return organizationItems
      case "type":
        return typeItems
      default:
        return businessItems
    }
  }

  // 搜索功能
  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const query = searchQuery.toLowerCase()

    // 递归搜索函数
    const searchInItems = (items: DirectoryItem[]): DirectoryItem[] => {
      const results: DirectoryItem[] = []

      items.forEach((item) => {
        // 检查当前项是否匹配
        if (item.name.toLowerCase().includes(query)) {
          results.push({ ...item, children: undefined }) // 添加匹配项，但不包含子项
        }

        // 检查子项
        if (item.children && item.children.length > 0) {
          const matchingChildren = searchInItems(item.children)
          if (matchingChildren.length > 0) {
            results.push(...matchingChildren)
          }
        }
      })

      return results
    }

    // 在所有类别中搜索
    const allItems = [...businessItems, ...organizationItems, ...typeItems]
    const results = searchInItems(allItems)

    setFilteredItems(results)
  }, [searchQuery])

  // 展开/折叠所有项
  useEffect(() => {
    if (expandAll) {
      const allItems: Record<string, boolean> = {}

      // 递归设置所有项为展开状态
      const expandAllItems = (items: DirectoryItem[]) => {
        items.forEach((item) => {
          allItems[item.id] = true
          if (item.children) {
            expandAllItems(item.children)
          }
        })
      }

      expandAllItems([...businessItems, ...organizationItems, ...typeItems])
      setExpandedItems(allItems)
    }
  }, [expandAll])

  const handleItemClick = (item: DirectoryItem) => {
    setSelectedItem(item.id)

    // 如果是叶子节点（没有子项的节点），则触发导航
    if (!item.children || item.children.length === 0) {
      // 如果提供了外部处理函数，则调用它
      if (onItemSelect) {
        onItemSelect(item.id, item.type || "", item.name)
      } else {
        // 默认导航行为 - 根据不同类型的资源导航到不同的路径
        switch (item.type) {
          case "table":
            router.push(`/resource/table/${item.id}`)
            break
          case "metric":
            router.push(`/resource/metric/${item.id}`)
            break
          case "tag":
            router.push(`/resource/tag/${item.id}`)
            break
          case "report":
            router.push(`/resource/report/${item.id}`)
            break
          default:
            // 对于文件夹类型或未指定类型，可以导航到一个列表页面
            router.push(`/category/${item.id}`)
        }
      }
    } else {
      // 如果是有子项的节点，则切换展开/折叠状态
      toggleExpand(item.id, null)
    }
  }

  const toggleExpand = (id: string, e: React.MouseEvent | null) => {
    if (e) e.stopPropagation()
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "table":
        return <Database className="h-4 w-4 text-blue-600" />
      case "metric":
        return <BarChart3 className="h-4 w-4 text-green-600" />
      case "tag":
        return <Tag className="h-4 w-4 text-purple-600" />
      case "report":
        return <FileText className="h-4 w-4 text-orange-600" />
      case "field":
        return <Info className="h-4 w-4 text-gray-600" />
      case "folder":
        return <Layers className="h-4 w-4 text-gray-600" />
      default:
        return activeCategory === "organization" ? (
          <Building className="h-4 w-4 text-gray-600" />
        ) : (
          <Layers className="h-4 w-4 text-gray-600" />
        )
    }
  }

  const renderItem = (item: DirectoryItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems[item.id]
    const isSelected = selectedItem === item.id

    return (
      <div key={item.id} className="relative">
        <div
          className={cn(
            "flex items-center px-4 py-1.5 cursor-pointer transition-all duration-200",
            level > 0 ? "pl-" + (level * 4 + 4) : "",
            isSelected ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200 text-gray-700",
            "group",
          )}
          onClick={() => handleItemClick(item)}
        >
          {hasChildren ? (
            <button
              className="h-4 w-4 mr-1.5 flex items-center justify-center rounded-sm hover:bg-gray-300 transition-colors shrink-0"
              onClick={(e) => toggleExpand(item.id, e)}
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-4 mr-1.5" />
          )}
          {getTypeIcon(item.type)}
          <span className="ml-1.5 text-sm flex-1">{item.name}</span>

          {/* 显示数量 */}
          {item.count !== undefined && (
            <Badge variant="outline" className="ml-2 bg-gray-100 text-xs">
              {item.count}
            </Badge>
          )}

          {/* 新增标记 */}
          {item.isNew && <Badge className="ml-2 bg-green-100 text-green-700 border-green-200 text-xs">新</Badge>}

          {/* 更新标记 */}
          {item.isUpdated && <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200 text-xs">更新</Badge>}

          {/* 悬停时显示的操作按钮 */}
          <div className="absolute right-2 hidden group-hover:flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-70 hover:opacity-100">
                    <Info className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>查看详情</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* 子项，带动画效果 */}
        {hasChildren && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            {item.children!.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="py-2 flex flex-col h-full">
      {/* 搜索框 */}
      <div className="px-4 mb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            className="pl-9 py-1 h-8 text-sm"
            placeholder="搜索数据资源..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery("")}
            >
              <ChevronRight className="h-4 w-4 rotate-45" />
            </Button>
          )}
        </div>
      </div>

      {/* 展开/折叠所有按钮 */}
      <div className="px-4 mb-2 flex justify-between">
        <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={() => setExpandAll(!expandAll)}>
          {expandAll ? "折叠所有" : "展开所有"}
        </Button>

        {isSearching && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            找到 {filteredItems.length} 项
          </Badge>
        )}
      </div>

      {/* 目录内容 */}
      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          // 搜索结果
          filteredItems.length > 0 ? (
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center px-4 py-1.5 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  {getTypeIcon(item.type)}
                  <span className="ml-1.5 text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">未找到匹配的数据资源</div>
          )
        ) : (
          // 正常目录
          getActiveItems().map((item) => renderItem(item))
        )}
      </div>
    </div>
  )
}
