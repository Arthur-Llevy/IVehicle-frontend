"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteVehicle, getAllVehicles } from "@/services/api/vehicleApi";
import { VehicleType } from "./types";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

export default function Home() {
    const [cookies] = useCookies(["token"]);
    const [vehicles, setVehicles] = useState<VehicleType[]>([]);
    const [isDeleteCardVisible, setIsDeleteCardVisible] = useState<boolean>(false);
    const [idToDelete, setIdToDelete] = useState<number | null>();
    
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
                location.reload();
            };
        } catch (error) {
            console.error(`Falha ao excluir o veículo: ${error}`)
        }
    }

    useEffect(() => {
       getVehicles()
    }, [])

    return (
        <div>
            <main className="w-screen h-screen flex items-center justify-center gap-4">
                <div className={`${isDeleteCardVisible ? " blur-sm" : ""} flex  flex-wrap items-center justify-center gap-4`}>
                    {vehicles.map(vehicle => (
                        <Card className="w-96" key={vehicle.id}>
                            <CardHeader>
                                <CardTitle>{vehicle.nome}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-between items-center">
                                <p>{vehicle.marca}, {vehicle.ano}</p>
                                <div className="flex gap-x-4">
                                    <Button variant="edit">Editar</Button>    
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
            </main>
        </div>
    );
}