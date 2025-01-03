"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/services/api/vehicleApi/administrator/";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useCookies } from "react-cookie";
import Link from "next/link";

export default function Home () {
    const [hasError, setHasError] = useState<boolean>(false);
    const [, setCookies] = useCookies(["token"]);

    const formSchema = z.object({
        email: z.string().email("Por favor, digite um e-mail válido."),
        password: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const handleSubmit = async (data: { email: string, password: string }) => {
        try {
            const result = await login(data.email, data.password);
            if ("token" in result.data && result.data) {
                setCookies("token", result.data.token);
                localStorage.setItem("email", result.data.email);
                location.href = "/home"
            }
        } catch {
            setHasError(true);
        } finally {
            setTimeout(() => setHasError(false), 4000);
        }
    };

    return (
        <div className="w-96 h-96 mx-auto my-40 flex flex-col gap-y-20"> 
            <h1 className="text-center text-2xl text-black font-bold">IVehicle</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                    <FormField 
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail: </FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite seu e-mail" {...field} />
                                </FormControl>
                                <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField 
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha: </FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Entrar</Button>
                </form>
            </Form>
            {hasError && (
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Ops!</AlertTitle>
                    <AlertDescription>
                        E-mail ou senha incorretos.
                    </AlertDescription>
                </Alert>
            )}
            <p>Não possui uma conta? Clique <Link href="/register"><span className="text-emerald-500 cursor-pointer">aqui</span></Link> e crie agora!</p>
        </div>
    );
}