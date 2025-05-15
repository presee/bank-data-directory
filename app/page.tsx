"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, Calendar, Database, Filter, FileText, Search, Tag, Users, X, ChevronRight, Eye } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ResourceDetail } from "@/components/resource-detail"
import { DataLineage } from "@/components/data-lineage"
import { ResourceCard } from "@/components/resource-card"
import { DirectoryNavigation } from "@/components/directory-navigation"

interface ResourceAttribute {
  label: string
  value: string
}

interface Resource {
  id: string
  title: string
  type: "table" | "metric" | "tag" | "report"
  description: string
  department: string
  owner: string
  attributes: ResourceAttribute[]
  tags: string[]
  updateFrequency?: string
  lastUpdated?: string
}

interface FilterOptions {
  types: string[]
  departments: string[]
  updateFrequencies: string[]
  tags: string[]
}

export default function Home() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("business")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Resource[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const [showLineage, setShowLineage] = useState(false)
  const [showFilterPopover, setShowFilterPopover] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    types: [],
    departments: [],
    updateFrequencies: [],
    tags: [],
  })

  const allResources: Resource[] = [
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
      updateFrequency: "日更新",
      lastUpdated: "2023-05-10",
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
      updateFrequency: "实时",
      lastUpdated: "2023-05-11",
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
      updateFrequency: "日更新",
      lastUpdated: "2023-05-09",
    },
    {
      id: "product_holding_tags",
      title: "产品持有标签",
      type: "tag",
      description: "标识客户持有的银行产品类型和数量",
      department: "产品部",
      owner: "陈明",
      attributes: [
        { label: "标签数", value: "24" },
        { label: "更新频率", value: "日更新" },
        { label: "覆盖人群", value: "全部客户" },
      ],
      tags: ["客户标签", "产品分析"],
      updateFrequency: "日更新",
      lastUpdated: "2023-05-08",
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
      updateFrequency: "日更新",
      lastUpdated: "2023-05-07",
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
      updateFrequency: "月更新",
      lastUpdated: "2023-04-30",
    },
    {
      id: "customer_activity_metric",
      title: "客户活跃度指标",
      type: "metric",
      description: "衡量客户交易和互动频率的综合指标",
      department: "数据分析部",
      owner: "刘芳",
      attributes: [
        { label: "计算频率", value: "日更新" },
        { label: "数据来源", value: "4个表" },
        { label: "覆盖率", value: "99%" },
      ],
      tags: ["客户分析", "活跃度", "高频访问"],
      updateFrequency: "日更新",
      lastUpdated: "2023-05-11",
    },
    {
      id: "high_value_customer_tag",
      title: "高净值客户标签",
      type: "tag",
      description: "识别银行高净值客户群体的标签",
      department: "零售部",
      owner: "王明",
      attributes: [
        { label: "标签数", value: "8" },
        { label: "更新频率", value: "周更新" },
        { label: "覆盖人群", value: "高净值客户" },
      ],
      tags: ["客户标签", "高净值", "高频访问"],
      updateFrequency: "周更新",
      lastUpdated: "2023-05-05",
    },
    {
      id: "electronic_channel_transaction",
      title: "电子渠道交易表",
      type: "table",
      description: "记录所有电子渠道的交易数据",
      department: "交易部",
      owner: "李华",
      attributes: [
        { label: "字段数", value: "45" },
        { label: "更新频率", value: "实时" },
        { label: "数据量", value: "3亿+" },
      ],
      tags: ["交易数据", "电子渠道", "高频访问"],
      updateFrequency: "实时",
      lastUpdated: "2023-05-11",
    },
  ]

  const getFilterOptions = () => {
    const types = Array.from(new Set(allResources.map((r) => r.type)))
    const departments = Array.from(new Set(allResources.map((r) => r.department)))
    const updateFrequencies = Array.from(
      new Set(allResources.map((r) => r.updateFrequency).filter(Boolean) as string[]),
    )

    const allTags = allResources.flatMap((r) => r.tags)
    const tags = Array.from(new Set(allTags))

    return { types, departments, updateFrequencies, tags }
  }

  const filterOptions = getFilterOptions()

  useEffect(() => {
    if (!searchQuery && Object.values(activeFilters).every((filters) => filters.length === 0)) {
      setIsSearching(false)
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const query = searchQuery.toLowerCase()

    const filteredResources = allResources.filter((resource) => {
      const matchesSearch =
        !searchQuery ||
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(query))

      const matchesType = activeFilters.types.length === 0 || activeFilters.types.includes(resource.type)

      const matchesDepartment =
        activeFilters.departments.length === 0 || activeFilters.departments.includes(resource.department)

      const matchesFrequency =
        activeFilters.updateFrequencies.length === 0 ||
        (resource.updateFrequency && activeFilters.updateFrequencies.includes(resource.updateFrequency))

      const matchesTags =
        activeFilters.tags.length === 0 || resource.tags.some((tag) => activeFilters.tags.includes(tag))

      return matchesSearch && matchesType && matchesDepartment && matchesFrequency && matchesTags
    })

    setSearchResults(filteredResources)
  }, [searchQuery, activeFilters])

  const handleSearch = () => {
    console.log("Searching for:", searchQuery)
  }

  const handleFilterToggle = (category: keyof FilterOptions, value: string) => {
    setActiveFilters((prev) => {
      const currentFilters = [...prev[category]]
      const index = currentFilters.indexOf(value)

      if (index === -1) {
        return { ...prev, [category]: [...currentFilters, value] }
      } else {
        currentFilters.splice(index, 1)
        return { ...prev, [category]: currentFilters }
      }
    })
  }

  const clearFilters = () => {
    setActiveFilters({
      types: [],
      departments: [],
      updateFrequencies: [],
      tags: [],
    })
  }

  const handleDirectoryItemSelect = (id: string, type: string, name: string) => {
    console.log(`Selected: ${name} (${id}) of type ${type}`)

    switch (type) {
      case "table":
        setSelectedResource(id)
        break
      case "metric":
        setSelectedResource(id)
        break
      case "tag":
        setSelectedResource(id)
        break
      case "report":
        setSelectedResource(id)
        break
      default:
        console.log(`Navigate to category: ${id}`)
    }
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
      default:
        return "未知类型"
    }
  }

  const activeFilterCount = Object.values(activeFilters).reduce((count, filters) => count + filters.length, 0)

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-700" />
            <h1 className="text-xl font-semibold text-blue-900">数据资源目录平台</h1>
          </div>
          <nav className="hidden md:flex">
            <ul className="flex space-x-8">
              <li className="text-blue-900 font-medium">数据目录</li>
              <li className="text-gray-600 hover:text-blue-700 cursor-pointer" onClick={() => router.push("/search")}>
                搜索
              </li>
              <li
                className="text-gray-600 hover:text-blue-700 cursor-pointer"
                onClick={() => router.push("/favorites")}
              >
                我的收藏
              </li>
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
        <aside className="w-64 border-r bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <Tabs defaultValue="business" onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="business">业务主题</TabsTrigger>
                <TabsTrigger value="organization">组织结构</TabsTrigger>
                <TabsTrigger value="type">资源类型</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <DirectoryNavigation activeCategory={activeCategory} onItemSelect={handleDirectoryItemSelect} />
        </aside>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="mb-6 flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                className="pl-10 bg-white"
                placeholder="搜索资源（支持关键词、拼音、标签）"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Popover open={showFilterPopover} onOpenChange={setShowFilterPopover}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  筛选
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">筛选条件</h3>
                    {activeFilterCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                        清除全部
                      </Button>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">资源类型</h4>
                    <div className="space-y-2">
                      {filterOptions.types.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`filter-type-${type}`}
                            checked={activeFilters.types.includes(type)}
                            onCheckedChange={() => handleFilterToggle("types", type)}
                          />
                          <label htmlFor={`filter-type-${type}`} className="text-sm flex items-center cursor-pointer">
                            {getTypeIcon(type)}
                            <span className="ml-1.5">{getTypeLabel(type)}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">所属部门</h4>
                    <div className="space-y-2">
                      {filterOptions.departments.map((department) => (
                        <div key={department} className="flex items-center space-x-2">
                          <Checkbox
                            id={`filter-dept-${department}`}
                            checked={activeFilters.departments.includes(department)}
                            onCheckedChange={() => handleFilterToggle("departments", department)}
                          />
                          <label htmlFor={`filter-dept-${department}`} className="text-sm cursor-pointer">
                            {department}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">更新频率</h4>
                    <div className="space-y-2">
                      {filterOptions.updateFrequencies.map((frequency) => (
                        <div key={frequency} className="flex items-center space-x-2">
                          <Checkbox
                            id={`filter-freq-${frequency}`}
                            checked={activeFilters.updateFrequencies.includes(frequency)}
                            onCheckedChange={() => handleFilterToggle("updateFrequencies", frequency)}
                          />
                          <label
                            htmlFor={`filter-freq-${frequency}`}
                            className="text-sm flex items-center cursor-pointer"
                          >
                            <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                            {frequency}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">业务标签</h4>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={activeFilters.tags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleFilterToggle("tags", tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button onClick={() => setShowFilterPopover(false)}>应用筛选</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {activeFilterCount > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeFilters.types.map((type) => (
                <Badge key={`active-type-${type}`} variant="secondary" className="px-2 py-1">
                  {getTypeLabel(type)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => handleFilterToggle("types", type)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {activeFilters.departments.map((dept) => (
                <Badge key={`active-dept-${dept}`} variant="secondary" className="px-2 py-1">
                  {dept}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => handleFilterToggle("departments", dept)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {activeFilters.updateFrequencies.map((freq) => (
                <Badge key={`active-freq-${freq}`} variant="secondary" className="px-2 py-1">
                  {freq}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => handleFilterToggle("updateFrequencies", freq)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {activeFilters.tags.map((tag) => (
                <Badge key={`active-tag-${tag}`} variant="secondary" className="px-2 py-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => handleFilterToggle("tags", tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                清除全部
              </Button>
            </div>
          )}

          {isSearching && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">搜索结果</h2>
                <p className="text-sm text-gray-500">
                  找到 {searchResults.length} 条与 "{searchQuery || "筛选条件"}" 相关的数据资源
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((resource) => (
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
                  />
                ))}
              </div>

              {searchResults.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">未找到匹配的数据资源</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    尝试使用不同的关键词或调整筛选条件，以获取更多相关结果
                  </p>
                </div>
              )}
            </div>
          )}

          {!isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allResources.slice(0, 6).map((resource) => (
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
                />
              ))}
            </div>
          )}

          {!isSearching && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">推荐资源</h2>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                  查看更多
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className="bg-blue-50 border-blue-200 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedResource("customer_activity_metric")}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                        高频使用
                      </Badge>
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium text-blue-900">客户活跃度指标</h3>
                    <p className="text-sm text-gray-600 mt-1">衡量客户交易和互动频率的综合指标</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      <span>1024次引用</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 p-0 hover:bg-blue-100">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card
                  className="bg-blue-50 border-blue-200 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedResource("high_value_customer_tag")}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                        高频使用
                      </Badge>
                      <Tag className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium text-blue-900">高净值客户标签</h3>
                    <p className="text-sm text-gray-600 mt-1">识别银行高净值客户群体的标签</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      <span>876次引用</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 p-0 hover:bg-blue-100">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card
                  className="bg-blue-50 border-blue-200 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedResource("electronic_channel_transaction")}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                        高频使用
                      </Badge>
                      <Database className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium text-blue-900">电子渠道交易表</h3>
                    <p className="text-sm text-gray-600 mt-1">记录所有电子渠道的交易数据</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      <span>752次引用</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 p-0 hover:bg-blue-100">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

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
    </div>
  )
}