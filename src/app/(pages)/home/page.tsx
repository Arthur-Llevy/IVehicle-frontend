"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteVehicle, editVehicle, getAllVehicles, createVehicle } from "@/services/api/vehicleApi/vechicle";
import { VehicleType } from "./types";
import { useState, useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCookies } from "react-cookie";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Terminal } from "lucide-react";

export default function Home() {
    const [cookies,, removeCookies] = useCookies(["token"]);
    const [userEmail, setUserEmail] = useState<string | null>("");
    const [vehicles, setVehicles] = useState<VehicleType[]>([]);
    const [isDeleteCardVisible, setIsDeleteCardVisible] = useState<boolean>(false);
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    const [idToDelete, setIdToDelete] = useState<number | null>();
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>("");
    const [submitType, setSubmitType] = useState<"create" | "edit" | null>(null);

    const formSchema = z.object({
        name: z.string().min(3, "O nome precisa ter no mínimo 3 caracteres."),
        mark: z.string().min(3, "A marca precisa ter no mínimo 3 caracteres."),
        year: z.string().min(4, "Digite um ano válido.")
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            year: "",
            mark: "",
            name: ""
        }
    });
    
    const getVehicles = async (): Promise<void> => {
        setVehicles(await getAllVehicles(cookies.token));
    };

    const changeDeleteCardVisibility = (id: number | null): void => {
        setIdToDelete(id);
        setIsDeleteCardVisible(previousValue => !previousValue);
    };

    const handleDeleteVehicle = async () => {
        try {
            if (idToDelete) {
                await deleteVehicle(cookies.token, idToDelete);
                setIsPopupVisible(true);
                setPopupMessage(`Veículo excuído com sucesso!`);
                setIsFormVisible(false);
                setIsDeleteCardVisible(previousValue => !previousValue);
                setTimeout(() => {
                    setIsPopupVisible(false)
                    location.reload();
                }, 4000);
            };
        } catch (error) {
            console.error(`Falha ao excluir o veículo: ${error}`);
        } 
    };

    const handleLogout = () => {
        removeCookies("token");
        localStorage.removeItem("email");
        location.href = "/";
    };

    const handleCreateVehicle = () => {
        setSubmitType("create");
        setIsFormVisible(previousValue => !previousValue);
    }

    const handleSubmit = async (data: { name: string, mark: string, year: string }) => {
        if (submitType === "create") {
            try {
                const result = await createVehicle(cookies.token, data.name, data.mark, Number(data.year));
                if (result.status === 201) {
                    setIsPopupVisible(true);
                    setPopupMessage(`Veículo criado com sucesso!`);
                    setIsFormVisible(false);
                    setTimeout(() => {
                        setIsPopupVisible(false)
                        location.reload();
                    }, 4000);
                }
            } catch {
                setIsPopupVisible(true);
                setPopupMessage(`Falha ao criar o novo veículo.`)
            }
        } else if (submitType === "edit") {
            try {
                const result = await editVehicle(cookies.token, Number(idToDelete), data.name, data.mark, Number(data.year));
                if (result.status === 204) {
                    setIsPopupVisible(true);
                    setPopupMessage(`Veículo editado com sucesso!`);
                    setIsFormVisible(false);
                    setTimeout(() => {
                        setIsPopupVisible(false)
                        location.reload();
                    }, 4000);
                }
            } catch {
                setIsPopupVisible(true);
                setPopupMessage(`Falha ao editar o veículo.`)
            } 
        }        
    };

    const handleEditVehicle = async (id: number, name: string, mark: string, year: number) => {
        setIsFormVisible(true);
        form.setValue("name", name);
        form.setValue("mark", mark);
        form.setValue("year", year.toString());
        setIdToDelete(id);
        setSubmitType("edit");
    }

    useEffect(() => {
       getVehicles()
       setUserEmail(localStorage.getItem("email"));
    }, [])

    return (
        <div>
            <header className="w-screen flex flex-wrap gap-3 justify-between items-center p-16">
                <h1 className="text-3xl text-center font-bold self-center">Lista de veículos cadsatrados</h1>
                <div className="flex flex-wrap gap-3 justify-center items-center">
                    <span>{userEmail}</span>
                    <Button onClick={handleLogout}>
                        Sair
                    </Button>
                    <Button variant={"edit"} onClick={handleCreateVehicle}>
                        Adicionar veículo
                    </Button>
                </div>
            </header>
            <main className="w-screen h-screen flex items-center justify-center gap-4">
                <div className={`${isDeleteCardVisible || isFormVisible ? " blur-sm" : ""} flex  flex-wrap items-center justify-center gap-4`}>
                    {vehicles.map(vehicle => (
                        <Card className="w-96" key={vehicle.id}>
                            <CardHeader>
                                <CardTitle>{vehicle.nome}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-between items-center">
                                <p>{vehicle.marca}, {vehicle.ano}</p>
                                <div className="flex gap-x-4">
                                    <Button variant="edit" onClick={() => handleEditVehicle(vehicle.id, vehicle.nome, vehicle.marca, vehicle.ano)}>Editar</Button>    
                                    <Button variant="destructive" onClick={() => changeDeleteCardVisibility(vehicle.id)}>X</Button>    
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {isDeleteCardVisible && (
                    <Card className="w-96 absolute z-10">
                        <CardHeader>
                            <CardTitle>Tem certeza que deseja excluir este veículo?</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <Button variant="destructive" onClick={() => changeDeleteCardVisibility(null)}>Não</Button>    
                            <Button variant="edit" onClick={handleDeleteVehicle}>Sim</Button>    
                        </CardContent>
                    </Card>
                )}
                {isFormVisible && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 position-absolute-center bg-white p-4">
                            <h2 className="font-bold text-2xl">Novo veículo</h2>
                            <FormField 
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome: </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite o nome do veículo" {...field} />
                                        </FormControl>
                                        <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                name="mark"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marca: </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite a marca do veículo" {...field} />
                                        </FormControl>
                                        <FormMessage>{form.formState.errors.mark?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                             <FormField 
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ano: </FormLabel>
                                        <FormControl>
                                            <Input min={2000} type={"number"} {...field} />
                                        </FormControl>
                                        <FormMessage>{form.formState.errors.year?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Salvar</Button>
                            <Button variant={"destructive"} onClick={handleCreateVehicle}>Cancelar</Button>
                        </form>
                    </Form>
                )}
                {isPopupVisible && (
                    <Alert className="position-absolute-rigth-bottom-alert">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Mensagem</AlertTitle>
                        <AlertDescription>
                            {popupMessage}
                        </AlertDescription>
                    </Alert>
                )}
            </main>
        </div>
    );
}