/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { Plus, CheckCircle2, Circle, Trash2, Calendar, Target } from "lucide-react"

interface Todo {
  id: number
  title: string
  completed: boolean
}

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const token = localStorage.getItem("token")

  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:3000/todos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setTodos(data)
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return
    
    setIsLoading(true)
    try {
      await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTodo }),
      })
      setNewTodo("")
      fetchTodos()
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTodo = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/todos/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchTodos()
    } catch (error) {
      console.error("Erro ao alterar tarefa:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const completedTodos = todos.filter(todo => todo.completed).length
  const totalTodos = todos.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      {/* Header com estatísticas */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Minhas Tarefas</h1>
          <p className="text-gray-600">Organize seu dia e seja mais produtivo</p>
        </div>
        
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalTodos}</p>
              <p className="text-blue-100 text-sm">Total de Tarefas</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{completedTodos}</p>
              <p className="text-green-100 text-sm">Concluídas</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <Circle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalTodos - completedTodos}</p>
              <p className="text-orange-100 text-sm">Pendentes</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Card principal */}
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-800">Lista de Tarefas</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Input para nova tarefa */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  placeholder="Adicione uma nova tarefa..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-4 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all duration-300"
                />
              </div>
              <Button 
                onClick={addTodo}
                disabled={!newTodo.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Lista de tarefas */}
            <div className="space-y-3">
              {todos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma tarefa ainda</h3>
                  <p className="text-gray-500">Adicione sua primeira tarefa acima para começar!</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`group flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                      todo.completed 
                        ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-indigo-200'
                    }`}
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="w-5 h-5 border-2"
                    />
                    
                    <div className="flex-1">
                      <span 
                        className={`text-lg transition-all duration-300 ${
                          todo.completed 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-800'
                        }`}
                      >
                        {todo.title}
                      </span>
                    </div>

                    {todo.completed && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Concluída</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Resumo de progresso */}
            {totalTodos > 0 && (
              <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progresso</span>
                  <span className="text-sm text-gray-600">
                    {completedTodos} de {totalTodos} tarefas
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}