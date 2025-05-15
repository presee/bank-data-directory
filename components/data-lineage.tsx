"use client"

import { useRef, useState } from "react"
import { Database, FileText, Server, Settings } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DataLineageProps {
  resourceId: string
}

export function DataLineage({ resourceId }: DataLineageProps) {
  const [zoomLevel, setZoomLevel] = useState(100)
  const [viewMode, setViewMode] = useState<"full" | "upstream" | "downstream">("full")
  const canvasRef = useRef<HTMLDivElement>(null)

  // 模拟根据resourceId获取血缘关系数据
  const getLineageData = () => {
    // 这里应该是从API获取数据，这里模拟一些数据
    return {
      nodes: [
        // 上游系统
        { id: "sys1", type: "system", name: "核心系统", level: 1, position: 1 },
        { id: "sys2", type: "system", name: "信贷系统", level: 1, position: 2 },

        // 上游数据表
        { id: "table1", type: "table", name: "客户信息主表", level: 2, position: 1 },
        { id: "table2", type: "table", name: "证件信息表", level: 2, position: 2 },
        { id: "table3", type: "table", name: "联系方式表", level: 2, position: 3 },

        // 中间处理
        { id: "etl1", type: "etl", name: "客户数据整合", level: 3, position: 1 },
        { id: "etl2", type: "etl", name: "数据清洗转换", level: 3, position: 2 },

        // 目标表（当前资源）
        { id: "current", type: "table", name: "客户基本信息表", level: 4, position: 1, isCurrent: true },

        // 下游应用
        { id: "app1", type: "application", name: "客户画像系统", level: 5, position: 1 },
        { id: "app2", type: "application", name: "风险评估系统", level: 5, position: 2 },
        { id: "app3", type: "application", name: "营销推荐系统", level: 5, position: 3 },

        // 下游报表
        { id: "report1", type: "report", name: "客户分析报表", level: 6, position: 1 },
        { id: "report2", type: "report", name: "营销效果报表", level: 6, position: 2 },
      ],
      edges: [
        { from: "sys1", to: "table1" },
        { from: "sys1", to: "table2" },
        { from: "sys2", to: "table3" },

        { from: "table1", to: "etl1" },
        { from: "table2", to: "etl1" },
        { from: "table3", to: "etl1" },

        { from: "etl1", to: "etl2" },
        { from: "etl2", to: "current" },

        { from: "current", to: "app1" },
        { from: "current", to: "app2" },
        { from: "current", to: "app3" },

        { from: "app1", to: "report1" },
        { from: "app2", to: "report1" },
        { from: "app3", to: "report2" },
      ],
    }
  }

  const lineageData = getLineageData()

  // 根据视图模式过滤节点和边
  const getFilteredData = () => {
    if (viewMode === "full") {
      return lineageData
    }

    const currentNodeId = "current"
    let filteredNodes = []
    let filteredEdges = []

    if (viewMode === "upstream") {
      // 获取所有上游节点
      const upstreamNodeIds = new Set<string>()
      const processUpstream = (nodeId: string) => {
        lineageData.edges.forEach((edge) => {
          if (edge.to === nodeId) {
            upstreamNodeIds.add(edge.from)
            processUpstream(edge.from)
          }
        })
      }

      upstreamNodeIds.add(currentNodeId)
      processUpstream(currentNodeId)

      filteredNodes = lineageData.nodes.filter((node) => upstreamNodeIds.has(node.id))
      filteredEdges = lineageData.edges.filter((edge) => upstreamNodeIds.has(edge.from) && upstreamNodeIds.has(edge.to))
    } else if (viewMode === "downstream") {
      // 获取所有下游节点
      const downstreamNodeIds = new Set<string>()
      const processDownstream = (nodeId: string) => {
        lineageData.edges.forEach((edge) => {
          if (edge.from === nodeId) {
            downstreamNodeIds.add(edge.to)
            processDownstream(edge.to)
          }
        })
      }

      downstreamNodeIds.add(currentNodeId)
      processDownstream(currentNodeId)

      filteredNodes = lineageData.nodes.filter((node) => downstreamNodeIds.has(node.id))
      filteredEdges = lineageData.edges.filter(
        (edge) => downstreamNodeIds.has(edge.from) && downstreamNodeIds.has(edge.to),
      )
    }

    return { nodes: filteredNodes, edges: filteredEdges }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "system":
        return <Server className="h-5 w-5 text-blue-600" />
      case "table":
        return <Database className="h-5 w-5 text-green-600" />
      case "etl":
        return <Settings className="h-5 w-5 text-orange-600" />
      case "application":
        return <Settings className="h-5 w-5 text-purple-600" />
      case "report":
        return <FileText className="h-5 w-5 text-gray-600" />
      default:
        return <Database className="h-5 w-5" />
    }
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue="full" onValueChange={(value) => setViewMode(value as any)}>
          <TabsList>
            <TabsTrigger value="full">完整血缘</TabsTrigger>
            <TabsTrigger value="upstream">上游血缘</TabsTrigger>
            <TabsTrigger value="downstream">下游血缘</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">缩放:</span>
          <Slider
            value={[zoomLevel]}
            min={50}
            max={150}
            step={10}
            className="w-32"
            onValueChange={(value) => setZoomLevel(value[0])}
          />
          <span className="text-sm w-10">{zoomLevel}%</span>
        </div>
      </div>

      <div ref={canvasRef} className="border rounded-lg bg-gray-50 p-4 overflow-auto" style={{ height: "500px" }}>
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "top left",
            width: "fit-content",
            minWidth: "100%",
            padding: "20px",
          }}
        >
          <div className="flex flex-col items-center">
            {/* 按层级渲染节点和连线 */}
            {Array.from(new Set(getFilteredData().nodes.map((node) => node.level)))
              .sort()
              .map((level) => (
                <div key={level} className="flex justify-center items-center mb-16 relative">
                  <div className="flex space-x-16">
                    {getFilteredData()
                      .nodes.filter((node) => node.level === level)
                      .sort((a, b) => a.position - b.position)
                      .map((node) => (
                        <div
                          key={node.id}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 w-40 h-20 ${
                            node.isCurrent ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            {getNodeIcon(node.type)}
                            <span className="ml-1 text-xs text-gray-500">
                              {node.type === "system"
                                ? "系统"
                                : node.type === "table"
                                  ? "数据表"
                                  : node.type === "etl"
                                    ? "ETL"
                                    : node.type === "application"
                                      ? "应用"
                                      : node.type === "report"
                                        ? "报表"
                                        : ""}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-center">{node.name}</div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}

            {/* 注意：在实际实现中，连线应该使用SVG或Canvas绘制 */}
            <div className="text-center mt-4 text-gray-500 text-sm">
              注：实际血缘关系图将显示节点之间的连线，此处为示意图
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>血缘关系图展示了数据从源系统到目标应用的完整流转路径，帮助理解数据来源和影响范围。</p>
      </div>
    </div>
  )
}
