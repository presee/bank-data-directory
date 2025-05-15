"use client"

import { useState } from "react"
import { BarChart3, Database, FileText, Heart, Info, LineChart, Lock, Share2, Tag, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ResourceDetailProps {
  resourceId: string
  onViewLineage: () => VideoFacingModeEnum
}

export function ResourceDetail({ resourceId, onViewLineage }: ResourceDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  // 模拟根据resourceId获取资源详情
  const getResourceDetails = () => {
    // 这里应该是从API获取数据，这里模拟一些数据
    const resources: Record<string, any> = {
      customer_basic_info: {
        id: "customer_basic_info",
        name: "客户基本信息表",
        englishName: "CUSTOMER_BASIC_INFO",
        type: "table",
        description: "包含客户的基础信息，如姓名、证件号码、联系方式等",
        department: "零售部",
        owner: "王明",
        updateFrequency: "日更新",
        dataVolume: "1200万",
        fieldCount: 42,
        qualityScore: 96,
        accessCount: 1240,
        referenceCount: 28,
        tags: ["客户信息", "核心数据"],
        permission: "未授权",
        fields: [
          { name: "CUSTOMER_ID", type: "VARCHAR(32)", description: "客户唯一标识", primaryKey: true },
          { name: "CUSTOMER_NAME", type: "VARCHAR(64)", description: "客户姓名" },
          { name: "ID_TYPE", type: "VARCHAR(2)", description: "证件类型" },
          { name: "ID_NUMBER", type: "VARCHAR(32)", description: "证件号码" },
          { name: "GENDER", type: "VARCHAR(1)", description: "性别" },
          { name: "BIRTH_DATE", type: "DATE", description: "出生日期" },
          { name: "MOBILE_PHONE", type: "VARCHAR(16)", description: "手机号码" },
          { name: "EMAIL", type: "VARCHAR(64)", description: "电子邮箱" },
          { name: "ADDRESS", type: "VARCHAR(256)", description: "联系地址" },
          { name: "CUSTOMER_STATUS", type: "VARCHAR(2)", description: "客户状态" },
        ],
      },
      transaction_details: {
        id: "transaction_details",
        name: "交易流水明细表",
        englishName: "TRANSACTION_DETAILS",
        type: "table",
        description: "记录所有客户交易的详细信息，包括交易金额、时间、类型等",
        department: "交易部",
        owner: "李华",
        updateFrequency: "实时",
        dataVolume: "5亿+",
        fieldCount: 38,
        qualityScore: 98,
        accessCount: 2150,
        referenceCount: 42,
        tags: ["交易数据", "高频访问"],
        permission: "已授权",
        fields: [
          { name: "TRANSACTION_ID", type: "VARCHAR(32)", description: "交易流水号", primaryKey: true },
          { name: "CUSTOMER_ID", type: "VARCHAR(32)", description: "客户唯一标识" },
          { name: "TRANSACTION_DATE", type: "TIMESTAMP", description: "交易时间" },
          { name: "TRANSACTION_TYPE", type: "VARCHAR(4)", description: "交易类型" },
          { name: "TRANSACTION_AMOUNT", type: "DECIMAL(18,2)", description: "交易金额" },
          { name: "CURRENCY", type: "VARCHAR(3)", description: "币种" },
          { name: "CHANNEL_ID", type: "VARCHAR(2)", description: "交易渠道" },
          { name: "MERCHANT_ID", type: "VARCHAR(32)", description: "商户号" },
          { name: "MERCHANT_NAME", type: "VARCHAR(128)", description: "商户名称" },
          { name: "STATUS", type: "VARCHAR(2)", description: "交易状态" },
        ],
      },
      customer_risk_score: {
        id: "customer_risk_score",
        name: "客户风险评分指标",
        englishName: "CUSTOMER_RISK_SCORE",
        type: "metric",
        description: "基于客户行为和历史记录计算的风险评分指标",
        department: "风险管理部",
        owner: "赵静",
        updateFrequency: "日更新",
        dataSource: "3个表",
        coverage: "98%",
        qualityScore: 94,
        accessCount: 980,
        referenceCount: 15,
        tags: ["风险管理", "评分指标"],
        permission: "未授权",
        formula: "基于客户交易行为、信用历史、资产负债等多维度特征，通过机器学习模型计算得出的0-100分值",
        dimensions: ["客户类型", "年龄段", "地域", "产品持有情况"],
      },
    }

    return resources[resourceId] || resources["customer_basic_info"]
  }

  const resource = getResourceDetails()

  const getTypeIcon = () => {
    switch (resource.type) {
      case "table":
        return <Database className="h-6 w-6 text-blue-600" />
      case "metric":
        return <BarChart3 className="h-6 w-6 text-green-600" />
      case "tag":
        return <Tag className="h-6 w-6 text-purple-600" />
      case "report":
        return <FileText className="h-6 w-6 text-orange-600" />
      case "field":
        return <Info className="h-6 w-6 text-gray-600" />
      default:
        return <Database className="h-6 w-6 text-blue-600" />
    }
  }

  const getTypeLabel = () => {
    switch (resource.type) {
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
    <div>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center">
          {getTypeIcon()}
          <div className="ml-3">
            <h2 className="text-2xl font-semibold text-blue-900">{resource.name}</h2>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2">
                {getTypeLabel()}
              </Badge>
              {resource.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="mr-2">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            <span className="sr-only">收藏</span>
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">分享</span>
          </Button>
          <Button variant="outline" onClick={onViewLineage}>
            查看血缘图
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="basic">基础信息</TabsTrigger>
          <TabsTrigger value="technical">技术属性</TabsTrigger>
          <TabsTrigger value="business">业务属性</TabsTrigger>
          <TabsTrigger value="management">管理属性</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">基本信息</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">中文名称</div>
                  <div className="col-span-2 text-sm">{resource.name}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">英文名称</div>
                  <div className="col-span-2 text-sm">{resource.englishName}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">资源类型</div>
                  <div className="col-span-2 text-sm">{getTypeLabel()}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">所属部门</div>
                  <div className="col-span-2 text-sm">{resource.department}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">责任人</div>
                  <div className="col-span-2 text-sm">{resource.owner}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">更新频率</div>
                  <div className="col-span-2 text-sm">{resource.updateFrequency}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">业务描述</div>
                  <div className="col-span-2 text-sm">{resource.description}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">数据质量</h3>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">总体质量评分</span>
                  <span className="text-lg font-semibold text-blue-700">{resource.qualityScore}/100</span>
                </div>
                <Progress value={resource.qualityScore} className="h-2 mb-4" />

                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-sm font-medium text-gray-500">完整性</div>
                    <div className="col-span-2">
                      <Progress value={98} className="h-1.5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-sm font-medium text-gray-500">准确性</div>
                    <div className="col-span-2">
                      <Progress value={95} className="h-1.5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-sm font-medium text-gray-500">一致性</div>
                    <div className="col-span-2">
                      <Progress value={92} className="h-1.5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-sm font-medium text-gray-500">及时性</div>
                    <div className="col-span-2">
                      <Progress value={97} className="h-1.5" />
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-6 mb-4">使用热度</h3>
              <div className="flex space-x-4">
                <div className="flex-1 p-3 border rounded-lg bg-gray-50 flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">访问量</div>
                    <div className="text-lg font-semibold">{resource.accessCount}</div>
                  </div>
                </div>
                <div className="flex-1 p-3 border rounded-lg bg-gray-50 flex items-center">
                  <LineChart className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">引用次数</div>
                    <div className="text-lg font-semibold">{resource.referenceCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="mt-6">
          {resource.type === "table" && (
            <div>
              <h3 className="text-lg font-medium mb-4">表结构信息</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">字段名</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">数据类型</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">描述</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">主键</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resource.fields.map((field: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-2 text-sm font-medium">{field.name}</td>
                        <td className="px-4 py-2 text-sm">{field.type}</td>
                        <td className="px-4 py-2 text-sm">{field.description}</td>
                        <td className="px-4 py-2 text-sm">
                          {field.primaryKey && (
                            <Badge variant="outline" className="bg-blue-50">
                              主键
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">技术属性</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="text-sm font-medium text-gray-500 mb-1">字段数量</div>
                    <div className="text-xl font-semibold">{resource.fieldCount}</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="text-sm font-medium text-gray-500 mb-1">数据量</div>
                    <div className="text-xl font-semibold">{resource.dataVolume}</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="text-sm font-medium text-gray-500 mb-1">更新频率</div>
                    <div className="text-xl font-semibold">{resource.updateFrequency}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {resource.type === "metric" && (
            <div>
              <h3 className="text-lg font-medium mb-4">指标定义</h3>
              <div className="p-4 border rounded-lg bg-gray-50 mb-6">
                <div className="text-sm">{resource.formula}</div>
              </div>

              <h3 className="text-lg font-medium mb-4">数据来源</h3>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="text-sm font-medium text-gray-500 mb-1">来源表数量</div>
                  <div className="text-xl font-semibold">{resource.dataSource}</div>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="text-sm font-medium text-gray-500 mb-1">覆盖率</div>
                  <div className="text-xl font-semibold">{resource.coverage}</div>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="text-sm font-medium text-gray-500 mb-1">更新频率</div>
                  <div className="text-xl font-semibold">{resource.updateFrequency}</div>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-4">维度信息</h3>
              <div className="flex flex-wrap gap-2">
                {resource.dimensions.map((dim: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-sm py-1">
                    {dim}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button variant="outline" onClick={onViewLineage}>
              查看血缘关系图
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">业务定义</h3>
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-sm">{resource.description}</p>
              </div>

              <h3 className="text-lg font-medium mt-6 mb-4">业务标签</h3>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h3 className="text-lg font-medium mt-6 mb-4">应用场景</h3>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="font-medium">客户画像分析</div>
                  <div className="text-sm text-gray-600 mt-1">用于构建客户360度视图，支持精准营销</div>
                </div>
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="font-medium">风险评估模型</div>
                  <div className="text-sm text-gray-600 mt-1">作为风险评分模型的输入特征</div>
                </div>
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="font-medium">监管报送</div>
                  <div className="text-sm text-gray-600 mt-1">用于生成监管要求的客户信息报表</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">关联指标</h3>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg bg-gray-50 flex items-center">
                  <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <div className="font-medium">客户活跃度</div>
                    <div className="text-sm text-gray-600">衡量客户交易和互动频率的综合指标</div>
                  </div>
                </div>
                <div className="p-3 border rounded-lg bg-gray-50 flex items-center">
                  <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <div className="font-medium">客户价值评分</div>
                    <div className="text-sm text-gray-600">基于客户资产、交易等维度的价值评估</div>
                  </div>
                </div>
                <div className="p-3 border rounded-lg bg-gray-50 flex items-center">
                  <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <div className="font-medium">流失风险指数</div>
                    <div className="text-sm text-gray-600">预测客户流失可能性的指标</div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-6 mb-4">关联标签</h3>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg bg-gray-50 flex items-center">
                  <Tag className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <div className="font-medium">高净值客户</div>
                    <div className="text-sm text-gray-600">资产规模超过100万的客户</div>
                  </div>
                </div>
                <div className="p-3 border rounded-lg bg-gray-50 flex items-center">
                  <Tag className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <div className="font-medium">信用卡活跃用户</div>
                    <div className="text-sm text-gray-600">近3个月有信用卡消费的客户</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="management" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">管理信息</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">所属部门</div>
                  <div className="col-span-2 text-sm">{resource.department}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">业务责任人</div>
                  <div className="col-span-2 text-sm">{resource.owner}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">技术责任人</div>
                  <div className="col-span-2 text-sm">张伟</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">创建时间</div>
                  <div className="col-span-2 text-sm">2022-06-15</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">最后更新</div>
                  <div className="col-span-2 text-sm">2023-09-28</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">生命周期状态</div>
                  <div className="col-span-2 text-sm">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      生产环境
                    </Badge>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-6 mb-4">数据安全等级</h3>
              <div className="p-4 border rounded-lg bg-gray-50">
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 mb-2">
                  二级敏感
                </Badge>
                <p className="text-sm text-gray-600">包含客户个人信息，需要进行脱敏处理，访问需要二级审批</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
