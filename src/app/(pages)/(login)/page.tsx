"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/services/api/vehicleApi";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useCookies } from "react-cookie";

export  const Login = () => {
    const [hasError, setHasError] = useState<boolean>(false);
    const [cookies, setCookies] = useCookies(["token"]);

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
               return setCookies("token", result.data.token);
            }
        } catch (error) {
            setHasError(true);
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
        </div>
    );
}