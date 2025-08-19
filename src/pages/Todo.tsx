/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { Plus, CheckCircle2, Circle, Trash2, Calendar, Target, LogOut, User } from "lucide-react"
import { api } from "../utils/api" // ← IMPORTAR O API CLIENT

interface Todo {
  id: number
  title: string
  completed: boolean
  userId: number
  createdAt: string
}

interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

export default function Todo({ onLogout }: { onLogout?: () => void }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const handleLogout = () => {
    console.log("👋 Fazendo logout...")
    localStorage.removeItem("token")
    if (onLogout) {
      onLogout()
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      console.log("🔄 Carregando dados iniciais...")
      
      // Carregar perfil do usuário e todos em paralelo
      const [userProfile, todosData] = await Promise.all([
        api.getProfile(),
        api.getTodos()
      ])
      
      setUser(userProfile)
      setTodos(todosData)
      console.log("✅ Dados carregados:", { user: userProfile, todos: todosData })
      
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error)
      // O api.ts já fez logout automático se token expirou
    } finally {
      setInitialLoading(false)
    }
  }

  const fetchTodos = async () => {
    try {
      const data = await api.getTodos()
      setTodos(data)
    } catch (error) {
      console.error("❌ Erro ao buscar tarefas:", error)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return
    
    setIsLoading(true)
    try {
      console.log("➕ Adicionando todo:", newTodo)
      const todo = await api.createTodo({ title: newTodo.trim() })
      setTodos(prev => [todo, ...prev])
      setNewTodo("")
    } catch (error) {
      console.error("❌ Erro ao adicionar tarefa:", error)
      alert("Erro ao adicionar tarefa")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      console.log(`🔄 Alternando todo ${id} para ${!todo.completed}`)
      await api.updateTodo(id, { completed: !todo.completed })
      setTodos(prev => 
        prev.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      )
    } catch (error) {
      console.error("❌ Erro ao alterar tarefa:", error)
      alert("Erro ao alterar tarefa")
    }
  }

  const deleteTodo = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return

    try {
      console.log("🗑️ Deletando todo:", id)
      await api.deleteTodo(id)
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error("❌ Erro ao deletar tarefa:", error)
      alert("Erro ao deletar tarefa")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  // Loading inicial
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando suas tarefas...</p>
        </div>
      </div>
    )
  }

  const completedTodos = todos.filter(todo => todo.completed).length
  const totalTodos = todos.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      {/* Header com informações do usuário */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Minhas Tarefas</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span>Olá, {user?.name || 'Usuário'}!</span>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
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

                    <div className="flex items-center gap-2">
                      {todo.completed && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Concluída</span>
                        </div>
                      )}
                      
                      {/* Botão de deletar */}
                      <Button
                        onClick={() => deleteTodo(todo.id)}
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
                    style={{ width: `${totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0}%` }}
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