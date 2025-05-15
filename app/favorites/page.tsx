"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  Database,
  FileText,
  FolderPlus,
  Grid,
  Heart,
  Info,
  List,
  MoreHorizontal,
  Search,
  Tag,
  Trash2,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ResourceDetail } from "@/components/resource-detail"
import { DataLineage } from "@/components/data-lineage"

interface FavoriteCollection {
  id: string
  name: string
  description?: string
  count: number
}

interface FavoriteResource {
  id: string
  title: string
  type: "table" | "metric" | "tag" | "report" | "field"
  description: string
  department: string
  owner: string
  attributes: { label: string; value: string }[]
  tags: string[]
  dateAdded: string
  collectionId?: string
}

export default function FavoritesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const [showLineage, setShowLineage] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState("date_desc")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [activeCollection, setActiveCollection] = useState<string | null>(null)
  const [showNewCollectionDialog, setShowNewCollectionDialog] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionDescription, setNewCollectionDescription] = useState("")
  const [showMoveToCollectionDialog, setShowMoveToCollectionDialog] = useState(false)
  const [targetCollectionId, setTargetCollectionId] = useState<string | null>(null)

  // 模拟收藏夹集合数据
  const [collections, setCollections] = useState<FavoriteCollection[]>([
    {
      id: "all",
      name: "全部收藏",
      count: 8,
    },
    {
      id: "important",
      name: "重要资源",
      description: "高优先级和常用的数据资源",
      count: 3,
    },
    {
      id: "customer",
      name: "客户分析",
      description: "与客户分析相关的数据资源",
      count: 4,
    },
    {
      id: "risk",
      name: "风险管理",
      description: "风险评估和管理相关的数据资源",
      count: 2,
    },
  ])

  // 模拟收藏的资源数据
  const [favoriteResources, setFavoriteResources] = useState<FavoriteResource[]>([
    {
      id: "customer_basic_info",
      title: "客户基本信息表",
      type: "table",
      description: "包含客户的基础信息，如姓名、证件号码、联系方式等",
      department: "零售部",
      owner: "王明",
      attributes: [
        { label: "字段数", value: "42" },
        { label: "更新频率", value: "日更新" },
        { label: "数据量", value: "1200万" },
      ],
      tags: ["客户信息", "核心数据"],
      dateAdded: "2023-11-15",
      collectionId: "important",
    },
    {
      id: "transaction_details",
      title: "交易流水明细表",
      type: "table",
      description: "记录所有客户交易的详细信息，包括交易金额、时间、类型等",
      department: "交易部",
      owner: "李华",
      attributes: [
        { label: "字段数", value: "38" },
        { label: "更新频率", value: "实时" },
        { label: "数据量", value: "5亿+" },
      ],
      tags: ["交易数据", "高频访问"],
      dateAdded: "2023-12-02",
      collectionId: "important",
    },
    {
      id: "customer_risk_score",
      title: "客户风险评分指标",
      type: "metric",
      description: "基于客户行为和历史记录计算的风险评分指标",
      department: "风险管理部",
      owner: "赵静",
      attributes: [
        { label: "计算频率", value: "日更新" },
        { label: "数据来源", value: "3个表" },
        { label: "覆盖率", value: "98%" },
      ],
      tags: ["风险管理", "评分指标"],
      dateAdded: "2023-10-28",
      collectionId: "risk",
    },
    {
      id: "customer_value",
      title: "客户价值评估指标",
      type: "metric",
      description: "基于客户资产、交易等维度的综合价值评估指标",
      department: "数据分析部",
      owner: "张伟",
      attributes: [
        { label: "计算频率", value: "日更新" },
        { label: "数据来源", value: "4个表" },
        { label: "覆盖率", value: "95%" },
      ],
      tags: ["客户分析", "价值评估"],
      dateAdded: "2024-01-05",
      collectionId: "customer",
    },
    {
      id: "customer_tag_group",
      title: "客户标签组",
      type: "tag",
      description: "客户相关的标签集合，包括行为特征、价值等级等",
      department: "数据分析部",
      owner: "刘芳",
      attributes: [
        { label: "标签数", value: "36" },
        { label: "更新频率", value: "日更新" },
        { label: "覆盖人群", value: "全部客户" },
      ],
      tags: ["客户标签", "标签组"],
      dateAdded: "2023-11-20",
      collectionId: "customer",
    },
    {
      id: "loan_application",
      title: "贷款申请表",
      type: "table",
      description: "记录客户贷款申请的详细信息和审批状态",
      department: "信贷部",
      owner: "张伟",
      attributes: [
        { label: "字段数", value: "56" },
        { label: "更新频率", value: "日更新" },
        { label: "数据量", value: "320万" },
      ],
      tags: ["贷款业务", "申请记录"],
      dateAdded: "2023-12-15",
      collectionId: "important",
    },
    {
      id: "customer_value_report",
      title: "客户价值分析报表",
      type: "report",
      description: "分析客户价值和贡献度的综合报表",
      department: "数据分析部",
      owner: "刘芳",
      attributes: [
        { label: "指标数", value: "18" },
        { label: "更新频率", value: "月更新" },
        { label: "数据来源", value: "5个表" },
      ],
      tags: ["客户分析", "价值评估"],
      dateAdded: "2024-01-10",
      collectionId: "customer",
    },
    {
      id: "risk_alert_rules",
      title: "风险预警规则表",
      type: "table",
      description: "定义各类风险预警的触发规则和阈值",
      department: "风险管理部",
      owner: "赵静",
      attributes: [
        { label: "字段数", value: "28" },
        { label: "更新频率", value: "周更新" },
        { label: "数据量", value: "156条" },
      ],
      tags: ["风险管理", "规则配置"],
      dateAdded: "2023-11-05",
      collectionId: "risk",
    },
  ])

  // 根据当前选择的收藏夹和搜索条件过滤资源
  const getFilteredResources = () => {
    let filtered = [...favoriteResources]

    // 按收藏夹筛选
    if (activeCollection && activeCollection !== "all") {
      filtered = filtered.filter((resource) => resource.collectionId === activeCollection)
    }

    // 按搜索关键词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // 排序
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "date_desc":
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        case "date_asc":
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        case "name_asc":
          return a.title.localeCompare(b.title)
        case "name_desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })
  }

  const filteredResources = getFilteredResources()

  // 处理全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredResources.map((resource) => resource.id))
    } else {
      setSelectedItems([])
    }
  }

  // 处理单个选择
  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    }
  }

  // 从收藏中移除
  const handleRemoveFromFavorites = (ids: string[]) => {
    setFavoriteResources(favoriteResources.filter((resource) => !ids.includes(resource.id)))
    setSelectedItems(selectedItems.filter((id) => !ids.includes(id)))

    // 更新收藏夹计数
    setCollections(
      collections.map((collection) => {
        if (collection.id === "all") {
          return { ...collection, count: collection.count - ids.length }
        }
        const removedFromThisCollection = favoriteResources.filter(
          (resource) => ids.includes(resource.id) && resource.collectionId === collection.id,
        ).length
        if (removedFromThisCollection > 0) {
          return { ...collection, count: collection.count - removedFromThisCollection }
        }
        return collection
      }),
    )
  }

  // 创建新收藏夹
  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return

    const newCollection: FavoriteCollection = {
      id: `collection_${Date.now()}`,
      name: newCollectionName,
      description: newCollectionDescription || undefined,
      count: 0,
    }

    setCollections([...collections, newCollection])
    setNewCollectionName("")
    setNewCollectionDescription("")
    setShowNewCollectionDialog(false)
  }

  // 移动到收藏夹
  const handleMoveToCollection = () => {
    if (!targetCollectionId || selectedItems.length === 0) return

    // 更新资源的收藏夹
    setFavoriteResources(
      favoriteResources.map((resource) => {
        if (selectedItems.includes(resource.id)) {
          // 如果已经在目标收藏夹中，不做改变
          if (resource.collectionId === targetCollectionId) {
            return resource
          }

          // 更新收藏夹计数
          const oldCollectionId = resource.collectionId
          if (oldCollectionId) {
            setCollections(
              collections.map((collection) => {
                if (collection.id === oldCollectionId) {
                  return { ...collection, count: collection.count - 1 }
                }
                return collection
              }),
            )
          }

          return { ...resource, collectionId: targetCollectionId }
        }
        return resource
      }),
    )

    // 更新目标收藏夹计数
    setCollections(
      collections.map((collection) => {
        if (collection.id === targetCollectionId) {
          return { ...collection, count: collection.count + selectedItems.length }
        }
        return collection
      }),
    )

    setSelectedItems([])
    setShowMoveToCollectionDialog(false)
    setTargetCollectionId(null)
  }

  const getTypeIcon = (type: string) => {
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

  const getTypeLabel = (type: string) => {
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
    <div className="flex h-screen flex-col">
      {/* 顶部导航栏 */}
      <header className="border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-700" />
            <h1 className="text-xl font-semibold text-blue-900">数据资源目录平台</h1>
          </div>
          <nav className="hidden md:flex">
            <ul className="flex space-x-8">
              <li className="text-gray-600 hover:text-blue-700 cursor-pointer" onClick={() => router.push("/")}>
                数据目录
              </li>
              <li className="text-gray-600 hover:text-blue-700 cursor-pointer" onClick={() => router.push("/search")}>
                搜索
              </li>
              <li className="text-blue-900 font-medium">我的收藏</li>
              <li
                className="text-gray-600 hover:text-blue-700 cursor-pointer"
                onClick={() => router.push("/management")}
              >
                管理中心
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarFallback className="bg-blue-100 text-blue-700">ZL</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>张丽 (数据分析师)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧收藏夹导航 */}
        <aside className="w-64 border-r bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-800">我的收藏</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowNewCollectionDialog(true)}>
                <FolderPlus className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-1">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
                    activeCollection === collection.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setActiveCollection(collection.id)}
                >
                  <div className="flex items-center">
                    <span className="font-medium">{collection.name}</span>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {collection.count}
                  </Badge>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="text-sm text-gray-500">
              <p>收藏夹可以帮助您组织和管理您收藏的数据资源，便于快速查找和使用。</p>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  {collections.find((c) => c.id === activeCollection)?.name || "我的收藏"}
                </h1>
                {activeCollection && activeCollection !== "all" && (
                  <p className="text-sm text-gray-500 mt-1">
                    {collections.find((c) => c.id === activeCollection)?.description}
                  </p>
                )}
              </div>
              <Button variant="outline" className="gap-2" onClick={() => router.push("/")}>
                <ChevronLeft className="h-4 w-4" />
                返回数据目录
              </Button>
            </div>

            {/* 搜索和操作栏 */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  className="pl-10 bg-white"
                  placeholder="搜索收藏的资源"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={viewMode === "grid" ? "bg-gray-200" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={viewMode === "list" ? "bg-gray-200" : ""}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">收藏时间 (最新优先)</SelectItem>
                  <SelectItem value="date_asc">收藏时间 (最早优先)</SelectItem>
                  <SelectItem value="name_asc">名称 (A-Z)</SelectItem>
                  <SelectItem value="name_desc">名称 (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 批量操作栏 */}
            {selectedItems.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="select-all"
                    checked={selectedItems.length === filteredResources.length}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    className="mr-2"
                  />
                  <label htmlFor="select-all" className="text-sm">
                    已选择 {selectedItems.length} 项
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => setShowMoveToCollectionDialog(true)}
                  >
                    <FolderPlus className="h-3.5 w-3.5" />
                    移动到收藏夹
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveFromFavorites(selectedItems)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    移除收藏
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedItems([])}>
                    取消
                  </Button>
                </div>
              </div>
            )}

            {/* 资源列表 - 网格视图 */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <Card key={resource.id} className="hover:border-blue-300 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedItems.includes(resource.id)}
                              onCheckedChange={(checked) => handleSelectItem(resource.id, !!checked)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            {getTypeIcon(resource.type)}
                            <Badge variant="outline" className="text-xs font-normal">
                              {getTypeLabel(resource.type)}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>操作</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setSelectedResource(resource.id)}>
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItems([resource.id])
                                  setShowMoveToCollectionDialog(true)
                                }}
                              >
                                移动到收藏夹
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleRemoveFromFavorites([resource.id])}
                              >
                                移除收藏
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <h3 className="text-lg font-medium text-blue-900 mb-1">{resource.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{resource.description}</p>

                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <span className="font-medium mr-2">所属部门:</span>
                          <span>{resource.department}</span>
                        </div>

                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <span className="font-medium mr-2">责任人:</span>
                          <span>{resource.owner}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {resource.attributes.map((attr, index) => (
                            <div key={index} className="bg-gray-50 p-1.5 rounded text-xs">
                              <div className="font-medium text-gray-700">{attr.label}</div>
                              <div className="text-gray-600">{attr.value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {resource.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs font-normal">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedResource(resource.id)}>
                          查看详情
                        </Button>
                        <div className="text-xs text-gray-500">
                          收藏于 {new Date(resource.dateAdded).toLocaleDateString("zh-CN")}
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                    <Heart className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">暂无收藏资源</h3>
                    <p className="text-gray-500 mb-6 max-w-md">
                      您当前没有收藏任何数据资源，或者没有符合筛选条件的收藏资源。
                    </p>
                    <Button onClick={() => router.push("/")}>浏览数据目录</Button>
                  </div>
                )}
              </div>
            )}

            {/* 资源列表 - 列表视图 */}
            {viewMode === "list" && (
              <div className="bg-white rounded-lg border overflow-hidden">
                {filteredResources.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 border-b text-sm font-medium text-gray-600">
                      <div className="col-span-1 flex items-center">
                        <Checkbox
                          id="select-all-list"
                          checked={selectedItems.length === filteredResources.length && filteredResources.length > 0}
                          onCheckedChange={(checked) => handleSelectAll(!!checked)}
                          className="mr-2"
                        />
                      </div>
                      <div className="col-span-3">资源名称</div>
                      <div className="col-span-3">描述</div>
                      <div className="col-span-1">类型</div>
                      <div className="col-span-1">部门</div>
                      <div className="col-span-1">责任人</div>
                      <div className="col-span-1">收藏时间</div>
                      <div className="col-span-1">操作</div>
                    </div>

                    {filteredResources.map((resource) => (
                      <div
                        key={resource.id}
                        className="grid grid-cols-12 gap-4 p-3 border-b hover:bg-gray-50 items-center text-sm"
                      >
                        <div className="col-span-1 flex items-center">
                          <Checkbox
                            checked={selectedItems.includes(resource.id)}
                            onCheckedChange={(checked) => handleSelectItem(resource.id, !!checked)}
                            className="mr-2"
                          />
                          {getTypeIcon(resource.type)}
                        </div>
                        <div className="col-span-3 font-medium text-blue-900">{resource.title}</div>
                        <div className="col-span-3 text-gray-600 truncate">{resource.description}</div>
                        <div className="col-span-1">
                          <Badge variant="outline" className="text-xs font-normal">
                            {getTypeLabel(resource.type)}
                          </Badge>
                        </div>
                        <div className="col-span-1 text-gray-600">{resource.department}</div>
                        <div className="col-span-1 text-gray-600">{resource.owner}</div>
                        <div className="col-span-1 text-gray-600">
                          {new Date(resource.dateAdded).toLocaleDateString("zh-CN")}
                        </div>
                        <div className="col-span-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedResource(resource.id)}>
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItems([resource.id])
                                  setShowMoveToCollectionDialog(true)
                                }}
                              >
                                移动到收藏夹
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleRemoveFromFavorites([resource.id])}
                              >
                                移除收藏
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Heart className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">暂无收藏资源</h3>
                    <p className="text-gray-500 mb-6 max-w-md">
                      您当前没有收藏任何数据资源，或者没有符合筛选条件的收藏资源。
                    </p>
                    <Button onClick={() => router.push("/")}>浏览数据目录</Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 数据使用指南入口 */}
          <div className="mt-8 border-t pt-4">
            <Button variant="link" className="text-blue-600 p-0">
              <BookOpen className="h-4 w-4 mr-2" />
              数据使用指南
            </Button>
          </div>
        </main>
      </div>

      {/* 资源详情弹窗 */}
      {selectedResource && (
        <Dialog
          open={!!selectedResource && !showLineage}
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
              onViewLineage={() => setShowLineage(true)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* 血缘关系可视化弹窗 */}
      {showLineage && (
        <Dialog
          open={showLineage}
          onOpenChange={(open) => {
            if (!open) {
              setShowLineage(false)
            }
          }}
        >
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>数据血缘关系</DialogTitle>
              <DialogDescription>展示数据从源系统到目标应用的完整流转路径</DialogDescription>
            </DialogHeader>
            <DataLineage resourceId={selectedResource || ""} />
          </DialogContent>
        </Dialog>
      )}

      {/* 新建收藏夹弹窗 */}
      <Dialog open={showNewCollectionDialog} onOpenChange={setShowNewCollectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>新建收藏夹</DialogTitle>
            <DialogDescription>创建一个新的收藏夹来组织您的数据资源</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="collection-name">收藏夹名称</Label>
              <Input
                id="collection-name"
                placeholder="输入收藏夹名称"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-description">描述 (可选)</Label>
              <Input
                id="collection-description"
                placeholder="简要描述该收藏夹的用途"
                value={newCollectionDescription}
                onChange={(e) => setNewCollectionDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowNewCollectionDialog(false)}>
              取消
            </Button>
            <Button onClick={handleCreateCollection} disabled={!newCollectionName.trim()}>
              创建
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 移动到收藏夹弹窗 */}
      <Dialog open={showMoveToCollectionDialog} onOpenChange={setShowMoveToCollectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>移动到收藏夹</DialogTitle>
            <DialogDescription>选择要将所选资源移动到的收藏夹</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={targetCollectionId || ""} onValueChange={setTargetCollectionId}>
              <SelectTrigger>
                <SelectValue placeholder="选择收藏夹" />
              </SelectTrigger>
              <SelectContent>
                {collections
                  .filter((c) => c.id !== "all")
                  .map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowMoveToCollectionDialog(false)}>
              取消
            </Button>
            <Button onClick={handleMoveToCollection} disabled={!targetCollectionId}>
              移动
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}