"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  BookmarkPlus,
  Calendar,
  ChevronDown,
  Clock,
  Database,
  FileText,
  History,
  Info,
  Search,
  SlidersHorizontal,
  Tag,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { ResourceDetail } from "@/components/resource-detail"
import { DataLineage } from "@/components/data-lineage"

// 模拟数据库资源
const allResources = [
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
    relevance: 98,
    updateTime: "2023-05-10",
  },
  {
    id: "customer_contact",
    title: "客户联系方式表",
    type: "table",
    description: "存储客户的各类联系方式，包括电话、邮箱、地址等",
    department: "零售部",
    owner: "王明",
    attributes: [
      { label: "字段数", value: "18" },
      { label: "更新频率", value: "日更新" },
      { label: "数据量", value: "1150万" },
    ],
    tags: ["客户信息", "联系方式"],
    relevance: 92,
    updateTime: "2023-05-08",
  },
  {
    id: "customer_preference",
    title: "客户偏好设置表",
    type: "table",
    description: "记录客户的产品偏好、服务偏好等个性化设置",
    department: "零售部",
    owner: "李华",
    attributes: [
      { label: "字段数", value: "24" },
      { label: "更新频率", value: "日更新" },
      { label: "数据量", value: "980万" },
    ],
    tags: ["客户信息", "偏好设置"],
    relevance: 85,
    updateTime: "2023-05-05",
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
    relevance: 78,
    updateTime: "2023-05-01",
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
    relevance: 72,
    updateTime: "2023-04-28",
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
    relevance: 68,
    updateTime: "2023-04-25",
  },
  {
    id: "transaction_daily",
    title: "交易流水日汇总表",
    type: "table",
    description: "每日交易流水汇总数据，包含交易金额、笔数等统计信息",
    department: "交易部",
    owner: "陈强",
    attributes: [
      { label: "字段数", value: "28" },
      { label: "更新频率", value: "日更新" },
      { label: "数据量", value: "365条/年" },
    ],
    tags: ["交易数据", "汇总数据"],
    relevance: 65,
    updateTime: "2023-04-20",
  },
  {
    id: "loan_application",
    title: "贷款申请表",
    type: "table",
    description: "记录客户贷款申请的详细信息，包括申请金额、期限等",
    department: "信贷部",
    owner: "杨帆",
    attributes: [
      { label: "字段数", value: "56" },
      { label: "更新频率", value: "实时" },
      { label: "数据量", value: "850万" },
    ],
    tags: ["贷款业务", "申请数据"],
    relevance: 60,
    updateTime: "2023-04-15",
  },
  {
    id: "credit_score",
    title: "信用评分模型",
    type: "metric",
    description: "基于多维度数据的客户信用评分模型",
    department: "风险管理部",
    owner: "赵静",
    attributes: [
      { label: "计算频率", value: "日更新" },
      { label: "数据来源", value: "6个表" },
      { label: "覆盖率", value: "99%" },
    ],
    tags: ["风险管理", "评分模型"],
    relevance: 55,
    updateTime: "2023-04-10",
  },
  {
    id: "product_info",
    title: "产品信息表",
    type: "table",
    description: "银行所有产品的基本信息，包括产品名称、类型、利率等",
    department: "产品部",
    owner: "林小红",
    attributes: [
      { label: "字段数", value: "32" },
      { label: "更新频率", value: "实时" },
      { label: "数据量", value: "500条" },
    ],
    tags: ["产品信息", "基础数据"],
    relevance: 50,
    updateTime: "2023-04-05",
  },
]

// 定义高级搜索的筛选条件类型
interface AdvancedSearchFilters {
  resourceType: string
  department: string
  updateFrequency: string
  businessTag: string
  owner: string
  updateTimeRange: string
}

// 定义保存的搜索类型
interface SavedSearch {
  id: string
  name: string
  query: string
  filters: AdvancedSearchFilters
  createdAt: string
}

export default function SearchPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [advancedSearch, setAdvancedSearch] = useState(false)
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const [showLineage, setShowLineage] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [sortOption, setSortOption] = useState("relevance")
  const [searchResults, setSearchResults] = useState<typeof allResources>([])
  const [isSearching, setIsSearching] = useState(false)
  const [saveSearchDialogOpen, setSaveSearchDialogOpen] = useState(false)
  const [newSearchName, setNewSearchName] = useState("")

  // 高级搜索筛选条件
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedSearchFilters>({
    resourceType: "all",
    department: "all",
    updateFrequency: "all",
    businessTag: "all",
    owner: "",
    updateTimeRange: "all",
  })

  // 初始化时从本地存储加载搜索历史和保存的搜索
  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory")
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory))
    }

    const storedSearches = localStorage.getItem("savedSearches")
    if (storedSearches) {
      setSavedSearches(JSON.parse(storedSearches))
    }
  }, [])

  // 保存搜索历史到本地存储
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
    }
  }, [searchHistory])

  // 保存已保存的搜索到本地存储
  useEffect(() => {
    if (savedSearches.length > 0) {
      localStorage.setItem("savedSearches", JSON.stringify(savedSearches))
    }
  }, [savedSearches])

  // 执行搜索
  const performSearch = () => {
    setIsSearching(true)

    // 模拟搜索延迟
    setTimeout(() => {
      let results = [...allResources]

      // 按关键词筛选
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        results = results.filter(
          (resource) =>
            resource.title.toLowerCase().includes(query) ||
            resource.description.toLowerCase().includes(query) ||
            resource.tags.some((tag) => tag.toLowerCase().includes(query)),
        )
      }

      // 应用高级搜索筛选
      if (advancedFilters.resourceType !== "all") {
        results = results.filter((resource) => resource.type === advancedFilters.resourceType)
      }

      if (advancedFilters.department !== "all") {
        results = results.filter((resource) => {
          const deptMap: { [key: string]: string } = {
            retail: "零售部",
            risk: "风险管理部",
            data: "数据分析部",
            credit: "信贷部",
            transaction: "交易部",
            product: "产品部",
          }
          return resource.department === deptMap[advancedFilters.department]
        })
      }

      if (advancedFilters.updateFrequency !== "all") {
        results = results.filter((resource) => {
          const freqMap: { [key: string]: string } = {
            realtime: "实时",
            daily: "日更新",
            weekly: "周更新",
            monthly: "月更新",
          }

          // 在属性中查找更新频率
          const updateFreqAttr = resource.attributes.find((attr) => attr.label === "更新频率")
          return updateFreqAttr && updateFreqAttr.value === freqMap[advancedFilters.updateFrequency]
        })
      }

      if (advancedFilters.businessTag !== "all") {
        results = results.filter((resource) => {
          const tagMap: { [key: string]: string } = {
            "customer-info": "客户信息",
            transaction: "交易数据",
            "risk-tag": "风险管理",
            core: "核心数据",
            product: "产品信息",
            loan: "贷款业务",
          }
          return resource.tags.includes(tagMap[advancedFilters.businessTag])
        })
      }

      if (advancedFilters.owner) {
        results = results.filter((resource) =>
          resource.owner.toLowerCase().includes(advancedFilters.owner.toLowerCase()),
        )
      }

      if (advancedFilters.updateTimeRange !== "all") {
        const now = new Date()
        const getDateLimit = (range: string) => {
          switch (range) {
            case "today":
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return today
            case "week":
              const week = new Date()
              week.setDate(week.getDate() - 7)
              return week
            case "month":
              const month = new Date()
              month.setMonth(month.getMonth() - 1)
              return month
            case "quarter":
              const quarter = new Date()
              quarter.setMonth(quarter.getMonth() - 3)
              return quarter
            default:
              return new Date(0) // 1970年
          }
        }

        const dateLimit = getDateLimit(advancedFilters.updateTimeRange)

        results = results.filter((resource) => {
          const updateDate = new Date(resource.updateTime)
          return updateDate >= dateLimit
        })
      }

      // 应用类型筛选器
      if (activeFilters.includes("table")) {
        results = results.filter((resource) => resource.type === "table")
      } else if (activeFilters.includes("metric")) {
        results = results.filter((resource) => resource.type === "metric")
      } else if (activeFilters.includes("tag")) {
        results = results.filter((resource) => resource.type === "tag")
      }

      // 应用部门筛选器
      if (activeFilters.includes("retail")) {
        results = results.filter((resource) => resource.department === "零售部")
      } else if (activeFilters.includes("risk")) {
        results = results.filter((resource) => resource.department === "风险管理部")
      } else if (activeFilters.includes("data")) {
        results = results.filter((resource) => resource.department === "数据分析部")
      } else if (activeFilters.includes("credit")) {
        results = results.filter((resource) => resource.department === "信贷部")
      }

      // 应用更新频率筛选器
      const updateFreqFilter = activeFilters.find((f) => ["realtime", "daily", "weekly", "monthly"].includes(f))
      if (updateFreqFilter) {
        const freqMap: { [key: string]: string } = {
          realtime: "实时",
          daily: "日更新",
          weekly: "周更新",
          monthly: "月更新",
        }

        results = results.filter((resource) => {
          const updateFreqAttr = resource.attributes.find((attr) => attr.label === "更新频率")
          return updateFreqAttr && updateFreqAttr.value === freqMap[updateFreqFilter]
        })
      }

      // 应用标签筛选器
      if (activeFilters.includes("customer-info")) {
        results = results.filter((resource) => resource.tags.includes("客户信息"))
      } else if (activeFilters.includes("transaction")) {
        results = results.filter((resource) => resource.tags.includes("交易数据"))
      } else if (activeFilters.includes("risk-tag")) {
        results = results.filter((resource) => resource.tags.includes("风险管理"))
      } else if (activeFilters.includes("core")) {
        results = results.filter((resource) => resource.tags.includes("核心数据"))
      }

      // 应用时间筛选器
      if (activeFilters.includes("today")) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        results = results.filter((resource) => new Date(resource.updateTime) >= today)
      } else if (activeFilters.includes("week")) {
        const week = new Date()
        week.setDate(week.getDate() - 7)
        results = results.filter((resource) => new Date(resource.updateTime) >= week)
      } else if (activeFilters.includes("month")) {
        const month = new Date()
        month.setMonth(month.getMonth() - 1)
        results = results.filter((resource) => new Date(resource.updateTime) >= month)
      }

      setSearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  // 处理搜索
  const handleSearch = () => {
    if (searchQuery.trim() && !searchHistory.includes(searchQuery)) {
      setSearchHistory([searchQuery, ...searchHistory].slice(0, 10))
    }
    performSearch()
  }

  // 处理高级搜索筛选条件变更
  const handleAdvancedFilterChange = (field: keyof AdvancedSearchFilters, value: string) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 应用高级搜索筛选
  const applyAdvancedFilters = () => {
    performSearch()
    setAdvancedSearch(false)

    toast({
      title: "筛选条件已应用",
      description: "搜索结果已根据您的筛选条件更新",
    })
  }

  // 重置高级搜索筛选
  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      resourceType: "all",
      department: "all",
      updateFrequency: "all",
      businessTag: "all",
      owner: "",
      updateTimeRange: "all",
    })
  }

  // 打开保存搜索对话框
  const openSaveSearchDialog = () => {
    setNewSearchName(`搜索: ${searchQuery || "所有资源"}`)
    setSaveSearchDialogOpen(true)
  }

  // 保存当前搜索
  const saveCurrentSearch = () => {
    if (newSearchName.trim()) {
      const newSavedSearch: SavedSearch = {
        id: Date.now().toString(),
        name: newSearchName,
        query: searchQuery,
        filters: advancedFilters,
        createdAt: new Date().toISOString(),
      }

      setSavedSearches([newSavedSearch, ...savedSearches])
      setSaveSearchDialogOpen(false)

      toast({
        title: "搜索已保存",
        description: `"${newSearchName}" 已添加到您的保存列表`,
      })
    }
  }

  // 加载保存的搜索
  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setSearchQuery(savedSearch.query)
    setAdvancedFilters(savedSearch.filters)

    // 关闭保存搜索弹窗
    setSaveSearchDialogOpen(false)

    // 执行搜索
    setTimeout(() => {
      performSearch()
    }, 100)

    toast({
      title: "已加载保存的搜索",
      description: `已应用 "${savedSearch.name}" 的搜索条件`,
    })
  }

  // 删除保存的搜索
  const deleteSavedSearch = (id: string) => {
    setSavedSearches(savedSearches.filter((search) => search.id !== id))

    toast({
      title: "已删除",
      description: "已从保存列表中移除该搜索",
    })
  }

  // 处理筛选条件切换
  const handleFilterToggle = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))

    // 应用筛选后重新搜索
    setTimeout(() => {
      performSearch()
    }, 100)
  }

  // 清除所有筛选条件
  const clearFilters = () => {
    setActiveFilters([])

    // 清除筛选后重新搜索
    setTimeout(() => {
      performSearch()
    }, 100)
  }

  // 根据排序选项对结果进行排序
  const getSortedResults = () => {
    return [...searchResults].sort((a, b) => {
      switch (sortOption) {
        case "relevance":
          return b.relevance - a.relevance
        case "name_asc":
          return a.title.localeCompare(b.title)
        case "name_desc":
          return b.title.localeCompare(a.title)
        case "update_time":
          return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
        default:
          return 0
      }
    })
  }

  // 获取资源类型图标
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

  // 初始化时执行一次搜索，显示所有结果
  useEffect(() => {
    performSearch()
  }, [])

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
              <li className="text-blue-900 font-medium">搜索</li>
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
        {/* 主内容区 */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">数据资源搜索</h1>

            {/* 搜索区域 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <Input
                    className="pl-10 py-6 text-base"
                    placeholder="搜索数据资源（支持关键词、拼音、标签）"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => {
                        setSearchQuery("")
                        performSearch()
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button onClick={handleSearch} className="py-6 px-6" disabled={isSearching}>
                  {isSearching ? "搜索中..." : "搜索"}
                </Button>
                <Button
                  variant={advancedSearch ? "default" : "outline"}
                  onClick={() => setAdvancedSearch(!advancedSearch)}
                  className="gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  高级搜索
                </Button>
              </div>

              {/* 高级搜索选项 */}
              {advancedSearch && (
                <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">资源类型</label>
                    <Select
                      value={advancedFilters.resourceType}
                      onValueChange={(value) => handleAdvancedFilterChange("resourceType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择资源类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        <SelectItem value="table">数据表</SelectItem>
                        <SelectItem value="metric">指标</SelectItem>
                        <SelectItem value="tag">标签</SelectItem>
                        <SelectItem value="report">报表</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">所属部门</label>
                    <Select
                      value={advancedFilters.department}
                      onValueChange={(value) => handleAdvancedFilterChange("department", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择部门" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部部门</SelectItem>
                        <SelectItem value="retail">零售部</SelectItem>
                        <SelectItem value="risk">风险管理部</SelectItem>
                        <SelectItem value="data">数据分析部</SelectItem>
                        <SelectItem value="credit">信贷部</SelectItem>
                        <SelectItem value="transaction">交易部</SelectItem>
                        <SelectItem value="product">产品部</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">更新频率</label>
                    <Select
                      value={advancedFilters.updateFrequency}
                      onValueChange={(value) => handleAdvancedFilterChange("updateFrequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择更新频率" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="realtime">实时</SelectItem>
                        <SelectItem value="daily">日更新</SelectItem>
                        <SelectItem value="weekly">周更新</SelectItem>
                        <SelectItem value="monthly">月更新</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">业务标签</label>
                    <Select
                      value={advancedFilters.businessTag}
                      onValueChange={(value) => handleAdvancedFilterChange("businessTag", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择业务标签" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部标签</SelectItem>
                        <SelectItem value="customer-info">客户信息</SelectItem>
                        <SelectItem value="transaction">交易数据</SelectItem>
                        <SelectItem value="risk-tag">风险管理</SelectItem>
                        <SelectItem value="core">核心数据</SelectItem>
                        <SelectItem value="product">产品信息</SelectItem>
                        <SelectItem value="loan">贷款业务</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">责任人</label>
                    <Input
                      placeholder="输入责任人姓名"
                      value={advancedFilters.owner}
                      onChange={(e) => handleAdvancedFilterChange("owner", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">更新时间</label>
                    <Select
                      value={advancedFilters.updateTimeRange}
                      onValueChange={(value) => handleAdvancedFilterChange("updateTimeRange", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择时间范围" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部时间</SelectItem>
                        <SelectItem value="today">今天</SelectItem>
                        <SelectItem value="week">本周</SelectItem>
                        <SelectItem value="month">本月</SelectItem>
                        <SelectItem value="quarter">本季度</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3 flex justify-end space-x-2 mt-2">
                    <Button variant="outline" onClick={resetAdvancedFilters}>
                      重置
                    </Button>
                    <Button variant="outline" onClick={() => setAdvancedSearch(false)}>
                      取消
                    </Button>
                    <Button onClick={applyAdvancedFilters}>应用筛选</Button>
                  </div>
                </div>
              )}

              {/* 搜索历史和快捷操作 */}
              <div className="flex items-center mt-2 text-sm">
                <div className="flex items-center text-gray-500 mr-6">
                  <History className="h-4 w-4 mr-1" />
                  <span>最近搜索:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.length > 0 ? (
                    searchHistory.slice(0, 5).map((item, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setSearchQuery(item)
                          handleSearch()
                        }}
                      >
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400">暂无搜索历史</span>
                  )}
                </div>
                <div className="ml-auto flex items-center">
                  <Popover open={saveSearchDialogOpen} onOpenChange={setSaveSearchDialogOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={openSaveSearchDialog}>
                        <BookmarkPlus className="h-4 w-4" />
                        <span>保存搜索</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <h4 className="font-medium">保存当前搜索</h4>
                        <div className="space-y-2">
                          <Input
                            placeholder="搜索名称"
                            value={newSearchName}
                            onChange={(e) => setNewSearchName(e.target.value)}
                          />
                          <div className="text-xs text-gray-500">
                            搜索条件: {searchQuery || "无关键词"}{" "}
                            {activeFilters.length > 0 ? `+ ${activeFilters.length}个筛选条件` : ""}
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button size="sm" onClick={saveCurrentSearch}>
                            保存
                          </Button>
                        </div>

                        {savedSearches.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-medium mb-2">已保存的搜索</h4>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {savedSearches.map((saved) => (
                                  <div key={saved.id} className="flex items-center justify-between">
                                    <div
                                      className="text-sm cursor-pointer hover:text-blue-600"
                                      onClick={() => loadSavedSearch(saved)}
                                    >
                                      {saved.name}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => deleteSavedSearch(saved.id)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          {/* 搜索结果区域 */}
          <div className="flex gap-6">
            {/* 筛选面板 */}
            <div className="w-64 shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">筛选条件</h3>
                  {activeFilters.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                      清除全部
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <h4 className="text-sm font-medium">资源类型</h4>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-table"
                          checked={activeFilters.includes("table")}
                          onCheckedChange={() => handleFilterToggle("table")}
                        />
                        <label htmlFor="filter-table" className="text-sm flex items-center cursor-pointer">
                          <Database className="h-4 w-4 text-blue-600 mr-1.5" />
                          数据表
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-metric"
                          checked={activeFilters.includes("metric")}
                          onCheckedChange={() => handleFilterToggle("metric")}
                        />
                        <label htmlFor="filter-metric" className="text-sm flex items-center cursor-pointer">
                          <BarChart3 className="h-4 w-4 text-green-600 mr-1.5" />
                          指标
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-tag"
                          checked={activeFilters.includes("tag")}
                          onCheckedChange={() => handleFilterToggle("tag")}
                        />
                        <label htmlFor="filter-tag" className="text-sm flex items-center cursor-pointer">
                          <Tag className="h-4 w-4 text-purple-600 mr-1.5" />
                          标签
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-report"
                          checked={activeFilters.includes("report")}
                          onCheckedChange={() => handleFilterToggle("report")}
                        />
                        <label htmlFor="filter-report" className="text-sm flex items-center cursor-pointer">
                          <FileText className="h-4 w-4 text-orange-600 mr-1.5" />
                          报表
                        </label>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <h4 className="text-sm font-medium">所属部门</h4>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-retail"
                          checked={activeFilters.includes("retail")}
                          onCheckedChange={() => handleFilterToggle("retail")}
                        />
                        <label htmlFor="filter-retail" className="text-sm cursor-pointer">
                          零售部
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-risk"
                          checked={activeFilters.includes("risk")}
                          onCheckedChange={() => handleFilterToggle("risk")}
                        />
                        <label htmlFor="filter-risk" className="text-sm cursor-pointer">
                          风险管理部
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-data"
                          checked={activeFilters.includes("data")}
                          onCheckedChange={() => handleFilterToggle("data")}
                        />
                        <label htmlFor="filter-data" className="text-sm cursor-pointer">
                          数据分析部
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-credit"
                          checked={activeFilters.includes("credit")}
                          onCheckedChange={() => handleFilterToggle("credit")}
                        />
                        <label htmlFor="filter-credit" className="text-sm cursor-pointer">
                          信贷部
                        </label>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <h4 className="text-sm font-medium">更新频率</h4>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-realtime"
                          checked={activeFilters.includes("realtime")}
                          onCheckedChange={() => handleFilterToggle("realtime")}
                        />
                        <label htmlFor="filter-realtime" className="text-sm cursor-pointer">
                          实时
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-daily"
                          checked={activeFilters.includes("daily")}
                          onCheckedChange={() => handleFilterToggle("daily")}
                        />
                        <label htmlFor="filter-daily" className="text-sm cursor-pointer">
                          日更新
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-weekly"
                          checked={activeFilters.includes("weekly")}
                          onCheckedChange={() => handleFilterToggle("weekly")}
                        />
                        <label htmlFor="filter-weekly" className="text-sm cursor-pointer">
                          周更新
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-monthly"
                          checked={activeFilters.includes("monthly")}
                          onCheckedChange={() => handleFilterToggle("monthly")}
                        />
                        <label htmlFor="filter-monthly" className="text-sm cursor-pointer">
                          月更新
                        </label>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <h4 className="text-sm font-medium">业务标签</h4>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-customer-info"
                          checked={activeFilters.includes("customer-info")}
                          onCheckedChange={() => handleFilterToggle("customer-info")}
                        />
                        <label htmlFor="filter-customer-info" className="text-sm cursor-pointer">
                          客户信息
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-transaction"
                          checked={activeFilters.includes("transaction")}
                          onCheckedChange={() => handleFilterToggle("transaction")}
                        />
                        <label htmlFor="filter-transaction" className="text-sm cursor-pointer">
                          交易数据
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-risk"
                          checked={activeFilters.includes("risk-tag")}
                          onCheckedChange={() => handleFilterToggle("risk-tag")}
                        />
                        <label htmlFor="filter-risk" className="text-sm cursor-pointer">
                          风险管理
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-core"
                          checked={activeFilters.includes("core")}
                          onCheckedChange={() => handleFilterToggle("core")}
                        />
                        <label htmlFor="filter-core" className="text-sm cursor-pointer">
                          核心数据
                        </label>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <h4 className="text-sm font-medium">更新时间</h4>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-today"
                          checked={activeFilters.includes("today")}
                          onCheckedChange={() => handleFilterToggle("today")}
                        />
                        <label htmlFor="filter-today" className="text-sm flex items-center cursor-pointer">
                          <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                          今天
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-week"
                          checked={activeFilters.includes("week")}
                          onCheckedChange={() => handleFilterToggle("week")}
                        />
                        <label htmlFor="filter-week" className="text-sm flex items-center cursor-pointer">
                          <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                          本周
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-month"
                          checked={activeFilters.includes("month")}
                          onCheckedChange={() => handleFilterToggle("month")}
                        />
                        <label htmlFor="filter-month" className="text-sm flex items-center cursor-pointer">
                          <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                          本月
                        </label>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </div>

            {/* 搜索结果列表 */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-medium">搜索结果</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      找到 {searchResults.length} 条与 "{searchQuery || "所有资源"}" 相关的数据资源
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">排序:</span>
                    <Select
                      value={sortOption}
                      onValueChange={(value) => {
                        setSortOption(value)
                        // 排序不需要重新搜索，只需要重新排序当前结果
                      }}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="排序方式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">相关度</SelectItem>
                        <SelectItem value="name_asc">名称 (A-Z)</SelectItem>
                        <SelectItem value="name_desc">名称 (Z-A)</SelectItem>
                        <SelectItem value="update_time">更新时间</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 活跃筛选条件展示 */}
                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeFilters.map((filter) => (
                      <Badge key={filter} variant="secondary" className="px-2 py-1">
                        {filter}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => handleFilterToggle(filter)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
                      清除全部
                    </Button>
                  </div>
                )}

                {/* 结果列表 */}
                {isSearching ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                      <p className="mt-4 text-gray-500">正在搜索中...</p>
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {getSortedResults().map((result) => (
                      <Card key={result.id} className="hover:border-blue-300 transition-colors">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(result.type)}
                              <Badge variant="outline" className="text-xs font-normal">
                                {result.type === "table"
                                  ? "数据表"
                                  : result.type === "metric"
                                    ? "指标"
                                    : result.type === "tag"
                                      ? "标签"
                                      : "报表"}
                              </Badge>
                              {sortOption === "relevance" && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                  相关度: {result.relevance}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <h3 className="text-lg font-medium text-blue-900 mb-1">{result.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{result.description}</p>

                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <span className="font-medium mr-2">所属部门:</span>
                            <span>{result.department}</span>
                          </div>

                          <div className="flex items-center text-xs text-gray-500 mb-3">
                            <span className="font-medium mr-2">责任人:</span>
                            <span>{result.owner}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {result.attributes.map((attr, index) => (
                              <div key={index} className="bg-gray-50 p-1.5 rounded text-xs">
                                <div className="font-medium text-gray-700">{attr.label}</div>
                                <div className="text-gray-600">{attr.value}</div>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {result.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs font-normal">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0 flex justify-between">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedResource(result.id)}>
                            查看详情
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="text-center">
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">未找到匹配的结果</h3>
                      <p className="text-gray-500 mb-4">尝试使用不同的关键词或减少筛选条件</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("")
                          setActiveFilters([])
                          resetAdvancedFilters()
                          performSearch()
                        }}
                      >
                        清除所有条件
                      </Button>
                    </div>
                  </div>
                )}

                {/* 分页 */}
                {searchResults.length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-500">
                      显示 1-{searchResults.length} 条，共 {searchResults.length} 条
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        上一页
                      </Button>
                      <Button variant="outline" size="sm" className="bg-blue-50">
                        1
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        下一页
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
    </div>
  )
}
