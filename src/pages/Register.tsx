import { useState, type SetStateAction } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../components/ui/alert-dialog";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await api.register({ name, email, password });
      setSuccess(true);

      // após 2 segundos redireciona para login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Erro ao cadastrar usuário");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            Criar sua conta
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Preencha os dados para começar
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setName(e.target.value)}
                required
                className="h-12 px-4 border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)}
                required
                className="h-12 px-4 border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)}
                required
                className="h-12 px-4 border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl transition-all"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Cadastrando...
                </div>
              ) : (
                "Cadastrar"
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-center text-gray-600 mt-4">
              Já tem uma conta?{" "} 
              <Link to={"/login"} className="text-indigo-600 hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card de sucesso */}
      <AlertDialog open={success}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cadastro realizado!</AlertDialogTitle>
            <AlertDialogDescription>
              Seu cadastro foi concluído com sucesso.  
              Você será redirecionado para a tela de login em instantes.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}