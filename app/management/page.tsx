"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, Bell, ChevronDown, Database, FileText, Gauge, Lock, Plus, Search, Tag } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

// 资源管理部分
function ResourceManagementSection({
  resources,
  renderResourceIcon,
  onAddResource,
  onEditResource,
  onDeleteResource,
}: {
  resources: any[]
  renderResourceIcon: (resource: any) => React.ReactNode
  onAddResource: () => void
  onEditResource: (resource: any) => void
  onDeleteResource: (resource: any) => void
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">资源管理</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="搜索资源..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute top-2.5 right-3 h-5 w-5 text-gray-500" />
          </div>
          <Button onClick={onAddResource}>
            <Plus className="mr-2 h-4 w-4" />
            添加资源
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">部门</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">访问量</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredResources.map((resource) => (
              <tr key={resource.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {renderResourceIcon(resource)}
                    <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{resource.type}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{resource.department}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{resource.visits}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Button variant="ghost" size="sm" onClick={() => onEditResource(resource)}>
                    编辑
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => onDeleteResource(resource)}>
                    删除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function ManagementPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [showResourceDialog, setShowResourceDialog] = useState(false)
  const [showEditResourceDialog, setShowEditResourceDialog] = useState(false)
  const [showDeleteResourceDialog, setShowDeleteResourceDialog] = useState(false)
  const [selectedResource, setSelectedResource] = useState<any>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmMessage, setConfirmMessage] = useState("")
  const { toast } = useToast()

  // 模拟资源数据
  const [resources, setResources] = useState([
    {
      id: 1,
      name: "客户基本信息表",
      description: "包含客户的基础信息",
      type: "数据表",
      department: "零售部",
      owner: "王明",
      visits: 1245,
      quality: 96,
      updateTime: "2023-12-10",
      icon: "database",
      iconColor: "blue",
      tags: ["客户", "基础信息", "核心数据"],
      accessLevel: "受限",
      dataSource: "核心系统",
      updateFrequency: "每日",
      fieldCount: 28,
    },
    {
      id: 2,
      name: "交易流水明细表",
      description: "记录所有客户交易的详细信息",
      type: "数据表",
      department: "交易部",
      owner: "李华",
      visits: 1128,
      quality: 98,
      updateTime: "2023-12-12",
      icon: "database",
      iconColor: "blue",
      tags: ["交易", "流水", "核心数据"],
      accessLevel: "受限",
      dataSource: "交易系统",
      updateFrequency: "实时",
      fieldCount: 42,
    },
    {
      id: 3,
      name: "客户风险评分指标",
      description: "基于客户行为和历史记录计算的风险评分",
      type: "指标",
      department: "风险管理部",
      owner: "赵静",
      visits: 986,
      quality: 94,
      updateTime: "2023-12-08",
      icon: "barChart3",
      iconColor: "green",
      tags: ["风险", "评分", "指标"],
      accessLevel: "内部",
      dataSource: "风控系统",
      updateFrequency: "每周",
      fieldCount: 15,
    },
    {
      id: 4,
      name: "高净值客户标签",
      description: "识别银行高净值客户群体的标签",
      type: "标签",
      department: "数据分析部",
      owner: "刘芳",
      visits: 876,
      quality: 92,
      updateTime: "2023-12-05",
      icon: "tag",
      iconColor: "purple",
      tags: ["客户", "标签", "高净值"],
      accessLevel: "内部",
      dataSource: "标签系统",
      updateFrequency: "每月",
      fieldCount: 8,
    },
    {
      id: 5,
      name: "客户价值分析报表",
      description: "分析客户价值和贡献度的综合报表",
      type: "报表",
      department: "数据分析部",
      owner: "刘芳",
      visits: 752,
      quality: 90,
      updateTime: "2023-12-01",
      icon: "fileText",
      iconColor: "orange",
      tags: ["客户", "价值", "分析", "报表"],
      accessLevel: "公开",
      dataSource: "BI系统",
      updateFrequency: "每月",
      fieldCount: 12,
    },
  ])

  // 模拟仪表盘数据
  const [dashboardData, setDashboardData] = useState({
    totalResources: 1284,
    resourceTypes: [
      { type: "数据表", count: 615, percentage: 48, color: "blue" },
      { type: "指标", count: 308, percentage: 24, color: "green" },
      { type: "标签", count: 231, percentage: 18, color: "purple" },
      { type: "报表", count: 130, percentage: 10, color: "orange" },
    ],
    activeUsers: 856,
    topActiveUsers: [
      { name: "张丽", department: "数据分析部", avatar: "ZL", avatarColor: "blue", visits: 128 },
      { name: "王明", department: "零售部", avatar: "WM", avatarColor: "green", visits: 112 },
      { name: "李华", department: "交易部", avatar: "LH", avatarColor: "purple", visits: 98 },
      { name: "赵静", department: "风险管理部", avatar: "ZJ", avatarColor: "orange", visits: 87 },
      { name: "刘芳", department: "数据分析部", avatar: "LF", avatarColor: "red", visits: 76 },
    ],
    topRequestUsers: [
      { name: "张伟", department: "信贷部", avatar: "ZW", avatarColor: "blue", requests: 12 },
      { name: "陈亮", department: "营销部", avatar: "CL", avatarColor: "purple", requests: 9 },
      { name: "王静", department: "产品部", avatar: "WJ", avatarColor: "orange", requests: 7 },
      { name: "刘明", department: "风险管理部", avatar: "LM", avatarColor: "red", requests: 6 },
      { name: "李华", department: "交易部", avatar: "LH", avatarColor: "green", requests: 5 },
    ],
    accessTrend: [
      { date: "12-01", visits: 420 },
      { date: "12-02", visits: 380 },
      { date: "12-03", visits: 450 },
      { date: "12-04", visits: 520 },
      { date: "12-05", visits: 480 },
      { date: "12-06", visits: 390 },
      { date: "12-07", visits: 430 },
      { date: "12-08", visits: 500 },
      { date: "12-09", visits: 580 },
      { date: "12-10", visits: 540 },
      { date: "12-11", visits: 460 },
      { date: "12-12", visits: 510 },
      { date: "12-13", visits: 590 },
      { date: "12-14", visits: 620 },
      { date: "12-15", visits: 570 },
    ],
  })

  // 处理资源添加
  const handleAddResource = () => {
    // 模拟添加资源
    toast({
      title: "资源添加成功",
      description: "新资源已成功添加到系统",
    })
    setShowResourceDialog(false)
  }

  // 处理资源编辑
  const handleEditResource = (resource: any) => {
    setSelectedResource(resource)
    setShowEditResourceDialog(true)
  }

  // 保存资源编辑
  const handleSaveResourceEdit = () => {
    // 模拟保存资源编辑
    toast({
      title: "资源信息已更新",
      description: "资源信息已成功更新",
    })
    setShowEditResourceDialog(false)
  }

  // 处理资源删除
  const handleDeleteResource = (resource: any) => {
    setSelectedResource(resource)
    setConfirmMessage(`确定要删除资源 "${resource.name}" 吗？此操作无法撤销。`)
    setConfirmAction(() => () => {
      // 模拟删除资源
      setResources(resources.filter((r) => r.id !== resource.id))
      toast({
        title: "资源已删除",
        description: `资源 "${resource.name}" 已成功从系统中删除`,
      })
      setShowConfirmDialog(false)
    })
    setShowConfirmDialog(true)
  }

  // 渲染资源图标
  const renderResourceIcon = (resource: any) => {
    switch (resource.icon) {
      case "database":
        return <Database className={`h-5 w-5 text-${resource.iconColor}-600 shrink-0`} />
      case "barChart3":
        return <BarChart3 className={`h-5 w-5 text-${resource.iconColor}-600 shrink-0`} />
      case "tag":
        return <Tag className={`h-5 w-5 text-${resource.iconColor}-600 shrink-0`} />
      case "fileText":
        return <FileText className={`h-5 w-5 text-${resource.iconColor}-600 shrink-0`} />
      default:
        return <Database className={`h-5 w-5 text-${resource.iconColor}-600 shrink-0`} />
    }
  }

  // 渲染不同的管理部分
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection dashboardData={dashboardData} />
      case "resources":
        return (
          <ResourceManagementSection
            resources={resources}
            renderResourceIcon={renderResourceIcon}
            onAddResource={() => setShowResourceDialog(true)}
            onEditResource={handleEditResource}
            onDeleteResource={handleDeleteResource}
          />
        )
      default:
        return <DashboardSection dashboardData={dashboardData} />
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
              <li
                className="text-gray-600 hover:text-blue-700 cursor-pointer"
                onClick={() => router.push("/favorites")}
              >
                我的收藏
              </li>
              <li className="text-blue-900 font-medium">管理中心</li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                      3
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>3条未读通知</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarFallback className="bg-blue-100 text-blue-700">ZL</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>张丽 (系统管理员)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          {/* 左侧管理导航栏 */}
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center justify-between px-4 py-2">
                <h2 className="text-lg font-semibold text-blue-900">管理中心</h2>
              </div>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeSection === "dashboard"}
                    onClick={() => setActiveSection("dashboard")}
                  >
                    <Gauge className="h-5 w-5" />
                    <span>仪表盘</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeSection === "resources"}
                    onClick={() => setActiveSection("resources")}
                  >
                    <Database className="h-5 w-5" />
                    <span>资源管理</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          {/* 主内容区 */}
          <main className="flex-1 overflow-y-auto bg-gray-100 p-6">{renderContent()}</main>
        </SidebarProvider>
      </div>

      {/* 添加资源弹窗 */}
      <Dialog open={showResourceDialog} onOpenChange={setShowResourceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加新资源</DialogTitle>
            <DialogDescription>创建新的数据资源</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource-name" className="text-right text-sm font-medium">
                资源名称
              </Label>
              <Input id="resource-name" placeholder="输入资源名称" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource-type" className="text-right text-sm font-medium">
                资源类型
              </Label>
              <Select>
                <SelectTrigger id="resource-type" className="col-span-3">
                  <SelectValue placeholder="选择资源类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">数据表</SelectItem>
                  <SelectItem value="metric">指标</SelectItem>
                  <SelectItem value="tag">标签</SelectItem>
                  <SelectItem value="report">报表</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource-desc" className="text-right text-sm font-medium">
                资源描述
              </Label>
              <Input id="resource-desc" placeholder="输入资源描述" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource-dept" className="text-right text-sm font-medium">
                所属部门
              </Label>
              <Select>
                <SelectTrigger id="resource-dept" className="col-span-3">
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">零售部</SelectItem>
                  <SelectItem value="risk">风险管理部</SelectItem>
                  <SelectItem value="data">数据分析部</SelectItem>
                  <SelectItem value="it">信息技术部</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource-owner" className="text-right text-sm font-medium">
                责任人
              </Label>
              <Input id="resource-owner" placeholder="输入责任人" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource-tags" className="text-right text-sm font-medium">
                标签
              </Label>
              <Input id="resource-tags" placeholder="输入标签，用逗号分隔" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResourceDialog(false)}>
              取消
            </Button>
            <Button onClick={handleAddResource}>创建资源</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑资源弹窗 */}
      <Dialog open={showEditResourceDialog} onOpenChange={setShowEditResourceDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑资源</DialogTitle>
            <DialogDescription>修改资源信息和配置</DialogDescription>
          </DialogHeader>
          {selectedResource && (
            <div className="space-y-4 py-4">
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">基本信息</TabsTrigger>
                  <TabsTrigger value="metadata">元数据</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right text-sm font-medium">
                      资源名称
                    </Label>
                    <Input id="edit-name" defaultValue={selectedResource.name} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-type" className="text-right text-sm font-medium">
                      资源类型
                    </Label>
                    <Select defaultValue={selectedResource.type}>
                      <SelectTrigger id="edit-type" className="col-span-3">
                        <SelectValue placeholder="选择资源类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="数据表">数据表</SelectItem>
                        <SelectItem value="指标">指标</SelectItem>
                        <SelectItem value="标签">标签</SelectItem>
                        <SelectItem value="报表">报表</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-desc" className="text-right text-sm font-medium">
                      资源描述
                    </Label>
                    <Input id="edit-desc" defaultValue={selectedResource.description} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-dept" className="text-right text-sm font-medium">
                      所属部门
                    </Label>
                    <Select defaultValue={selectedResource.department}>
                      <SelectTrigger id="edit-dept" className="col-span-3">
                        <SelectValue placeholder="选择部门" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="零售部">零售部</SelectItem>
                        <SelectItem value="风险管理部">风险管理部</SelectItem>
                        <SelectItem value="数据分析部">数据分析部</SelectItem>
                        <SelectItem value="交易部">交易部</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-owner" className="text-right text-sm font-medium">
                      责任人
                    </Label>
                    <Input id="edit-owner" defaultValue={selectedResource.owner} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-tags" className="text-right text-sm font-medium">
                      标签
                    </Label>
                    <Input id="edit-tags" defaultValue={selectedResource.tags.join(", ")} className="col-span-3" />
                  </div>
                </TabsContent>
                <TabsContent value="metadata" className="space-y-4 pt-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-source" className="text-right text-sm font-medium">
                      数据源
                    </Label>
                    <Input id="edit-source" defaultValue={selectedResource.dataSource} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-frequency" className="text-right text-sm font-medium">
                      更新频率
                    </Label>
                    <Select defaultValue={selectedResource.updateFrequency}>
                      <SelectTrigger id="edit-frequency" className="col-span-3">
                        <SelectValue placeholder="选择更新频率" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="实时">实时</SelectItem>
                        <SelectItem value="每日">每日</SelectItem>
                        <SelectItem value="每周">每周</SelectItem>
                        <SelectItem value="每月">每月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-fields" className="text-right text-sm font-medium">
                      字段数量
                    </Label>
                    <Input
                      id="edit-fields"
                      type="number"
                      defaultValue={selectedResource.fieldCount.toString()}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-quality" className="text-right text-sm font-medium">
                      质量评分
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Slider defaultValue={[selectedResource.quality]} max={100} step={1} className="w-full" />
                      <span className="w-8 text-center">{selectedResource.quality}</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditResourceDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSaveResourceEdit}>保存更改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 通用确认对话框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>确认操作</DialogTitle>
            <DialogDescription>{confirmMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmAction}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 仪表盘部分
function DashboardSection({ dashboardData }: { dashboardData: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">管理仪表盘</h1>
        <div className="flex items-center space-x-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-36">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">今天</SelectItem>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年度</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            导出报表
          </Button>
        </div>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardDescription>总资源数</CardDescription>
            <CardTitle className="text-2xl">{dashboardData.totalResources}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-600 mb-2">
              <ChevronDown className="h-4 w-4 rotate-180" />
              <span>较上月增长 8.2%</span>
            </div>
            <div className="space-y-2">
              {dashboardData.resourceTypes.map((type: any) => (
                <div key={type.type} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full bg-${type.color}-500`}></div>
                    <span>{type.type}</span>
                  </div>
                  <span>{type.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardDescription>活跃用户数</CardDescription>
            <CardTitle className="text-2xl">{dashboardData.activeUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-600 mb-2">
              <ChevronDown className="h-4 w-4 rotate-180" />
              <span>较上月增长 12.5%</span>
            </div>
            <div className="space-y-2">
              {dashboardData.topActiveUsers.map((user: any, index: number) => (
                <div key={user.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className={`bg-${user.avatarColor}-100 text-${user.avatarColor}-700 text-xs`}>
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                  <span>{user.visits} 次访问</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表和详细信息 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>资源类型分布</CardTitle>
            <CardDescription>按资源类型统计的数量分布</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-60 items-center justify-center">
              <div className="relative h-40 w-40">
                {/* 实际饼图 */}
                <svg className="h-40 w-40" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="white" />

                  {/* 数据表扇区 - 48% */}
                  <path d="M50,50 L90,50 A40,40 0 0,1 50,90 z" fill="#3b82f6" />

                  {/* 指标扇区 - 24% */}
                  <path d="M50,50 L50,90 A40,40 0 0,1 10,50 z" fill="#10b981" />

                  {/* 标签扇区 - 18% */}
                  <path d="M50,50 L10,50 A40,40 0 0,1 26,14 z" fill="#8b5cf6" />

                  {/* 报表扇区 - 10% */}
                  <path d="M50,50 L26,14 A40,40 0 0,1 90,50 z" fill="#f97316" />

                  {/* 中心白色圆 */}
                  <circle cx="50" cy="50" r="20" fill="white" />
                </svg>

                <div className="absolute top-0 left-0 h-40 w-40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold">{dashboardData.totalResources}</div>
                    <div className="text-xs text-gray-500">总资源数</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {dashboardData.resourceTypes.map((type: any) => (
                <div key={type.type} className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full bg-${type.color}-500`}></div>
                  <span className="text-sm">
                    {type.type} ({type.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>资源访问趋势</CardTitle>
            <CardDescription>近15天资源访问量趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full">
              <div className="h-full w-full flex flex-col">
                <div className="flex-1 relative">
                  {/* 实际折线图 */}
                  <svg className="h-full w-full" viewBox="0 0 300 200" preserveAspectRatio="none">
                    {/* 网格线 */}
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="0" y1="100" x2="300" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="0" y1="150" x2="300" y2="150" stroke="#e5e7eb" strokeWidth="1" />

                    {/* Y轴标签 */}
                    <text x="5" y="50" fontSize="10" fill="#6b7280">
                      600
                    </text>
                    <text x="5" y="100" fontSize="10" fill="#6b7280">
                      400
                    </text>
                    <text x="5" y="150" fontSize="10" fill="#6b7280">
                      200
                    </text>

                    {/* 折线 */}
                    <polyline
                      points="20,130 40,140 60,125 80,105 100,115 120,135 140,125 160,90 180,70 200,90 220,60 240,75 260,45 280,55"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />

                    {/* 数据点 */}
                    <circle cx="20" cy="130" r="3" fill="#3b82f6" />
                    <circle cx="40" cy="140" r="3" fill="#3b82f6" />
                    <circle cx="60" cy="125" r="3" fill="#3b82f6" />
                    <circle cx="80" cy="105" r="3" fill="#3b82f6" />
                    <circle cx="100" cy="115" r="3" fill="#3b82f6" />
                    <circle cx="120" cy="135" r="3" fill="#3b82f6" />
                    <circle cx="140" cy="125" r="3" fill="#3b82f6" />
                    <circle cx="160" cy="90" r="3" fill="#3b82f6" />
                    <circle cx="180" cy="70" r="3" fill="#3b82f6" />
                    <circle cx="200" cy="90" r="3" fill="#3b82f6" />
                    <circle cx="220" cy="60" r="3" fill="#3b82f6" />
                    <circle cx="240" cy="75" r="3" fill="#3b82f6" />
                    <circle cx="260" cy="45" r="3" fill="#3b82f6" />
                    <circle cx="280" cy="55" r="3" fill="#3b82f6" />

                    {/* 区域填充 */}
                    <path
                      d="M20,130 40,140 60,125 80,105 100,115 120,135 140,125 160,90 180,70 200,90 220,60 240,75 260,45 280,55 L280,180 L20,180 Z"
                      fill="url(#blue-gradient)"
                      fillOpacity="0.2"
                    />
                    <defs>
                      <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="h-6 flex justify-between text-xs text-gray-500 px-2">
                  {dashboardData.accessTrend
                    .filter((_: any, i: number) => i % 3 === 0)
                    .map((point: any) => (
                      <div key={point.date}>{point.date}</div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 资源相关信息 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 热门资源 */}
        <Card>
          <CardHeader>
            <CardTitle>热门资源</CardTitle>
            <CardDescription>最近30天访问量最高的资源</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">客户基本信息表</span>
                </div>
                <span className="text-sm text-gray-500">1,245次访问</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">交易流水明细表</span>
                </div>
                <span className="text-sm text-gray-500">1,128次访问</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span className="font-medium">客户风险评分指标</span>
                </div>
                <span className="text-sm text-gray-500">986次访问</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">高净值客户标签</span>
                </div>
                <span className="text-sm text-gray-500">876次访问</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              查看全部热门资源
            </Button>
          </CardContent>
        </Card>

        {/* 最近更新 */}
        <Card>
          <CardHeader>
            <CardTitle>最近更新</CardTitle>
            <CardDescription>最近更新的资源</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">交易流水明细表</span>
                </div>
                <span className="text-sm text-gray-500">今天 09:45</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span className="font-medium">客户风险评分指标</span>
                </div>
                <span className="text-sm text-gray-500">昨天 16:30</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">月度业务报表</span>
                </div>
                <span className="text-sm text-gray-500">2天前</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">潜在流失客户标签</span>
                </div>
                <span className="text-sm text-gray-500">3天前</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              查看全部更新记录
            </Button>
          </CardContent>
        </Card>

        {/* 资源分类统计 */}
        <Card>
          <CardHeader>
            <CardTitle>资源分类统计</CardTitle>
            <CardDescription>按业务领域分类的资源数量</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">零售业务</span>
                  <span className="text-sm text-gray-500">428个资源</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: "33%" }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">公司业务</span>
                  <span className="text-sm text-gray-500">356个资源</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "28%" }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">信用卡业务</span>
                  <span className="text-sm text-gray-500">285个资源</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-purple-500" style={{ width: "22%" }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">金融市场</span>
                  <span className="text-sm text-gray-500">215个资源</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-orange-500" style={{ width: "17%" }}></div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              查看详细分类
            </Button>
          </CardContent>
        </Card>

        {/* 资源使用情况 */}
        <Card>
          <CardHeader>
            <CardTitle>资源使用情况</CardTitle>
            <CardDescription>各部门资源使用统计</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-700">数分</span>
                  </div>
                  <span className="font-medium">数据分析部</span>
                </div>
                <span className="text-sm text-gray-500">2,845次访问</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-green-700">风控</span>
                  </div>
                  <span className="font-medium">风险管理部</span>
                </div>
                <span className="text-sm text-gray-500">1,932次访问</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-700">零售</span>
                  </div>
                  <span className="font-medium">零售业务部</span>
                </div>
                <span className="text-sm text-gray-500">1,756次访问</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-orange-700">营销</span>
                  </div>
                  <span className="font-medium">营销策划部</span>
                </div>
                <span className="text-sm text-gray-500">1,245次访问</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              查看全部部门
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
