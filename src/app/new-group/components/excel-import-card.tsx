"use client";

import { useState } from "react";
import { Download, Upload, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import { assignSecretFriends } from "@/helpers/assign-secret-friends";
import { createGroupAction } from "@/actions/group/create-group-action";
import { validateExcelData } from "@/helpers/valid-excel-data";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ExcelImportCardProps {
  userName: string;
  userEmail: string;
  groupName: string;
  groupDescription: string;
}

export default function ExcelImportCard({
  userName,
  userEmail,
  groupName,
  groupDescription,
}: ExcelImportCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      setFileName(file.name);
      handleFileUpload(file);
    } else {
      alert("Por favor, importe apenas arquivos Excel (.xlsx)");
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      if (!validateExcelData(jsonData)) {
        alert(
          "O arquivo contém colunas inválidas ou valores ausentes! as colunas precisam ser 'name', 'email' e 'gift'"
        );
        return;
      }

      console.log("Dados Importados:", jsonData);
      setParticipants(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
    const columns = ["name", "email", "gift"];
    const participants = [
      [userName, userEmail, "Mouse"],
      ["Robson", "rob@gmail.com", "Teclado"],
    ];

    const data = [columns, ...participants];
    const ws = XLSX.utils.aoa_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "Template");

    XLSX.writeFile(wb, "template-amigo-secreto.xlsx");
  };

  const handleCreateGroup = async () => {
    if (participants.length <= 1) {
      alert("Por favor, importe pelo menos 2 participantes");
      return;
    }

    if (groupName === "" || groupDescription === "") {
      alert("Por favor, preencha o nome e a descrição do grupo");
      return;
    }

    try {
      const arrayWithSecretFriend = assignSecretFriends(participants);

      const group = await createGroupAction({
        groupDescription,
        groupName,
        participants: arrayWithSecretFriend,
      });

      toast.success("Grupo criado com sucesso");
      router.push(`/groups/${group}`);
    } catch (error) {
      console.log(error);
      toast.error("Falha ao criar grupo");
      return false;
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <p className="text-xs ">
          Você pode importar um arquivo xlsx clicando{" "}
          <span className="text-primary underline">aqui</span>
        </p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Dados do Excel</DialogTitle>
          <DialogDescription>
            Baixe o template ou importe seus dados
          </DialogDescription>
        </DialogHeader>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Importar Dados do Excel</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant={"secondary"}
              onClick={handleDownload}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" /> Clique aqui para baixar o
              template
            </Button>
            <div className="flex items-start flex-col gap-1 w-full">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 w-full border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-gray-300"
                }`}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Arraste para cá para importar os dados
                </p>
                {fileName && (
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {fileName}
                  </p>
                )}
              </div>

              <p className="text-sm text-gray-500 text-center">
                Apenas arquivos .xlsx são aceitos
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleCreateGroup}>
              <Users size={20} /> Criar grupo
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
